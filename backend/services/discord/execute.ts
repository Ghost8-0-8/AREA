import { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits, TextChannel, Message } from 'discord.js';
import dotenv from 'dotenv';
import IArea from "../areas/areaSchema";
import execute from "../areas/areaExecution";
import { exec } from 'child_process';

dotenv.config();

type ActionFunction = (area: any) => Promise<boolean>;

interface ActionTypesList {
    [key: string]: {
        "execute" : ActionFunction,
        "unexecute" : ActionFunction
    };
}

const actionTypesList: ActionTypesList = {
    "get_server_message": {
        "execute" : executeGetServerMessage,
        "unexecute" : unexecute_server_msg
    },
    "get_new_user": {
        "execute" : executeGetNewUser,
        "unexecute" : unexecute_new_user
    }
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ]
});

const watchedChannels: Set<any> = new Set();
const watchedServersNewUsers: Set<any> = new Set();

async function executeGetServerMessage(area: any): Promise<boolean> {
    watchedChannels.add(area);
    return true;
}

async function unexecute_server_msg(area: any): Promise<boolean> {
    for (const set_area of watchedChannels) {
        if (set_area._id.toString() == area._id.toString()) {
            watchedChannels.delete(set_area);
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}

async function executeGetNewUser(area: any): Promise<boolean> {
    watchedServersNewUsers.add(area);
    return true;
}

async function unexecute_new_user(area: any): Promise<boolean> {
    for (const set_area of watchedServersNewUsers) {
        if (set_area._id.toString() == area._id.toString()) {
            watchedServersNewUsers.delete(set_area);
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}

function interpret_received_server_message(area : any, message : Message) {
    if (area.action.params.user != "") {
        if (area.action.params.user == message.author.username) {
            if (area.action.params.content != "") {
                if (message.content.includes(area.action.params.content)) {
                    execute.reaction_execute(area);
                }
            } else {
                execute.reaction_execute(area);
            }
        }
        return;
    } 

    if (area.action.params.content != "") {
        if (message.content.includes(area.action.params.content)) {
            execute.reaction_execute(area);
        }
        return;
    }

    execute.reaction_execute(area);
}

client.on('messageCreate', (message: Message) => {
    if (message.author.id === client.user?.id) {
        return;
    }
    for (const area of watchedChannels) {
        if (message.channel.id === area.action.params.channel) {
            area.action.params.username = message.author.username;
            area.action.params.globalName = message.author.globalName;
            area.action.params.displayName = message.author.displayName;
            area.action.params.rcontent = message.content;

            interpret_received_server_message(area, message);
            break;
        }
    }
});

client.on('guildMemberAdd', member => {
    for (const area of watchedServersNewUsers) {
        if (area.action.params.server == member.guild.id) {
            if (area.action.params.user != "") {
                if (area.action.params.user == member.user.username) {
                    area.action.params.username = member.user.username;
                    area.action.params.globalName = member.user.globalName;
                    area.action.params.displayName = member.user.displayName;
                    area.action.params.channel = member.guild.systemChannel?.id;
                    execute.reaction_execute(area);
                }
            } else {
                execute.reaction_execute(area);
            }
            break;
        }
    }
});

type ReactionFunction = (area: any) => boolean;

interface ReactionTypesList {
    [key: string]: ReactionFunction;
}

const reactionTypesList: ReactionTypesList = {
    "send_server_message": executeSendServerMessage
};

function executeSendServerMessage(area: any): boolean {
    const channel = client.channels.cache.get(area.reaction.params.channel) as TextChannel;

    if (channel) {
        channel.send(area.reaction.params.content);
        return true;
    }
    return false;
}

export default {
    execute: async (type: string, area: any): Promise<boolean> => {
        try {
            switch (type) {
                case "action":
                    return await actionTypesList[area.action.method].execute(area);
                case "reaction":
                    return reactionTypesList[area.reaction.method](area);
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    },
    unexecute: async (area: any): Promise<boolean> => {
        try {
            return actionTypesList[area.action.method].unexecute(area);
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
