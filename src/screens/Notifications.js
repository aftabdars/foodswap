import React, { useContext } from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from "react-native";

import { ThemeContext, getColors } from "../assets/Theme";
import { getClientNotifications, partialUpdateUserNotification } from "../api/backend/User";
import { getUserToken } from "../storage/UserToken";
import { useNavigation } from "@react-navigation/native";
import { getProfile } from "../storage/User";
import { deleteFoodShareRequest, deleteFoodSwapRequest, postFoodSwap } from "../api/backend/Food";
import PaginatedFlatList from "../components/PaginatedFlatList";
import { useRef } from "react";
import ShareRequest from "../components/notifications/ShareRequest";
import { formatTimestamp } from "../utils/Format";
import SwapRequest from "../components/notifications/SwapRequest";

function Notifications() {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const [userID, setUserID] = useState();

    const navigation = useNavigation();
    const flatListRef = useRef(null);

    // Gets the data
    useEffect(() => {
        // Get user's ID
        const getMeUserID = async () => {
            setUserID((await getProfile()).id);
        }
        getMeUserID();
    }, []);

    // Get client's notifications
    const getMeClientNotifications = async (page) => {
        const token = await getUserToken();
        let response;
        try {
            response = await getClientNotifications(token.token, { 'page': page });

            // Update latest notification is_read to true
            if (response.data.results.length > 0) {
                await partialUpdateUserNotification(response.data.results[0].id, token.token, { is_read: true });
            }

            return response.data;
        }
        catch (error) { }
    }

    const swapDecline = async (notifcationID, foodSwapRequestID) => {
        try {
            // Delete swap request from backend
            const token = (await getUserToken()).token;
            const response = await deleteFoodSwapRequest(foodSwapRequestID, token);
            console.log(response.data);
            // Remove the swap request notification from screen
            deleteNotificationFromScreen(notifcationID);
        } catch (error) { }
    };

    const swapAccept = async (notifcationID, foodSwapRequestID, object) => {
        try {
            // Delete swap request from backend
            const token = (await getUserToken()).token;
            const response = await deleteFoodSwapRequest(foodSwapRequestID, token, { 'accepted': true });
            console.log(response.data);
            // Remove the swap request notification from screen
            deleteNotificationFromScreen(notifcationID);

            await postFoodSwap(token, {
                'food_a': object.food_a,
                'food_b': object.food_b,
                'location_latitude': object.proposed_location_latitude,
                'location_longitude': object.proposed_location_longitude
            })
                .then(response => {
                    console.log(response.data);
                    navigation.navigate("FoodSwapRoom", { swapID: response.data.id });
                })
                .catch(error => { })
        } catch (error) { }
    };

    const shareDecline = async (notifcationID, foodShareRequestID) => {
        try {
            // Delete share request from backend
            const token = (await getUserToken()).token;
            const response = await deleteFoodShareRequest(foodShareRequestID, token);
            console.log(response.data);
            // Remove the share request notification from screen
            deleteNotificationFromScreen(notifcationID);
        } catch (error) { }
    };

    const shareAccept = async (object) => {
        navigation.navigate('LocationSelection', {
            food: object.food,
            taker: object.taker,
            shareRequestID: object.id
        });
    };

    const renderNotificationItem = ({ item }) => {
        if (item.notification_type === 'foodswap_request') {
            return <SwapRequest key={item.id} colors={colors} data={item} userID={userID} navigation={navigation} swapDecline={swapDecline} swapAccept={swapAccept} />
        }
        else if (item.notification_type === 'foodshare_request') {
            return <ShareRequest key={item.id} colors={colors} data={item} userID={userID} navigation={navigation} shareDecline={shareDecline} shareAccept={shareAccept} />
        }
        else { // Other notifications
            return <NotificationPreview key={item.id} styles={styles} data={item} />
        }
    };

    const deleteNotificationFromScreen = (notifcationID) => {
        if (flatListRef.current) {
            flatListRef.current.setDataFromExternal(
                flatListRef.current.getData().filter((item) => item.id !== notifcationID)
            );
        }
    }

    return (
        <View style={styles.container}>
            {userID &&
                <PaginatedFlatList
                    ref={flatListRef}
                    colors={colors}
                    loadData={getMeClientNotifications}
                    renderItem={renderNotificationItem}
                    alternativeText={'No notifications to show'}
                />
            }
        </View>
    );
};

function NotificationPreview({ styles, data }) {

    return (
        <View style={styles.notificationContainer}>
            <View style={styles.iconContainer}>
                <Text style={styles.notificationIcon}>🔔</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.message}>{data.message}</Text>
                <Text style={styles.timestamp}>{formatTimestamp(data.timestamp)}</Text>
            </View>
        </View>
    )
}

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingVertical: 10,
            backgroundColor: colors.background,
        },
        notificationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            padding: 16,
            marginVertical: 5,
            elevation: 2,
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
    });
}


export default Notifications;