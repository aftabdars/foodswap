import  React, { useContext } from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList,PixelRatio,Image,TouchableOpacity } from "react-native";
import { ThemeContext, getColors } from "../assets/Theme";

function Notifications() {
      // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const  [notifications, setNotifications] = useState([
      { id: '1', title: 'New Message', message: 'You have a new message from John Doe.', timestamp: '2023-11-10T08:30:00Z' },
      { id: '2', title: 'Reminder', message: 'Don\'t forget to attend the meeting at 2 PM.',timestamp: '2023-11-09T14:00:00Z' },
      { id: '3', type: 'follower', title: 'New Follower', message: 'John Smith started following you.', timestamp: '2023-11-08T18:45:00Z' },
      { id: '4', type: 'following', title: 'New Following', message: 'You started following Jane Doe.', timestamp: '2023-11-08T18:45:00Z' },
    ]);

    const renderNotificationItem = ({ item }) => (
        <NotificationPreview styles={styles} data={item} />
    );
      
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
    
function NotificationPreview(props) {
    const styles = props.styles;
    const data = props.data;

    const handleNotificationPress = () => {
        // Handle the press event for the notification item
        console.log(`Notification pressed: ${data.title}`);
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

    return (
        <TouchableOpacity onPress={ handleNotificationPress }>
            <View style={styles.notificationContainer}>
                <View style={styles.iconContainer}>
                    <Text style={styles.notificationIcon}>🔔</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{data.title}</Text>
                    <Text style={styles.message}>{data.message}</Text>
                </View>
                <Text style={styles.timestamp}>{formatTimestamp(data.timestamp)}</Text>
            </View>
        </TouchableOpacity>
    )
}


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
            marginTop:1,
        },
    });
}


export default Notifications;