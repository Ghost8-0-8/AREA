
import { AreaProvider } from './Lib/components/AreaContext';
import React from 'react';
import { LoginPage } from './Lib/pages/LoginPage';
import { RegisterPage } from './Lib/pages/RegisterPage';
import { HomePage } from './Lib/pages/HomePage';
import "@tamagui/core/reset.css";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MyServicesPage } from './Lib/pages/MyServicesPage';
import { NewAreaPage } from './Lib/pages/NewAreaPage';
import { RiotPage } from './Lib/pages/RiotPage';
import { DiscordPage } from './Lib/pages/DiscordPage';
import DiscordLoginPage from './Lib/DiscordLoginPage';
import GoogleLoginPage from './Lib/GoogleLoginPage';
import SpotifyLoginPage from './Lib/SpotifyLoginPage';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
      <Drawer.Screen name="My services" component={MyServicesPage} options={{ headerShown: false }} />
      <Drawer.Screen name="New A-REA" component={NewAreaPage} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}



export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Drawer"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Riot"
            component={RiotPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Discord"
            component={DiscordPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DiscordLoginPage"
            component={DiscordLoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GoogleLoginPage"
            component={GoogleLoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SpotifyLoginPage"
            component={SpotifyLoginPage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
