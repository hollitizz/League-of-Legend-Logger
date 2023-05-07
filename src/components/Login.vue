<template>
    <div class="login">
        <UiInputPassword
            v-model="password"
            @enter="sendPassword"
            label="Mot de passe"
        />
        <UiButton @click="sendPassword">Connexion</UiButton>
    </div>
</template>
<script setup lang="ts">
import UiInputPassword from './ui/input/Password.vue';
import UiButton from './ui/Button.vue';
import { ref } from 'vue';

const emits = defineEmits(['update:modelValue']);

const password = ref('' as string);

function sendPassword() {
    emits('update:modelValue', password.value);
}
</script>

<style lang="scss" scoped>
.login {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}
</style>
