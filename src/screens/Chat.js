import React, { useContext, useRef } from 'react';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
//import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import EntypoIcon from "react-native-vector-icons/Entypo";

import { getUserToken } from '../storage/UserToken';
import { getMessages, postMessage } from '../api/backend/Social';
import { SerializeImage } from '../api/backend/utils/Serialize';
import { ThemeContext, getColors } from '../assets/Theme';
import { WSChat } from '../api/backend/WebSocket';
import MaterialButtonSuccess from '../components/MaterialButtonSuccess';
import CustomModal from '../components/CustomModal';
import CustomModalButton from '../components/CustomModalButton';
import PaginatedFlatList from '../components/PaginatedFlatList';


function Chat() {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const navigation = useNavigation();
    const route = useRoute(); // Use useRoute to access route parameters
    const messagesFlatListRef = useRef();

    const chatPreviewMessage = route.params?.chatPreviewMessage;
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    // WebSocket
    const [socket, setSocket] = useState(null);

    // Initiate a websocket connection
    useEffect(() => {
        let chatRoom = null;
        if (chatPreviewMessage.otherUserID < chatPreviewMessage.clientUserID)
            chatRoom = `${chatPreviewMessage.otherUserID}_${chatPreviewMessage.clientUserID}`
        else
            chatRoom = `${chatPreviewMessage.clientUserID}_${chatPreviewMessage.otherUserID}`
        const ws = WSChat(chatRoom);

        ws.onopen = () => {
            console.log(`WebSocket connected, chatroom: ${chatRoom}`);
        };

        ws.onmessage = (event) => {
            const receivedMessage = JSON.parse(JSON.parse(event.data)['message']);
            if (messagesFlatListRef.current) {
                messagesFlatListRef.current.setDataFromExternal([
                    receivedMessage, ...(messagesFlatListRef.current.getData())
                ]);
            }
        };

        ws.onclose = () => {
            console.log(`WebSocket disconnected, chatroom: ${chatRoom}`);
            // Reconnect logic can be added here if needed
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    // Get chat messages
    const getMeMessages = async (page) => {
        const token = (await getUserToken()).token;
        const params = {
            'sender': chatPreviewMessage.clientUserID,
            'receiver': chatPreviewMessage.otherUserID,
            'or_sender': chatPreviewMessage.otherUserID,
            'or_receiver': chatPreviewMessage.clientUserID,
            'page': page,
        }
        let response;
        try {
            response = await getMessages(token, params);
            return response.data;
        }
        catch (error) { }
    };

    const handleSend = async () => {
        if (newMessage.trim() !== '' || attachment) {
            // Post the message to database (API post request)
            const token = await getUserToken();
            const data = new FormData();
            data.append('receiver', chatPreviewMessage.otherUserID);
            if (newMessage)
                data.append('message', newMessage);
            if (attachment)
                data.append('attachment', SerializeImage(attachment, `chat-photo-${chatPreviewMessage.clientUserID}-${chatPreviewMessage.otherUserID}`));
            await postMessage(token.token, data)
                .then(response => {
                    console.log(response.data);

                    // Pass the successful sent message to WebSocket
                    if (socket && socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify(response.data));
                    }
                    // Update user's screen with the message user has typed if no socket
                    // This way the user will still see their own message even if socket connection is not on or it is lost
                    else {
                        if (messagesFlatListRef.current) {
                            const prevMessages = messagesFlatListRef.current.getData();
                            messagesFlatListRef.current.setDataFromExternal([{
                                id: (prevMessages && prevMessages.length > 0) ? (prevMessages[0].id + 1) : 0,
                                sender: chatPreviewMessage.clientUserID,
                                receiver: chatPreviewMessage.otherUserID,
                                message: newMessage,
                                attachment: attachment && attachment.assets[0].uri
                            }, ...prevMessages]);
                        }
                    }
                })
                .catch(error => { })

            // Empty the new message and attachment states
            setNewMessage('');
            setAttachment(undefined);
        }
    };

    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('FoodSwap needs your permission to access camera!');
        }
        else {
            try {
                const picture = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 1,
                });

                if (!picture.canceled) {
                    console.log(picture);
                    setAttachment(picture);
                }
            } catch (error) {
                console.error('Error picking image:', error);
            }
        }
    };

    const backPressed = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const viewProfilePressed = () => {
        navigation.navigate('PublicProfile', { userID: chatPreviewMessage.otherUserID });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerBackAndProfile}>
                    <TouchableOpacity onPress={backPressed}>
                        <EntypoIcon name="chevron-thin-left" style={styles.icon}></EntypoIcon>
                    </TouchableOpacity>
                    <Image source={chatPreviewMessage.otherUserProfilePicture ? { uri: chatPreviewMessage.otherUserProfilePicture } : require("../assets/images/default_profile.jpg")} style={styles.profilePic} />
                    <Text style={styles.senderName}>
                        {
                            chatPreviewMessage.otherUserFirstName ? (chatPreviewMessage.otherUserLastName ? chatPreviewMessage.otherUserFirstName + chatPreviewMessage.otherUserLastName : chatPreviewMessage.otherUserUsername)
                                :
                                chatPreviewMessage.otherUserUsername
                        }
                    </Text>
                </View>
                <TouchableOpacity onPress={toggleModal}>
                    <EntypoIcon name="dots-three-vertical" style={styles.icon} />
                </TouchableOpacity>
                <CustomModal
                    visible={isModalVisible}
                    onRequestClose={toggleModal}
                    colors={colors}
                >
                    <CustomModalButton colors={colors} onPress={viewProfilePressed}>
                        View Profile
                    </CustomModalButton>
                    <CustomModalButton colors={colors} onPress={() => { console.log('Block pressed') }}>
                        Block
                    </CustomModalButton>
                </CustomModal>
            </View>
            <PaginatedFlatList
                ref={messagesFlatListRef}
                colors={colors}
                style={styles.messagesContainer}
                loadData={getMeMessages}
                renderItem={({ item }) => (
                    <Message
                        key={item.id}
                        msg={item}
                        isYourMessage={item.sender === chatPreviewMessage.clientUserID}
                        styles={styles} />
                )}
                inverted={true}
            />
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                    <Icon name="camera" size={20} color={colors.foreground} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    placeholderTextColor={colors.foreground}
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                />
                <MaterialButtonSuccess style={styles.sendButton} onPress={handleSend}>
                    <Icon name="send" size={18} color={colors.foreground} />
                </MaterialButtonSuccess>
            </View>
        </View>
    );
};

