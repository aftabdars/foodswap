import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import { getColors, ThemeContext } from "../assets/Theme";
import { setUserTheme } from "../storage/UserSettings";


function Settings() {
  // Theme
  const {
    theme,
    setTheme
  } = useContext(ThemeContext);
  const colors = getColors(theme);
  const styles = createStyles(colors);

  // States
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const navigation = useNavigation();

  const handleSwitchTheme = (toTheme) => {
    // Save user theme settings in cache and storage (It should not be asynchrouns )
    setUserTheme(toTheme);
    // Updates user theme in real-time by changing the theme State
    setTheme(toTheme);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subHeading}>Display and notification</Text>
      <View style={styles.parentView}>
        <Text style={[styles.childText, styles.commonStyle]}>Notification</Text>
        <Text style={[styles.notification, { color: colors.foreground }]}>You will receive app notifications.</Text>
        <Text style={[styles.childText1, styles.commonStyle]}>Theme</Text>
        <Text style={[styles.theme, { color: colors.foreground }]}>DarkMode preference.</Text>
        <Text style={[styles.childText2, styles.commonStyle]}>Privacy Notice</Text>

        <Switch style={[styles.childText3, styles.commonStyle]}
          value={notificationEnabled}
          onValueChange={() => setNotificationEnabled(!notificationEnabled)}
        />
        <View style={[styles.childText4, styles.commonStyle, { flex: 1, flexDirection: 'row', justifyContent: "space-between", width: 80, marginLeft: 260 }]}>
          <Picker
            placeholder='Select Theme'
            style={styles.themePicker}
            dropdownIconColor={colors.foreground}
            dropdownIconRippleColor={colors.highlight2}
            selectedValue={theme}
            onValueChange={(itemValue, itemIndex) => handleSwitchTheme(itemValue)}
          >
            <Picker.Item label="System" value={"auto"} style={styles.pickerItem} />
            <Picker.Item label="Light" value={"light"} style={styles.pickerItem} />
            <Picker.Item label="Dark" value={"dark"} style={styles.pickerItem} />
            <Picker.Item label="Christmas" value={"christmas"} style={styles.pickerItem} />
          </Picker>
        </View>
      </View>
    </View>

  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      flexDirection: 'row',

    },
    subHeading: {
      position: 'absolute',
      color: colors.foreground,
      fontWeight: '800',
      marginLeft: 45,
      marginTop: 20
    },
    parentView: {
      position: 'absolute',
      width: "95%",
      height: 230,
      marginTop: 50,
      marginHorizontal: 10,
      backgroundColor: colors.background2,
      marginLeft: 10,
      borderRadius: 25,
    },
    childText: {
      color: colors.foreground,
      borderBottomWidth: 1,
      borderBottomLeftRadius: -1,
      borderBottomRightRadius: 40,
      borderBottomColor: colors.foreground,
      borderRadius: 100,
      marginTop: 5,
      marginLeft: 15
    },
    childText1: {
      color: colors.foreground,
      borderBottomWidth: 1,
      borderBottomLeftRadius: -1,
      borderBottomRightRadius: 40,
      borderBottomColor: colors.foreground,
      borderRadius: 100,
      marginLeft: 15,
      marginTop: -15
    },
    childText2: {
      color: colors.foreground,
      marginLeft: 15,
      marginTop: -10
    },
    childText3: {
      position: 'absolute',
      marginLeft: 310,
      marginTop: 0,
    },
    themePicker: {
      height: '40%',
      width: '150%',
      backgroundColor: colors.background,
      color: colors.foreground,
      marginBottom: 20,
    },
    pickerItem: {
      backgroundColor: colors.background,
      color: colors.foreground
    },
    childText4: {
      position: 'absolute',
      right: 56,
      marginTop: 63,

    },
    commonStyle: {
      fontSize: 20,
      //padding:25,
      paddingVertical: 25,
    },
    notification: {
      position: 'absolute',
      marginTop: 60,
      marginLeft: 12
    },
    theme: {
      position: 'absolute',
      marginTop: 123,
      marginLeft: 12,
    },
  })
}


export default Settings;
