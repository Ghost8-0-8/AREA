import { google } from 'googleapis';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import mongoose from 'mongoose';
import UserModel from '../user-service/userModel';
import execute from "../areas/areaExecution";

dotenv.config();

type ActionFunction = (area: any) => Promise<boolean>;
type ReactionFunction = (area: any) => Promise<boolean>;

interface ActionTypesList {
    [key: string]: {
        "execute" : ActionFunction,
        "unexecute" : ActionFunction
    };
}


interface ReactionTypesList {
    [key: string]: ReactionFunction;
}

const watchedUsers = new Set<string>();

async function refreshAccessToken(refreshToken: string): Promise<string> {
    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
}

async function isAccessTokenValid(accessToken: string): Promise<boolean> {
    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
            params: { access_token: accessToken }
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error checking access token:', error);
        return false;
    }
}

async function getGoogleAccessTokenFromJWT(token: string): Promise<string> {
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.id;
        console.log('User ID from JWT:', userId);
        
        const objectId = new mongoose.Types.ObjectId(userId);
        const user = await UserModel.findById(objectId);

        if (!user || !user.googleAccessToken || !user.googleRefreshToken) {
            throw new Error('User or Google tokens not found');
        }

        const isValid = await isAccessTokenValid(user.googleAccessToken);

        if (!isValid) {
            const newAccessToken = await refreshAccessToken(user.googleRefreshToken);
            user.googleAccessToken = newAccessToken;
            await user.save();
        }

        return user.googleAccessToken;
    } catch (error) {
        console.error('Error fetching Google access token from database:', error);
        throw error;
    }
}

async function execute_start_checking_emails(area: any): Promise<boolean> {
    const token = area.action.params.token;
    const accessToken = await getGoogleAccessTokenFromJWT(token);

    watchedUsers.add(token);

    while (watchedUsers.has(token)) {
        const oAuth2Client = new google.auth.OAuth2();
        oAuth2Client.setCredentials({ access_token: accessToken });

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        try {
            const res = await gmail.users.messages.list({
                userId: 'me',
                q: 'is:unread',
            });

            if (res.data.messages && res.data.messages.length > 0) {
                for (const message of res.data.messages) {
                    const msg = await gmail.users.messages.get({
                        userId: 'me',
                        id: message.id!,
                    });
                    console.log(`New email from ${msg.data.payload?.headers?.find(header => header.name === 'From')?.value}`);
                    area.action.params.emailData = msg.data;
                    execute.reaction_execute(area);
                }
            }
        } catch (error) {
            console.error('Error getting unread emails:', error);
        }

        await new Promise(resolve => setTimeout(resolve, 60000));
    }
    return true;
}

async function execute_stop_checking_emails(area: any): Promise<boolean> {
    const token = area.action.params.token;
    watchedUsers.delete(token);
    console.log(`Stopped watching emails for token: ${token}`);
    return true;
}

async function executeSendEmail(area: any): Promise<boolean> {
    const token = area.reaction.params.token;
    const accessToken = await getGoogleAccessTokenFromJWT(token);

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;
    const userRecord = await UserModel.findById(userId);
    
    if (!userRecord || !userRecord.email) {
        console.error('User or user email not found in the database');
        return false;
    }

    const userEmail = userRecord.email;
    const { object, content } = area.reaction.params;

    const email = [
        `From: ${userEmail}`,
        `To: ${area.reaction.params.user}`,
        `Subject: ${object}`,
        ``,
        `${content}`,
    ].join("\r\n");

    const encodedMessage = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    try {
        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

async function executeCreateDraft(area: any): Promise<boolean> {
    const token = area.reaction.params.token;
    const accessToken = await getGoogleAccessTokenFromJWT(token);

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;
    const userRecord = await UserModel.findById(userId);
    
    if (!userRecord || !userRecord.email) {
        console.error('User or user email not found in the database');
        return false;
    }

    const userEmail = userRecord.email;
    const { object, content } = area.reaction.params;

    const email = [
        `From: ${userEmail}`,
        `To: ${area.reaction.params.user}`,
        `Subject: ${object}`,
        ``,
        `${content}`,
    ].join("\r\n");

    const encodedMessage = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    try {
        await gmail.users.drafts.create({
            userId: 'me',
            requestBody: {
                message: {
                    raw: encodedMessage,
                },
            },
        });
        console.log('Draft created successfully');
        return true;
    } catch (error) {
        console.error('Error creating draft:', error);
        return false;
    }
}

const actionTypesList: ActionTypesList = {
    "get_unread_emails": {
        "execute" : execute_start_checking_emails,
        "unexecute" : execute_stop_checking_emails
    }
};

const reactionTypesList: ReactionTypesList = {
    "send_mail": executeSendEmail,
    "create_draft": executeCreateDraft,
};

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
