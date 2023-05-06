import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Settings } from '../types';
import fs from 'fs';
import bcrypt from 'bcryptjs';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({} as Settings);

    function loadSettings() {
        const settingsString = fs.readFileSync('src/config.lal', 'utf-8');
        settings.value = JSON.parse(settingsString);
        if (!settings.value.isFirstTime) settings.value.isFirstTime = false;
        if (!settings.value.isEncrypted) settings.value.isEncrypted = false;
        if (!settings.value.password) settings.value.password = '';
    }

    function saveSettings() {
        if (settings.value.isFirstTime) {
            settings.value.isFirstTime = false;
        }
        fs.writeFileSync(
            'src/config.lal',
            JSON.stringify(settings.value, null, 4)
        );
    }

    function setPassword(password: string) {
        const salt = bcrypt.genSaltSync(10);
        settings.value.password = bcrypt.hashSync(password, salt);
        settings.value.isEncrypted = true;
        saveSettings();
        console.log('success');
    }

    function changePassword(oldPassword: string, password: string) {
        if (bcrypt.compareSync(oldPassword, settings.value.password ?? '')) {
            setPassword(password);
        } else {
            throw new Error('Wrong password');
        }
    }

    function checkPassword(password: string) {
        if (!bcrypt.compareSync(password, settings.value.password ?? '')) {
            throw new Error('Wrong password');
        }
        return true;
    }

    function deletePassword(password: string) {
        if (!bcrypt.compareSync(password, settings.value.password ?? '')) {
            throw new Error('Wrong password');
        }
        settings.value.password = '';
        settings.value.isEncrypted = false;
        saveSettings();
        console.log('success');
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
