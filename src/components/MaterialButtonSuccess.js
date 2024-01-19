import React, { Component, useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { ThemeContext, getColors } from "../assets/Theme";

function MaterialButtonSuccess(props) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handlePress = () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);

      props.onPress && props.onPress();

      // Lock will release after 3 seconds
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, props.disabled && { backgroundColor: colors.background2 } || { backgroundColor: colors.highlight2 }, props.style]}
      onPress={handlePress}
      disabled={props.disabled}
    >
      <Text 
        style={[styles.caption, props.disabled && {color: colors.background} || {color: colors.foreground}, props.captionStyle]}
      >
        {props.children}
      </Text>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.highlight2,
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
      //minWidth: 88,
      paddingLeft: 16,
      paddingRight: 16
    },
    caption: {
      color: colors.foreground,
      fontWeight: 'bold',
      fontSize: 14
    }
  })
};

export default MaterialButtonSuccess;
