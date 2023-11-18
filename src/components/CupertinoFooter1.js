import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import Colors from '../assets/Colors'


function CupertinoFooter1(props) {
  const [active, setActive] = React.useState('home');

  const navigation = useNavigation();

    const homePressed = () => {
      navigation.navigate('Home');
  }
    const profilePressed = () => {
      // Navigate to settings screen
      navigation.navigate('Profile');
  }

  const cameraPressed = () => {
      // Navigate to selection for food photo screen
      navigation.navigate('FoodImageSelection');
  }
  const settingsPressed = () => {
      // Navigate to settings screen
      navigation.navigate('Settings');
  }

  return (
    <View style={[styles.container, props.style, {backgroundColor: Colors.background2, width: "100%"}]}>
      <TouchableOpacity style={styles.btnWrapper} onPress={() => { setActive('home'); homePressed(); }}>
        <MaterialCommunityIconsIcon
          name="home-minus"
          style={[styles.icon, {color: (active == 'home') ? Colors.highlight1 : Colors.foreground}]}
        ></MaterialCommunityIconsIcon>
        <Text
          style={[styles.font, {color: (active == 'home') ? Colors.highlight1 : Colors.foreground}]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper} onPress={() => {setActive('profile'); profilePressed(); }}>
        <MaterialCommunityIconsIcon
          name="account-circle"
          style={[styles.icon, {color: (active == 'profile') ? Colors.highlight1 : Colors.foreground}]}
        ></MaterialCommunityIconsIcon>
        <Text
         style={[styles.font, {color: (active == 'profile') ? Colors.highlight1 : Colors.foreground}]}>
        Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper} onPress={() => {setActive('camera' ); cameraPressed();}}>
        <MaterialCommunityIconsIcon
          name="camera"
          style={[styles.icon, {color: (active == 'camera') ? Colors.highlight1 : Colors.foreground}]}
        ></MaterialCommunityIconsIcon>
        <Text
          style={[styles.font, {color: (active == 'camera') ? Colors.highlight1 : Colors.foreground}]}
        >
          Share Food
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper} onPress={() => setActive('messages')}>
        <MaterialCommunityIconsIcon
          name="message-processing"
          style={[styles.icon, {color: (active == 'messages') ? Colors.highlight1 : Colors.foreground}]}
        ></MaterialCommunityIconsIcon>
        <Text style={[styles.font, {color: (active == 'messages') ? Colors.highlight1 : Colors.foreground}]}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper} onPress={() => { setActive('settings'); settingsPressed(); }}>
        <MaterialCommunityIconsIcon
          name="account-settings"
          style={[styles.icon, {color: (active == 'settings') ? Colors.highlight1 : Colors.foreground}]}
        ></MaterialCommunityIconsIcon>
        <Text style={[styles.font, {color: (active == 'settings') ? Colors.highlight1 : Colors.foreground}]}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "rgba(216,216,216,1)",
    paddingLeft: 4
  },
  btnWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 75
  },
  icon: {
    backgroundColor: "transparent",
    fontSize: 24,
    opacity: 0.8
  },
  font: {
    fontSize: 12,
    backgroundColor: "transparent",
    paddingTop: 4
  },
});

export default CupertinoFooter1;
