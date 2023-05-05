<template>
    <div class="content">
        <div class="actions">
            <UiButton @click="sendLogin">Se connecter</UiButton>
        </div>
        <div v-if="isEditMode" class="edit">
            <UiButton v-if="isEditMode" @click="deleteAccount" class="button" variant="transparent">
                <img src="../../assets/svg/delete.svg" alt="delete" />
            </UiButton>
            <UiButton v-if="isEditMode" @click="" class="button" variant="transparent">
                <img src="../../assets/svg/drag.svg" alt="drag" />
            </UiButton>
        </div>
    </div>
</template>
<script setup lang="ts">
import { login } from '../../utils/RiotClient';
import { delAccount } from '../../utils/AccountsManager';
import { Account } from '../../types';
import { PropType } from 'vue';
import UiButton from '../Ui/Button.vue';

const emits = defineEmits(['update:accounts']);

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

function sendLogin() {
    try {
        login(props.account.username, props.account.password);
    } catch (e) {
        console.log(e);
    }
}

function deleteAccount() {
    try {
        delAccount(props.account);
        emits('update:accounts');
    } catch (e) {
        console.log(e);
    }
}

</script>
<style lang="scss" scoped>
.actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 100%;
}

.edit {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    transition: all 0.5s ease-in-out;
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        margin: 0;
        img {
            width: 100%;
            height: 100%;
            margin: auto;
        }
    }
}
</style>
