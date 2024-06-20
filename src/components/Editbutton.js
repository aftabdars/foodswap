import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

function Editbutton(props) {
  const colors = props.colors;
  const styles = createStyles(colors);

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
      <Icon name="settings" color={colors && colors.foreground} style={styles.icon}></Icon>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 5
    },
    icon: {
      fontSize: 24
    }
  });
}

export default Editbutton;
