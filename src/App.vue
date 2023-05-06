<template>
    <AccountAddAccount
        v-if="isAddingAccount"
        @add:account="accountStore.addAccount"
        v-model="isAddingAccount"
    />
    <Settings
        v-if="isSettingsOpen"
        v-model="isSettingsOpen"
        :isOpen="isSettingsOpen"
    />
    <UiButton @click="openSettings" class="button-settings">
        <img src="./assets/svg/settings.svg" alt="edit" />
    </UiButton>
    <UiButton @click="editAccounts" class="button-edit">
        <img src="./assets/svg/edit.svg" alt="edit" />
    </UiButton>
    <UiButton @click="addAccount" class="button-add">
        <img src="./assets/svg/add.svg" alt="add" />
    </UiButton>
    <AccountAccounts class="main" :isEditMode="isEditMode" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useAccountStore } from './store/AccountsManager';
import AccountAccounts from './components/account/Accounts.vue';
import UiButton from './components/ui/Button.vue';
import AccountAddAccount from './components/account/AddAccount.vue';
import Settings from './components/Settings.vue';


const isEditMode = ref(false);
const isAddingAccount = ref(false);
const isSettingsOpen = ref(false);

const accountStore = useAccountStore();
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
