import fs from 'fs';
import { Account } from '../types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAccountStore = defineStore('accountsStore', () => {
    const accounts = ref<Account[]>([]);

    function loadAccounts(): void {
        accounts.value = JSON.parse(fs.readFileSync('src/accounts.lal', 'utf-8')).accounts;
    }

    function saveAccounts(): void {
        fs.writeFileSync('src/accounts.lal', JSON.stringify({ accounts: accounts.value }, null, 4));
    }

    function addAccount(account: Account): void {
        if (!account.summoner_name || !account.username || !account.password) return;
        accounts.value.push({...account, tier: 0, rank: 0, lp: 0});
        saveAccounts();
    }

    function deleteAccount(account: Account): void {
        const index = accounts.value.findIndex(acc => acc.summoner_name === account.summoner_name);
        if (index === -1) return;
        accounts.value.splice(index, 1);
        saveAccounts();
    }

    function moveAccount(from: number, to: number): void {
        const account = accounts.value[from];
        accounts.value.splice(from, 1);
        accounts.value.splice(to, 0, account);
        saveAccounts();
    }

    return { accounts, loadAccounts, saveAccounts, addAccount, deleteAccount, moveAccount };

});