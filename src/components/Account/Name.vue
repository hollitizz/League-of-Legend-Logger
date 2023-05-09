<template>
    <div class="name-fields">
        <div v-if="account.icon_id && iconExists" class="profileIcon">
            <img :src="icon" alt="icon" />
            <p class="lvl">{{ account.summoner_level }}</p>
        </div>
        <h1 class="mx-auto text-center">{{ account.summoner_name }}</h1>
    </div>
</template>
<script setup lang="ts">
import { Account } from '../../types';
import { PropType, computed, watch } from 'vue';
import fs from 'fs';

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

const iconExists = computed(() => {
    return fs.existsSync(`profileIcons/${props.account.icon_id}.png`);
});

const icon = computed(() => {
    return `../../../profileIcons/${props.account.icon_id}.png`;
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
