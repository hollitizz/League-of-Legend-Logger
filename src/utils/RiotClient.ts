import fs from 'fs';
import path from 'path';
import axios from 'axios';
import https from 'https';

export function login(username: string, password: string): void {
    const [lcu_port, lcu_password, lcu_method] = fs.readFileSync(
        path.join(process.env.APPDATA, '../Local/Riot\ Games/Riot\ Client/Config/lockfile'),
        'utf-8'
    ).split(':').slice(2);
    const endpoint = `${lcu_method}://127.0.0.1:${lcu_port}/rso-auth/v1/session/credentials`;
    const payload = {
        username,
        password,
        persistLogin: false,
    };
    const auth = {
        username: 'riot',
        password: lcu_password,
    }
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });
    axios.put(endpoint, payload, { auth, httpsAgent })
}
