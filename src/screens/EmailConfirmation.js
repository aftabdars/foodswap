import React, { useState } from "react";
import { StyleSheet, View, Image, Text, KeyboardAvoidingView } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import { useFonts } from 'expo-font';
import { postVerifyAccount } from "../api/backend/Auth";
import Colors from '../assets/Colors'

function EmailConfirmation({navigation}) {
  const [code, setCode] = useState();
  const [showError, setShowError] = useState();

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
        errorMessage = error.response.data[Object.keys(error.response.data)[0]];
        setShowError(errorMessage);
      });
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image
        source={require("../assets/images/key.png")}
        resizeMode="contain"
        style={styles.keylogo}
      ></Image>
      <Text style={styles.loremIpsum1}>Your account has been created</Text>
      <Text style={styles.loremIpsum2}>
        Please enter the activation code we just emailed you
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  keylogo: {
    width: 244,
    height: 244,
    marginTop: 91,
    alignSelf: "center"
  },
  loremIpsum1: {
    fontFamily: "abeezee-regular",
    color: Colors.foreground,
    fontSize: 24,
    marginTop: 43,
    alignSelf: "center"
  },
  loremIpsum2: {
    fontFamily: "roboto-regular",
    color: Colors.foreground,
    marginTop: 16,
    marginLeft: 0,
    textAlign: "center"
  },
  materialFixedLabelTextbox1: {
    height: 43,
    width: 278,
    backgroundColor: Colors.background,
    color: Colors.foreground,
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
    color: Colors.error,
    marginTop: -69,
    marginLeft: 97
  }
});

export default EmailConfirmation;
