import AreaModel from "./areaModel";
import {authenticateJWT} from "../auth-service/authMiddleware";
import gmail from "../gmail/error_handling";
import discord from "../discord/error_handling";
import riot from "../riot-games/error_handling";
import spotify from "../spotify/error_handling";
import steam from "../steam/error_handling";
import cat from "../cat/error_handling"
import execute from "./areaExecution";

import {Request, Response} from "express";
import { RootQuerySelector } from "mongoose";
import { exec } from "child_process";

interface services_types {
    check : Function,
    get_actions : Function,
    get_reactions : Function,
    get_params : Function
}

interface services_list_schema {
    [key: string]: services_types;
}

const services_list : services_list_schema = {
    "gmail" : gmail,
    "discord" : discord,
    "riot_games" : riot,
    "spotify" : spotify,
    "steam" : steam,
    "cat" : cat
}

function is_good_area(action : any, area_type : string) : boolean{
    try {
        if (!action)
            return false;
        const {service, method} = action;
        if (!service || !method)
            return false;
        return services_list[service].check(
            method,
            area_type,
            action.params
        );
    } catch(err) {
        return false;
    }
}

export default {
    add_area: [authenticateJWT, async (req: Request, res: Response): Promise<Response> => {
        try {
            const {action, reaction} = req.body;
            if (!is_good_area(action, "action")) {
                return res.status(400).json({
                    success: false,
                    error: "Bad action"
                });
            }
            if (!is_good_area(reaction, "reaction")) {
                return res.status(400).json({
                    success: false,
                    error: "Bad reaction"
                });
            }
            const userId = req.user as {_id: string};
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: "User ID not found"
                });
            }
            const token = req.header("Authorization")?.split(" ")[1];
            action.params.token = token;
            reaction.params.token = token;
            const new_area = new AreaModel({
                user_id : userId._id,
                action : action,
                reaction : reaction
            });
            await new_area.save();

            execute.action_execute();

            return res.status(200).json({
                success: true,
                area_id: new_area._id
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }],

    get_areas: [authenticateJWT, async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = req.user as {_id : string};
            const areas = await AreaModel.find({user_id : user._id});
            return res.status(200).json({
                success : true,
                data : areas
            });
        } catch(err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }],

    get_area: [authenticateJWT, async (req: Request, res: Response): Promise<Response> => {
        try {
            const area_id = req.params.id;
            const area = await AreaModel.find({_id : area_id});
            return res.status(200).json({
                success : true,
                data : area[0]
            });
        } catch(err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }],

    modify_area: [authenticateJWT, async (req: Request, res: Response): Promise<Response> => {
        try {
            const {action, reaction} = req.body;
            if (!is_good_area(action, "action")) {
                return res.status(400).json({
                    success: false,
                    error: "Bad action"
                });
            }

            if (!is_good_area(reaction, "reaction")) {
                return res.status(400).json({
                    success: false,
                    error: "Bad reaction"
                });
            }
            const userId = req.user as {_id: string};
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: "User ID not found"
                });
            }

            const area_id = req.params.id;
            const area = await AreaModel.findOne({_id : area_id});
            if (!area) {
                return res.status(404).json({
                    success: false,
                    error: "Area not found"
                });
            }
            area.action = action;
            area.reaction = reaction;
            await area.save();

            return res.status(200).json({
                success : true
            });
        } catch(err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }],

    delete_area: [authenticateJWT, async (req: Request, res: Response): Promise<Response> => {
        try {
            const area_id = req.params.id;
            const area = await AreaModel.findOne({_id : area_id});
            execute.unexecute(area)
            await AreaModel.deleteOne({_id : area_id});
            execute.action_execute();
            return res.status(200).json({
                success : true,
            });
        } catch(err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }],
    get_services : [authenticateJWT, async (req : Request, res : Response) : Promise<Response> => {
        try {
            let services = new Array();
            for (const service in services_list) {
                services.push(service);
            }
            return res.status(200).json({
                success: true,
                data: services
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }],
    get_actions : [authenticateJWT, async (req : Request, res : Response) : Promise<Response> => {
        try {
            let service = req.params.name;
            let actions = services_list[service].get_actions();
            
            return res.status(200).json({
                success: true,
                data: actions
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }],
    get_reactions : [authenticateJWT, async (req : Request, res : Response) : Promise<Response> => {
        try {
            let service = req.params.name;
            let reactions = services_list[service].get_reactions();
            
            return res.status(200).json({
                success: true,
                data: reactions
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }],
    get_params : [authenticateJWT, async (req : Request, res : Response) : Promise<Response> => {
        try {
            let service = req.params.service_name;
            let method = req.params.method_name;
            let methods = services_list[service].get_params(method);
            
            return res.status(200).json({
                success: true,
                data: methods
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Unknown service and/or method entered."
            });
        }
    }]
}
