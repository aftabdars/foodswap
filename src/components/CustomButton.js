import React from "react";
import { TouchableHighlight,TouchableOpacity, Text,View, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

const CustomButton = ({ title, onPress, style,iconColor,icon }) => {
    return (
       <TouchableHighlight
      style={[styles.button, style]}
      onPress={onPress}
      underlayColor="rgba(0, 0, 0, 0.1)" // Change the color on touch
    >
      <View style={styles.buttonContent}>
        <Icon name={icon} color={iconColor} style={styles.icon}/>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};
  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      borderRadius: 8,
      flexDirection: "row",
      marginBottom: 10,
      marginRight:125,
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 16,
      color: "black",
      marginRight: 10,
    },
    icon: {
      marginRight:10,
    },
  });
  
  export default CustomButton;