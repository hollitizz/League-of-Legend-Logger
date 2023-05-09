import fs from 'fs';
import { ref } from 'vue';
import { RankedStats } from '../types';
import axios from 'axios';
import https from 'https';
import { ipcRenderer } from 'electron';

export const useLeagueLCUAPI = () => {
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

    function sleep(s: number) {
        return new Promise(resolve => setTimeout(resolve, s * 1000));
    }

    async function refreshLockfile(): Promise<void> {
        const lockfilePath = `${process.env['LEAGUE_LOCKFILE']}`;
        let i = 0;
        while (!fs.existsSync(lockfilePath)) {
            console.log('Waiting for lockfile...');
            await sleep(1);
            i++;
            if (i > 100) {
                throw new Error(
                    'Une erreur est survenue lors de la récupération des statistiques'
                );
            }
        }
        [
            clientName.value,
            pid.value,
            port.value,
            password.value,
            method.value
        ] = fs.readFileSync(`${lockfilePath}`, 'utf-8').split(':');
        baseUrl.value = `${method.value}://127.0.0.1:${port.value}`;
        auth.value.password = password.value;
    }

    async function getCurrentSummonerName(): Promise<{
        summoner_name: string;
        iconId: number;
        level: number;
    }> {
        await refreshLockfile();
        const endpoint = `${baseUrl.value}/lol-summoner/v1/current-summoner`;
        let response = null;
        let count = 0;
        while (true) {
            try {
                response = await axios.get(endpoint, {
                    auth: auth.value,
                    httpsAgent
                });
                break;
            } catch (error) {
                await sleep(1);
                count++;
                if (count > 40) {
                    throw new Error(
                        'Une erreur est survenue lors de la récupération des statistiques'
                    );
                }
            }
        }
        const iconId = response.data.profileIconId;
        ipcRenderer.send(
            'download-image',
            `http://ddragon.leagueoflegends.com/cdn/13.9.1/img/profileicon/${iconId}.png`,
            `profileIcons/${iconId}.png`
        );
        return { summoner_name: response.data.displayName, iconId, level: response.data.summonerLevel };
    }

    async function getCurrentSummonerRankedDatas(): Promise<RankedStats> {
        await refreshLockfile();
        const endpoint = `${baseUrl.value}/lol-ranked/v1/current-ranked-stats`;
        let response = null;
        let count = 0;
        while (true) {
            try {
                response = await axios.get(endpoint, {
                    auth: auth.value,
                    httpsAgent
                });
                break;
            } catch (error) {
                await sleep(1);
                count++;
                if (count > 40) {
                    throw new Error(
                        'Une erreur est survenue lors de la récupération des statistiques'
                    );
                }
            }
        }
        const soloQStats = response.data.queues.find(
            (queue: any) => queue.queueType === 'RANKED_SOLO_5x5'
        );
        return {
            tier: soloQStats.tier,
            division: soloQStats.division,
            leaguePoints: soloQStats.leaguePoints,
            miniSeriesProgress: soloQStats.miniSeriesProgress,
            wins: soloQStats.wins,
            losses: soloQStats.losses,
            isProvisional: soloQStats.isProvisional,
        };
    }

    return { getCurrentSummonerRankedDatas, getCurrentSummonerName };
};
