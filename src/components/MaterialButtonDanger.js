import React, { Component, useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { ThemeContext, getColors } from "../assets/Theme";

function MaterialButtonDanger(props) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
      <Text style={styles.caption}>{props.children}</Text>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.error,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.35,
      shadowRadius: 5,
      elevation: 2,
      minWidth: 88,
      paddingLeft: 16,
      paddingRight: 16
    },
    caption: {
      color: colors.foreground,
      fontSize: 14
    }
  });
}

export default MaterialButtonDanger;
