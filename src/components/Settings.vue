<template>
    <UiModal
        @close="emits('update:modelValue', false)"
        width="50rem"
        height="40rem"
    >
        <div class="settings-content">
            <h1 class="text-center title">Paramètres</h1>
            <UiCardsRectangle class="imports">
                <h2 class="text-center title">Importer / Exporter</h2>
                <div class="buttons">
                    <UiButton @click="importAccounts"
                        >Importer des comptes</UiButton
                    >
                    <UiButton @click="exportAccounts"
                        >Exporter des comptes</UiButton
                    >
                </div>
            </UiCardsRectangle>
            <UiCardsRectangle class="security">
                <h2 class="text-center title">Sécurité</h2>
                <div class="buttons">
                    <UiButton @click="handleEncryptionButton"
                        >{{
                            settings.isEncrypted ? 'Désactiver' : 'Activer'
                        }}
                        le chiffrement</UiButton
                    >
                </div>
            </UiCardsRectangle>
            <UiCardsRectangle v-if="settings.isEncrypted" class="passwords">
                <h2 class="title text-center">Mot de passe</h2>
                <div class="config">
                    <UiInputPassword
                        v-model="oldPassword"
                        label="Ancien mot de passe"
                    />
                    <UiInputPassword
                        v-model="newPassword"
                        label="Nouveau mot de passe"
                    />
                    <UiInputPassword
                        v-model="newPasswordConfirm"
                        label="Confirmer le nouveau mot de passe"
                    />
                    <UiButton @click="changePassword"
                        >Changer le mot de passe</UiButton
                    >
                </div>
            </UiCardsRectangle>
        </div>
    </UiModal>
    <SetPassword
        v-if="isSettingPassword"
        v-model="isSettingPassword"
        @set:password="setPassword"
    />
    <AskPassword
        v-if="isAskingPassword"
        v-model="isAskingPassword"
        @send:password="disableEncryption"
    />
</template>

<script setup lang="ts">
import UiModal from './ui/Modal.vue';
import UiButton from './ui/Button.vue';
import UiInputPassword from './ui/input/Password.vue';
import UiCardsRectangle from './ui/cards/Rectangle.vue';
import { useSettingsStore } from '../store/Settings';
import { storeToRefs } from 'pinia';
import { PropType, ref } from 'vue';
import SetPassword from './SetPassword.vue';
import AskPassword from './AskPassword.vue';
import { Account } from '../types';
import { ipcRenderer } from 'electron';
import { useAlerts } from '../utils/Alerts';

const settingsStore = useSettingsStore();
settingsStore.loadSettings();
const { settings } = storeToRefs(settingsStore);

const { success } = useAlerts();

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    accounts: {
        type: Array as PropType<Account[]>,
        required: true
    }
});

const emits = defineEmits([
    'update:modelValue',
    'update:encryption',
    'add:accounts'
]);
const isSettingPassword = ref(false);
const isAskingPassword = ref(false);

const oldPassword = ref('' as string);
const newPassword = ref('' as string);
const newPasswordConfirm = ref('' as string);

function importAccounts() {
    ipcRenderer.send('import-accounts');
    ipcRenderer.on('import-accounts-reply', (event, accounts) => {
        emits('add:accounts', accounts);
    });
}

function exportAccounts() {
    ipcRenderer.send(
        'export-accounts',
        JSON.stringify(props.accounts, null, 4)
    );
    ipcRenderer.on('export-accounts-reply', (event) => {
        success('Les comptes ont bien été exportés !');
    });
}

function setPassword(password: string) {
    settingsStore.setPassword(password);
    emits('update:encryption', true, password);
    success('Le mot de passe a bien été défini !');
}

function handleEncryptionButton() {
    if (!settings.value.isEncrypted) {
        isSettingPassword.value = true;
    } else {
        isAskingPassword.value = true;
    }
}

function changePassword() {
    if (newPassword.value !== newPasswordConfirm.value) {
        throw new Error('Les nouveaux mots de passe ne correspondent pas');
    }
    settingsStore.changePassword(oldPassword.value, newPassword.value);
    success('Le mot de passe a bien été changé !');
}

function disableEncryption(password: string) {
    settingsStore.deletePassword(password);
    emits('update:encryption', false);
    success('Le chiffrement a été désactivé !');
}
</script>

<style lang="scss" scoped>
.settings-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    .title {
        margin: 0;
    }
    .imports {
        position: relative;
        width: 80%;
        height: 7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        .title {
            margin: 0;
        }

        .buttons {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
    }

    .security {
        position: relative;
        width: 80%;
        height: 7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        .title {
            margin: 0;
        }

        .buttons {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
    }

    .passwords {
        position: relative;
        width: 80%;
        height: 23rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        .config {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
    }
}
</style>
