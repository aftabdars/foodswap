import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";

import MaterialButtonSuccess from "../../components/MaterialButtonSuccess";
import MaterialButtonDanger from "../../components/MaterialButtonDanger";
import { formatTimestamp } from "../../utils/Format";


const SwapRequest = ({ colors, data, userID, navigation, swapDecline, swapAccept }) => {
    const styles = createStyles(colors);

    const handleNotificationPressed = () => {
        console.log('Swap Request Pressed');
    }

    const onAccept = () => {
        swapAccept(data.id, data.object_id, data.content_object);
    }

    const onDecline = () => {
        swapDecline(data.id, data.object_id);
    }

    const onRepropose = () => {
        navigation.navigate('LocationSelection', {
            rePropose: true,
            swapRequestID: data.object_id
        });
    }

    const foodAImagePressed = () => {
        navigation.navigate('FoodInfo', { foodID: data.content_object.food_a })
    }

    const foodBImagePressed = () => {
        navigation.navigate('FoodInfo', { foodID: data.content_object.food_b })
    }

    return (
        <TouchableOpacity onPress={handleNotificationPressed}>
            <View style={styles.swapRequestContainer}>
                <View style={styles.swapBodyContainer}>
                    <View style={styles.swapRequestTextContainer}>
                        <Text style={styles.swapRequestTitle}>Swap Request</Text>
                        <Text style={styles.swapRequestMessage}>{data.message}</Text>
                        <Text style={styles.swapRequestTimestamp}>{formatTimestamp(data.timestamp)}</Text>
                    </View>
                    <View style={styles.foodImagesContainer}>
                        <TouchableOpacity onPress={foodBImagePressed}>
                            <Image
                                source={data.content_object.food_b_image ? { uri: data.content_object.food_b_image } : require("../../assets/images/default_food.png")}
                                style={styles.foodImage}
                            />
                        </TouchableOpacity>
                        <EntypoIcon name="swap" style={styles.swapIcon}></EntypoIcon>
                        <TouchableOpacity onPress={foodAImagePressed}>
                            <Image
                                source={data.content_object.food_a_image ? { uri: data.content_object.food_a_image } : require("../../assets/images/default_food.png")}
                                style={styles.foodImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {data.content_object.is_location_reproposed && userID && data.content_object.food_a_owner === userID ? (
                    <Text style={styles.swapRequestReproposedText}>You reproposed the location!</Text>
                ) : (
                    <View style={styles.swapRequestButtonsContainer}>
                        <MaterialButtonSuccess style={styles.swapRequestButton} onPress={onAccept}>
                            <Text style={styles.swapRequestButtonText}>Accept</Text>
                        </MaterialButtonSuccess>
                        {!data.content_object.is_location_reproposed && (
                            <MaterialButtonSuccess style={styles.swapRequestButton} onPress={onRepropose}>
                                <Text style={styles.swapRequestButtonText}>Repropose</Text>
                            </MaterialButtonSuccess>
                        )}
                        <MaterialButtonDanger style={styles.swapRequestButton} onPress={onDecline}>
                            <Text style={styles.swapRequestButtonText}>Decline</Text>
                        </MaterialButtonDanger>
                    </View>
                )}

            </View>
        </TouchableOpacity>
    )
};

function createStyles(colors) {
    return StyleSheet.create({
        swapRequestContainer: {
            borderWidth: 1,
            borderColor: colors.background2,
            borderRadius: 8,
            padding: 8,
            marginVertical: 6,
            elevation: 2,
            backgroundColor: colors.background2,
        },
        swapBodyContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        swapRequestTextContainer: {
            flex: 1,
            marginBottom: 6,
        },
        foodImagesContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 3,
            alignItems: 'center',
            verticalAlign: 'middle',
        },
        foodImage: {
            width: 64,
            height: 64,
            resizeMode: 'cover',
            borderRadius: 5,
        },
        swapIcon: {
            fontSize: 25,
            color: colors.highlight2,
        },
        swapRequestTitle: {
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        swapRequestMessage: {
            fontSize: 12,
            color: colors.foreground,
            paddingTop: 5
        },
        swapRequestButtonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 6,
        },
        swapRequestButton: {
            borderRadius: 8,
            padding: 8,
            width: '30%',
            alignItems: 'center',
        },
        swapRequestButtonText: {
            fontSize: 12,
            color: colors.foreground,
        },
        swapRequestTimestamp: {
            fontSize: 10,
            color: colors.foreground,
            marginTop: 6,
        },
        swapRequestReproposedText: {
            color: colors.highlight2,
            textAlign: 'center',
            marginTop: 5
        }
    });
}

export default SwapRequest;