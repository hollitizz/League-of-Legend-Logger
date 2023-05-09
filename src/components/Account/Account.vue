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
            v-if="isLogged"
            class="refresh text-center"
            @click="refreshButton"
            variant="transparent"
        >
            <img src="../../assets/svg/refresh.svg" alt="refresh" />
        </UiButton>
    </div>
</template>
<script setup lang="ts">
import { PropType, computed, onMounted, ref, watch } from 'vue';
import { Account } from '../../types';
import AccountElo from './Elo.vue';
import AccountName from './Name.vue';
import AccountActions from './Actions.vue';
import { useLeagueLCUAPI } from '../../utils/LeagueLCU';
import UiButton from '../ui/Button.vue';
import { RankedStats } from '../../types';

const { getCurrentSummonerRankedData, getSummonerInfo, checkIsLoggedIn } =
    useLeagueLCUAPI();

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
    'NONE',
    'IRON',
    'BRONZE',
    'SILVER',
    'GOLD',
    'PLATINUM',
    'DIAMOND',
    'MASTER',
    'GRANDMASTER',
    'CHALLENGER'
];

const APIRank = ['0', 'I', 'II', 'III', 'IV'];

const emits = defineEmits(['delete:account', 'update:account']);

const isEditMode = computed(() => {
    return props.isEditMode;
});

const isLogged = ref(false);
let runningInterval: NodeJS.Timer | null = null;

onMounted(async () => {
    const res = await checkIsLoggedIn(account.value.id);
    if (res) {
        updateAccount();
    }
    isLogged.value = res;
});

async function refreshButton() {
    isLogged.value = await checkIsLoggedIn(account.value.id);
    if (!isLogged.value) return;
    updateAccount();
}

function checkStillLoggedIn() {
    if (runningInterval) clearInterval(runningInterval);
    runningInterval = setInterval(async () => {
        isLogged.value = await checkIsLoggedIn(account.value.id);
    }, 10000);
}

async function updateAccount() {
    let summoner = null;
    let rankedStats = {} as RankedStats;
    try {
        summoner = await getSummonerInfo();
        rankedStats = await getCurrentSummonerRankedData();
    } catch (error) {
        return;
    }
    const to: Account = {
        ...account.value,
        id: summoner.id,
        summoner_level: summoner.level,
        icon_id: summoner.iconId,
        summoner_name: summoner.summoner_name,
        tier: APITier.findIndex(tier => tier === rankedStats.tier),
        rank: APIRank.findIndex(rank => rank === rankedStats.division),
        lp: rankedStats.leaguePoints,
        wins: rankedStats.wins,
        losses: rankedStats.losses,
        is_provisional: rankedStats.isProvisional
    };
    emits('update:account', account.value, to);
    isLogged.value = true;
    checkStillLoggedIn();
    account.value = to;
}

function handleDelete(account: Account) {
    emits('delete:account', account);
}

watch(isLogged, () => {
    if (isLogged.value) {
        checkStillLoggedIn();
    } else {
        if (runningInterval) {
            clearInterval(runningInterval);
            runningInterval = null;
        }
    }
});
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
    top: 0.2rem;
    right: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    margin: 0;
    img {
        width: 100%;
        height: 100%;
        margin: auto;
    }
}

.w-full {
    width: 100%;
}
</style>
