import  React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text,TouchableOpacity } from "react-native";
import { Avatar, Icon } from 'react-native-elements'; 
import { getUserToken } from "../storage/Token";
import { getUserInbox } from "../api/backend/Social";
import Colors from '../assets/Colors'


function Inbox() {
    const [inboxData, setInboxData] = useState();

    useEffect(() => {
        const getMeUserInbox = async () => {
            const token = await getUserToken();
            getUserInbox(token.token)
            .then(response => {
                console.log(response.data);
                setInboxData(response.data);
            })
            .catch(error => {
                console.log(error);
            })
        };
        getMeUserInbox();
    }, []);

    return (
        <View style={styles.container}>
            {inboxData?
                inboxData.map((data, index) => (
                    <ChatPreview key={data.id} data={data} index={index} dataLength={inboxData.length}/>
                ))
                :
                <Text style={[styles.message, {'textAlign': 'center'}]}>No chats to show</Text>
            }
        </View>
    )
};

function ChatPreview(props) {
    const navigation = useNavigation();

    const handleDataPress = (data) => {
        navigation.navigate('Chat', {chatPreviewMessage: data});
    };
    
    return (
        <TouchableOpacity key={props.index} onPress={() => handleDataPress(props.data)}> 
        <View>
            <View style ={styles.notificationContainer}>
                <Avatar
                    rounded
                    source={props.data.sender_profile_picture? {uri: props.data.sender_profile_picture} : require("../assets/images/default_profile.jpg")}
                    size="medium"
                    containerStyle={styles.avatarContainer}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>
                        {props.data.sender_username}
                    </Text>
                    <Text style={styles.message}>
                        {props.data.attachment?
                            (<Icon name="paperclip" type="font-awesome" size={16} color="#666" />)
                            : ""
                        }
                        {props.data.message?
                            (props.data.message.substring(0, 100) + (props.data.message.length > 100? '...' : ''))
                            : ''
                        }
                    </Text>
                
                    <Text style={styles.time}>
                        {formatTimeDifference(props.data.timestamp)}
                    </Text>
                </View>
                <Icon
                    name='arrow-right'
                    type='feather'
                    color='#007bff'
                    size={24}
                />
            </View>
            {props.index < props.dataLength - 1 && <View style={styles.notificationBorder} />}
        </View>
    </TouchableOpacity>
    )
}

const formatTimeDifference = (timestamp) => {
    const currentTime = new Date(); // Current time
    const messageTime = new Date(timestamp); // Time of the message
  
    const timeDifferenceInMilliseconds = currentTime - messageTime;
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));
  
    if (timeDifferenceInMinutes < 60) {
      return `${timeDifferenceInMinutes} minutes ago`;
    } else if (timeDifferenceInMinutes < 24 * 60) {
      const hours = Math.floor(timeDifferenceInMinutes / 60);
      const remainingMinutes = timeDifferenceInMinutes % 60;
      return `${hours} hours ${remainingMinutes} minutes ago`;
    } else {
      const days = Math.floor(timeDifferenceInMinutes / (24 * 60));
      const remainingHours = Math.floor((timeDifferenceInMinutes % (24 * 60)) / 60);
      return `${days} days ${remainingHours} hours ago`;
    }
  };

const styles = StyleSheet.create({
    container: {
        
        flex: 1,
        padding:16,
        backgroundColor: Colors.background,
    },

    notificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:0,
        paddingHorizontal: 16,
        backgroundColor: Colors.background2,
        borderRadius: 10,
        elevation: 3,
        shadowColor: Colors.foreground,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        padding: 16,
    },
    avatarContainer: {
        marginRight: 16,
        },
    textContainer: {
        flex:1,
        
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.foreground,
    },
    message: {
        fontSize: 16,
        color: Colors.foreground,
        marginBottom:4,
        },

    time: {
    color: Colors.foreground,
    fontSize: 12,       
    },

    notificationBorder:{
    height: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
    }
});

 export default Inbox;