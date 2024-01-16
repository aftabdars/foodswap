import React, { useContext } from "react";
import { TouchableHighlight, Text,View, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { ThemeContext, getColors } from "../assets/Theme";

const SidebarButton = ({ title, onPress, style, icon, iconType, iconColor }) => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    return (
      <TouchableHighlight
        style={[styles.button, style]}
        onPress={onPress}
        underlayColor={colors.highlight2} // Change the color on touch
      >
      <View style={styles.buttonContent}>
        <Icon name={icon} color={colors.foreground} style={styles.icon} type={iconType}/>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};

function createStyles(colors) {
  return StyleSheet.create({
    button: {
      alignItems: "left",
      justifyContent: "left",
      padding: 12,
      borderRadius: 8,
      flexDirection: "row",
      marginBottom: 0,
      width: '100%'
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "left",
      justifyContent: "left",
    },
    title: {
      fontSize: 16,
      color: colors.foreground,
      marginRight: 10,
    },
    icon: {
      marginRight: 10,
    },
  });
}
  
export default SidebarButton;