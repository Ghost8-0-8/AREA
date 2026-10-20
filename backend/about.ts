import gmail from "./services/gmail/error_handling";
import discord from "./services/discord/error_handling";
import riot from "./services/riot-games/error_handling";
import spotify from "./services/spotify/error_handling";
import steam from "./services/steam/error_handling";
import cat from "./services/cat/error_handling"

function get_client(req : any) : any {
    const client : any = {
        "host" : req.ip
    };

    return client;
}

interface services_types {
    check : Function,
    get_actions : Function,
    get_reactions : Function,
    get_about_actions : Function,
    get_about_reactions : Function,
    get_params : Function
}

function get_a_service(name : string, func : services_types) : any {
    const service : any = {
        "name" : name,
        "actions" : func.get_about_actions(),
        "reactions" : func.get_about_reactions()
    };

    return service;
}

function get_services() : any[] {
    const services : any[] = [];
    services.push(get_a_service("discord", discord));
    services.push(get_a_service("cat", cat));
    services.push(get_a_service("gmail", gmail));
    services.push(get_a_service("riot_games", riot));
    services.push(get_a_service("spotify", spotify));
    services.push(get_a_service("steam", steam));

    return services;
}

function get_server() : any {
    const server : any = {
        "current_time" : Math.floor(Date.now() / 1000),
        "services" : get_services()
    };

    return server;
}

export function get_about(req : any, res : any) {
    const about : any = {
        "client" : get_client(req),
        "server" : get_server()
    };

    return about;
}
