import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";

function CupertinoFooter1(props) {
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity style={styles.btnWrapper1}>
        <MaterialCommunityIconsIcon
          name="home-minus"
          style={[
            styles.icon,
            {
              color: props.active ? "#007AFF" : "#616161"
            }
          ]}
        ></MaterialCommunityIconsIcon>
        <Text
          style={[
            styles.home,
            {
              color: props.active ? "#007AFF" : "#9E9E9E"
            }
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper2}>
        <MaterialCommunityIconsIcon
          name="account-circle"
          style={styles.icon1}
        ></MaterialCommunityIconsIcon>
        <Text style={styles.profile}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper5}>
        <MaterialCommunityIconsIcon
          name="camera"
          style={[
            styles.icon4,
            {
              color: props.active ? "#007AFF" : "#616161"
            }
          ]}
        ></MaterialCommunityIconsIcon>
        <Text
          style={[
            styles.shareFood,
            {
              color: props.active ? "#007AFF" : "#9E9E9E"
            }
          ]}
        >
          Share Food
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper3}>
        <MaterialCommunityIconsIcon
          name="message-processing"
          style={styles.icon2}
        ></MaterialCommunityIconsIcon>
        <Text style={styles.messages}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper4}>
        <MaterialCommunityIconsIcon
          name="settings"
          style={styles.icon3}
        ></MaterialCommunityIconsIcon>
        <Text style={styles.settings}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "rgba(216,216,216,1)"
  },
  btnWrapper1: {
    alignItems: "center",
    justifyContent: "center",
    width: 75
  },
  icon: {
    backgroundColor: "transparent",
    fontSize: 24,
    opacity: 0.8
  },
  home: {
    fontSize: 12,
    backgroundColor: "transparent",
    paddingTop: 4
  },
  btnWrapper2: {
    alignItems: "center",
    justifyContent: "center",
    width: 75
  },
  icon1: {
    backgroundColor: "transparent",
    color: "#616161",
    fontSize: 24,
    opacity: 0.8
  },
  profile: {
    fontSize: 12,
    color: "#9E9E9E",
    backgroundColor: "transparent",
    paddingTop: 4
  },
  btnWrapper5: {
    alignItems: "center",
    justifyContent: "center",
    width: 75
  },
  icon4: {
    backgroundColor: "transparent",
    fontSize: 24,
    opacity: 0.8
  },
  shareFood: {
    fontSize: 12,
    backgroundColor: "transparent",
    paddingTop: 4
  },
  btnWrapper3: {
    alignItems: "center",
    justifyContent: "center",
    width: 75
  },
  icon2: {
    backgroundColor: "transparent",
    color: "#616161",
    fontSize: 24,
    opacity: 0.8
  },
  messages: {
    fontSize: 12,
    color: "#9E9E9E",
    backgroundColor: "transparent",
    paddingTop: 4
  },
  btnWrapper4: {
    alignItems: "center",
    justifyContent: "center",
    width: 75
  },
  icon3: {
    backgroundColor: "transparent",
    color: "#616161",
    fontSize: 24,
    opacity: 0.8
  },
  settings: {
    fontSize: 12,
    color: "#9E9E9E",
    backgroundColor: "transparent",
    paddingTop: 4
  }
});

export default CupertinoFooter1;
