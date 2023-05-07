<template>
    <AccountAddAccount
        v-if="isAddingAccount"
        @add:account="accountStore.addAccount"
        v-model="isAddingAccount"
    />
    <Settings
        v-if="isSettingsOpen"
        v-model="isSettingsOpen"
        :accounts="accounts"
        @update:encryption="changeEncryption"
        @add:accounts="accountStore.importAccounts"
    />
    <UiButton @click="openSettings" class="button-settings">
        <img src="../assets/svg/settings.svg" alt="edit" />
    </UiButton>
    <UiButton @click="editAccounts" class="button-edit">
        <img src="../assets/svg/edit.svg" alt="edit" />
    </UiButton>
    <UiButton @click="addAccount" class="button-add">
        <img src="../assets/svg/add.svg" alt="add" />
    </UiButton>
    <AccountAccounts
        class="main"
        :isEditMode="isEditMode"
        :accounts="accounts"
        @update:accounts="accountStore.moveAccount"
        @delete:account="accountStore.deleteAccount"
    />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAccountStore } from '../store/AccountsManager';
import AccountAccounts from './account/Accounts.vue';
import UiButton from './ui/Button.vue';
import AccountAddAccount from './account/AddAccount.vue';
import Settings from './Settings.vue';
import { storeToRefs } from 'pinia';

const props = defineProps({
    password: {
        type: String,
        required: true
    },
    isEncrypted: {
        type: Boolean,
        required: true
    }
});

const isEditMode = ref(false);
const isAddingAccount = ref(false);
const isSettingsOpen = ref(false);

const accountStore = useAccountStore();
const { accounts, password, isEncrypted } = storeToRefs(accountStore);
if (props.isEncrypted) {
    password.value = props.password;
    isEncrypted.value = props.isEncrypted;
}
accountStore.loadAccounts();

function editAccounts() {
    isEditMode.value = !isEditMode.value;
}

function addAccount() {
    isAddingAccount.value = true;
}

function openSettings() {
    isSettingsOpen.value = true;
}

watch(isEncrypted, () => {
    if (isEncrypted.value) {
        accountStore.loadAccounts();
    }
});

function changeEncryption(isEncrypt: boolean, pass: string) {
    password.value = pass;
    isEncrypted.value = isEncrypt;
    accountStore.saveAccounts();
}
</script>
<style lang="scss" scoped>
.main {
    height: 100%;
    width: 100%;
}
.button {
    position: absolute;
    padding: 0;
    right: 3.5rem;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    &-settings {
        top: 3.5rem;
    }

    &-edit {
        top: 7.5rem;
    }

    &-add {
        top: 11.5rem;
    }
}
</style>
