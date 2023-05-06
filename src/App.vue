<template>
    <Main v-if="isLogged || !settings.isEncrypted" :password="password" :isEncrypted="settings.isEncrypted" />
    <Login v-else v-model="password" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import Main from './components/Main.vue';
import Login from './components/Login.vue';
import { useSettingsStore } from './store/Settings';
import { storeToRefs } from 'pinia';

const settingsStore = useSettingsStore();
settingsStore.loadSettings();
const { settings } = storeToRefs(settingsStore);

const isLogged = ref(false);
const password = ref('' as string);

watch(password, () => {
    if (settingsStore.checkPassword(password.value)) {
        isLogged.value = true;
    }
});

</script>
<style lang="scss" scoped>
</style>
