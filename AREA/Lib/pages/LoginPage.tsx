import React, { useState } from "react";
import { Dimensions, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Image, Input, View, XStack, YStack } from "tamagui";
import { styles } from "../components/theme";
import { TamaguiProvider } from "tamagui";
import config from "../../tamagui.config";
import areaImage from '../../assets/area_light.png';
import { useFonts } from 'expo-font';
import { SocialLoginButton } from "../components/socialMediaButton";
import { PageProps } from "../route";
import axios from "axios";
import { Linking } from 'react-native';
import * as SecureStorage from "../components/SecureStorage";
import { NavigationProp } from "@react-navigation/native";
import { WebView } from 'react-native-webview';

const url = "http://area.damdamdeo.ovh:49153";

export const LoginPage: React.FC<PageProps> = ({ navigation }) => {
  const windowWidth = Dimensions.get('window').width;
  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, seterror] = useState<string>('');
  const [showDiscordWebView, setShowDiscordWebView] = useState<boolean>(false);
  const [loaded] = useFonts({
    Inter: require('../../assets/fonts/JosefinSans-Bold.ttf'),
    Josefin: require('../../assets/fonts/JosefinSans-VariableFont_wght.ttf'),
  });

  const handleDiscordLogin = () => {
    ;
  };

  const handleLogin = async (mail: string, pw: string) => {
    try {
      const data = { email: mail, password: pw };
      const response = await axios.post(url + '/api/auth/login', data);
      if (response.data.success) {
        await SecureStorage.saveToken('Token', response.data.token);
        navigation.navigate('Drawer');
      } else {
        seterror("Login failed");
      }
    } catch (error) {
      seterror("Error while login");
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <LinearGradient colors={['#E4F9F5', '#11999E']} style={styles.gradient}>
        <View style={styles.container}>
          <YStack
            width={windowWidth - 100}
            minHeight={250}
            overflow="hidden"
            margin="$3"
            padding="$2"
            gap="$2"
            inset={{ top: 10, bottom: 20, left: 5, right: 5 }}
          >
            <Image source={areaImage} style={styles.image} objectFit="contain" />
            <Text style={styles.title}>A-REA</Text>
            <Input
              value={mail}
              onChangeText={setMail}
              placeholderTextColor={'#707070'}
              placeholder="Mail"
              style={styles.textinput}
            />
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={'#707070'}
              style={styles.textinput}
              secureTextEntry={true}
            />
            <Text style={styles.error}>{error}</Text>
            <Button style={styles.button} onPress={() => handleLogin(mail, password)}>Login</Button>
            <Button style={styles.button} onPress={() => navigation.navigate('Register')}>Go to register</Button>
            <XStack style={styles.row}>
              <SocialLoginButton iconName="google" onPress={() => navigation.navigate('GoogleLoginPage')} />
              <SocialLoginButton iconName="discord" onPress={() => navigation.navigate('DiscordLoginPage')} />
            </XStack>
          </YStack>
        </View>
      </LinearGradient>
    </TamaguiProvider>
  );
};
