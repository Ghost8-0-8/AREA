import riotImage from '../../assets/Riot.png';
import steamImage from '../../assets/Steam.png';
import catImage from '../../assets/Catapi.png';
import googleImage from '../../assets/Google.png';
import discordImage from '../../assets/Discord.png';
import spotifyImage from '../../assets/Spotify.png';

export const services = [
    { label: 'Riot Games', value: 'riot_games', icon: riotImage },
    { label: 'Steam', value: 'steam', icon: steamImage },
    { label: 'CatApi', value: 'cat', icon: catImage },
    { label: 'Google', value: 'google', icon: googleImage },
    { label: 'Discord', value: 'discord', icon: discordImage },
    { label: 'Spotify', value: 'spotify', icon: spotifyImage },
];

export const actions = {
    discord: [
        { label: 'Récupérer les messages serveur :', value: 'get_server_message', parameters: [{ key: 'channel', placeholder: 'Identifiant du canal' }, { key: 'content', placeholder: 'Contenu' }, { key: 'user', placeholder: 'Utilisateur' },] },
        { label: 'Récupérer le nouvel utilisateur sur le serveur :', value: 'get_new_user', parameters: [{ key: 'server', placeholder: 'Identifiant du serveur' }, { key: 'user', placeholder: 'Utilisateur' },] },
    ],
    steam: [
        { label: 'le joueur dépasse le temps de jeu sur :', value: 'get_game_time', parameters: [{ key: 'steam_id', placeholder: 'ID du joueur' }, { key: 'game_name', placeholder: 'nom du jeu' }, { key: 'app_id', placeholder: 'ID de l\'application' }, { key: 'timer', placeholder: 'Temps passé' },] },
        { label: 'le joueur ajoute un jeu dans la bibliothèque', value: 'get_game', parameters: [{ key: 'steam_id', placeholder: 'ID du joueur' },] },
        { label: 'le joueur ajoute un ami', value: 'get_friends', parameters: [{ key: 'steam_id', placeholder: 'ID du joueur' },] }, 
    ],
    riot_games: [
        { label: 'le joueur gagne un rang', value: 'rank_up', parameters: [{ key: 'user', placeholder: 'ID du joueur' },{ key: 'status', placeholder: 'État de la game' },] },
        { label: 'le joueur lance une partie', value: 'get_game', parameters: [{ key: 'user', placeholder: 'ID du joueur' },] },
        { label: 'le joueur gagne un niveau', value: 'level_up', parameters: [{ key: 'user', placeholder: 'ID du joueur' },] },
    ],
    cat: [
        { label: 'le joueur récupère des images de chat à envoyer', value: 'get_cat', parameters: [{ key: 'limit', placeholder: 'nombre d\'images reçues' }, { key: 'timer', placeholder: 'intervalle de temps' },] },
    ],
    spotify: [
        { label: 'le joueur écoute une musique', value: 'listen', parameters: [] },
    ],
    gmail: [
        { label: 'Le joueur reçoit un mail', value: 'get_unread_emails', parameters: [{ key: 'user', placeholder: 'email de l\'utilisateur' },{ key: 'object', placeholder: 'objet du mail' }] },
    ],
}

export const reactions = {
    discord: [
        { label: 'Envoyer un message serveur :', value: 'send_server_message', parameters: [{ key: 'channel', placeholder: 'Identifiant du canal' }, { key: 'content', placeholder: 'Contenu' },] },
    ],
    steam: [],
    riot: [],
    cat: [],
    spotify: [
        { label: 'ajouter une musique à la file d\'attente', value: 'add_track', parameters: [{ key: 'title', placeholder: 'Titre de la musique' }, { key: 'playlist', placeholder: 'ID de la playlist' },] },
        { label: 'jouer une musique', value: 'send_server_message', parameters: [{ key: 'trackName', placeholder: 'Titre de la musique' },] },
    ],
    gmail: [
        { label: 'envoyer mail', value: 'send_mail', parameters: [{ key: 'user', placeholder: 'Destinataire' }, { key: 'object', placeholder: 'Objet du mail' }, { key: 'content', placeholder: 'Message' }, { key: 'token', placeholder: 'OAuth' },] },
        { label: 'Créer un brouillon', value: 'create_draft', parameters: [{ key: 'user', placeholder: 'Destinataire' }, { key: 'object', placeholder: 'Objet du mail' }, { key: 'content', placeholder: 'Message' }, { key: 'token', placeholder: 'OAuth' },] },
    ],
}