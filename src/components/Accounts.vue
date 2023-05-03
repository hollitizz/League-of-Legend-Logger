<template>
    <ul class="account-list">
        <Card class="card-element" v-for="account in [...accounts, ...accounts]">
            <Account :accountName="account" />
        </Card>
    </ul>
</template>
<script setup lang="ts">
import { getAccountsName, getAccountByName } from '../utils/AccountsManager';
import { computed } from 'vue';
import Card from './Ui/Card.vue';
import Account from './Account.vue';

const accounts = computed(() => getAccountsName());

</script>
<style lang="scss" scoped>
.account-list {
    width: 100%;
    height: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    overflow:auto;

    .card-element {
        margin: 1rem auto;
        padding: 0;
        height: 10rem;
        width: 45rem;
    }
}
</style>
