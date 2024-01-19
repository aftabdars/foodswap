import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import { getColors, ThemeContext } from "../assets/Theme";
import { setUserTheme } from "../storage/UserSettings";
import { Button } from "react-native-elements";
import { logoutUser } from "../utils/Auth";
import { useLoading } from "../assets/LoadingContext";


function Settings() {
  // Theme
  const {
    theme,
    setTheme
  } = useContext(ThemeContext);
  const colors = getColors(theme);
  const styles = createStyles(colors);
  // Loading
  const { showLoading, hideLoading } = useLoading();

  // States
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const navigation = useNavigation();

  const handleSwitchTheme = (toTheme) => {
    // Save user theme settings in cache and storage (It should not be asynchrouns )
    setUserTheme(toTheme);
    // Updates user theme in real-time by changing the theme State
    setTheme(toTheme);
  };

  const helpPressed = () => {
    console.log('Help Pressed');
  };

  const feedbackPressed = () => {
    navigation.navigate('UserFeedback');
  };

  const bugReportPressed = () => {
    navigation.navigate('BugReport');
  };

  const logoutPressed = () => {
    logoutUser(navigation, showLoading, hideLoading);
  };

  const SettingsBox = (props) => {
    return (
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsHeading}>{props.heading}</Text>
        {props.children}
      </View>
    )
  };

  const SettingsRow = (props) => {
    return (
      <View style={styles.settingsRowContainer}>
        {props.children}
      </View>
    )
  }

  const SettingsRowButton = (props) => {
    return (
      <Button
        title={props.buttonText}
        color={colors.background2}
        buttonStyle={styles.settingsRowButton}
        titleStyle={styles.settingText}
        onPress={props.onPress}
      />
    )
  }

  return (
    <View style={styles.container}>
      <SettingsBox
        heading={'General'}
      >
        <SettingsRow>
          <Text style={styles.settingText}>Push Notifications</Text>
          <Switch
            value={notificationEnabled}
            onValueChange={() => setNotificationEnabled(!notificationEnabled)}
          />
        </SettingsRow>
        <SettingsRow>
          <Text style={styles.settingText}>Theme</Text>
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
        </SettingsRow>
      </SettingsBox>

      <SettingsBox
        heading={'Other'}
      >
        <SettingsRowButton
          buttonText={'Help'}
          onPress={helpPressed}
        />
        <SettingsRowButton
          buttonText={'Give Feedback'}
          onPress={feedbackPressed}
        />
        <SettingsRowButton
          buttonText={'Bug Report'}
          onPress={bugReportPressed}
        />
        <SettingsRowButton
          buttonText={'Logout'}
          onPress={logoutPressed}
        />
      </SettingsBox>
      <Text style={styles.versionText}>
        FoodSwap v0.1.0
      </Text>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    settingsContainer: {
      marginVertical: 10,
      backgroundColor: colors.background2,
      borderRadius: 25,
      padding: 15
    },
    settingsHeading: {
      color: colors.foreground,
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 10
    },
    settingsRowContainer: {
      backgroundColor: colors.background2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.foreground,
      marginVertical: 5,
      paddingBottom: 5
    },
    settingsRowButton: {
      backgroundColor: colors.background2,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      verticalAlign: 'middle',
      width: '100%',
      paddingVertical: 15
    },
    settingText: {
      color: colors.foreground,
      fontSize: 16
    },
    versionText: {
      color: colors.foreground,
      fontSize: 16,
      alignSelf: 'center',
      marginTop: 10
    },
    themePicker: {
      height: '40%',
      width: '50%',
      backgroundColor: colors.background,
      color: colors.foreground,
    },
    pickerItem: {
      backgroundColor: colors.background,
      color: colors.foreground
    },
  })
}


export default Settings;
