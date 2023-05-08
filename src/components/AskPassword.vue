<template>
    <UiModal @close="emits('update:modelValue', false)">
        <div class="add-account-modal-content">
            <UiInputPassword v-model="password" @enter="sendPassword" label="Mot de passe" />
            <div class="buttons">
                <UiButton @click="sendPassword">Valider</UiButton>
                <UiButton @click="emits('update:modelValue', false)"
                    >Annuler</UiButton
                >
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UiModal from './ui/Modal.vue';
import UiInputPassword from './ui/input/Password.vue';
import UiButton from './ui/Button.vue';

const emits = defineEmits(['update:modelValue', 'send:password']);
const password = ref('' as string);

function sendPassword() {
    if (!password.value) {
        throw new Error('Le mot de passe est vide');
    }
    emits('send:password', password.value);
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
