import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { TamaguiProvider, Button, YStack, XStack, Sheet, Image, Text } from 'tamagui';
import config from '../../tamagui.config';


interface DropdownMenuIconProps {
  selectedItem: string;
  setSelectedItem: (value: string) => void;
}

export const DropdownMenuReaction: React.FC<DropdownMenuIconProps> = ({ selectedItem, setSelectedItem }) => {
  const [open, setOpen] = useState(false);

  const services = [
    { label: 'Message envoyé sur le serveur :', value: 'send_server_message' },
];

  const handleSelect = (value: string) => {
    setSelectedItem(value);
    setOpen(false);
  };

  const renderService = ({ item }: { item: { label: string; value: string;} }) => (
    <Button
      onPress={() => handleSelect(item.value)}
      style={styles.serviceButton}
    >
        <Text>item.label</Text>
    </Button>
  );

  return (
    <TamaguiProvider config={config}>
      <YStack alignItems="center" justifyContent="center" flex={1}>
        <Button onPress={() => setOpen(true)} style={styles.button}>
          <XStack alignItems="center">
            {selectedItem ? (
              <Text style={styles.text}>
                {services.find(s => s.value === selectedItem)?.label}
              </Text>
            ) : (
              <Text style={styles.text}>Selectionnez une option</Text>
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
    width: 300,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceButton: {
    width: 300,
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
  text:{
    height: 20,
    alignSelf: 'center',
    fontFamily: 'Josefin',
    color: 'white',
    fontSize: 64
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});
