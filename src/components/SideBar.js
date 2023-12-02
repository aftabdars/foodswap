import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { Button,Avatar } from "react-native-elements";
import ProgressBar from './ProgressBar';
import CustomButton from "./CustomButton";

const SideBar = (props)=> {
    const userData = {
        username: "Asfana",
        level: 5,
        xp: 2500,
      };
    //Theme
    const colors = props.colors;
    const styles = createStyles(colors);

    const navigation = useNavigation();

    const findUsersPressed = () => {
        navigation.navigate('Search', {userSearch: true})
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
        <Avatar
          rounded
          style={styles.avatar}
          size="large"
          source={require("../assets/images/default_profile.jpg")}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{userData.username}</Text>
          <Text style={styles.level}>{`Level ${userData.level}`}</Text>
          <ProgressBar xp={[30,60]} height={8} />
        </View>
      </View>
      <View style={styles.buttonContainer}>
      <CustomButton
        title="Find Users"
        onPress={findUsersPressed}
        icon="search"
      />
      <CustomButton 
      title="Button 2" 
      onPress={() => console.log("Button 2")}
      icon="settings"
      />
      <CustomButton 
      title="Button 3" 
      onPress={() => console.log("Button 3")} 
      icon="notifications"
      />
    </View>
    </View>
    )
}

function createStyles(colors) {
    return StyleSheet.create({
        container: {
          backgroundColor: colors.background,
          flex: 1,
          paddingTop: 50,
          paddingHorizontal: 20,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          },
          buttonContainer: {
            marginTop: 20,
          },
          avatar: {
            position:'absolute',
            right:-10,
            top:-10,
            width: 80,
            height: 80,
            borderRadius: 40,
          },
          userInfo: {
            marginLeft: -10,
            
          },
          username: {
            fontSize: 24,
            fontWeight: "bold",
            color:  colors.foreground,
            marginBottom: 5,
          },
          level: {
            fontSize: 18,
            marginTop:5,
            color:  colors.foreground,
          },
          xp: {
            fontSize: 16,
            color: colors.foreground,
            marginTop:5,
          },
    });
}

export default SideBar