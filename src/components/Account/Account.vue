<template>
    <div class="account">
        <AccountElo class="w-full" :account="account" />
        <AccountName class="w-full" :account="account" />
        <AccountActions
            :account="account"
            :isEditMode="isEditMode"
            class="w-full"
            @delete:account="handleDelete"
            @login:success="updateAccount"
        />
        <UiButton
            class="refresh text-center"
            @click="updateAccount"
        >R</UiButton>
    </div>

</template>
<script setup lang="ts">
import { PropType, computed, ref } from 'vue';
import { Account } from '../../types';
import AccountElo from './Elo.vue';
import AccountName from './Name.vue';
import AccountActions from './Actions.vue';
import { useLeagueLCUAPI } from '../../utils/LeagueLCU';
import UiButton from '../ui/Button.vue';
const { getCurrentSummonerRankedDatas, getCurrentSummonerName } = useLeagueLCUAPI();

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    },
    isEditMode: {
        type: Boolean,
        required: true
    }
});

const account = ref<Account>(props.account);

const APITier = [
    "NONE",
    "IRON",
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "DIAMOND",
    "MASTER",
    "GRANDMASTER",
    "CHALLENGER"
]

const APIRank = [
    "0",
    "I",
    "II",
    "III",
    "IV"
]

const emits = defineEmits(['delete:account', 'update:account']);

const isEditMode = computed(() => {
    return props.isEditMode;
});

async function updateAccount() {
    const rankedStats = await getCurrentSummonerRankedDatas();
    const summoner = await getCurrentSummonerName();
    const to: Account = {
        ...account.value,
        tier: APITier.findIndex((tier) => tier === rankedStats.tier),
        rank: APIRank.findIndex((rank) => rank === rankedStats.division),
        lp: rankedStats.leaguePoints,
        summoner_name: summoner.summoner_name,
        icon_id: summoner.iconId,
        wins: rankedStats.wins,
        losses: rankedStats.losses,
        is_provisional: rankedStats.isProvisional,
        summoner_level: summoner.level
    };
    emits('update:account', account.value, to)
    account.value = to;
}

function handleDelete(account: Account) {
    emits('delete:account', account);
}
</script>
<style lang="scss" scoped>
.account {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 100%;

    h2 {
        margin: 0;
        padding: 0;
    }
}
.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.refresh {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 1rem;
    height: 2rem;
}

.w-full {
    width: 100%;
}
</style>
