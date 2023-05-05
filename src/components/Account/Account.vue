<template>
    <div class="account">
        <AccountElo class="w-full" :account="account" />
        <AccountName class="w-full" :account="account" />
        <AccountActions
            @update:accounts="deleteAccount"
            :isEditMode="isEditMode"
            class="w-full"
            :account="account"
        />
    </div>
</template>
<script setup lang="ts">
import { getAccountByName } from '../../utils/AccountsManager';
import { computed } from 'vue';
import AccountElo from './Elo.vue';
import AccountName from './Name.vue';
import AccountActions from './Actions.vue';

const props = defineProps({
    accountName: {
        type: String,
        required: true
    },
    isEditMode: {
        type: Boolean,
        required: true
    }
});
const emits = defineEmits(['update:accounts']);
const account = computed(() => getAccountByName(props.accountName));

function deleteAccount() {
    emits('update:accounts');
}
</script>
<style lang="scss" scoped>
.account {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 100%;

    h2 {
        margin: 0;
        padding: 0;
    }
}
.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.w-full {
    width: 100%;
}
</style>
