import React, { Component } from "react";
import { StyleSheet, TextInput, KeyboardAvoidingView } from "react-native";

function MaterialFixedLabelTextbox(props) {
  return (
    <KeyboardAvoidingView style={[styles.container, props.style]}>
      <TextInput
        placeholder={props.placeholder || undefined}
        placeholderTextColor={props.style.color}
        style={[styles.inputStyle, {color: props.style.color}]}
        onChangeText={props.onChangeText || undefined}
      ></TextInput>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
    flexDirection: "row",
    paddingLeft: 16
  },
  label: {
    fontSize: 16,
    lineHeight: 16,
    paddingTop: 16,
    paddingBottom: 8,
    opacity: 0.5,
    alignSelf: "flex-start"
  },
  inputStyle: {
    paddingRight: 5,
    fontSize: 16,
    alignSelf: "stretch",
    flex: 1,
    lineHeight: 16,
    paddingTop: 14,
    paddingBottom: 8,
    paddingLeft: 0
  }
});

export default MaterialFixedLabelTextbox;
