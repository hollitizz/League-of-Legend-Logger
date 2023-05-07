import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Settings } from '../types';
import fs from 'fs';
import bcrypt from 'bcryptjs';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({} as Settings);

    function loadSettings() {
        let file = null;
        try {
            file = fs.readFileSync('config.lal', 'utf-8');
        } catch (e) {
            fs.writeFileSync('config.lal', JSON.stringify({ isFirstTime: true, isEncrypted: false, password: '' }, null, 4));
            file = fs.readFileSync('config.lal', 'utf-8');
        }
        settings.value = JSON.parse(file);
        if (!settings.value.isFirstTime) settings.value.isFirstTime = true;
        if (!settings.value.isEncrypted) settings.value.isEncrypted = false;
        if (!settings.value.password) settings.value.password = '';
    }

    function saveSettings() {
        if (settings.value.isFirstTime) {
            settings.value.isFirstTime = false;
        }
        fs.writeFileSync(
            'config.lal',
            JSON.stringify(settings.value, null, 4)
        );
    }

    function setPassword(password: string) {
        const salt = bcrypt.genSaltSync(10);
        settings.value.password = bcrypt.hashSync(password, salt);
        settings.value.isEncrypted = true;
        saveSettings();
    }

    function changePassword(oldPassword: string, password: string) {
        if (bcrypt.compareSync(oldPassword, settings.value.password ?? '')) {
            setPassword(password);
        } else {
            throw new Error('Mauvais mot de passe');
        }
    }

    function checkPassword(password: string) {
        if (!bcrypt.compareSync(password, settings.value.password ?? '')) {
            throw new Error('Mauvais mot de passe');
        }
        return true;
    }

    function deletePassword(password: string) {
        if (!bcrypt.compareSync(password, settings.value.password ?? '')) {
            throw new Error('Mauvais mot de passe');
        }
        settings.value.password = '';
        settings.value.isEncrypted = false;
        saveSettings();
    }

    return {
        settings,
        loadSettings,
        changePassword,
        setPassword,
        deletePassword,
        checkPassword
    };
});
