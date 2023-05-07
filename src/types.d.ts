
export interface Account {
    summoner_name: string;
    username: string;
    password: string;
    tier: number;
    rank: number;
    lp: number;
}

export interface Settings {
    isFirstTime?: boolean;
    isEncrypted?: boolean;
    password?: string;
}

export interface RankedStats {
    division: string;
    highestDivision: string;
    highestTier: string;
    isProvisional: boolean;
    leaguePoints: number;
    losses: number;
    miniSeriesProgress: string;
    previousSeasonAchievedDivision: string;
    previousSeasonAchievedTier: string;
    previousSeasonEndDivision: string;
    previousSeasonEndTier: string;
    provisionalGameThreshold: number;
    provisionalGamesRemaining: number;
    queueType: string;
    ratedRating: number;
    ratedTier: string;
    tier: string;
    warnings: null;
    wins: number;
}

export class RequestError extends Error {
    constructor(message: string, status: number) {
        super(message);
        this.response = {status: status};
    }
}