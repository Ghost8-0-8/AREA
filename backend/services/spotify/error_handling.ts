type reaction_types_types = (params: any) => boolean;

interface reaction_types_list_schema {
    [key: string]: {function : reaction_types_types, params : any, description : string};
}

const reaction_types_list : reaction_types_list_schema = {
    "add_track" : {
        "function" : check_add_track,
        "params" : {
            "title" : ""
        },
        "description" : "Add a track to a playlist."
    },
    "play_track" : {
        "function" : check_play_track,
        "params" : {
            "trackName": ""
        },
        "description" : "Play the track entered to the spotify player."
    }
}

function check_play_track(params : any) : boolean {
    const default_params = reaction_types_list["play_track"].params;
    const filtered_params = {
        token: params.token || default_params.token,
        trackId: params.trackId || default_params.trackId,
    };
    Object.assign(params, filtered_params);
    return true;
}

function check_add_track(params : any) : boolean {
    const default_params = reaction_types_list["add_track"].params;
    const filtered_params = {
        title: params.title || default_params.title,
    };
    Object.assign(params, filtered_params);
    return true;
}

type action_types_types = (params: any) => boolean;

interface action_types_list_schema {
    [key: string]: {function : action_types_types, params : any, description : string};
}

const action_types_list : action_types_list_schema = {
    "listen" : {
        "function" : check_listen,
        "params" : {
        },
        "description" : "Trigger when the user listen a music."
    }
}

function check_listen(params : any) : boolean {
    const default_params = action_types_list["listen"].params;
    const filtered_params = {
        token: params.token || default_params.token,
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
