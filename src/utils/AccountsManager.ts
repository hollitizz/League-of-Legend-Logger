import fs from 'fs';

interface Account {
    summoner_name: string;
    username: string;
    password: string;
}

function getAccountList(): Account[] {
    return JSON.parse(fs.readFileSync('src/accounts.lal', 'utf-8')).accounts;
}

export function getAccountsName(): string[] {
    const accounts = getAccountList();
    if (accounts.length === 0) return [];
    return accounts.map(account => account.summoner_name);
}

export function getAccountByName(name: string): Account {
    const accounts = getAccountList();
    const account = accounts.find(account => account.summoner_name === name);
    if (!account) return {} as Account;
    return account;
}