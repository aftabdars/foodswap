import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialRightIconTextbox from "../components/MaterialRightIconTextbox";
import MaterialButtonWithVioletText from "../components/MaterialButtonWithVioletText";
import MaterialButtonWithVioletText1 from "../components/MaterialButtonWithVioletText1";

function Login(props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        resizeMode="contain"
        style={styles.foodswaplogo}
      ></Image>
      <MaterialFixedLabelTextbox
        label="FixedLabel"
        label="Username"
        style={styles.usernameinput}
      ></MaterialFixedLabelTextbox>
      <MaterialButtonSuccess
        caption="BUTTON"
        caption="Login"
        style={styles.loginbtn}
      ></MaterialButtonSuccess>
      <MaterialRightIconTextbox
        inputStyle="Label"
        inputStyle="    Password"
        style={styles.passwordinput}
      ></MaterialRightIconTextbox>
      <MaterialButtonWithVioletText
        caption="Forgot Password?"
        style={styles.forgotpasswordbtn}
      ></MaterialButtonWithVioletText>
      <View style={styles.notAUserRow}>
        <Text style={styles.notAUser}>Not a user ?</Text>
        <MaterialButtonWithVioletText1
          caption="BUTTON"
          button="Sign up"
          style={styles.signupbtn}
        ></MaterialButtonWithVioletText1>
      </View>
    </View>
  );
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
    width: 100,
    marginTop: 50,
    marginLeft: 138
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
    marginTop: 40,
    marginLeft: 114,
    marginRight: 87
  }
});

export default Login;
