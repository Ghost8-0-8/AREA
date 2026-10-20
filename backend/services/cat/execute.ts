import axios from 'axios';
import dotenv from 'dotenv';
import IArea from "../areas/areaSchema"
import execute from "../areas/areaExecution"
import { NewsChannel } from 'discord.js';
import { exec } from 'child_process';

dotenv.config();

const catApiKey = process.env.CAT_API_KEY;

const watchedCats : Set<any> = new Set();

type action_types_types = (area: any) => Promise<boolean>;

interface action_types_list_schema {
    [key: string]: {
        "execute" : action_types_types,
        "unexecute" : action_types_types
    };
}

const action_types_list: action_types_list_schema = {
    "get_cat": {
        "execute" : execute_cat,
        "unexecute" : unexecute_cat
    }
};

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function get_current_time_in_seconds() : number {
    return Math.floor(Date.now() / 1000);
}

async function execute_cat(area: any): Promise<boolean> {
    area.action.params.cat = null;
    area.action.params.lastTimer = get_current_time_in_seconds();
    watchedCats.add(area);
    return Promise.resolve(true);
}

async function unexecute_cat(area: any) : Promise<boolean> {
    for (const set_area of watchedCats) {
        if (set_area._id.toString() == area._id.toString()) {
            watchedCats.delete(set_area);
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}

async function get_cat(limit : string) : Promise<any> {
    try {
        const url : string = `https://api.thecatapi.com/v1/images/search?limit=${limit}&api_key=${catApiKey}`;
        const response = await axios.get(url);
        const cats : any[] = [];
        for (const cat of response.data) {
            cats.push(cat.url)
        }
        return cats;
    } catch(error) {
        console.log(error);
        return null;
    }
}

async function check_cat(area : any, timer : number) : Promise<boolean> {
    try {
        const current : number = get_current_time_in_seconds();
        if (current - area.action.params.lastTimer >= area.action.params.timer) {
            area.action.params.lastTimer = get_current_time_in_seconds();
            area.action.params.cat = await get_cat(area.action.params.limit);
            return true;
        }
        return false;
    } catch(error) {
        console.log(error);
        return false;
    }
}

async function monitorCats() {
    while (true) {
        for (const area of watchedCats) {
            if (await check_cat(area, area.action.params.lastTimer))
                execute.reaction_execute(area);
        }
        await delay(1 * 1 * 1000);
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

monitorCats();
