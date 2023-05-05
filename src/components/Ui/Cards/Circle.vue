<template>
    <div class="card">
        <slot />
    </div>
</template>
<style lang="scss" scoped>
.card {
    background-color: var(--secondary);
    border-radius: 50%;
    padding: 0.5rem;
    height: 50rem;
    width: 45rem;
}
</style>