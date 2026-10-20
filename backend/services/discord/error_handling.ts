import { arrayBuffer } from "stream/consumers";

type reaction_types_types = (params: any) => boolean;

interface reaction_types_list_schema {
    [key: string]: {function : reaction_types_types, params : any, description : string};
}

const reaction_types_list : reaction_types_list_schema = {
    
    
    
    
    
    
    
    "send_server_message" : {
        "function" : check_send_server_message,
        "params" : {
            "channel" : "",
            "content" : ""
        },
        "description" : "Send a message to a channel."
    },
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}

function check_send_private_message(params : any) : boolean {
    const default_params = reaction_types_list["send_private_message"].params;
    const filtered_params = {
        user: params.user || default_params.user,
        content: params.content || default_params.content
    };
    Object.assign(params, filtered_params);
    return true;
}

function check_send_server_message(params : any) : boolean {
    const default_params = reaction_types_list["send_server_message"].params;
    const filtered_params = {
        channel: params.channel || default_params.channel,
        content: params.content || default_params.content
    };
    Object.assign(params, filtered_params);
    return true;
}

function check_add_role(params : any) : boolean {
    const default_params = reaction_types_list["add_role"].params;
    const filtered_params = {
        user: params.user || default_params.user,
        role: params.role || default_params.role
    };
    Object.assign(params, filtered_params);
    return true;
}

function check_delete_role(params : any) : boolean {
    const default_params = reaction_types_list["delete_role"].params;
    const filtered_params = {
        user: params.user || default_params.user,
        role: params.role || default_params.role
    };
    Object.assign(params, filtered_params);
    return true;
}

function check_rename_channel(params : any) : boolean {
    const default_params = reaction_types_list["rename_channel"].params;
    const filtered_params = {
        channel: params.channel || default_params.channel,
        new_name: params.new_name || default_params.new_name
    };
    Object.assign(params, filtered_params);
    return true;
}

type action_types_types = (params: any) => boolean;

interface action_types_list_schema {
    [key: string]: {function : action_types_types, params : any, description : string};
}

const action_types_list : action_types_list_schema = {
    
    
    
    
    
    
    "get_server_message" :{
        "function" : check_get_server_message,
        "params" : {
            "user" : "",
            "channel" : "",
            "content" : ""
        },
        "description" : "Get a message from a channel."
    },
    "get_new_user" :{
        "function" : check_get_new_user,
        "params" : {
            "server" : "",
            "user" : ""
        },
        "description" : "Trigger when a new user joins a server."
    },
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}

function check_get_private_message(params : any) : boolean {
    const default_params = action_types_list["get_private_message"].params;
    if (params) {
        if (params.user)
            default_params.user = params.user;
    }
    Object.assign(params, default_params);
    return true;
}

function check_get_server_message(params : any) : boolean {
    const default_params = action_types_list["get_server_message"].params;
    if (params) {
        if (params.user)
            default_params.user = params.user;
        if (params.channel)
            default_params.channel = params.channel;
        if (params.content)
            default_params.content = params.content;
    }
    Object.assign(params, default_params);
    return true;
}

function check_get_new_reaction(params : any) : boolean {
    const default_params = action_types_list["get_new_reaction"].params;
    if (params) {
        if (params.emote)
            default_params.emote = params.emote;
        if (params.count)
            default_params.count = params.count;
    }
    Object.assign(params, default_params);
    return true;
}

function check_get_added_role(params : any) : boolean {
    const default_params = action_types_list["get_added_role"].params;
    if (params) {
        if (params.user)
            default_params.user = params.user;
        if (params.role)
            default_params.role = params.role;
    }
    Object.assign(params, default_params);
    return true;
}

function check_get_deleted_role(params : any) : boolean {
    const default_params = action_types_list["get_deleted_role"].params;
    if (params) {
        if (params.user)
            default_params.user = params.user;
        if (params.role)
            default_params.role = params.role;
    }
    Object.assign(params, default_params);
    return true;
}

function check_get_new_user(params : any) : boolean {
    const default_params = action_types_list["get_new_user"].params;
    if (params) {
        if (params.user)
            default_params.user = params.user;
        if (params.server)
            default_params.server = params.server;
    }
    Object.assign(params, default_params);
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
