import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";

function CupertinoFooter1(props) {
  const [active, setActive] = React.useState('settings');
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity style={styles.btnWrapper} onPress={() => setActive('home')}>
        <MaterialCommunityIconsIcon
          name="home-minus"
          style={[styles.icon, {color: (active == 'home') ? "#009688" : "#616161"}]}
        ></MaterialCommunityIconsIcon>
        <Text
          style={[styles.font, {color: (active == 'home') ? "#009688" : "#616161"}]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper} onPress={() => setActive('profile')}>
        <MaterialCommunityIconsIcon
          name="account-circle"
          style={[styles.icon, {color: (active == 'profile') ? "#009688" : "#616161"}]}
        ></MaterialCommunityIconsIcon>
        <Text
         style={[styles.font, {color: (active == 'profile') ? "#009688" : "#616161"}]}>
        Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper} onPress={() => setActive('camera')}>
        <MaterialCommunityIconsIcon
          name="camera"
          style={[styles.icon, {color: (active == 'camera') ? "#009688" : "#616161"}]}
        ></MaterialCommunityIconsIcon>
        <Text
          style={[styles.font, {color: (active == 'camera') ? "#009688" : "#616161"}]}
        >
          Share Food
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper} onPress={() => setActive('messages')}>
        <MaterialCommunityIconsIcon
          name="message-processing"
          style={[styles.icon, {color: (active == 'messages') ? "#009688" : "#616161"}]}
        ></MaterialCommunityIconsIcon>
        <Text style={[styles.font, {color: (active == 'messages') ? "#009688" : "#616161"}]}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper} onPress={() => setActive('settings')}>
        <MaterialCommunityIconsIcon
          name="account-settings"
          style={[styles.icon, {color: (active == 'settings') ? "#009688" : "#616161"}]}
        ></MaterialCommunityIconsIcon>
        <Text style={[styles.font, {color: (active == 'settings') ? "#009688" : "#616161"}]}>Settings</Text>
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