function Message(props) {
    const styles = props.styles;
    const msg = props.msg ? props.msg : [];
    const isYourMessage = props.isYourMessage;

    return (
        <View key={props.index} style={isYourMessage ? styles.yourMessage : styles.otherMessage}>
            <TouchableOpacity>
                <Text style={styles.sender}>{isYourMessage == true ? 'You' : msg.sender_username}:</Text>
                {msg.attachment ? (
                    <Image source={{ uri: msg.attachment }} style={styles.messageImage} />
                ) : ''
                }
                <Text style={styles.message}>{msg.message}</Text>
            </TouchableOpacity>
        </View>
    );
}

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.highlight1,
            paddingTop: 40
        },
        headerBackAndProfile: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        icon: {
            color: '#fff',
            fontSize: 25,
        },
        profilePic: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginLeft: 20,
            marginRight: 10,
            marginVertical: 10,
            resizeMode: 'contain'
        },
        senderName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: "#fff",
        },
        messagesContainer: {
            flex: 1,
            padding: 10,
            backgroundColor: colors.background,
        },
        yourMessage: {
            alignSelf: 'flex-end',
            backgroundColor: colors.background2,
            borderRadius: 8,
            maxWidth: '75%',
            paddingHorizontal: 8,
            paddingVertical: 5,
            marginVertical: 4,
        },
        otherMessage: {
            alignSelf: 'flex-start',
            backgroundColor: colors.highlight2,
            borderRadius: 8,
            maxWidth: '75%',
            paddingHorizontal: 8,
            paddingVertical: 5,
            marginVertical: 4,
        },
        sender: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.foreground,
            marginBottom: 4,
        },
        message: {
            fontSize: 16,
            color: colors.foreground,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 12,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.background2,
        },
        imagePickerButton: {
            marginRight: 10
        },
        messageImage: {
            width: 200,
            height: 150,
            borderRadius: 8,
            resizeMode: 'contain'
        },
        input: {
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: colors.background2,
            borderRadius: 20,
            paddingHorizontal: 16,
            marginRight: 8,
            backgroundColor: colors.background2,
            color: colors.foreground
        },
        sendButton: {
            backgroundColor: colors.highlight2,
            padding: 8,
            borderRadius: 20,
        },
        sendButtonText: {
            color: colors.foreground,
            fontWeight: 'bold',
        },
    })
}

export default Chat;