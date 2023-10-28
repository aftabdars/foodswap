import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function Categorybutton(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <Icon name="ios-trash" style={styles.icon}></Icon>
      <Text style={styles.category}>Category</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    color: "#000",
    fontSize: 24,
    height: 26,
    width: 13
  },
  category: {
    fontFamily: "roboto-regular",
    color: "#121212"
  }
});

export default Categorybutton;
