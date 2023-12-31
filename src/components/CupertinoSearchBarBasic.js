import React, { useContext } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemeContext, getColors } from '../assets/Theme';


function CupertinoSearchBarBasic(props) {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

  return (
    <TouchableOpacity onPress={props.onPressFirst}>
    <View style={[styles.container, props.style]}>
      <View
        style={[
          styles.inputBox,
          {
            backgroundColor: colors.background2 || "#EFEFF4"
          }
        ]}
      >
        
        <Icon name="magnify" style={styles.inputLeftIcon}></Icon>
        <TextInput
          placeholder={props.inputStyle || "Search"}
          placeholderTextColor={colors.foreground}
          style={styles.inputStyle}
          onPressIn={props.onPressIn}
          onChangeText={props.onChangeText}
          editable={props.editable} 
          selectTextOnFocus={props.editable}
        ></TextInput>
        
      </View>
    </View>
    </TouchableOpacity>
  );
}

function createStyles (colors) {
  return StyleSheet.create({
      container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: 18
      },
      inputBox: {
        flex: 1,
        flexDirection: "row",
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background2,
      },
      inputLeftIcon: {
        color: colors.foreground,
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
        color: colors.foreground,
        flex: 1
      }
    }
  )
}

export default CupertinoSearchBarBasic;
