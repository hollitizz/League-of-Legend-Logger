var import_electron = require("electron");
function createWindow() {
  const win = new import_electron.BrowserWindow({
    width: 800,
    height: 600
  });
  win.loadURL(process.env.VITE_DEV_SERVER_URL);
}
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    import_electron.app.quit();
});
import_electron.app.whenReady().then(() => {
  createWindow();
  import_electron.app.on("activate", () => {
    if (import_electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
