<template>
    <Main
        v-if="isLogged || !isEncrypted"
        v-model="password"
        :isEncrypted="isEncrypted"
    />
    <Login v-else v-model="password" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import Main from './components/Main.vue';
import Login from './components/Login.vue';
import { useSettingsStore } from './store/Settings';
import { storeToRefs } from 'pinia';
import { useAlerts } from './utils/Alerts';

const { success } = useAlerts();

const settingsStore = useSettingsStore();
settingsStore.loadSettings();
const { settings } = storeToRefs(settingsStore);

const isEncrypted = ref(false);
if (settings.value.isEncrypted) {
    isEncrypted.value = true;
}
const isLogged = ref(false);
const password = ref('' as string);

watch(password, () => {
    if (settingsStore.checkPassword(password.value)) {
        isLogged.value = true;
        success('Vous êtes connecté !');
    }
});
</script>
<style lang="scss" scoped></style>
