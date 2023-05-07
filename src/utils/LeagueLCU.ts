import fs from 'fs';
import { ref } from 'vue';
import { RankedStats } from '../types';
import axios from 'axios';
import https from 'https';

export const useLeagueLCURequests = () => {
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
    const baseUrl = ref<string>(`${method.value}://127.0.0.1:${port.value}`);

    function refreshLockfile(): void {
        [
            clientName.value,
            pid.value,
            port.value,
            password.value,
            method.value
        ] = fs
            .readFileSync(
                `${process.env['SystemDrive']}/Riot Games/League of Legends/lockfile`,
                'utf-8'
            )
            .split(':');
    }

    async function getRankedData(): Promise<RankedStats> {
        refreshLockfile();
        const endpoint = `${baseUrl.value}/lol-ranked/v1/ranked-stats`;
        const response = await axios.get(endpoint, { auth: auth.value, httpsAgent });
        return response.data;
    }

    return { getRankedData };
};
