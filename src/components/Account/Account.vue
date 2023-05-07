<template>
    <div class="account">
        <AccountElo class="w-full" :account="account" />
        <AccountName class="w-full" :account="account" />
        <AccountActions
            :account="account"
            :isEditMode="isEditMode"
            class="w-full"
            @delete:account="handleDelete"
        />
    </div>
</template>
<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Account } from '../../types';
import AccountElo from './Elo.vue';
import AccountName from './Name.vue';
import AccountActions from './Actions.vue';

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    },
    isEditMode: {
        type: Boolean,
        required: true
    }
});

const emits = defineEmits(['delete:account']);

const isEditMode = computed(() => {
    return props.isEditMode;
});
function handleDelete(account: Account) {
    emits('delete:account', account);
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
