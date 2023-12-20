import React, { useContext } from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, PixelRatio, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import { ThemeContext, getColors } from "../assets/Theme";
import { getClientNotifications } from "../api/backend/User";
import { getUserToken } from "../storage/UserToken";

function Notifications() {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const [notifications, setNotifications] = useState();

    // Get client's notifications
    useEffect(() => {
        getMeClientNotifications = async () => {
            const token = await getUserToken();
            await getClientNotifications(token.token)
                .then(response => {
                    console.log(response.data);
                    setNotifications(response.data.results);
                })
                .catch(error => {
                    console.log(error.response.data);
                })
        }
        getMeClientNotifications();
    }, []);

    const renderNotificationItem = ({ item }) => {
        if (item.notification_type === 'foodswap_request') {
            return <SwapRequestNotification key={item.id} colors={colors} styles={styles} data={item} />
        }
        else {
            return <NotificationPreview key={item.id} styles={styles} data={item} />
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderNotificationItem}
            />
        </View>
    );
};

function NotificationPreview({ styles, data }) {

    const handleNotificationPress = () => {
        // Handle the press event for the notification item
        console.log(`Notification pressed: ${data.title}`);
    };

    return (
        <TouchableOpacity onPress={handleNotificationPress}>
            <View style={styles.notificationContainer}>
                <View style={styles.iconContainer}>
                    <Text style={styles.notificationIcon}>🔔</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Title</Text>
                    <Text style={styles.message}>{data.message}</Text>
                </View>
                <Text style={styles.timestamp}>{formatTimestamp(data.timestamp)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const SwapRequestNotification = ({ colors, styles, data }) => {

    const handleNotificationPressed = () => {
        console.log('Swap Request Pressed');
    }

    const onAccept = () => {
        console.log('onAccept');
    }

    const onDecline = () => {
        console.log('onDecline');
    }

    const onRepropose = () => {
        console.log('onRepropose');
    }
    console.log(data.content_object.food_a_image)

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
                        <Image 
                            source={data.content_object.food_b_image? { uri: data.content_object.food_b_image } : require("../assets/images/image_2023-10-27_183534741.png")}
                            style={styles.foodImage} 
                        />
                        <Icon name="exchange" size={24} color={colors.highlight2} style={styles.swapIcon} />
                        <Image 
                            source={data.content_object.food_a_image? { uri: data.content_object.food_a_image } : require("../assets/images/image_2023-10-27_183534741.png")}
                            style={styles.foodImage} 
                        />
                    </View>
                </View>

                <View style={styles.swapRequestButtonsContainer}>
                    <TouchableOpacity style={styles.swapRequestButton} onPress={onAccept}>
                        <Text style={styles.swapRequestButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.swapRequestButton} onPress={onDecline}>
                        <Text style={styles.swapRequestButtonText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.swapRequestButton} onPress={onRepropose}>
                        <Text style={styles.swapRequestButtonText}>Repropose</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        return 'Today';
    } else if (diffInDays === 1) {
        return 'Yesterday';
    } else {
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
};

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: colors.background,
        },
        notificationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.background2,
            borderRadius: 8,
            padding: 12,
            marginVertical: 5,
            elevation: 1,
            backgroundColor: colors.background2,
        },
        iconContainer: {
            backgroundColor: colors.highlight2,
            borderRadius: 25,
            padding: 10,
            paddingHorizontal: 12,
            marginRight: 16,
        },
        notificationIcon: {
            fontSize: 20,
            color: colors.foreground,
        },
        textContainer: {
            flex: 1,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 8,
            color: colors.foreground,
        },
        message: {
            fontSize: 12,
            color: colors.foreground,
            marginBottom: 5,
        },
        timestamp: {
            fontSize: 10,
            color: colors.foreground,
            marginTop: 1,
        },
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
            fontSize: 20,
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
        },
        swapRequestButtonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 6,
        },
        swapRequestButton: {
            backgroundColor: colors.highlight2,
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
    });
}


export default Notifications;