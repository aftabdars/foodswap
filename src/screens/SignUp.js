import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialRightIconTextbox1 from "../components/MaterialRightIconTextbox1";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialButtonWithVioletText1 from "../components/MaterialButtonWithVioletText1";

function SignUp(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SIGN UP</Text>
      <View style={styles.group}>
        <MaterialFixedLabelTextbox
          label="FixedLabel"
          label="Username"
          style={styles.usernameinput}
        ></MaterialFixedLabelTextbox>
        <MaterialFixedLabelTextbox
          label="Email@abc.com"
          style={styles.emailinput}
        ></MaterialFixedLabelTextbox>
        <MaterialRightIconTextbox1
          inputStyle="Label"
          inputStyle="    Password"
          style={styles.passinput}
        ></MaterialRightIconTextbox1>
        <MaterialRightIconTextbox1
          inputStyle="Label"
          inputStyle="    Retype Password"
          style={styles.passinput2}
        ></MaterialRightIconTextbox1>
      </View>
      <MaterialButtonSuccess
        caption="Sign Up"
        style={styles.materialButtonSuccess1}
      ></MaterialButtonSuccess>
      <View style={styles.materialButtonWithVioletText1Stack}>
        <MaterialButtonWithVioletText1
          button="Sign In"
          style={styles.materialButtonWithVioletText1}
        ></MaterialButtonWithVioletText1>
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
  materialButtonWithVioletText1Stack: {
    width: 238,
    height: 36,
    marginTop: 76,
    marginLeft: 79
  }
});

export default SignUp;
