import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'tamagui';
import { styles } from './theme';
import areaImage from '../../assets/area_transparent.png';

interface AppBarProps {
  title: string;
}

export const CustomAppBar: React.FC<AppBarProps> = ({ title="Welcome" }) => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.appBar}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
      <Image
              source={areaImage}
              style={styles.imageIcon}
              objectFit="contain"
            />
      </TouchableOpacity>
      <Text style={styles.appBarTitle}>{title}</Text>

      <TouchableOpacity onPress={() => console.log('Profile clicked')} style={styles.iconButton}>
        <MaterialIcons name="person" size={40} color="#707070" />
      </TouchableOpacity>
    </LinearGradient>
  );
};
