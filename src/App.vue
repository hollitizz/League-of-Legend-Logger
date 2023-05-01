<template>
    <button v-for="name in accounts" @click="sendLogin(name)">{{ name }}</button>
</template>
<script setup lang="ts">
import { login } from './utils/RiotClient';
import { getAccountsName, getAccountByName } from './utils/AccountsManager';
import { computed } from 'vue';

const accounts = computed(() => getAccountsName());

function sendLogin(name: string) {
    try {
        const account = getAccountByName(name);
        login(account.username, account.password);
    } catch (e) {
        console.log(e);
    }
}
</script>
<style></style>
