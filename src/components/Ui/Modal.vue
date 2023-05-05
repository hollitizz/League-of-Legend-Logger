<!-- create a vue component modal which close when click outside and add a blur effect to the rest of the window -->
<template>
    <div class="modal" @click="close">
        <div class="modal-content" @click.stop>
            <UiButton @click="close" class="button-close" variant="transparent">
                <img src="../../assets/svg/close.svg" alt="close" />
            </UiButton>
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';
import UiButton from './Button.vue';

const emits = defineEmits(['close']);

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
        width: 30rem;
        height: 25rem;
        top: 50%;
        left: 50%;
        padding: 1rem;
        transform: translate(-50%, -50%);
        background-color: var(--secondary);
        border-radius: 0.5rem;
    }

    .button-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        display: flex;
        padding: 0;
        align-items: center;
        justify-content: center;
    }

}
</style>