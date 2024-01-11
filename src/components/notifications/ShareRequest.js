import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";

import MaterialButtonSuccess from "../../components/MaterialButtonSuccess";
import MaterialButtonDanger from "../../components/MaterialButtonDanger";
import { formatTimestamp } from "../../utils/Format";

const ShareRequest = ({ colors, data, userID, navigation, shareDecline, shareAccept }) => {
    const styles = createStyles(colors);

    const handleNotificationPressed = () => {
        console.log('Share Request Pressed');
    }

    const onAccept = () => {
        shareAccept(data.content_object);
    }

    const onDecline = () => {
        shareDecline(data.id, data.object_id);
    }

    const foodImagePressed = () => {
        navigation.navigate('FoodInfo', { foodID: data.content_object.food })
    }

    const takerImagePressed = () => {
        navigation.navigate('PublicProfile', { userID: data.content_object.taker })
    }

    return (
        <TouchableOpacity onPress={handleNotificationPressed}>
            <View style={styles.shareRequestContainer}>
                <View style={styles.shareBodyContainer}>
                    <View style={styles.shareRequestTextContainer}>
                        <Text style={styles.shareRequestTitle}>Share Request</Text>
                        <Text style={styles.shareRequestMessage}>{data.message}</Text>
                        <Text style={styles.shareRequestTimestamp}>{formatTimestamp(data.timestamp)}</Text>
                    </View>
                    <View style={styles.foodImagesContainer}>
                        <TouchableOpacity onPress={foodImagePressed}>
                            <Image
                                source={data.content_object.food_image ? { uri: data.content_object.food_image } : require("../../assets/images/default_food.png")}
                                style={styles.foodImage}
                            />
                        </TouchableOpacity>
                        <EntypoIcon name="level-down" style={styles.shareIcon}></EntypoIcon>
                        <TouchableOpacity onPress={takerImagePressed}>
                            <Image
                                source={data.content_object.taker_profile_picture ? { uri: data.content_object.taker_profile_picture } : require("../../assets/images/default_profile.jpg")}
                                style={styles.userIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.shareRequestButtonsContainer}>
                    <MaterialButtonSuccess style={styles.shareRequestButton} onPress={onAccept}>
                        <Text style={styles.shareRequestButtonText}>Accept</Text>
                    </MaterialButtonSuccess>
                    <MaterialButtonDanger style={styles.shareRequestButton} onPress={onDecline}>
                        <Text style={styles.shareRequestButtonText}>Decline</Text>
                    </MaterialButtonDanger>
                </View>

            </View>
        </TouchableOpacity>
    )
};

function createStyles(colors) {
    return StyleSheet.create({
        shareRequestContainer: {
            borderWidth: 1,
            borderColor: colors.background2,
            borderRadius: 8,
            padding: 8,
            marginVertical: 6,
            elevation: 2,
            backgroundColor: colors.background2,
        },
        shareBodyContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        shareRequestTextContainer: {
            flex: 1,
            marginBottom: 6,
            paddingLeft: 5
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
        userIcon: {
            width: 64,
            height: 64,
            resizeMode: 'cover',
            borderRadius: 28,
        },
        shareIcon: {
            fontSize: 25,
            color: colors.highlight2,
        },
        shareRequestTitle: {
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        shareRequestMessage: {
            fontSize: 12,
            color: colors.foreground,
            paddingTop: 5
        },
        shareRequestButtonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 6,
        },
        shareRequestButton: {
            borderRadius: 8,
            padding: 8,
            width: '30%',
            alignItems: 'center',
        },
        shareRequestButtonText: {
            fontSize: 12,
            color: colors.foreground,
        },
        shareRequestTimestamp: {
            fontSize: 10,
            color: colors.foreground,
            marginTop: 6,
        },
        shareRequestReproposedText: {
            color: colors.highlight2,
            textAlign: 'center',
            marginTop: 5
        }
    });
}

export default ShareRequest;
