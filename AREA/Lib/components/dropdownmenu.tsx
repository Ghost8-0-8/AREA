import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { TamaguiProvider, Button, YStack, XStack, Sheet, Image } from 'tamagui';
import config from '../../tamagui.config';
import riotImage from '../../assets/Riot.png';
import steamImage from '../../assets/Steam.png';
import twitchImage from '../../assets/Twitch.png';
import googleImage from '../../assets/Google.png';
import discordImage from '../../assets/Discord.png';
import spotifyImage from '../../assets/Spotify.png';
import { FontAwesome } from '@expo/vector-icons';

interface DropdownMenuIconProps {
  selectedItem: string;
  setSelectedItem: (value: string) => void;
}

export const DropdownMenuIcon: React.FC<DropdownMenuIconProps> = ({ selectedItem, setSelectedItem }) => {
  const [open, setOpen] = useState(false);

  const services = [
    { label: 'Riot Games', value: 'riot', icon: riotImage },
    { label: 'Steam', value: 'steam', icon: steamImage },
    { label: 'Twitch', value: 'twitch', icon: twitchImage },
    { label: 'Google', value: 'google', icon: googleImage },
    { label: 'Discord', value: 'discord', icon: discordImage },
    { label: 'Spotify', value: 'spotify', icon: spotifyImage },
  ];

  const handleSelect = (value: string) => {
    setSelectedItem(value);
    setOpen(false);
  };

  const renderService = ({ item }: { item: { label: string; value: string; icon: any } }) => (
    <Button
      onPress={() => handleSelect(item.value)}
      style={styles.serviceButton}
    >
        <Image source={item.icon} style={styles.image} objectFit="contain" />
    </Button>
  );

  return (
    <TamaguiProvider config={config}>
      <YStack alignItems="center" justifyContent="center" flex={1}>
        <Button onPress={() => setOpen(true)} style={styles.button}>
          <XStack alignItems="center">
            {selectedItem ? (
              <Image
                source={services.find(s => s.value === selectedItem)?.icon}
                style={styles.image}
                objectFit="contain"
              />
            ) : (
              <FontAwesome name="question-circle" size={24} color="black" />
            )}
          </XStack>
        </Button>
        <Sheet
          modal
          open={open}
          onOpenChange={setOpen}
          snapPointsMode={'fit'}
          dismissOnOverlayPress={true}
        >
          <FlatList
            data={services}
            renderItem={renderService}
            keyExtractor={(item) => item.value}
            showsVerticalScrollIndicator={false}
          />
          <Sheet.Overlay style={styles.overlay} />
        </Sheet>
      </YStack>
    </TamaguiProvider>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceButton: {
    width: 50,
    height: 50,
    marginVertical: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  sheetFrame: {
    maxHeight: 300,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});
