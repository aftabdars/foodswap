import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";

function Forgot(props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/lock.png")}
        resizeMode="contain"
        style={styles.locklogo}
      ></Image>
      <Text style={styles.loremIpsum}>Forgot Your Password?</Text>
      <Text style={styles.loremIpsum2}>Please enter your email below</Text>
      <MaterialFixedLabelTextbox
        label="Email@xyz.com"
        style={styles.emailinput}
      ></MaterialFixedLabelTextbox>
      <MaterialButtonSuccess
        caption="Next"
        style={styles.nextbtn}
      ></MaterialButtonSuccess>
      <Text style={styles.errormsg}>
        Sorry that email doesn&#39;t match an account
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(215,215,215,1)"
  },
  locklogo: {
    width: 219,
    height: 219,
    marginTop: 97,
    marginLeft: 78
  },
  loremIpsum: {
    fontFamily: "abeezee-regular",
    color: "rgba(39,45,47,1)",
    fontSize: 24,
    marginTop: 62,
    alignSelf: "center"
  },
  loremIpsum2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 14,
    marginLeft: 95
  },
  emailinput: {
    height: 43,
    width: 278,
    backgroundColor: "rgba(230, 230, 230,1)",
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
    color: "rgba(254,114,76,1)",
    marginTop: -69,
    marginLeft: 57
  }
});

export default Forgot;
