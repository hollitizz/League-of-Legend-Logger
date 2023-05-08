<template>
    <UiModal @close="emits('update:modelValue', false)">
        <div class="add-account-modal-content">
            <UiInputPassword v-model="password" label="Mot de passe" />
            <UiInputPassword
                v-model="passwordConfirm"
                label="Confirmer le mot de passe"
                @enter="setPassword"
            />
            <div class="buttons">
                <UiButton @click="setPassword">Valider</UiButton>
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

const emits = defineEmits(['update:modelValue', 'set:password']);
const passwordConfirm = ref('' as string);
const password = ref('' as string);

function setPassword() {
    if (password.value !== passwordConfirm.value) {
        throw new Error('Les mots de passe ne correspondent pas');
    }
    emits('set:password', password.value);
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
