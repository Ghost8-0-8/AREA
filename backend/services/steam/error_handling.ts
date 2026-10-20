type reaction_types_types = (params: any) => boolean;

interface reaction_types_list_schema {
    [key: string]: {function : reaction_types_types, params : any, description : string};
}

const reaction_types_list : reaction_types_list_schema = {
}

type action_types_types = (params: any) => boolean;

interface action_types_list_schema {
    [key: string]: {function : action_types_types, params : any, description : string};
}

const action_types_list : action_types_list_schema = {
    "get_game_time" : {
        "function" : check_game_time,
        "params" : {
            "steam_id" : "",
            "game_name" : "",
            "app_id" : "",
            "timer" : "0"
        },
        "description" : "Trigger when the user passes the time (in minutes) entered in a game."
    },
    "get_game" : {
        "function" : check_get_game,
        "params" : {
            "steam_id" : ""
        },
        "description" : "Trigger when the user gets a new game."
    },
    "get_friends" : {
        "function" : check_get_friends,
        "params" : {
            "steam_id" : ""
        },
        "description" : "Trigger when the user add a new contact as friend."
    }
}

function check_game_time(params : any) : boolean {
    const default_params = action_types_list["get_game_time"].params;
    const filtered_params = {
        user: params.user || default_params.user,
        game: params.game || default_params.game,
        time: params.time || default_params.time
    };
    Object.assign(params, filtered_params);
    return true;
}

function check_get_game(params : any) : boolean {
    const default_params = action_types_list["get_game"].params;
    const filtered_params = {
        steam_id: params.steam_id || default_params.steam_id,
    };
    Object.assign(params, filtered_params);
    return true;
}

function check_get_friends(params : any) : boolean {
    const default_params = action_types_list["get_friends"].params;
    const filtered_params = {
        steam_id: params.steam_id || default_params.steam_id,
    };
    Object.assign(params, filtered_params);
    return true;
}

export default {
    check : (type : string, area_type : string, params : any) : boolean => {
        try {
            switch (area_type) {
                case "action":
                    return action_types_list[type].function(params);
                case "reaction":
                    return reaction_types_list[type].function(params);
            }
            return false
        } catch(err) {
            return false;
        }
    },
    get_actions : () : Array<string> => {
        let actions = new Array();
        for (const action in action_types_list) {
            actions.push(action);
        }
        return actions;
    },
    get_about_actions : () : Array<string> => {
        let actions = new Array();
        for (const action in action_types_list) {
            actions.push({
                "name" : action,
                "description" : action_types_list[action].description
            });
        }
        return actions;
    },
    get_reactions : () : Array<string> => {
        let reactions = new Array();
        for (const reaction in reaction_types_list) {
            reactions.push(reaction);
        }
        return reactions;
    },
    get_about_reactions : () : Array<string> => {
        let reactions = new Array();
        for (const reaction in reaction_types_list) {
            reactions.push({
                "name" : reaction,
                "description" : reaction_types_list[reaction].description
            });
        }
        return reactions;
    },
    get_params : (method : string) : Object => {
        try {
            let params = action_types_list[method].params;
            if (!params) {
                params = reaction_types_list[method].params;
            }
            return params;
        } catch(err) {
            let params = reaction_types_list[method].params;
            return params;
        }
    }
}
