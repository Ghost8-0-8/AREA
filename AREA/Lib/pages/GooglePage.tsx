import { Image, TamaguiProvider, Text, XStack, YStack } from "tamagui"
import config from "../../tamagui.config";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../components/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomAppBar } from "../components/Appbar";
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import riotImage from '../../assets/Riot.png';
import steamImage from '../../assets/Steam.png';
import twitchImage from '../../assets/Twitch.png';
import googleImage from '../../assets/Google.png';
import discordImage from '../../assets/Discord.png';
import spotifyImage from '../../assets/Spotify.png';


export const GooglePage = () => {
    return (
        <TamaguiProvider config={config}>{
            <LinearGradient
                colors={['#E4F9F5', '#11999E']}
                style={styles.gradient}>
                <SafeAreaView style={styles.appBarContainer}>
                    <CustomAppBar title="Google" />
                    <SafeAreaView style={styles.container}>
                        <YStack style={buttonStyle.ystack}>
                        <Text style={{
                                alignSelf: 'center',
                                fontFamily: 'Inter',
                                color: 'black',
                                fontSize: 30
                            }}>Connexion :</Text>
                            <Text style={{
                                marginBottom: 24,
                                alignSelf: 'center',
                                fontFamily: 'Inter',
                                color: 'black',
                                fontSize: 20
                            }}>Pas de connexion nécessaire</Text>
                            <Text style={{
                                alignSelf: 'center',
                                fontFamily: 'Inter',
                                color: 'black',
                                fontSize: 30
                            }}>Actions :</Text>
                            <Text style={{
                                marginBottom: 24,
                                alignSelf: 'center',
                                fontFamily: 'Inter',
                                color: 'black',
                                fontSize: 20
                            }}> • Mail envoyé</Text>
                            <Text style={{
                                alignSelf: 'center',
                                fontFamily: 'Inter',
                                color: 'black',
                                fontSize: 30
                            }}>Réactions :</Text>
                            <Text style={{
                                marginBottom: 24,
                                alignSelf: 'center',
                                fontFamily: 'Inter',
                                color: 'black',
                                fontSize: 20
                            }}>
                            • Envoyer un mail
                            </Text>
                        </YStack>
                    </SafeAreaView>
                </SafeAreaView>
            </LinearGradient>
        }</TamaguiProvider>
    );
}


const buttonStyle = StyleSheet.create({
    riotButton: {
        width: 90,
        height: 90,
        margin: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        backgroundColor: '#E54040',
    },

    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        alignSelf: 'center',
    },
    xstack: {
        justifyContent: 'space-between',
    },
    ystack: {
        justifyContent: 'space-between',
    }
});