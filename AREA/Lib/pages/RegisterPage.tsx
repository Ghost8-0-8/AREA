import { Button, Image, Input, Text, View, XStack, YStack } from "tamagui";
import { TamaguiProvider } from "tamagui"
import areaImage from '../../assets/area_light.png';
import config from "../../tamagui.config"
import { styles } from "../components/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, SafeAreaView } from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";
import { SocialLoginButton } from "../components/socialMediaButton";
import { PageProps } from "../route";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
const url = "http://area.damdamdeo.ovh:49153"

const handleRegister = async (navigation: NavigationProp<any>, mail: string, pw: string, firstname: string, lastname: string, confirm: string, errorMessage: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        if (pw === confirm) {

            const data = {
                email: mail,
                password: pw,
                firstName: firstname,
                lastName: lastname
            }
            const response = await axios.post(url + '/api/auth/register', data);
            if (response.data.success === true) {
                navigation.navigate('Login');
            } else {
                errorMessage("Registration failed");
            }
        } else {
            errorMessage("Passwords are different");
        }
    } catch (error) {
        console.error(error);
    }
};

export const RegisterPage: React.FC<PageProps> = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const [firstname, setfirstname] = useState<string>('');
    const [lastname, setlastname] = useState<string>('');
    const [mail, setMail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [error, seterror] = useState<string>('');


    const [loaded] = useFonts({
        Inter: require('../../assets/fonts/JosefinSans-Bold.ttf'),
        Josefin: require('../../assets/fonts/JosefinSans-VariableFont_wght.ttf'),
    })

    if (!loaded) {
        return null
    }

    return (
        <TamaguiProvider config={config}>{
            <LinearGradient
                colors={['#E4F9F5', '#11999E']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.container}>
                    <YStack
                        width={windowWidth - 100}
                        minHeight={250}
                        overflow="hidden"
                        space="$2"
                        margin="$3"
                        padding="$2"
                        inset={{ top: 10, bottom: 20, left: 5, right: 5 }}
                    >
                        <Image
                            source={areaImage}
                            style={styles.image}
                            objectFit="contain"
                        />
                        <Text style={styles.title}>A-REA</Text>
                        <Input value={mail}              
                            onChangeText={setMail}     
                            placeholderTextColor={'#707070'}
                            placeholder="Enter mail"
                            style={styles.textinput} />
                        <Input value={firstname}              
                            onChangeText={setfirstname}     
                            placeholderTextColor={'#707070'}
                            placeholder="Enter first name"
                            style={styles.textinput} />
                        <Input value={lastname}              
                            onChangeText={setlastname}     
                            placeholderTextColor={'#707070'}
                            placeholder="Enter last name"
                            style={styles.textinput} />
                        <Input value={password}              
                            onChangeText={setPassword}     
                            placeholderTextColor={'#707070'}
                            placeholder="Enter password"
                            style={styles.textinput} />
                        <Input value={confirm}              
                            onChangeText={setConfirm}     
                            placeholderTextColor={'#707070'}
                            placeholder="Confirm password"
                            style={styles.textinput} />
                        <Text style={styles.error}>{error}</Text>
                        <Button style={styles.button} onPress={() => handleRegister(navigation, mail, password, firstname, lastname, confirm, seterror)}>Sign up</Button>
                        <Button style={styles.button} onPress={() => navigation.navigate('Login')}>Back to login</Button>
                    </YStack>
                </SafeAreaView>
            </LinearGradient>
        }</TamaguiProvider>
    );
}