
export interface Account {
    id: number;
    summoner_name: string;
    username: string;
    password: string;
    tier: number;
    rank: number;
    lp: number;
    icon_id: number;
    is_provisional: boolean;
    wins: number;
    losses: number;
    summoner_level: number;
}

export interface Settings {
    isFirstTime?: boolean;
    isEncrypted?: boolean;
    password?: string;
}

export interface RankedStats {
    tier: string;
    division: string;
    leaguePoints: number;
    miniSeriesProgress: string;
    isProvisional: boolean;
    wins: number;
    losses: number;
}

export class RequestError extends Error {
    constructor(message: string, status: number) {
        super(message);
        this.response = {status: status};
    }
}