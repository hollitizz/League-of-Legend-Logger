<template>
    <ul class="account-list drop-zone">
        <li v-for="(account, index) in accounts">
            <UiCardsRectangle
                :draggable="isEditMode"
                class="card-element"
                :class="{ 'clickable': isEditMode }"
                @dragstart="dragStart($event, index)"
                @dragenter="dragEnter($event, index)"
                @dragleave="dragLeave($event, index)"
                @dragover="dragOver($event, index)"
                @dragend="dragEnd($event, index)"
                @drop="drop($event, index)"
            >
                <AccountAccount
                    @delete:account="handleDeleteAccount"
                    @login:success="updateAccount"
                    @update:account="updateAccount"
                    :isEditMode="isEditMode"
                    :account="account"
                />
            </UiCardsRectangle>
        </li>
    </ul>
</template>
<script setup lang="ts">
import { Account } from '../../types';
import AccountAccount from './Account.vue';
import UiCardsRectangle from '../ui/cards/Rectangle.vue';
import { PropType } from 'vue';


const emits = defineEmits(['update:accounts', 'delete:account', 'update:account']);

const props = defineProps({
    isEditMode: {
        type: Boolean,
        required: true
    },
    accounts: {
        type: Array as PropType<Account[]>,
        required: true
    }
});

function handleDeleteAccount(account: Account) {
    emits('delete:account', account);
}

async function updateAccount(from: Account, to: Account) {
    emits('update:account', from, to);
}

function dragStart(event: DragEvent, index: number) {
    if (!props.isEditMode) return;
    event.dataTransfer?.setData('startIndex', index.toString());
}

function drop(event: DragEvent, index: number) {
    if (!props.isEditMode) return;
    const startIndex = parseInt(event.dataTransfer?.getData('startIndex') ?? '-1');
    if (startIndex === -1) return;
    emits('update:accounts', startIndex, index);
    event.preventDefault();
}

function dragEnd(event: DragEvent, index: number) {
    // console.log('drag end');
    event.preventDefault();
}

function dragEnter(event: DragEvent, index: number) {
    // console.log('drag enter');
    event.preventDefault();
}

function dragLeave(event: DragEvent, index: number) {
    // console.log('drag leave');
    event.preventDefault();
}

function dragOver(event: DragEvent, index: number) {
    // console.log('drag over');
    event.preventDefault();
}

</script>
<style lang="scss" scoped>
.account-list {
    width: 100%;
    height: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    overflow: auto;

    .card-element {
        margin: 1rem auto;
        padding: 0;
        height: 10rem;
        width: 45rem;
    }
    .clickable {
        &:hover {
            cursor: grab;
            background-color: rgba($color: #000, $alpha: 0.2);
        }
    }
}
</style>
