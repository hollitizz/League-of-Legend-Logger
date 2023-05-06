<template>
    <button class="button select-none" @click="click" :class="{ [variant]: Boolean(variant) }">
        <slot />
    </button>
</template>
<script setup lang="ts">

const emits = defineEmits(['click']);

defineProps({
    variant: {
        type: String,
        default: 'primary'
    }
});

function click() {
    emits('click');
}
</script>
<style lang="scss" scoped>
.button {
    border: none;
    padding: 0.6rem 1rem;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    font-weight: 800;
    &:hover {
        transform: scale(1.05);
    }
    &:active {
        box-shadow: inset 0px 0px 5px #000;
    }
}

.primary {
    background-color: var(--primary);
    color: white;
}

.red {
    background-color: var(--red);
    color: white;
}

.transparent {
    background-color: transparent;
}
</style>
