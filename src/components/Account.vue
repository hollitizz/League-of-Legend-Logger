<template>
    <div class="account">
        <h2>{{ accountName }}</h2>
        <button @click="sendLogin">Se connecter</button>
        <button @click="deleteAccount">Suprimer ce compte</button>
    </div>
</template>
<script setup lang="ts">
import { login } from '../utils/RiotClient';
import { getAccountByName } from '../utils/AccountsManager';
import { computed } from 'vue';

const props = defineProps({
    accountName: {
        type: String,
        required: true
    }
});

const account = computed(() => getAccountByName(props.accountName));

function sendLogin() {
    try {
        login(account.value.username, account.value.password);
    } catch (e) {
        console.log(e);
    }
}

function deleteAccount() {
}

</script>
<style lang="scss" scoped>
.account {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    h2 {
        margin: 0;
        padding: 0;
    }
}
</style>
