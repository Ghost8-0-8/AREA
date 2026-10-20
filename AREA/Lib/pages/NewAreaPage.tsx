import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../components/theme";
import config from "../../tamagui.config";
import { Button, Input, TamaguiProvider, View, Text, XStack, YStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { CustomAppBar } from "../components/Appbar";
import { useState } from "react";
import { Dimensions, Modal } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Image } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { PageProps } from "../route";
import axios from "axios";
import * as SecureStorage from "../components/SecureStorage"
import { actions, reactions, services, } from "../components/ActionReaction";
import { useArea } from '../components/AreaContext';

const url = "http://area.damdamdeo.ovh:49153"
type ServiceParams = {
    [key: string]: string;
};

type ActionOrReaction = {
    service: string;
    method: string;
    params: ServiceParams;
};

type NewAreaRequest = {
    action: ActionOrReaction;
    reaction: ActionOrReaction;
};



type FormData = {
    [key: string]: string;
}

export const NewAreaPage: React.FC<PageProps> = ({ navigation }) => {
    const handleNewArea = async (
        actionService: string,
        reactionService: string,
        actionMethod: string,
        reactionMethod: string,
        actionParams: FormData,
        reactionParams: FormData,
        errorMessage: React.Dispatch<React.SetStateAction<string>>
    ) => {
        try {
            if (actionService === "" || reactionService === "" || actionMethod === "" || reactionMethod === "") {
                errorMessage("1+ champ(s) sontt vides");
            } else {
                const token = await SecureStorage.getToken('Token');
    
                const requestData: NewAreaRequest = {
                    action: {
                        service: actionService,
                        method: actionMethod,
                        params: actionParams,
                    },
                    reaction: {
                        service: reactionService,
                        method: reactionMethod,
                        params: reactionParams,
                    },
                };
    
                const response = await axios.post(url + '/api/area/add', requestData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data.success) {
                    errorMessage("Area added successfully!");
                } else {
                    errorMessage("Failed to add new area");
                }
            }
        } catch (error) {
            console.error("Error while adding new area", error);
            errorMessage("Error while adding new area");
        }
    };
    const [selectedAction, setSelectedAction] = useState<{ label: string; value: string; parameters: any; }>();
    const [selectedActionService, setSelectedActionService] = useState<{ label: string; value: string; icon: any; }>();
    const [selectedReaction, setSelectedReaction] = useState<{ label: string; value: string; parameters: any; }>();
    const [selectedReactionService, setSelectedReactionService] = useState<{ label: string; value: string; icon: any; }>();
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [reactionModalVisible, setReactionModalVisible] = useState(false);
    const [Actionfields, setActionFields] = useState<Field[]>([]);
    const [Reactionfields, setReactionFields] = useState<Field[]>([]);

    type Field = {
        key: string;
        placeholder: string;
    };

    const windowWidth = Dimensions.get('window').width;
    const [aformData, setaFormData] = useState<FormData>({});
    const [rformData, setrFormData] = useState<FormData>({});
    const [error, seterror] = useState<string>('');


   
    const handleRChange = (key: string, value: string) => {
        setrFormData({ ...rformData, [key]: value });
    };

    const handleAChange = (key: string, value: string) => {
        setaFormData({ ...aformData, [key]: value });
    };


    const handleActionSubmit = () => {
        setActionModalVisible(false);
       
    };

    const handleReactionSubmit = () => {
        setReactionModalVisible(false);
       
    };

    const [loaded] = useFonts({
        Inter: require('../../assets/fonts/JosefinSans-Bold.ttf'),
        Josefin: require('../../assets/fonts/JosefinSans-VariableFont_wght.ttf'),
    });

    if (!loaded) {
        return null;
    }

    return (
        <TamaguiProvider config={config}>
            <LinearGradient
                colors={['#E4F9F5', '#11999E']}
                style={styles.gradient}>
                <SafeAreaView style={styles.appBarContainer}>
                    <CustomAppBar title="New Area" />
                    <SafeAreaView style={styles.container}>
                        <YStack space="$2" style={{ flex: 1, alignItems: 'center' }}>
                            <XStack space="$2" style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', alignItems: 'center' }} >
                                <Dropdown
                                    dropdownPosition="auto"
                                    style={{ flexShrink: 1, minWidth: 100 }}
                                    labelField="label"
                                    valueField="value"
                                    onChange={item => {
                                        setSelectedActionService(item);
                                    }}
                                    data={services}
                                    renderLeftIcon={() => (selectedActionService ? (
                                        <Image
                                            source={services.find(s => s.value === selectedActionService.value)?.icon}
                                            style={dropdownstyles.image}
                                            objectFit="contain"
                                        />
                                    ) : (
                                        <FontAwesome name="question-circle" size={24} color="black" />
                                    ))}
                                />
                                <Dropdown
                                    dropdownPosition="auto"
                                    style={{ flexShrink: 1, minWidth: 100 }}
                                    labelField="label"
                                    valueField="value"
                                    onChange={item => {
                                        setSelectedAction(item);
                                        setActionFields(item.parameters);
                                        setaFormData({});
                                    }}
                                    data={selectedActionService?.value ? actions[selectedActionService.value as keyof typeof actions] : []}
                                />
                                <Button style={styles.button} onPress={() => setActionModalVisible(true)}>Parameters</Button>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={actionModalVisible}
                                    onRequestClose={() => setActionModalVisible(false)}
                                >
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalContent}>
                                            <Text style={styles.modalTitle}>Formulaire Dynamique</Text>

                                            {/* Génère dynamiquement les TextInput en fonction des champs */}
                                            {Actionfields.map((field) => (
                                                <Input
                                                    key={field.key}
                                                    placeholder={field.placeholder}
                                                    style={[styles.textinput, { marginBottom: 10 }]}
                                                    value={aformData[field.key] || ''}
                                                    onChangeText={(text) => handleAChange(field.key, text)}
                                                />
                                            ))}
                                            <Button style={[styles.button, { marginBottom: 10 }]} onPress={() => setActionModalVisible(false)}>Annuler</Button>
                                            <Button style={[styles.button, { marginBottom: 10 }]} onPress={handleActionSubmit}>Valider</Button>
                                        </View>
                                    </View>
                                </Modal>
                            </XStack>
                            <XStack space="$2" style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', alignItems: 'center' }} >
                                <Dropdown
                                    dropdownPosition="auto"
                                    style={{ flexShrink: 1, minWidth: 100 }}
                                    labelField="label"
                                    valueField="value"
                                    onChange={item => {
                                        setSelectedReactionService(item);
                                    }}
                                    data={services}
                                    renderLeftIcon={() => (selectedReactionService ? (
                                        <Image
                                            source={services.find(s => s.value === selectedReactionService.value)?.icon}
                                            style={dropdownstyles.image}
                                            objectFit="contain"
                                        />
                                    ) : (
                                        <FontAwesome name="question-circle" size={24} color="black" />
                                    ))}
                                />
                                <Dropdown
                                    dropdownPosition="auto"
                                    style={{ flexShrink: 1, minWidth: 100 }}
                                    labelField="label"
                                    valueField="value"
                                    onChange={item => {
                                        setSelectedReaction(item);
                                        setReactionFields(item.parameters);
                                        setrFormData({});
                                    }}
                                    data={selectedReactionService?.value ? reactions[selectedReactionService.value as keyof typeof reactions] : []}
                                />
                                <Button style={styles.button} onPress={() => setReactionModalVisible(true)}>Parameters</Button>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={reactionModalVisible}
                                    onRequestClose={() => setReactionModalVisible(false)}
                                >
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalContent}>
                                            <Text style={styles.modalTitle}>Paramètre(s)</Text>
                                            {Reactionfields.map((field) => (
                                                <Input
                                                    key={field.key}
                                                    placeholder={field.placeholder}
                                                    style={[styles.textinput, { marginBottom: 10 }]}
                                                    value={rformData[field.key] || ''}
                                                    onChangeText={(text) => handleRChange(field.key, text)}
                                                />
                                            ))}
                                            <Button style={[styles.button, { marginBottom: 10 }]} onPress={() => setReactionModalVisible(false)}>Annuler</Button>
                                            <Button style={[styles.button, { marginBottom: 10 }]} onPress={handleReactionSubmit}>Valider</Button>
                                        </View>
                                    </View>
                                </Modal>
                            </XStack>
                            <Button
                                style={styles.button}
                                onPress={() =>
                                    handleNewArea(
                                        selectedActionService?.value ?? "",
                                        selectedReactionService?.value ?? "",
                                        selectedAction?.value ?? "",
                                        selectedReaction?.value ?? "",
                                        aformData,
                                        rformData,
                                        seterror
                                    )
                                }
                            >
                                New area
                            </Button>
                        </YStack>
                    </SafeAreaView>
                </SafeAreaView>
            </LinearGradient>
        </TamaguiProvider>
    );
};

export const dropdownstyles = StyleSheet.create({
    image: {
        width: 24,
        height: 24,
        alignSelf: 'center',
    },
});
