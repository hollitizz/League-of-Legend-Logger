<template>
    <div class="mx-auto flex gap-1 select-none relative">
        <UiCardCircle class="circle-elo">
            <img :src="tierImg" alt="rank" />
        </UiCardCircle>
        <div class="text-center m-auto rank-text">
            <h3 class="m-0">{{ tier + rank }}</h3>
            <h3 class="m-0">{{ account.lp }} LP</h3>
            <h3 v-if="account.wins || account.losses" class="m-0">
                {{
                    `${account.is_provisional ? '[P] ' : ''}${account.wins}V ${
                        account.losses
                    }D`
                }}
            </h3>
        </div>
    </div>
</template>
<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Account } from '../../types';
import UiCardCircle from '../ui/cards/Circle.vue';
import ChallengerImg from '../../assets/rank/9.png';
import GrandmasterImg from '../../assets/rank/8.png';
import MasterImg from '../../assets/rank/7.png';
import DiamondImg from '../../assets/rank/6.png';
import PlatinumImg from '../../assets/rank/5.png';
import GoldImg from '../../assets/rank/4.png';
import SilverImg from '../../assets/rank/3.png';
import BronzeImg from '../../assets/rank/2.png';
import IronImg from '../../assets/rank/1.png';
import UnrankedImg from '../../assets/rank/0.png';

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

const img = [
    UnrankedImg,
    IronImg,
    BronzeImg,
    SilverImg,
    GoldImg,
    PlatinumImg,
    DiamondImg,
    MasterImg,
    GrandmasterImg,
    ChallengerImg
];

const correspondingTier = [
    'Unranked',
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Master',
    'Grandmaster',
    'Challenger'
];

const correspondingRank = ['0', 'I', 'II', 'III', 'IV'];

const tier = computed(() => {
    return correspondingTier[props.account.tier];
});

const tierImg = computed(() => {
    return img[props.account.tier];
});

const rank = computed(() => {
    return !props.account.tier || props.account.tier > 6
        ? ''
        : ` ${correspondingRank[props.account.rank]}`;
});
</script>
<style lang="scss" scoped>
.circle-elo {
    position: absolute;
    height: 6rem;
    width: 6rem;
    left: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary);
}

.rank-text {
    margin-left: 8.4rem;
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
