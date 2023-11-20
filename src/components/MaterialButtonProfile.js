import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
function MaterialButtonProfile(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
      <Image
            source={{uri: props.userData.profile_picture} || require("../assets/images/image_(1).png")}
            resizeMode="contain"
            style={styles.icon}
          ></Image>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    shadowColor: "#111",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.2,
    elevation: 2,
    minWidth: 40,
    minHeight: 40,
    width: 55,
    height: 55,
  },
  icon: {
    width: '100%',
    height: '100%',
    alignSelf: "center",
  }
});

export default MaterialButtonProfile;
