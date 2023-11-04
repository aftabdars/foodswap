import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import { useFonts } from 'expo-font';

function EmailConfirmation({navigation}) {
  const [loaded] = useFonts({
    'roboto-regular': require('../assets/fonts/roboto-regular.ttf'),
    'abeezee-regular': require('../assets/fonts/abeezee-regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
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
      ></MaterialFixedLabelTextbox>
      <MaterialButtonSuccess
        caption="Confirm"
        style={styles.nextbtn}
        onPress={()=>{navigation.navigate('Login')}}
      ></MaterialButtonSuccess>
      <Text style={styles.errormsg}>Sorry that&#39;s not the right code</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(215,215,215,1)"
  },
  keylogo: {
    width: 244,
    height: 244,
    marginTop: 91,
    alignSelf: "center"
  },
  loremIpsum1: {
    fontFamily: "abeezee-regular",
    color: "rgba(39,45,47,1)",
    fontSize: 24,
    marginTop: 43,
    alignSelf: "center"
  },
  loremIpsum2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 16,
    marginLeft: 0,
    textAlign: "center"
  },
  materialFixedLabelTextbox1: {
    height: 43,
    width: 278,
    backgroundColor: "rgba(230, 230, 230,1)",
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
    color: "rgba(254,114,76,1)",
    marginTop: -69,
    marginLeft: 97
  }
});

export default EmailConfirmation;
