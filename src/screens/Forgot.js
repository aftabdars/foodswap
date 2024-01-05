import React, { useContext, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import { useFonts } from 'expo-font';
import { ThemeContext, getColors } from '../assets/Theme';
import { postForgotPassword } from "../api/backend/Auth";
import { extractErrorMessage } from "../api/backend/utils/Utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function Forgot({ navigation }) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);
  // States
  const [email, setEmail] = useState();
  const [showError, setShowError] = useState();

  const [loaded] = useFonts({
    'abeezee-regular': require('../assets/fonts/abeezee-regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const handlePress = async () => {
    if (!email) {
      setShowError("Please enter the email");
      return;
    }
    await postForgotPassword({ email: email })
      .then(response => {
        console.log(response.data);

        navigation.navigate('Forgot2');
      })
      .catch(error => {
        setShowError(extractErrorMessage(error.response? error.response.data: 'Network Error'));
      })
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image
        source={require("../assets/images/lock.png")}
        resizeMode="contain"
        style={styles.locklogo}
      ></Image>
      <Text style={styles.loremIpsum}>Forgot Your Password?</Text>
      <Text style={styles.loremIpsum2}>Please enter your email below</Text>
      <MaterialFixedLabelTextbox
        placeholder="Email@xyz.com"
        style={styles.emailinput}
        onChangeText={(text) => setEmail(text)}
      ></MaterialFixedLabelTextbox>
      {showError &&
        <Text style={styles.errormsg}>
          {showError}
        </Text>
      }
      <MaterialButtonSuccess
        style={styles.nextbtn}
        onPress={handlePress}
      >Next</MaterialButtonSuccess>
    </KeyboardAwareScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    locklogo: {
      width: 219,
      height: 219,
      marginTop: 97,
      marginLeft: 78
    },
    loremIpsum: {
      fontFamily: "abeezee-regular",
      color: colors.foreground,
      fontSize: 24,
      marginTop: 62,
      alignSelf: "center"
    },
    loremIpsum2: {
      fontFamily: "roboto-regular",
      color: colors.foreground,
      marginTop: 14,
      marginLeft: 95
    },
    emailinput: {
      height: 43,
      width: 278,
      backgroundColor: colors.background2,
      color: colors.foreground,
      borderRadius: 9,
      marginTop: 47,
      marginLeft: 49
    },
    nextbtn: {
      height: 36,
      width: 100,
      borderRadius: 9,
      marginTop: 49,
      marginLeft: 138
    },
    errormsg: {
      fontFamily: "roboto-regular",
      color: colors.error,
      marginTop: 20,
      textAlign: "center"
    }
  }
  )
}
export default Forgot;
