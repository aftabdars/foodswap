import React, { useContext, useRef } from 'react';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
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


function Chat() {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const navigation = useNavigation();
    const route = useRoute(); // Use useRoute to access route parameters
    const messagesScrollRef = useRef();

    const chatPreviewMessage = route.params?.chatPreviewMessage;
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState();
    const [messages, setMessages] = useState();
    const [initialScrollDone, setInitialScrollDone] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    // WebSocket
    const [socket, setSocket] = useState(null);

    // Initiate a websocket connection
    useEffect(() => {
        let chatRoom = null;
        if (chatPreviewMessage.sender < chatPreviewMessage.receiver)
            chatRoom = `${chatPreviewMessage.sender}_${chatPreviewMessage.receiver}`
        else
            chatRoom = `${chatPreviewMessage.receiver}_${chatPreviewMessage.sender}`
        const ws = WSChat(chatRoom);

        ws.onopen = () => {
            console.log(`WebSocket connected, chatroom: ${chatRoom}`);
        };

        ws.onmessage = (event) => {
            const receivedMessage = JSON.parse(JSON.parse(event.data)['message']);
            setMessages((prevMessages) => [receivedMessage, ...prevMessages]);
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
    useEffect(() => {
        const getMeMessages = async () => {
            const token = (await getUserToken()).token;
            const params = {
                'sender': chatPreviewMessage.sender,
                'receiver': chatPreviewMessage.receiver,
                'or_sender': chatPreviewMessage.receiver,
                'or_receiver': chatPreviewMessage.sender,
            }
            await getMessages(token, params)
                .then(response => {
                    setMessages(response.data.results);
                })
                .catch(error => { })
        };
        getMeMessages();
    }, []);

    // Scroll to bottom once messages are loaded initially
    useEffect(() => {
        if (!initialScrollDone && messages && messages.length > 0) {
            scrollToBottom();
            setInitialScrollDone(true);
        }
    }, [messages]);

    const handleSend = async () => {
        if (newMessage.trim() !== '' || attachment) {
            // Post the message to database (API post request)
            const token = await getUserToken();
            const data = new FormData();
            data.append('receiver', chatPreviewMessage.sender);
            if (newMessage)
                data.append('message', newMessage);
            if (attachment)
                data.append('attachment', SerializeImage(attachment, `chat-photo-${chatPreviewMessage.receiver}-${chatPreviewMessage.sender}`));
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
                        setMessages([{
                            id: messages[0].id + 1,
                            sender: chatPreviewMessage.receiver,
                            receiver: chatPreviewMessage.sender,
                            message: newMessage,
                            attachment: attachment && attachment.uri
                        }, ...messages]);
                    }
                    scrollToBottom();
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

    const scrollToBottom = () => {
        messagesScrollRef.current.scrollToEnd({ animated: true });
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
        navigation.navigate('PublicProfile', { userID: chatPreviewMessage.sender });
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerExtraSpaceTop} />
            <View style={styles.header}>
                <View style={styles.headerBackAndProfile}>
                    <TouchableOpacity onPress={backPressed}>
                        <EntypoIcon name="chevron-thin-left" style={styles.icon}></EntypoIcon>
                    </TouchableOpacity>
                    <Image source={chatPreviewMessage.sender_profile_picture ? { uri: chatPreviewMessage.sender_profile_picture } : require("../assets/images/default_profile.jpg")} style={styles.profilePic} />
                    <Text style={styles.senderName}>
                        {
                            chatPreviewMessage.sender_first_name ? (chatPreviewMessage.sender_last_name ? chatPreviewMessage.sender_first_name + chatPreviewMessage.sender_last_name : chatPreviewMessage.sender_username)
                                :
                                chatPreviewMessage.sender_username
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
            <ScrollView
                style={styles.messagesContainer}
                ref={messagesScrollRef}
            >
                {messages && messages.slice().reverse().map((msg, index) => (
                    <Message key={msg.id && msg.id} index={index} msg={msg} isYourMessage={msg.sender === chatPreviewMessage.receiver} styles={styles} />
                ))}

                <Text styles={{ "marginVertican": 10 }} />
            </ScrollView>
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
            backgroundColor: colors.highlight1,
        },
        headerExtraSpaceTop: {
            marginVertical: 10
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.highlight1,
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
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
            padding: 15,
            backgroundColor: colors.background,
        },
        yourMessage: {
            alignSelf: 'flex-end',
            backgroundColor: colors.background2,
            borderRadius: 8,
            maxWidth: '75%',
            paddingHorizontal: 8,
            paddingVertical: 5,
            marginBottom: 8,
        },
        otherMessage: {
            alignSelf: 'flex-start',
            backgroundColor: colors.highlight2,
            borderRadius: 8,
            maxWidth: '75%',
            paddingHorizontal: 8,
            paddingVertical: 5,
            marginBottom: 8,
        },
        messageContainer: {
            marginBottom: 16,
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