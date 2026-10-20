import { Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';

interface SocialLoginButtonProps {
    iconName: any;
    onPress: () => void;
}

export const SocialLoginButton = ({ iconName ,onPress}: SocialLoginButtonProps) => {
    let icon;
    
    if (iconName === "discord") {
        icon = <MaterialCommunityIcons name="discord" size={30} color="white" />;
    } else {
        icon = <FontAwesome name={iconName} size={30} color="white" />;
    }

    return (
        <TouchableOpacity style={styles.circleButton} onPress={onPress}>
            {icon}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    circleButton: {
        backgroundColor: '#006064',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
});
