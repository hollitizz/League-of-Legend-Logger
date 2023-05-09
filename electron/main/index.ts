import {
    app,
    BrowserWindow,
    shell,
    ipcMain,
    globalShortcut,
    dialog
} from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import fs from 'fs';
import axios from 'axios';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
    win = new BrowserWindow({
        title: 'Main window',
        width: 1000,
        height: 800,
        icon: 'src/assets/favicon.ico',
        autoHideMenuBar: true,
        resizable: false,
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        // electron-vite-vue#298
        win.loadURL(url);
        // Open devTool if the app is not packaged
        win.webContents.openDevTools();
    } else {
        win.loadFile(indexHtml);
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send(
            'main-process-message',
            new Date().toLocaleString()
        );
    });

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url);
        return { action: 'deny' };
    });
    // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(() => {
    if (!process.env.VITE_DEV_SERVER_URL) {
        globalShortcut.register('F12', () => {});
        globalShortcut.register('CommandOrControl+R', () => {});
        globalShortcut.register('CommandOrControl+Shift+R', () => {});
        globalShortcut.register('Alt+CommandOrControl+I', () => {});
        // globalShortcut.register('Shift+CommandOrControl+I', () => { })
    }
    createWindow();
    ipcMain.on('export-accounts', (event, file: string) => {
        const path = dialog.showOpenDialogSync({
            defaultPath: process.env.USERPROFILE + '\\Downloads\\accounts.lal'
        });
        if (path) {
            fs.writeFileSync(path[0], file);
        }
    });
    ipcMain.on('import-accounts', event => {
        const path = dialog.showOpenDialogSync({
            defaultPath: process.env.USERPROFILE + '\\Downloads\\accounts.lal'
        });
        if (path) {
            const file = fs.readFileSync(path[0], 'utf8');
            event.reply('import-accounts-reply', JSON.parse(file));
        }
    });
    ipcMain.on('download-image', (event, url, path) => {
        if (!fs.existsSync('profileIcons')) {
            fs.mkdirSync('profileIcons');
        }
        axios.get(url, { responseType: 'stream' }).then(res => {
            res.data.pipe(fs.createWriteStream(path));
        });
    });
});

app.on('window-all-closed', () => {
    win = null;
    if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createWindow();
    }
});
app.on(
    'certificate-error',
    (event, webContents, url, error, certificate, callback) => {
        // On certificate error we disable default behaviour (stop loading the page)
        // and we then say "it is all fine - true" to the callback
        event.preventDefault();
        callback(true);
    }
);

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`);
    } else {
        childWindow.loadFile(indexHtml, { hash: arg });
    }
});
