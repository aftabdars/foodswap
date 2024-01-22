import { useNavigation } from "@react-navigation/native";
import  React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getProfile } from "../storage/User";

function SearchedUserPreview(props) {
    //Theme
    const colors = props.colors;
    const styles = createStyles(colors);
    // User's Data
    const item = props.userData;

    const navigation = useNavigation();

    const handlePress = () => {
      navigation.navigate('PublicProfile', {userID: item.id});
    }
    const [clientUserID, setClientUserID] = useState();

    const messagePressed = () => {
      let userData = props.userData;
      if (userData && clientUserID) {
          navigation.navigate('Chat', {
              chatPreviewMessage: {
                  clientUserID: clientUserID,
                  otherUserID: userData.id,
                  otherUserProfilePicture: userData.profile_picture,
                  otherUserUsername: userData.username,
                  otherUserFirstName: userData.first_name,
                  otherUserLastName: userData.last_name,
              }
          });
      }
    };

    // Gets client user profile ID
    useEffect(() => {
      const getClientUserProfile = async () => {
          try {
              setClientUserID((await getProfile()).id);
          }
          catch (error) {
              console.log(error);
          }
      }
      getClientUserProfile();
    }, []);

    return (
      <TouchableOpacity onPress={props.message? messagePressed : handlePress}>
        <View style={styles.userItem}>
          <Image 
            source={item.profile_picture? {uri: item.profile_picture} : require('../assets/images/default_profile.jpg')} 
            style={styles.profilePicture} 
          />
          <Text style={styles.username}>{item.username}</Text>
        </View>
      </TouchableOpacity>
    );
}

function createStyles(colors) {
  return StyleSheet.create({
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 1,
      padding: 10,
      backgroundColor: colors.background2,
      borderRadius: 1,
      elevation: 3,
    },
    profilePicture: {
      width: 40,
      height: 40,
      borderRadius: 30,
      marginRight: 12,
    },
    username: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
    },
  });
}
  
export default SearchedUserPreview;
