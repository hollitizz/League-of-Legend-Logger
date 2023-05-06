
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