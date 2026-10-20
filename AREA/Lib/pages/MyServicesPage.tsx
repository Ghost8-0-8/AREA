import { Image, TamaguiProvider, XStack, YStack } from "tamagui"
import config from "../../tamagui.config";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../components/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomAppBar } from "../components/Appbar";
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import riotImage from '../../assets/Riot.png';
import steamImage from '../../assets/Steam.png';
import catImage from '../../assets/Catapi.png';
import googleImage from '../../assets/Google.png';
import discordImage from '../../assets/Discord.png';
import spotifyImage from '../../assets/Spotify.png';
import { PageProps } from "../route";


export const MyServicesPage: React.FC<PageProps> = ({ navigation }) => {
    return(
        <TamaguiProvider config={config}>{
            <LinearGradient
            colors={['#E4F9F5', '#11999E']}
            style={styles.gradient}>
            <SafeAreaView style={styles.appBarContainer}>
                <CustomAppBar title="My Services" />
                <SafeAreaView style={styles.container}>
                    <YStack style={buttonStyle.ystack}>
                        <XStack style={buttonStyle.xstack}>
                    <TouchableOpacity style={buttonStyle.riotButton}>
                        <Image
                            source={riotImage}
                            style={buttonStyle.image}
                            objectFit="contain"
                            />
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyle.steamButton}>
                        <Image
                            source={steamImage}
                            style={buttonStyle.image}
                            objectFit="contain"
                            />
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyle.catButton}>
                        <Image
                            source={catImage}
                            style={buttonStyle.image}
                            objectFit="contain"
                            />
                    </TouchableOpacity>
                        </XStack>

                        <XStack style={buttonStyle.xstack}>
                    <TouchableOpacity style={buttonStyle.googleButton} onPress={() => navigation.navigate('GoogleLoginPage')}>
                        <Image
                            source={googleImage}
                            style={buttonStyle.image}
                            objectFit="contain"
                            />
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyle.spotifyButton}onPress={() => navigation.navigate('SpotifyLoginPage')}>
                        <Image
                            source={spotifyImage}
                            style={buttonStyle.image}
                            objectFit="contain"
                            />
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyle.discordButton} onPress={() => navigation.navigate('DiscordLoginPage')}>
                        <Image
                            source={discordImage}
                            style={buttonStyle.image}
                            objectFit="contain"
                            />
                    </TouchableOpacity>
                        </XStack>
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
        margin:20,
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
    steamButton: {
        width: 90,
        height: 90,
        margin:20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        backgroundColor: '#013286',
    },
    catButton: {
        width: 90,
        height: 90,
        margin:20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        backgroundColor: '#60211C',
    },
    googleButton: {
        width: 90,
        height: 90,
        margin:20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        backgroundColor: '#fffFFF',
    },
    spotifyButton: {
        width: 90,
        height: 90,
        margin:20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        backgroundColor: '#00E676',
    },
    discordButton: {
        width: 90,
        height: 90,
        margin:20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        backgroundColor: '#69A0FE',
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