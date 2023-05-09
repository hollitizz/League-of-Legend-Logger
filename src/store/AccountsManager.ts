import fs from 'fs';
import { Account } from '../types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const encryptpwd = require('encrypt-with-password');

export const useAccountStore = defineStore('accountsStore', () => {
    const accounts = ref<Account[]>([]);
    const password = ref<string>('');
    const isEncrypted = ref<boolean>(false);

    function loadAccounts(): void {
        if (isEncrypted.value && !password.value)
            throw new Error(
                'Impossible de décrypter les comptes sans mot de passe'
            );
        let file = null;
        try {
            file = fs.readFileSync('accounts.lal', 'utf-8');
        } catch (e) {
            fs.writeFileSync(
                'accounts.lal',
                JSON.stringify({ accounts: [] }, null, 4)
            );
            file = fs.readFileSync('accounts.lal', 'utf-8');
        }
        if (isEncrypted.value) {
            accounts.value = encryptpwd.decryptJSON(
                file,
                password.value
            ).accounts;
        } else {
            accounts.value = JSON.parse(file).accounts;
        }
        accounts.value.forEach(acc => {
            if (acc.id === undefined) acc.id = 0;
            if (acc.tier === undefined) acc.tier = 0;
            if (acc.rank === undefined) acc.rank = 0;
            if (acc.lp === undefined) acc.lp = 0;
            if (acc.icon_id === undefined) acc.icon_id = 0;
            if (acc.is_provisional === undefined) acc.is_provisional = false;
            if (acc.wins === undefined) acc.wins = 0;
            if (acc.losses === undefined) acc.losses = 0;
            if (acc.summoner_level === undefined) acc.summoner_level = 0;
        });
        saveAccounts();
    }

    function saveAccounts(): void {
        if (isEncrypted.value && !password.value)
            throw new Error(
                "Impossible d'encrypter les comptes sans mot de passe"
            );
        if (isEncrypted.value) {
            fs.writeFileSync(
                'accounts.lal',
                encryptpwd.encryptJSON(
                    { accounts: accounts.value },
                    password.value
                )
            );
        } else {
            fs.writeFileSync(
                'accounts.lal',
                JSON.stringify({ accounts: accounts.value }, null, 4)
            );
        }
    }

    function addAccount(account: Account): void {
        if (!account.summoner_name || !account.username || !account.password)
            return;
        accounts.value.push({ ...account, tier: 0, rank: 0, lp: 0 });
        saveAccounts();
    }

    function importAccounts(inAccounts: Account[]): void {
        inAccounts.forEach(inAcc => {
            if (!inAcc.summoner_name || !inAcc.username || !inAcc.password)
                return;
            if (
                accounts.value.find(
                    acc =>
                        inAcc.summoner_name === acc.summoner_name &&
                        inAcc.username === acc.username &&
                        inAcc.password === acc.password
                )
            )
                return;
            accounts.value.push({ ...inAcc });
        });
        accounts.value.forEach(acc => {
            if (acc.id === undefined) acc.id = 0;
            if (acc.tier === undefined) acc.tier = 0;
            if (acc.rank === undefined) acc.rank = 0;
            if (acc.lp === undefined) acc.lp = 0;
            if (acc.icon_id === undefined) acc.icon_id = 0;
            if (acc.is_provisional === undefined) acc.is_provisional = false;
            if (acc.wins === undefined) acc.wins = 0;
            if (acc.losses === undefined) acc.losses = 0;
            if (acc.summoner_level === undefined) acc.summoner_level = 0;
        });
        saveAccounts();
    }

    function deleteAccount(account: Account): void {
        const index = accounts.value.findIndex(
            acc => acc.summoner_name === account.summoner_name
        );
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

    function updateAccount(from: Account, to: Account): void {
        const index = accounts.value.findIndex(
            acc => acc.summoner_name === from.summoner_name
        );
        if (index === -1) return;
        accounts.value[index] = to;
        saveAccounts();
    }

    return {
        accounts,
        password,
        isEncrypted,
        loadAccounts,
        saveAccounts,
        addAccount,
        deleteAccount,
        moveAccount,
        importAccounts,
        updateAccount
    };
});
