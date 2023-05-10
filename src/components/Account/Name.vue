<template>
    <div class="name-fields" :key="imgKey" >
        <div v-if="account.icon_id && iconExists" class="profileIcon">
            <img :src="icon" alt="icon" />
            <p class="lvl">{{ account.summoner_level }}</p>
        </div>
        <h1 class="mx-auto text-center">{{ account.summoner_name }}</h1>
    </div>
</template>
<script setup lang="ts">
import { Account } from '../../types';
import { PropType, computed, ref } from 'vue';
import fs from 'fs';
import { ipcRenderer } from 'electron';

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

const iconExists = computed(() => {
    imgKey.value++;
    if (!props.account.icon_id) return false;
    return fs.existsSync(`profileIcons/${props.account.icon_id}.png`);
});

const icon = ref(`../../../profileIcons/${props.account.icon_id}.png`);

const imgKey = ref(0);

function sleep(s: number) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

ipcRenderer.on('download-image-reply', async (event, id) => {
    if (props.account.id === id) {
        await sleep(1);
        console.log('downloaded imageof '+ props.account.summoner_name);
        imgKey.value++;
    }
});
</script>
<style lang="scss" scoped>
.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.profileIcon {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
        width: 6rem;
        height: 6rem;
        border-radius: 32px;
        margin: 0;
    }

    .lvl {
        position: absolute;
        top: 4rem;
        text-align: center;
        background-color: var(--primary);
        padding: 0 0.5rem;
        border-radius: 0.8rem;
        border: var(--secondary) solid 0.3rem;
    }
}

.name-fields {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    margin-top: 10px;
    h1 {
        margin: 0;
        padding: 0;
    }
}
</style>
