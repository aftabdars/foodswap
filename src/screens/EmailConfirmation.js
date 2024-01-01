import React, { useContext, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import { useFonts } from 'expo-font';
import { postVerifyAccount } from "../api/backend/Auth";
import { ThemeContext, getColors } from '../assets/Theme';
import { useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


function EmailConfirmation({navigation}) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  const [code, setCode] = useState();
  const [showError, setShowError] = useState();

  const route = useRoute();
  const fromLogin = route.params?.fromLogin;

  const [loaded] = useFonts({
    'roboto-regular': require('../assets/fonts/roboto-regular.ttf'),
    'abeezee-regular': require('../assets/fonts/abeezee-regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const onClickConfirm = () => {
    if (!code) {
      setShowError("Please fill out the code field");
    }
    else {
      postVerifyAccount({"code": code})
      .then(response => {
        console.log(response.status);
        console.log(response.data);
  
        if(response.status == 200) {
          navigation.navigate('Login');
        }
      })
      .catch(error => {
        console.log(error.response.status);
        console.log(error.response.data);
        setShowError(extractErrorMessage(error.response.data));
      });
    }
  }

  return (
    <KeyboardAwareScrollView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
      <Image
        source={require("../assets/images/key.png")}
        resizeMode="contain"
        style={styles.keylogo}
      ></Image>
      <Text style={styles.loremIpsum1}>
        {fromLogin ? 
          'Your account is not verified'
          :
          'Your account has been created'
        }
      </Text>
      <Text style={styles.loremIpsum2}>
        {
          fromLogin ?
          'Please enter the verification code we emailed you when you signed up'
          :
          'Please enter the verification code we just emailed you'
        }
      </Text>
      <MaterialFixedLabelTextbox
        label="000000"
        style={styles.materialFixedLabelTextbox1}
        onChangeText={(text) => setCode(text)}
      ></MaterialFixedLabelTextbox>
      <MaterialButtonSuccess
        style={styles.nextbtn}
        onPress={ onClickConfirm }
      >Confirm</MaterialButtonSuccess>
      {showError &&
        <Text style={styles.errormsg}>{ showError }</Text>
      }
    </KeyboardAwareScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 5
      },
      keylogo: {
        width: 244,
        height: 244,
        marginTop: 91,
        alignSelf: "center"
      },
      loremIpsum1: {
        fontFamily: "abeezee-regular",
        color: colors.foreground,
        fontSize: 24,
        marginTop: 43,
        alignSelf: "center"
      },
      loremIpsum2: {
        fontFamily: "roboto-regular",
        color: colors.foreground,
        marginTop: 16,
        marginLeft: 0,
        textAlign: "center"
      },
      materialFixedLabelTextbox1: {
        height: 43,
        width: 278,
        backgroundColor: colors.background2,
        color: colors.foreground,
        borderRadius: 9,
        marginTop: 45,
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
        marginTop: -69,
        textAlign: "center"
      }
    })
}
export default EmailConfirmation;
