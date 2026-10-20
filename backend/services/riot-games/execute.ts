import axios from 'axios';
import dotenv from 'dotenv';
import IArea from "../areas/areaSchema"
import execute from "../areas/areaExecution"
import { NewsChannel } from 'discord.js';

dotenv.config();

const riotApiKey = process.env.RIOT_API_KEY;
console.log('Clé API de Riot Games :', riotApiKey);
const watchedSummoners: Set<any> = new Set();
const rank_up_summoners : Set<any> = new Set();
const level_summoners : Set<any> = new Set();
type action_types_types = (area: any) => Promise<boolean>;

interface action_types_list_schema {
    [key: string]: {
        "execute" : action_types_types,
        "unexecute" : action_types_types
    };
}

const action_types_list: action_types_list_schema = {
    "get_game" : {
        "execute" : execute_start_watching_game,
        "unexecute" : unexecute_watch_game
    },
    "rank_up" : {
        "execute" : execute_rank_up,
        "unexecute" : unexecute_rank_up
    },
    "level_up" : {
        "execute" : execute_level_up,
        "unexecute" : unexecute_level_up
    }
};

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getActiveGame(puuid: string): Promise<any | null> {
    try {
        const response = await axios.get(`https://euw1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`, {
            headers: { 'X-Riot-Token': riotApiKey }
        });
        return response.data;
    } catch (error: any) {
        console.log(error);
        return null;
    }
}

async function getMatchDetails(matchId: string): Promise<any> {
    try {
        const response = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
            headers: { 'X-Riot-Token': riotApiKey }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getPUUIDFromRiotID(gameName: string, tagLine: string): Promise<string | null> {
    try {
        const response = await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
            headers: { 'X-Riot-Token': riotApiKey }
        });
        return response.data.puuid;
    } catch (error: any) {
        console.log(error);
        return null;
    }
}

async function execute_start_watching_game(area: any): Promise<boolean> {
    const riotId = area.action.params.user;
    if (!riotId) {
        return Promise.resolve(false);
    }
    const [gameName, tagLine] = riotId.split('#');
    if (!gameName || !tagLine) {
        return Promise.resolve(false);
    }
    const puuid = await getPUUIDFromRiotID(gameName, tagLine);
    if (!puuid) {
        return Promise.resolve(false);
    }
    area.action.params.puuid = puuid;
    watchedSummoners.add(area);
    return Promise.resolve(true);
}

