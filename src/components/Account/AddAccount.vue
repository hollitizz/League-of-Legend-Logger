<template>
    <UiModal @close="emits('update:modelValue', false)">
        <div class="add-account-modal-content">
            <UiInputText v-model="name" label="Nom du compte" />
            <UiInputText v-model="username" label="Identifiant" />
            <UiInputPassword @enter="addAccount" v-model="password" label="Mot de passe" />
            <div class="buttons">
                <UiButton @click="addAccount">Ajouter</UiButton>
                <UiButton @click="emits('update:modelValue', false)"
                    >Annuler</UiButton
                >
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Account } from '../../types';
import UiModal from '../ui/Modal.vue';
import UiInputText from '../ui/input/Text.vue';
import UiInputPassword from '../ui/input/Password.vue';
import UiButton from '../ui/Button.vue';

const emits = defineEmits(['update:modelValue', 'add:account']);
const name = ref('' as string);
const username = ref('' as string);
const password = ref('' as string);

function addAccount() {
    const account = {
        summoner_name: name.value,
        username: username.value,
        password: password.value
    } as Account;
    if (!account.summoner_name || !account.username || !account.password) {
        throw new Error("Un des champs n'est pas rempli");
    }
    emits('add:account', account);
    emits('update:modelValue', false);
}
</script>

<style lang="scss" scoped>
.add-account-modal-content {
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}
.buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}
</style>
