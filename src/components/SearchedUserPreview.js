import { useNavigation } from "@react-navigation/native";
import  React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

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

    return (
      <TouchableOpacity onPress={handlePress}>
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
