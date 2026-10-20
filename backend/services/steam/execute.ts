import axios from 'axios';
import dotenv from 'dotenv';
import IArea from "../areas/areaSchema"
import execute from "../areas/areaExecution"
import { NewsChannel } from 'discord.js';

dotenv.config();

const steamApiKey = process.env.STEAM_API_KEY;

const watchedGameTime: Set<any> = new Set();
const watchedGames : Set<any> = new Set();
const watchedFriends : Set<any> = new Set();

type action_types_types = (area: any) => Promise<boolean>;

interface action_types_list_schema {
    [key: string]: {
        "execute" : action_types_types,
        "unexecute" : action_types_types
    };
}

const action_types_list: action_types_list_schema = {
    "get_game_time" : {
        "execute" : execute_game_time,
        "unexecute" : unexecute_game_time
    },
    "get_game" : {
        "execute" : execute_game,
        "unexecute" : unexecute_game
    },
    "get_friends" : {
        "execute" : execute_friends,
        "unexecute" : unexecute_friends
    }
};

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function execute_game_time(area: any): Promise<boolean> {
    watchedGameTime.add(area);
    return Promise.resolve(true);
}

async function unexecute_game_time(area: any) : Promise<boolean> {
    for (const set_area of watchedGameTime) {
        if (set_area._id.toString() == area._id.toString()) {
            watchedGameTime.delete(set_area);
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}

async function get_steam_games(steamId : string) : Promise<any> {
    try {
        const response = await axios.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/', {
            params: {
                key: steamApiKey,
                steamid: steamId,
                include_appinfo: true,
                include_played_free_games: true
            }
        });
        return response.data.response.games;

    } catch (error) {
        console.log(error);
        return null;
    }
}

async function check_game_time(area : any) : Promise<boolean> {
    const steamId = area.action.params.steam_id;
    const name = area.action.params.game_name;
    const appId = area.action.params.app_id;

    try {
        const games = await get_steam_games(steamId);

        var wanted = null;
        for (const game of games) {
            if (game.name == name || game.appid == appId) {
                wanted = game;
            }
        }

        if (wanted == null) {
            return false;
        }

        const total = wanted.playtime_forever + wanted.playtime_disconnected;
        area.action.params.total = total;
        if (total >= Number(area.action.params.time))
            return true;
        return false;

    } catch (error) {
        console.log(error);
        return false;
    }
}

async function monitor_game_time() {
    while (true) {
        for (const area of watchedGameTime) {
            if (await check_game_time(area))
                execute.reaction_execute(area);
            await delay(1 * 2 * 1000);
        }
        await delay(1 * 5 * 1000);
    }
}

async function execute_game(area: any): Promise<boolean> {
    const steamId = area.action.params.steam_id;

    area.action.params.games_list = await get_steam_games(steamId)
    watchedGames.add(area);
    return Promise.resolve(true);
}

function has_game(games : any[], name : string) : boolean {
    for (const game of games) {
        if (game.name == name)
            return true;
    }
    return false;
}

async function unexecute_game(area: any) : Promise<boolean> {
    for (const set_area of watchedGames) {
        if (set_area._id.toString() == area._id.toString()) {
            watchedGames.delete(set_area);
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}


async function check_games(area : any) : Promise<boolean> {
    try {
        const steamId = area.action.params.steam_id;
        const games = await get_steam_games(steamId);
        const addedGames : string[] = [];

        for (const game of games) {
            if (!has_game(area.action.params.games_list, game.name)) {
                addedGames.push(game.name);
            }
        }

        if (addedGames.length > 0) {
            area.action.params.new_game = addedGames;
            area.action.params.games_list = games;
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function monitor_games() {
    while (true) {
        for (const area of watchedGames) {
            if (await check_games(area))
                execute.reaction_execute(area);
            await delay(1 * 1 * 1000);
        }
        await delay(1 * 3 * 1000);
    }
}

async function get_steam_friends(steamId : string) : Promise<any> {
    try {
        const response = await axios.get('http://api.steampowered.com/ISteamUser/GetFriendList/v1/', {
            params: {
                key: steamApiKey,
                steamid: steamId,
                relationship: 'friend'
            }
        });
        return response.data.friendslist.friends;
    } catch(error) {
        console.log(error);
        return null;
    }
}

async function execute_friends(area : any) : Promise<boolean> {
    const steamId = area.action.params.steam_id;
    area.action.params.friends = await get_steam_friends(steamId)
    watchedFriends.add(area);
    return true;
}

function is_friend(friends : any[], name : string) : boolean {
    for (const friend of friends) {
        if (friend.steamid == name) {
            return true;
        }
    }
    return false;
}

async function unexecute_friends(area: any) : Promise<boolean> {
    for (const set_area of watchedFriends) {
        if (set_area._id.toString() == area._id.toString()) {
            watchedFriends.delete(set_area);
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}


async function check_friends(area : any) : Promise<boolean> {
    try {
        const friends = await get_steam_friends(area.action.params.steam_id);
        const new_friends = [];

        for (const friend of friends) {
            if (!is_friend(area.action.params.friends, friend.steamid)) {
                new_friends.push(friend.steamid);
            }
        }
        area.action.params.friends = friends;
        if (new_friends.length > 0) {
            area.action.params.new_friend = new_friends;
            return true;
        }
        return false;
    } catch(error) {
        console.log(error);
        return false;
    }
}

async function monitor_friends() {
    while (true) {
        for (const area of watchedFriends) {
            if (await check_friends(area))
                execute.reaction_execute(area);
            await delay(1 * 1 * 1000);
        }
        await delay(1 * 3 * 1000);
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

monitor_game_time();
monitor_games();
monitor_friends();
