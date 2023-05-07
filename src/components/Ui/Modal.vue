<template>
    <div class="modal" @click="close">
        <div class="modal-content" :style="{ width, height }" @click.stop>
            <UiButton @click="close" class="button-close" variant="transparent">
                <img src="../../assets/svg/close.svg" alt="close" />
            </UiButton>
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import UiButton from './Button.vue';

const emits = defineEmits(['close']);

defineProps({
    width: {
        type: String,
        default: '30rem'
    },
    height: {
        type: String,
        default: '25rem'
    }
});

function close() {
    emits('close');
}
</script>

<style lang="scss" scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    .modal-content {
        position: fixed;
        top: 50%;
        left: 50%;
        padding: 1rem;
        transform: translate(-50%, -50%);
        background-color: var(--secondary);
        border-radius: 0.5rem;
        overflow-y: auto;
    }

    .button-close {
        position: sticky;
        top: 0.5rem;
        left: calc(100% - 0.5rem);
        display: flex;
        padding: 0;
        align-items: center;
        justify-content: center;
    }
}
</style>
