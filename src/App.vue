<template>

    <button @click="login"></button>
</template>
<script setup lang="ts">
import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';


function login() {
    const lockfile = fs.readFileSync(
        path.join(process.env.APPDATA, '../Local/Riot\ Games/Riot\ Client/Config/lockfile'),
        'utf-8'
    ).split(':');
    let login = "aaaaaaaaaaaa";
    let password = "xxxxxxxxxxxxxxxx";
    let lcu_url = `${lockfile[4]}://127.0.0.1:${lockfile[2]}`;
    let lcu_port = parseInt(lockfile[2]);
    let lcu_user = 'riot';
    let lcu_password = lockfile[3];
    let lcu_protocol = lockfile[4];
    let payload = {
        username: login,
        password: password,
        persistLogin: false,
    };
    let agent = new https.Agent({
        rejectUnauthorized: false,
    });
    axios.put(
        `${lcu_url}/rso-auth/v1/session/credentials`,
        payload,
        {
            httpsAgent: agent,
            auth: {
                username: lcu_user,
                password: lcu_password,
            },
        }
    )

}

</script>
<style>

</style>
