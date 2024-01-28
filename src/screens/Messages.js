import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Avatar, Icon } from 'react-native-elements';
//import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { getUserToken } from "../storage/UserToken";
import { getUserInbox } from "../api/backend/Social";
import { ThemeContext, getColors } from '../assets/Theme';
import { formatTimeDifferencePast } from '../utils/Format';
import PaginatedFlatList from "../components/PaginatedFlatList";
import { getProfile } from "../storage/User";


function Inbox() {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const [userID, setUserID] = useState();
    const navigation = useNavigation();

    // Get user id
    useEffect(() => {
        (async () => {
            setUserID((await getProfile()).id);
        })();
    }, []);

    const getMeUserInbox = async (page) => {
        const token = await getUserToken();
        let response;
        try {
            response = await getUserInbox(token.token, { 'page': page });
            return response.data;
        }
        catch (error) { }
    };

    return (
        <View style={styles.container}>
            {userID &&
                <PaginatedFlatList
                    colors={colors}
                    loadData={getMeUserInbox}
                    renderItem={({ item }) => (
                        <ChatPreview
                            key={item.id}
                            userID={userID}
                            data={item}
                            dataLength={item.length}
                            colors={colors}
                            styles={styles}
                        />
                    )}
                    alternativeText={'No chats to show'}
                />
            }
            <TouchableOpacity onPress={()=> {console.log('bagar billo'); navigation.navigate('Search', { userSearch: true, message:true })}}>
                <View style={styles.newMessage}>
                    <Icon name='message'></Icon>
                </View>
            </TouchableOpacity>
        </View>
    )
};

function ChatPreview(props) {
    const colors = props.colors;
    const styles = props.styles;

    const navigation = useNavigation();

    // Decide the other user and last message by whom
    const otherUserID = props.data.sender === props.userID? props.data.receiver : props.data.sender;
    const otherUserProfilePicture = otherUserID === props.data.sender? props.data.sender_profile_picture : props.data.receiver_profile_picture;
    const otherUserUsername = otherUserID === props.data.sender? props.data.sender_username : props.data.receiver_username;
    const otherUserFirstName = otherUserID === props.data.sender? props.data.sender_first_name : props.data.receiver_first_name;
    const otherUserLastName = otherUserID === props.data.sender? props.data.sender_last_name : props.data.receiver_last_name;
    const lastMessageByClient = props.userID === props.data.sender? true : false;

    const handleDataPress = (data) => {
        navigation.navigate('Chat', { chatPreviewMessage: {
            clientUserID: props.userID,
            otherUserID: otherUserID,
            otherUserProfilePicture: otherUserProfilePicture,
            otherUserUsername: otherUserUsername,
            otherUserFirstName: otherUserFirstName,
            otherUserLastName: otherUserLastName,
        } });
    };

    return (
        <TouchableOpacity onPress={() => handleDataPress(props.data)}>
            <View style={styles.notificationContainer}>
                <Avatar
                    rounded
                    source={otherUserProfilePicture ? { uri: otherUserProfilePicture } : require("../assets/images/default_profile.jpg")}
                    size="medium"
                    containerStyle={styles.avatarContainer}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>
                        {otherUserUsername}
                    </Text>
                    <Text style={styles.message}>
                        {props.data.attachment ?
                            (<Icon name="paperclip" type="font-awesome" size={16} color="#666" />)
                            : ""
                        }
                        {props.data.message ?
                            (lastMessageByClient? 'You: ': '') +
                            (props.data.message.substring(0, 100) + 
                            (props.data.message.length > 100 ? '...' : ''))
                            : ''
                        }
                    </Text>

                    <Text style={styles.time}>
                        {formatTimeDifferencePast(props.data.timestamp)} ago
                    </Text>
                </View>
                <Icon
                    name='arrow-right'
                    type='feather'
                    color={colors.highlight2}
                    size={24}
                />
            </View>
            {props.index < props.dataLength - 1 && <View style={styles.notificationBorder} />}
        </TouchableOpacity>
    )
}

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingVertical: 16,
            backgroundColor: colors.background,
        },
        newMessage: {
            width: 60,
            height: 60,
            backgroundColor: colors.highlight1,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 30,
            right: 30,
        },
        notificationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            paddingHorizontal: 16,
            backgroundColor: colors.background2,
            borderRadius: 10,
            elevation: 3,
            shadowColor: colors.foreground,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            padding: 16,
        },
        avatarContainer: {
            marginRight: 16,
        },
        textContainer: {
            flex: 1,
        },
        name: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 4,
            color: colors.foreground,
        },
        message: {
            fontSize: 16,
            color: colors.foreground,
            marginBottom: 4,
        },
        time: {
            color: colors.foreground,
            fontSize: 12,
        },
        notificationBorder: {
            height: 1,
            borderBottomColor: '#ddd',
            marginVertical: 10,
        }
    });
}

export default Inbox;
