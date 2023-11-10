import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialRightIconTextbox from "../components/MaterialRightIconTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialButtonWithOrangeText from "../components/MaterialButtonWithOrangeText";
import { useFonts } from 'expo-font';

function SignUp({navigation}) {
  const [loaded] = useFonts({
    'roboto-regular': require('../assets/fonts/roboto-regular.ttf'),
    'roboto-700': require('../assets/fonts/roboto-700.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SIGN UP</Text>
      <View style={styles.group}>
        <MaterialFixedLabelTextbox
          placeholder="Username"
          style={styles.usernameinput}
        ></MaterialFixedLabelTextbox>
        <MaterialFixedLabelTextbox
          placeholder="abc@xyz.com"
          style={styles.emailinput}
        ></MaterialFixedLabelTextbox>
        <MaterialRightIconTextbox
          placeholder="Password"
          style={styles.passinput}
        ></MaterialRightIconTextbox>
        <MaterialRightIconTextbox
          placeholder="Retype Password"
          style={styles.passinput2}
        ></MaterialRightIconTextbox>
      </View>
      <MaterialButtonSuccess
        style={styles.materialButtonSuccess1}
        onPress={()=>{navigation.navigate('EmailConfirmation')}}
      >Sign Up</MaterialButtonSuccess>
      <View style={styles.alreadyContainer}>
        <MaterialButtonWithOrangeText
          caption="Sign In"
          style={styles.materialButtonWithVioletText1}
          onPress={()=>{navigation.navigate('Login')}}
        ></MaterialButtonWithOrangeText>
        <Text style={styles.notAUser1}>Already have an account?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(215,215,215,1)"
  },
  text: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 24,
    marginTop: 92,
    marginLeft: 49
  },
  group: {
    width: 278,
    height: 306,
    justifyContent: "space-between",
    marginTop: 64,
    marginLeft: 49
  },
  usernameinput: {
    height: 43,
    width: 278,
    backgroundColor: "rgba(230, 230, 230,1)",
    borderRadius: 9
  },
  emailinput: {
    height: 43,
    width: 278,
    backgroundColor: "rgba(230, 230, 230,1)",
    borderRadius: 9
  },
  passinput: {
    height: 43,
    width: 277,
    backgroundColor: "rgba(230, 230, 230,1)",
    borderRadius: 9
  },
  passinput2: {
    height: 43,
    width: 277,
    backgroundColor: "rgba(230, 230, 230,1)",
    borderRadius: 9
  },
  materialButtonSuccess1: {
    height: 36,
    width: 100,
    borderRadius: 9,
    marginTop: 46,
    marginLeft: 138
  },
  materialButtonWithVioletText1: {
    height: 36,
    width: 100,
    position: "absolute",
    left: 138,
    top: 0
  },
  notAUser1: {
    top: 9,
    left: 0,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  alreadyContainer: {
    width: 238,
    height: 36,
    marginTop: 76,
    marginLeft: 79,
    flexDirection: "column",
  }
});

export default SignUp;
