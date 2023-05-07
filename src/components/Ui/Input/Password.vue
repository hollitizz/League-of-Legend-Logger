<template>
    <div class="password">
        <label v-if="label" :style="{ maxWidth }" class="label">{{
            label
        }}</label>
        <input
            class="input"
            :type="isShowed ? 'text' : 'password'"
            :value="modelValue"
            :style="{ maxWidth }"
            @input="handleInput"
            @keydown.enter.prevent="emits('enter')"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emits = defineEmits(['update:modelValue', 'enter']);
defineProps({
    modelValue: {
        type: String,
        required: true
    },
    maxWidth: {
        type: String,
        default: '14rem'
    },
    label: {
        type: String,
        default: ''
    }
});
function handleInput(event: Event) {
    const target = event?.target as HTMLInputElement;
    emits('update:modelValue', target?.value);
}
const isShowed = ref(false);
</script>

<style lang="scss" scoped>
.password {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .label {
        width: 100%;
        font-size: large;
        font-weight: 600;
        text-align: left;
        margin: 0;
    }
    .input {
        width: 100%;
        border: none;
        background-color: white;
        outline: 0.2rem solid var(--primary);
        padding: 0.5rem;
        border-radius: 0.5rem;
        font-size: large;
        font-weight: 600;
        color: var(--primary);
    }
}
</style>
