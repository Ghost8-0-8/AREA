import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { styles } from "../components/theme";
import config from "../../tamagui.config";
import { TamaguiProvider } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { CustomAppBar } from "../components/Appbar";
import axios from "axios";
import * as SecureStorage from "../components/SecureStorage";
import { FlatList } from "react-native-gesture-handler";
import AreaItem from "../components/AreaItem";

const handleAreas = async () => {
    try {
        const token = await SecureStorage.getToken('Token');
        const response = await axios.get('http://area.damdamdeo.ovh:49153/api/area/', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.data.success) {
            return response.data.data;
        }
    } catch (error) {
        console.error("Error while fetching areas", error);
        return [];
    }
};

export const HomePage = () => {

    const [areas, setAreas] = useState([]);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const data = await handleAreas();
                setAreas(data);
            } catch (error) {
                console.error("Error fetching areas", error);
            }
        };
        fetchAreas();
    }, []);
    
    const [loaded] = useFonts({
        Inter: require('../../assets/fonts/JosefinSans-Bold.ttf'),
        Josefin: require('../../assets/fonts/JosefinSans-VariableFont_wght.ttf'),
    });

   
    const handleDelete = async (id: string) => {
        await deleteArea(id);
        setAreas((prevAreas) => prevAreas.filter((area) => area._id !== id));
    };

    const deleteArea = async (id: string) => {
        try {
            const token = await SecureStorage.getToken('Token');
            await axios.delete(`http://area.damdamdeo.ovh:49153/api/area/${id}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`Element ${id} supprimé avec succès.`);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'élément", error);
        }
    };

    if (!loaded) {
        return null;
    }

    return (
        <TamaguiProvider config={config}>
            <LinearGradient colors={['#E4F9F5', '#11999E']} style={styles.gradient}>
                <SafeAreaView style={styles.appBarContainer}>
                    <CustomAppBar title="Home" />
                    <SafeAreaView style={styles.container}>
                        {areas.length === 0 ? (
                            <View style={mystyles.emptyContainer}>
                                <Text style={mystyles.emptyText}>Aucun area n'est lié à ce compte.</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={areas}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <AreaItem
                                        id={item._id}
                                        actionService={item.action.service}
                                        actionMethod={item.action.method}
                                        actionParams={item.action.params}
                                        reactionService={item.reaction.service}
                                        reactionMethod={item.reaction.method}
                                        reactionParams={item.reaction.params}
                                        handleDelete={handleDelete}
                                    />
                                )}
                            />
                        )}
                    </SafeAreaView>
                </SafeAreaView>
            </LinearGradient>
        </TamaguiProvider>
    );
};

const mystyles = StyleSheet.create({
    container: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f0f8ff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    serviceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    serviceIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    serviceLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    actionContainer: {
        marginTop: 10,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007acc',
    },
    reactionContainer: {
        marginTop: 10,
    },
    reactionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#32a852',
    },
    paramText: {
        fontSize: 12,
        color: '#555',
        marginLeft: 10,
        marginTop: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
});

