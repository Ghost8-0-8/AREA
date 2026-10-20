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
    "get_game" : {
        "function" : check_game_status,
        "params" : {
            "user" : "",
            "status" : "start"
        },
        "description" : "Trigger when the player is [start, in_game, end]=status game."
    },
    "rank_up" : {
        "function" : check_rank_up,
        "params" : {
            "user" : ""
        },
        "description" : "Trigger when the player's rank changes."
    },
    "level_up" : {
        "function" : check_level_up,
        "params" : {
            "user" : ""
        },
        "description" : "Trigger when the player level up."
    }
}

function check_game_status(params : any) : boolean {
    const default_params = action_types_list["get_game"].params;
    const filtered_params = {
        user: params.user || default_params.user,
        status: params.status || default_params.status
    };
    Object.assign(params, filtered_params);
    return true;
}

function check_rank_up(params : any) : boolean {
    const default_params = action_types_list["rank_up"].params;
    const filtered_params = {
        user: params.user || default_params.user,
    };
    Object.assign(params, filtered_params);
    return true;
}

function check_level_up(params : any) : boolean {
    const default_params = action_types_list["level_up"].params;
    const filtered_params = {
        user: params.user || default_params.user,
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
