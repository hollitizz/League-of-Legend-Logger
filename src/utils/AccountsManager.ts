import fs from 'fs';
import { Account } from '../types';
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

export function delAccount(account: Account): void {
    const accounts = getAccountList();
    const index = accounts.findIndex(acc => acc.summoner_name === account.summoner_name);
    if (index === -1) return;
    accounts.splice(index, 1);
    fs.writeFileSync('src/accounts.lal', JSON.stringify({ accounts }, null, 4));
}