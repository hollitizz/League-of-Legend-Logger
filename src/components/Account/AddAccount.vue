<template>
    <UiModal @close="emits('close')">
        <div class="add-account-modal-content">
            <UiInputText v-model="name" label="Nom sur league"/>
            <UiInputText v-model="username" label="Identifiant" />
            <UiInputPassword v-model="password" label="Mot de passe" />
            <div class="buttons">
                <UiButton @click="">Ajouter</UiButton>
                <UiButton @click="emits('close')">Annuler</UiButton>
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { defineEmits, ref} from 'vue';
import UiModal from '../Ui/Modal.vue';
import UiButton from '../Ui/Button.vue';
import UiInputText from '../Ui/Input/Text.vue';
import UiInputPassword from '../Ui/Input/Password.vue';
const emits = defineEmits(['close', 'cancel']);

const name = ref('' as string);
const username = ref('' as string);
const password = ref('' as string);
</script>

<style lang="scss" scoped>
.add-account-modal-content {
    width: 100%;
    height: 100%;
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