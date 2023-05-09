<template>
    <div class="name-fields">
        <div class="profileIcon">
            <img :src="icon" alt="icon" />
            <p class="lvl">{{ account.summoner_level }}</p>
        </div>
        <h1 class="mx-auto text-center">{{ account.summoner_name }}</h1>
    </div>
</template>
<script setup lang="ts">
import { Account } from '../../types';
import { PropType, computed } from 'vue';

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
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
        top: 4.2rem;
        text-align: center;
        background-color: var(--primary);
        padding: 0 0.5rem;
        border-radius: 0.5rem;
        outline: var(--secondary) solid 0.2rem;
    }
}

.name-fields {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: 0;
    h1 {
        margin: 0;
        padding: 0;
    }
}

</style>
