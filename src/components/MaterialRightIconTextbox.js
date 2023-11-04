import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function MaterialRightIconTextbox(props) {
  const [secure, setSecure] = React.useState(props.secure);

  return (
    <View style={[styles.container, props.style]}>
      <TextInput
        secureTextEntry={!secure}
        placeholder={props.placeholder || "Label"}
        style={styles.inputStyle}
      ></TextInput>
      <Icon name="eye" style={styles.iconStyle} onPress={() => setSecure(!secure)} ></Icon>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16
  },
  inputStyle: {
    color: "#000",
    paddingRight: 16,
    fontSize: 16,
    alignSelf: "stretch",
    flex: 1,
    lineHeight: 16,
    paddingTop: 14,
    paddingBottom: 8,
    paddingLeft: 0
  },
  iconStyle: {
    color: "#616161",
    fontSize: 24,
    paddingRight: 8
  }
});

export default MaterialRightIconTextbox;
