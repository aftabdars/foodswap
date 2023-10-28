import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialRightIconTextbox1 from "../components/MaterialRightIconTextbox1";

function Forgot3(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.congratulations}>Congratulations!</Text>
      <Text style={styles.errormsg}>
        Sorry the two passwords don&#39;t match
      </Text>
      <MaterialButtonSuccess
        caption="Next"
        style={styles.nextbtn}
      ></MaterialButtonSuccess>
      <Text style={styles.loremIpsum3}>Please enter the new Password</Text>
      <Image
        source={require("../assets/images/unlock.png")}
        resizeMode="contain"
        style={styles.image2}
      ></Image>
      <View style={styles.group}>
        <MaterialRightIconTextbox1
          inputStyle="Label"
          inputStyle="Password"
          style={styles.passinput}
        ></MaterialRightIconTextbox1>
        <MaterialRightIconTextbox1
          inputStyle="Label"
          inputStyle="Retype Password"
          style={styles.passinput2}
        ></MaterialRightIconTextbox1>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(215,215,215,1)"
  },
  congratulations: {
    fontFamily: "abeezee-regular",
    color: "rgba(39,45,47,1)",
    fontSize: 24,
    marginTop: 378,
    marginLeft: 93
  },
  errormsg: {
    fontFamily: "roboto-regular",
    color: "rgba(254,114,76,1)",
    marginTop: 188,
    marginLeft: 70
  },
  nextbtn: {
    height: 36,
    width: 100,
    borderRadius: 9,
    marginTop: 25,
    marginLeft: 135
  },
  loremIpsum3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: -257,
    marginLeft: 90
  },
  image2: {
    width: 223,
    height: 223,
    marginTop: -334,
    marginLeft: 74
  },
  group: {
    width: 283,
    height: 96,
    justifyContent: "space-between",
    marginTop: 156,
    marginLeft: 44
  },
  passinput: {
    height: 43,
    width: 283,
    backgroundColor: "rgba(230, 230, 230,1)",
    borderRadius: 9
  },
  passinput2: {
    height: 43,
    width: 283,
    backgroundColor: "rgba(230, 230, 230,1)",
    borderRadius: 9
  }
});

export default Forgot3;
