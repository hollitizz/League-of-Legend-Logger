<template>
    <AddAccount
        v-if="isAddingAccount"
        @close="isAddingAccount = false"
        :isOpen="isAddingAccount"
    />
    <Button @click="openSettings" class="button-settings">
        <img src="./assets/svg/settings.svg" alt="edit" />
    </Button>
    <Button @click="editAccounts" class="button-edit">
        <img src="./assets/svg/edit.svg" alt="edit" />
    </Button>
    <Button @click="addAccount" class="button-add">
        <img src="./assets/svg/add.svg" alt="add" />
    </Button>
    <Accounts class="main" :isEditMode="isEditMode" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Accounts from './components/Account/Accounts.vue';
import Button from './components/Ui/Button.vue';
import AddAccount from './components/Account/addAccount.vue';

const isEditMode = ref(false);
const isAddingAccount = ref(false);

function editAccounts() {
    isEditMode.value = !isEditMode.value;
}

function addAccount() {
    isAddingAccount.value = true;
}

function openSettings() {
    console.log('open settings');
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
