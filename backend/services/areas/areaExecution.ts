import AreaModel from "./areaModel";
import discord from "../discord/execute"
import riot from "../riot-games/execute"
import spotify from "../spotify/execute"
import steam from "../steam/execute"
import cat from "../cat/execute"
import gmail from "../gmail/execute"

type services_types = (type : string, area : any) => Promise<boolean>;
type services_unex_types = (area : any) => Promise<boolean>;

interface services_list_schema {
    [key : string] : {
        "execute" : services_types,
        "unexecute" : services_unex_types
    };
}

const services_list : services_list_schema = {
    "gmail" : {
        "execute" : gmail.execute,
        "unexecute" : gmail.unexecute
    },
    "discord" : {
        "execute" : discord.execute,
        "unexecute" : discord.unexecute
    },
    "riot_games" : {
        "execute" : riot.execute,
        "unexecute" : riot.unexecute
    },
    "spotify" : {
        "execute" : spotify.execute,
        "unexecute" : spotify.unexecute
    },
    "steam" : {
        "execute" : steam.execute,
        "unexecute" : steam.unexecute
    },
    "cat" : {
        "execute" : cat.execute,
        "unexecute" : cat.unexecute
    }
}

function get_var_parameter(params : any, param : string) : string | null {
    for (const ac_param of params) {
        if (ac_param == param)
            return ac_param;
    }
    return null;
}

function update_area_var(area : any) : any {
    try {
        const action_p = area.action.params;

        for (const key of Object.keys(area.reaction.params)) {
            area.reaction.params[key] = area.reaction.params[key].replace(
                /{(.*?)}/g, (match : string, p1 : string) => action_p[p1] || null
            );
        }
        return area;
    } catch (error) {
        return area;
    }
}

export default {
    action_execute : async () => {
        try {
            const areas = await AreaModel.find();
            if (!areas)
                return;
            for (const area of areas) {
                try {
                    const action = area.action as {service : string};
                    services_list[action.service].execute("action", area);
                } catch (err) {
                    console.log("Error occured at the execution of action: ", err);
                }
            }
        } catch(err) {
            console.log("Error occured at the execution of action: ", err);
        }
    },
    reaction_execute : async (area : any) => {
        try {
            const reaction = area.reaction as {service : string};
            var area_copy = JSON.parse(JSON.stringify(area));
            area_copy = update_area_var(area_copy);
            services_list[reaction.service].execute("reaction", area_copy);
        } catch (err) {
            console.log("Error occured at the execution of reaction: ", err);
        }
    },
    unexecute : async (area : any) => {
        try {
            services_list[area.action.service].unexecute(area);
        } catch(err) {
            console.log("Error occured at the execution of action: ", err);
        }
    },
};
