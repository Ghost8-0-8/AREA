type reaction_types_types = (params: any) => boolean;

interface reaction_types_list_schema {
    [key: string]: {function : reaction_types_types, params : any, description : string};
}

const reaction_types_list : reaction_types_list_schema = {
    "send_mail" : {
        "function" : check_send_mail,
        "params" : {
            "user" : "",
            "object" : "",
            "content" : "",
        },
        "description" : "Send a mail to the recipient entered."
    },
    "create_draft": {
        "function" : check_create_draft,
        "params" : {
            "user" : "",
            "object" : "",
            "content" : "",
        },
        "description" : "Create a draft without sending it."
    }
}

function check_create_draft(params : any) : boolean {
    const default_params = reaction_types_list["create_draft"].params;
    const filtered_params = {
        user: params.user || default_params.user,
        object: params.object || default_params.object,
        content: params.content || default_params.content,
        token: params.token || default_params.token
    };
    Object.assign(params, filtered_params);
    return true;
}

function check_send_mail(params : any) : boolean {
    const default_params = reaction_types_list["send_mail"].params;
    const filtered_params = {
        user: params.user || default_params.user,
        object: params.object || default_params.object,
        content: params.content || default_params.content
    };
    Object.assign(params, filtered_params);
    return true;
}

type action_types_types = (params: any) => boolean;

interface action_types_list_schema {
    [key: string]: {function : action_types_types, params : any, description : string};
}

const action_types_list : action_types_list_schema = {
    "get_unread_emails" : {
        "function" : check_get_mail,
        "params" : {
            "user" : "",
            "object" : "",
        },
        "description" : "Trigger once you receive a new mail."
    }
}

function check_get_mail(params : any) : boolean {
    const default_params = action_types_list["get_unread_emails"].params;
    if (params) {
        if (params.user)
            default_params.user = params.user;
        if (params.object)
            default_params.object = params.object;
        if (params.token)
            default_params.token = params.token;
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
