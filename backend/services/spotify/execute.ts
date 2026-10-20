import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import UserModel from '../user-service/userModel';
import execute from "../areas/areaExecution";

dotenv.config();

const watchedUsers: Set<any> = new Set();

type action_types_types = (area: any) => Promise<boolean>;

interface action_types_list_schema {
    [key: string]: {
        "execute" : action_types_types,
        "unexecute" : action_types_types
    };
}
const action_types_list: action_types_list_schema = {
    "listen": {
        "execute" : execute_start_listening,
        "unexecute" : unexecute_listening
    }
};

async function refreshAccessToken(refreshToken: string): Promise<string> {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
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
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error checking access token:', error);
        return false;
    }
}

async function getSpotifyAccessTokenFromJWT(token: string): Promise<string> {
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.id;
        const user = await UserModel.findById(userId);

        if (!user || !user.spotifyAccessToken || !user.spotifyRefreshToken) {
            throw new Error('User or Spotify tokens not found');
        }

        const isValid = await isAccessTokenValid(user.spotifyAccessToken);

        if (!isValid) {
            const newAccessToken = await refreshAccessToken(user.spotifyRefreshToken);
            user.spotifyAccessToken = newAccessToken;
            await user.save();
        }

        return user.spotifyAccessToken;
    } catch (error) {
        console.error('Error fetching Spotify access token from database:', error);
        throw error;
    }
}

async function getCurrentlyPlaying(accessToken: string): Promise<any | null> {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (response.status === 204) {
            return null;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching currently playing track:', error);
        throw error;
    }
}

async function execute_start_listening(area: any): Promise<boolean> {
    const token = area.action.params.token;
    const accessToken = await getSpotifyAccessTokenFromJWT(token);

    watchedUsers.add(token);

    while (watchedUsers.has(token)) {
        const currentlyPlaying = await getCurrentlyPlaying(accessToken);
        if (currentlyPlaying) {
            area.action.params.title = currentlyPlaying;
            execute.reaction_execute(area);
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
    return true;
}

async function unexecute_listening(area: any) : Promise<boolean> {
    for (const set_area of watchedUsers) {
        if (set_area._id.toString() == area._id.toString()) {
            watchedUsers.delete(set_area);
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}
type reaction_types_list_schema = (area: any) => Promise<boolean>;

interface reaction_types_types {
    [key: string]: reaction_types_list_schema;
}

const reaction_types_list: reaction_types_types = {
    "add_track": execute_add_track,
    "play_track": execute_play_track,
};

async function play_track(area: any): Promise<boolean> {
    const token = area.reaction.params.token;
    const trackId = area.reaction.params.trackId;
    const accessToken = await getSpotifyAccessTokenFromJWT(token);

    try {
        const response = await axios.put(`https://api.spotify.com/v1/me/player/play`, {
            uris: [`spotify:track:${trackId}`]
        }, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (response.status === 204) {
            console.log(`Playing track: ${trackId}`);
            return true;
        } else {
            console.error('Failed to play track:', response.data);
            return false;
        }
    } catch (error) {
        console.error('Error playing track:', error);
        return false;
    }
}

async function execute_play_track(area: any): Promise<boolean> {
    console.log('Executing play track');
    const token = area.reaction.params.token;
    const trackName = area.reaction.params.trackName;
    if (!trackName) {
        console.log('No track name provided');
        return false;
    }
    console.log(`Playing track: ${trackName}`);
    const accessToken = await getSpotifyAccessTokenFromJWT(token);

    const track = await searchTrackByTitle(accessToken, trackName);
    console.log(track);
    if (track) {
        return play_track({ reaction: { params: { token, trackId: track.id } } });
    } else {
        console.log(`No track found for name: ${trackName}`);
        return false;
    }
}

async function execute_add_track(area: any): Promise<boolean> {
    const token = area.reaction.params.token;
    const title = area.reaction.params.title;
    const playlistId = area.reaction.params.playlistId;
    const accessToken = await getSpotifyAccessTokenFromJWT(token);
    
    const track = await searchTrackByTitle(accessToken, title);
    if (track) {
        console.log(`Track found: ${track.name} by ${track.artists[0].name}`);
        const trackAdded = await addTrackToPlaylist(accessToken, playlistId, track.id);
        return trackAdded;
    } else {
        console.log(`No track found for title: ${title}`);
        return false;
    }
}

async function searchTrackByTitle(accessToken: string, title: string): Promise<any | null> {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: {
                q: title,
                type: 'track',
                limit: 1
            }
        });
        if (response.data.tracks.items.length === 0) {
            return null;
        }
        return response.data.tracks.items[0];
    } catch (error) {
        console.error('Error searching for track:', error);
        throw error;
    }
}

async function verifyPlaylistId(accessToken: string, playlistId: string): Promise<boolean> {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error verifying playlist ID:', error);
        return false;
    }
}

export async function addTrackToPlaylist(accessToken: string, playlistId: string, trackId: string): Promise<boolean> {
    try {
        const isValidPlaylist = await verifyPlaylistId(accessToken, playlistId);
        if (!isValidPlaylist) {
            console.error('Invalid playlist ID:', playlistId);
            return false;
        }

        const response = await axios.post(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            { uris: [`spotify:track:${trackId}`] },
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );

        if (response.status === 201) {
            console.log(`Track added to playlist: ${playlistId}`);
            return true;
        } else {
            console.error('Failed to add track to playlist:', response.data);
            return false;
        }
    } catch (error) {
        console.error('Error adding track to playlist:', error);
        throw error;
    }
}

export default {
    execute: async (type: string, area: any): Promise<boolean> => {
        try {
            switch (type) {
                case "action":
                    return await action_types_list[area.action.method].execute(area);
                case "reaction":
                    return await reaction_types_list[area.reaction.method](area);
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    },
    unexecute: (area: any): Promise<boolean> => {
        try {
            return action_types_list[area.action.method].unexecute(area);
        } catch (error) {
            console.log(error);
            return Promise.resolve(false);
        }
    }
};
