import React from 'react';
import { View, Text, Image, StyleSheet, Button, ImageSourcePropType } from 'react-native';
import { services, actions, reactions } from './ActionReaction';

interface Parameter {
    key: string;
    placeholder: string;
}

interface Action {
    label: string;
    value: string;
    parameters: Parameter[];
}

interface Reaction {
    label: string;
    value: string;
    parameters: Parameter[];
}

interface Service {
    label: string;
    value: string;
    icon: ImageSourcePropType;
}

interface ActionsMap {
    [key: string]: Action[];
}

interface ReactionsMap {
    [key: string]: Reaction[];
}

interface AreaItemProps {
    id: string;
    actionService: string;
    actionMethod: string;
    actionParams: Record<string, any>;
    reactionService: string;
    reactionMethod: string;
    reactionParams: Record<string, any>;
    handleDelete: (id: string) => void;
}

const AreaItem: React.FC<AreaItemProps> = ({
    id,
    actionService,
    actionMethod,
    actionParams,
    reactionService,
    reactionMethod,
    reactionParams,
    handleDelete,
}) => {
    const service: Service | undefined = services.find(s => s.value === actionService);
    const reactionServiceData: Service | undefined = services.find(s => s.value === reactionService);

    const actionList = (actions as { [key: string]: Action[] })[actionService];
    const reactionList = (reactions as { [key: string]: Reaction[] })[reactionService];

    const action = actionList?.find(a => a.value === actionMethod);
    const actionLabel = action?.label;

    const reaction = reactionList?.find(r => r.value === reactionMethod);
    const reactionLabel = reaction?.label;

   
    const renderParameters = (params: Record<string, any>, placeholders?: Parameter[]) => {
        if (!params || Object.keys(params).length === 0) {
            return <Text style={styles.paramText}>Aucun paramètre</Text>;
        }

        return Object.entries(params).map(([key, value], index) => (
            <Text key={index} style={styles.paramText}>
                {placeholders && placeholders[index]?.placeholder}: {value}
            </Text>
        ));
    };

    return (
        <View style={styles.container}>
            {service && (
                <View style={styles.serviceContainer}>
                    <Image source={service.icon} style={styles.serviceIcon} />
                    <Text style={styles.serviceLabel}>{service.label}</Text>
                </View>
            )}
            <View style={styles.actionContainer}>
                <Text style={styles.actionLabel}>Action: {actionLabel}</Text>
                {renderParameters(actionParams, action?.parameters)}
            </View>

            {reactionServiceData && (
                <View style={styles.serviceContainer}>
                    <Image source={reactionServiceData.icon} style={styles.serviceIcon} />
                    <Text style={styles.serviceLabel}>{reactionServiceData.label}</Text>
                </View>
            )}
            <View style={styles.reactionContainer}>
                <Text style={styles.reactionLabel}>Réaction: {reactionLabel}</Text>
                {renderParameters(reactionParams, reaction?.parameters)}
            </View>

            <Button title="Supprimer" onPress={() => handleDelete(id)} color="#FF6347" />
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default AreaItem;
