import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialRightIconTextbox from "../components/MaterialRightIconTextbox";
import MaterialButtonWithVioletText from "../components/MaterialButtonWithVioletText";
import { useFonts } from 'expo-font';
import MaterialButtonWithOrangeText from "../components/MaterialButtonWithOrangeText";
import EventEmitter from "../assets/EventEmitter";

function Login({navigation}) {
  const [loaded] = useFonts({
    'roboto-regular': require('../assets/fonts/roboto-regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        resizeMode="contain"
        style={styles.foodswaplogo}
      ></Image>
      <MaterialFixedLabelTextbox
        placeholder="Username"
        style={styles.usernameinput}
      ></MaterialFixedLabelTextbox>
      <MaterialButtonSuccess
        caption="Login"
        style={styles.loginbtn}
        onPress={()=>{loginHandler({username: 'aftab', password: 'dars'})}}
      ></MaterialButtonSuccess>
      <MaterialRightIconTextbox
        placeholder="Password"
        style={styles.passwordinput}
      ></MaterialRightIconTextbox>
      <MaterialButtonWithVioletText
        caption="Forgot Password?"
        style={styles.forgotpasswordbtn}
        onPress={()=>{navigation.navigate('Forgot')}}
      ></MaterialButtonWithVioletText>
      <Text style={styles.errormsg}>
        Incorrect username or password
      </Text>
      <View style={styles.notAUserRow}>
        <Text style={styles.notAUser}>Not a user ?</Text>
        <MaterialButtonWithOrangeText
          caption="Sign Up"
          style={styles.signupbtn}
          onPress={()=>{navigation.navigate('SignUp')}}
        ></MaterialButtonWithOrangeText>
      </View>
    </View>
  );
}

function loginHandler (props) {
  if ((props.username == 'aftab') && (props.password == 'dars')) {
    EventEmitter.notify("onLogin", true)
  }
  else {
    EventEmitter.notify("onLogin", false)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(215,215,215,1)"
  },
  foodswaplogo: {
    width: 375,
    height: 375,
    marginTop: 58
  },
  usernameinput: {
    height: 43,
    width: 278,
    backgroundColor: "rgba(230, 230, 230,1)",
    borderRadius: 9,
    marginTop: 37,
    marginLeft: 49
  },
  loginbtn: {
    height: 36,
    width: 100,
    borderRadius: 9,
    marginTop: 68,
    marginLeft: 138
  },
  passwordinput: {
    height: 43,
    width: 278,
    borderRadius: 9,
    backgroundColor: "rgba(230, 230, 230,1)",
    marginTop: -93,
    marginLeft: 49
  },
  forgotpasswordbtn: {
    height: 36,
    width: 200,
    marginTop: 50,
    marginLeft: 88
  },
  notAUser: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 9
  },
  signupbtn: {
    height: 36,
    width: 100
  },
  notAUserRow: {
    height: 36,
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 114,
    marginRight: 87
  },
  errormsg: {
    fontFamily: "roboto-regular",
    color: "rgba(254,114,76,1)",
    marginTop: 20,
    marginRight: 15,
    textAlign: "center"
  },
});

export default Login;
