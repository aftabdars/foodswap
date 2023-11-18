import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from '../assets/Colors'

function CupertinoSearchBarBasic(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View
        style={[
          styles.inputBox,
          {
            backgroundColor: Colors.background2 || "#EFEFF4"
          }
        ]}
      >
        <Icon name="magnify" style={styles.inputLeftIcon}></Icon>
        <TextInput
          placeholder={props.inputStyle || "Search"}
          placeholderTextColor={Colors.foreground}
          style={styles.inputStyle}
        ></TextInput>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background2,
  },
  inputLeftIcon: {
    color: Colors.foreground,
    fontSize: 20,
    alignSelf: "center",
    paddingLeft: 5,
    paddingRight: 5
  },
  inputStyle: {
    height: 32,
    alignSelf: "flex-start",
    fontSize: 15,
    lineHeight: 15,
    color: Colors.foreground,
    flex: 1
  }
});

export default CupertinoSearchBarBasic;
