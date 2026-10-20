import * as SecureStore from 'expo-secure-store';

export const saveToken = async (key: string, token: string): Promise<void> => {
    try {
        await SecureStore.setItemAsync(key, token);
    } catch (error) {
        console.error('Erreur de stockage sécurisé du token', error);
    }
};

export const getToken = async (key: string): Promise<string | null> => {
    try {
        const token = await SecureStore.getItemAsync(key);
        return token;
    } catch (error) {
        console.error('Erreur de récupération sécurisée du token', error);
        return null;
    }
};

export const removeToken = async (key: string): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync('oauth_token');
    } catch (error) {
        console.error('Erreur de suppression sécurisée du token', error);
    }
};
