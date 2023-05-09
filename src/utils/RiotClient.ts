import fs from 'fs';
import { ref } from 'vue';
import axios from 'axios';
import https from 'https';
import { RequestError } from '../types.d';

export const useRiotLCUAPI = () => {
    const clientName = ref<string>('');
    const pid = ref<string>('');
    const port = ref<string>('');
    const password = ref<string>('');
    const method = ref<string>('');
    const auth = ref({
        username: 'riot',
        password: password.value
    });
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
    const baseUrl = ref<string>('');

    function refreshLockfile(): void {
        [
            clientName.value,
            pid.value,
            port.value,
            password.value,
            method.value
        ] = fs
            .readFileSync(
                `${process.env['RIOT_LOCKFILE']}`,
                'utf-8'
            )
            .split(':');
        baseUrl.value = `${method.value}://127.0.0.1:${port.value}`;
        auth.value.password = password.value;
    }

    async function login(username: string, password: string): Promise<any> {
        try {
            refreshLockfile();
        } catch (error) {
            throw new RequestError('Impossible de se connecter au client LCU', 404);
        }
        const endpoint = `${baseUrl.value}/rso-auth/v1/session/credentials`;
        const payload = {
            username: username,
            password: password,
            persistLogin: false
        };
        const response = await axios.put(endpoint, payload, {
            auth: auth.value,
            httpsAgent
        });
        return response;
    }

    return { login };
};
