<template>
    <div class="mx-auto flex gap-1 select-none">
        <UiCardCircle class="circle-elo">
            <img :src="`./src/assets/rank/${9}.png`" alt="">
        </UiCardCircle>
        <div class="text-center m-auto">
            <h3 class="m-0">Master</h3>
            <h3 class="m-0">401 LP</h3>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Account } from "../../types";
import { PropType } from "vue";
import UiCardCircle from "../Ui/Cards/Circle.vue";


defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

</script>
<style lang="scss" scoped>
.circle-elo {
    height: 6rem;
    width: 6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary);
}
.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.text-center {
    text-align: center;
}

.m-0 {
    margin: 0;
}

.p-0 {
    padding: 0;
}

.gap-1 {
    gap: 1rem;
}

.flex {
    display: flex;
    align-items: center;
    justify-content: center;
}

img {
    position: relative;
    top: 10px;
    width: 100%;
}

</style>
