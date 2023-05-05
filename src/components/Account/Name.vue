<template>
    <h1 class="mx-auto text-center">{{ account.summoner_name }}</h1>
</template>
<script setup lang="ts">
import { Account } from "../../types";
import { PropType } from "vue";


defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});


</script>
<style lang="scss" scoped>
.mx-auto {
    margin-left: auto;
    margin-right: auto;
}
.text-center {
    text-align: center;
}
</style>
