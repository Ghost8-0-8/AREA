import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as SecureStorage from "./components/SecureStorage";
import { PageProps } from './route';


const DiscordLoginPage: React.FC<PageProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'http://area.damdamdeo.ovh:49153/api/auth/discord' }}
        onNavigationStateChange={(event) => {
            if (event.url.includes('token=')) {
              const token = event.url.match(/token=([^&]*)/)?.[1];
              if (token) {
                SecureStorage.saveToken('Token', token);
                console.log(token);
                navigation.navigate('Drawer');
              }
            }
          }}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DiscordLoginPage;
