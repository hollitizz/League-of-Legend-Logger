<template>
    <ul class="account-list">
        <UiCardsRectangle class="card-element" v-for="account in accounts">
            <Account @update:accounts="reloadAccounts" :isEditMode="isEditMode" :accountName="account" />
        </UiCardsRectangle>
    </ul>
</template>
<script setup lang="ts">
import { getAccountsName, } from '../../utils/AccountsManager';
import UiCardsRectangle from '../Ui/Cards/Rectangle.vue';
import Account from './Account.vue';
import { ref } from 'vue';

defineProps({
    isEditMode: {
        type: Boolean,
        required: true
    }
});

const accounts = ref(getAccountsName() as string[]);

function reloadAccounts(accountName: string) {
    accounts.value = getAccountsName();
}

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
