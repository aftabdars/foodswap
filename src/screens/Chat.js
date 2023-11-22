import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet,TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
//import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

import { getUserToken } from '../storage/Token';
import { getMessages, postMessage } from '../api/backend/Social';
import { SerializeImage } from '../api/backend/utils/Serialize';
import { useTheme } from '@react-navigation/native';



function Chat() {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    
    const route = useRoute(); // Use useRoute to access route parameters

    const chatPreviewMessage = route.params?.chatPreviewMessage;
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState();
    const [messages, setMessages] = useState();

    // Get chat messages
    useEffect(() => {
        const getMeMessages = async () => {
            const token = await getUserToken();
            const params = {
                'sender': chatPreviewMessage.sender,
                'receiver': chatPreviewMessage.receiver,
                'or_sender': chatPreviewMessage.receiver,
                'or_receiver': chatPreviewMessage.sender,
            }
            getMessages(token.token, params)
            .then(response => {
                console.log(response.data);
                setMessages(response.data.results);
            })
            .catch(error => {
                console.log(error);
            })
        };
        getMeMessages();
    }, []);

    const handleSend = async () => {
        if (newMessage.trim() !== '' || attachment) {
            // Post the message to database
            const token = await getUserToken();
            const data = new FormData();
            data.append('receiver', chatPreviewMessage.sender);
            if (newMessage) 
                data.append('message', newMessage);
            if (attachment)
                data.append('attachment', SerializeImage(attachment, `chat-photo-${chatPreviewMessage.receiver}-${chatPreviewMessage.sender}`));
            postMessage(token.token, data)
            .then(response => {
                console.log(response.data);
                // Update user's screen with the message user has typed
                setMessages([{
                    id: messages[messages.length - 1].id,
                    sender: chatPreviewMessage.receiver,
                    receiver: chatPreviewMessage.sender,
                    message: newMessage,
                    attachment: attachment.uri
                }, ...messages]);
            })
            .catch(error => {
                console.log(error);
                console.log(error.response.data);
            })

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

    return ( 
        <View style={styles.container}>
            <View style={styles.headerExtraSpaceTop}/>
            <View style={styles.header}>
                <Image source={chatPreviewMessage.sender_profile_picture? {uri: chatPreviewMessage.sender_profile_picture} : require("../assets/images/default_profile.jpg")} style={styles.profilePic} />
                <Text style={styles.senderName}>
                    {
                        chatPreviewMessage.sender_first_name? (chatPreviewMessage.sender_last_name? chatPreviewMessage.sender_first_name + chatPreviewMessage.sender_last_name : '')
                    :
                        chatPreviewMessage.sender_username
                    }
                </Text>
            </View>
            <ScrollView style={styles.messagesContainer}>
                {messages && messages.slice().reverse().map((msg, index) => (
                    <Message key={msg.id && msg.id} index={index} msg={msg} isYourMessage={msg.sender === chatPreviewMessage.receiver}/>
                 ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                <Icon name="camera" size={20} color="#707070" />
                </TouchableOpacity>
                    <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    placeholderTextColor={colors.foreground}
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Icon name="send" size={18}  color={colors.foreground} />
            </TouchableOpacity>
            </View>
        </View>
    );
};

function Message(props) {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const msg = props.msg? props.msg : [];
    const isYourMessage = props.isYourMessage;

    return (
        <View key={props.index} style={isYourMessage ? styles.yourMessage : styles.otherMessage}>
            <Text style={styles.sender}>{isYourMessage == true? 'You' : msg.sender_username}:</Text>
            {msg.attachment ? (
                <Image source={{ uri: msg.attachment }} style={styles.messageImage} />
            ) : ''
            }
            <Text style={styles.message}>{msg.message}</Text>
        </View>
    );
}

function createStyles(colors){
    return (
        {
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
                justifyContent: 'left',
                backgroundColor: colors.highlight1,
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
            },
            profilePic: {
                width: 40,
                height: 40,
                borderRadius: 20,
                marginLeft: 20,
                marginRight: 10,
                marginVertical: 10,
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
                marginBottom: 8,
            },
            message: {
                fontSize: 16,
                color: colors.foreground,
            },
            inputContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: colors.background,
                borderTopWidth: 1,
                borderTopColor: colors.background2,
            },
            imagePickerButton:{
                padding: 8,
                
            },
            messageImage: {
                width: 200, // Adjust the width as needed
                height: 150, // Adjust the height as needed
                borderRadius: 8,
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
                color: '#fff',
                fontWeight: 'bold',
            },
        }
    )
}
    
export default Chat;    