async function unexecute_watch_game(area: any) : Promise<boolean> {
    for (const set_area of watchedSummoners) {
        if (set_area._id.toString() == area._id.toString()) {
            watchedSummoners.delete(set_area);
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}

async function monitorGames() {
    while (true) {
        for (const area of watchedSummoners) {
            const puuid = area.action.params.puuid;
            const activeGame = await getActiveGame(puuid);
            if (activeGame) {
                let gameInProgress = true;
                if (area.action.params.status == "start") {
                    execute.reaction_execute(area);
                }
                while (gameInProgress) {
                    if (area.action.params.status == "during") {
                        execute.reaction_execute(area);
                    }
                    const gameCheck = await getActiveGame(puuid);
                    if (!gameCheck) {
                        gameInProgress = false;
                        const matchDetails = await getMatchDetails(activeGame.gameId);
                        if (area.action.params.status == "end") {
                            execute.reaction_execute(area);
                        }
                    }
                    await delay(1 * 60 * 1000);
                }
            }
            await delay(1 * 2 * 1000);
        }
        await delay(1 * 5 * 1000);
    }
}

async function execute_rank_up(area: any): Promise<boolean> {
    const riotId = area.action.params.user;
    if (!riotId) {
        console.error('Riot ID manquant dans les paramètres');
        return Promise.resolve(false);
    }
    const [gameName, tagLine] = riotId.split('#');
    if (!gameName || !tagLine) {
        console.error('Riot ID invalide. Le format doit être gameName#tagLine.');
        return Promise.resolve(false);
    }
    const puuid = await getPUUIDFromRiotID(gameName, tagLine);
    if (!puuid) {
        console.error(`Impossible de récupérer le PUUID pour le Riot ID : ${riotId}`);
        return Promise.resolve(false);
    }
    area.action.params.puuid = puuid;
    area.action.params.crank = null;
    rank_up_summoners.add(area);
    return Promise.resolve(true);
}

async function unexecute_rank_up(area: any) : Promise<boolean> {
    for (const set_area of rank_up_summoners) {
        if (set_area._id.toString() == area._id.toString()) {
            rank_up_summoners.delete(set_area);
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}

async function getSummonerIdByPUUID(puuid : string) : Promise<string | null> {
    try {
        const url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
        const response = await axios.get(url, {
            headers: { 'X-Riot-Token': riotApiKey }
        });
        return response.data.id;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getCurrentRank(puuid: string): Promise<{ tier: string; rank: string; lp: number } | null> {
    try {
        const summonerId = await getSummonerIdByPUUID(puuid);
        const url = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
        const response = await axios.get(url, {
            headers: { 'X-Riot-Token': riotApiKey }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

function get_rank_mode(ranks : any, mode : string) : any {
    try {
        if (ranks == null)
            return null;
        for (const rank of ranks) {
            if (rank["queueType"] == mode) {
                return rank;
            }
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const SOLOQ_MODE : string = "RANKED_SOLO_5x5";

function has_rank_changed(old_rank : any, new_rank : any) : number {
    try {

        const old_soloq = get_rank_mode(old_rank, SOLOQ_MODE);
        const new_soloq = get_rank_mode(new_rank, SOLOQ_MODE);

        if (old_soloq == null) {
            if (new_soloq == null) {
                return 0;
            }
            return 2;
        }

        if (old_soloq["leaguePoints"] != new_soloq["leaguePoints"]) {
            return 1;
        }

        if (old_soloq["rank"] != new_soloq["rank"]) {
            return 1;
        }

        if (old_soloq["tier"] != new_soloq["tier"]) {
            return 1;
        }

        return 0;

    } catch (error) {
        console.log(error);
        return 0;
    }
}

function assign_var_rank(area : any, current_rank : any) {
    const old_soloq = get_rank_mode(area.action.params.crank, SOLOQ_MODE);
    const new_soloq = get_rank_mode(current_rank, SOLOQ_MODE);
    
    area.action.params.old_rank = old_soloq.rank;
    area.action.params.old_tier = old_soloq.tier;
    area.action.params.old_lp = old_soloq.leaguePoints;
    
    area.action.params.crank = current_rank;
    
    area.action.params.tier = new_soloq.tier;
    area.action.params.rank = new_soloq.rank;
    area.action.params.lp = new_soloq.leaguePoints;
}

async function monitor_rank_up() {
    while (true) {
        for (const area of rank_up_summoners) {
                const current_rank = await getCurrentRank(area.action.params.puuid);
                const rank_status = has_rank_changed(area.action.params.crank, current_rank);
                if (rank_status == 2) {
                    area.action.params.crank = current_rank;
                } else if (rank_status == 1) {
                    assign_var_rank(area, current_rank);
                    console.log(area.action.params);
                    execute.reaction_execute(area);
                }
            await delay(1 * 60 * 1000);
        }
        await delay(1 * 5 * 1000); //? n * s * ms
    }
}

async function getLevelByPUUID(puuid : string) : Promise<number> {
    try {
        const url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
        const response = await axios.get(url, {
            headers: { 'X-Riot-Token': riotApiKey }
        });
        return response.data.summonerLevel;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

async function execute_level_up(area: any): Promise<boolean> {
    const riotId = area.action.params.user;
    if (!riotId) {
        console.error('Riot ID manquant dans les paramètres');
        return Promise.resolve(false);
    }

    const [gameName, tagLine] = riotId.split('#');

    if (!gameName || !tagLine) {
        console.error('Riot ID invalide. Le format doit être gameName#tagLine.');
        return Promise.resolve(false);
    }

    const puuid = await getPUUIDFromRiotID(gameName, tagLine);
    if (!puuid) {
        console.error(`Impossible de récupérer le PUUID pour le Riot ID : ${riotId}`);
        return Promise.resolve(false);
    }

    area.action.params.puuid = puuid;
    area.action.params.level = getLevelByPUUID(puuid);
    level_summoners.add(area);

    return Promise.resolve(true);
}

async function unexecute_level_up(area: any) : Promise<boolean> {
    for (const set_area of level_summoners) {
        if (set_area._id.toString() == area._id.toString()) {
            level_summoners.delete(set_area);
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}

async function monitor_level_up() {
    while (true) {
        for (const area of rank_up_summoners) {
            const current_level = getLevelByPUUID(area.action.params.puuid);
            const old_level = area.action.params.level;
            if (old_level != null) {
                if (old_level < current_level) {
                    console.log("level up !");
                    area.action.params.level = current_level;
                    execute.reaction_execute(area);
                }
            } else {
                area.action.params.level = current_level;
            }
            await delay(1 * 60 * 1000);
        }
        await delay(1 * 5 * 1000);
    }
}

export default {
    execute: (type: string, area: any): Promise<boolean> => {
        switch (type) {
            case "action":
                return action_types_list[area.action.method].execute(area);
            default:
                return Promise.resolve(false);
        }
    },
    unexecute: (area: any): Promise<boolean> => {
        try {
            return action_types_list[area.action.method].unexecute(area);
        } catch (error) {
            console.log(error);
            return Promise.resolve(false);
        }
    }
};

monitorGames();
monitor_rank_up();
monitor_level_up();
