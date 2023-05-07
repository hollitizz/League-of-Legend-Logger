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
        if (isEncrypted.value && !password.value) throw new Error('Password is required');
        let file = null;
        try {
            file = fs.readFileSync('accounts.lal', 'utf-8');
        } catch (e) {
            fs.writeFileSync('accounts.lal', JSON.stringify({ accounts: [] }, null, 4));
            file = fs.readFileSync('accounts.lal', 'utf-8');
        }
        // if (isEncrypted.value) {
        //     accounts.value = encryptpwd.decryptJSON(
        //         file,
        //         password.value
        //     ).accounts;
        // } else {
            accounts.value = JSON.parse(file).accounts;
        // }
    }

    function saveAccounts(): void {
        if (isEncrypted.value && !password.value) throw new Error('Password is required');
        // if (isEncrypted.value) {
        //     fs.writeFileSync(
        //         'src/accounts.lal',
        //         encryptpwd.encryptJSON(
        //             { accounts: accounts.value },
        //             password.value
        //         )
        //     );
        // } else {
            fs.writeFileSync(
                'accounts.lal',
                JSON.stringify({ accounts: accounts.value }, null, 4)
            );
        // }
    }

    function addAccount(account: Account): void {
        if (!account.summoner_name || !account.username || !account.password)
            return;
        accounts.value.push({ ...account, tier: 0, rank: 0, lp: 0 });
        saveAccounts();
    }

    function addAccounts(accounts: Account[]): void {
        accounts.forEach(acc => addAccount(acc));
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

    return {
        accounts,
        password,
        isEncrypted,
        loadAccounts,
        saveAccounts,
        addAccount,
        deleteAccount,
        moveAccount,
        addAccounts
    };
});
