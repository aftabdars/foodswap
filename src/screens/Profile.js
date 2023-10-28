import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import Editbutton from "../components/Editbutton";
import MaterialButtonWithVioletText1 from "../components/MaterialButtonWithVioletText1";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import EntypoIcon from "react-native-vector-icons/Entypo";
import OcticonsIcon from "react-native-vector-icons/Octicons";

function Profile(props) {
  return (
    <View style={styles.container}>
      <View style={styles.profilecontainer}>
        <View style={styles.imageStack}>
          <Image
            source={require("../assets/images/image_(1).png")}
            resizeMode="contain"
            style={styles.image}
          ></Image>
          <Editbutton style={styles.cupertinoButtonDelete}></Editbutton>
        </View>
        <Text style={styles.aftabHussain}>Aftab Hussain</Text>
      </View>
      <MaterialButtonWithVioletText1
        button="Log out"
        style={styles.materialButtonWithVioletText1}
      ></MaterialButtonWithVioletText1>
      <Text style={styles.details}>Details</Text>
      <View style={styles.group5}>
        <View style={styles.group}>
          <FontAwesomeIcon name="phone" style={styles.icon}></FontAwesomeIcon>
          <Text style={styles.aftabHussain1}>+923173820608</Text>
        </View>
        <View style={styles.group2}>
          <EntypoIcon name="location-pin" style={styles.icon2}></EntypoIcon>
          <Text style={styles.b26ShabazTown}>B-26, Shabaz Town</Text>
        </View>
        <View style={styles.group3}>
          <EntypoIcon name="email" style={styles.icon3}></EntypoIcon>
          <Text style={styles.aftabdarsGmailCom}>aftabdars@gmail.com</Text>
        </View>
        <View style={styles.group4}>
          <OcticonsIcon name="key" style={styles.icon4}></OcticonsIcon>
          <Text style={styles.aftabdarsGmailCom1}>*******************</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(215,215,215,1)",
    opacity: 0.77
  },
  profilecontainer: {
    width: 375,
    height: 378,
    backgroundColor: "rgba(243,114,76,1)",
    borderRadius: 100,
    marginTop: -55
  },
  image: {
    top: 0,
    left: 0,
    width: 155,
    height: 155,
    position: "absolute",
    borderRadius: 100
  },
  cupertinoButtonDelete: {
    height: 44,
    width: 44,
    position: "absolute",
    left: 137,
    top: 0
  },
  imageStack: {
    width: 181,
    height: 155,
    marginTop: 112,
    marginLeft: 110
  },
  aftabHussain: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 22,
    textAlign: "center",
    marginTop: 7,
    marginLeft: 118
  },
  materialButtonWithVioletText1: {
    height: 36,
    width: 100,
    marginTop: 352,
    marginLeft: 138
  },
  details: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    marginTop: -365,
    marginLeft: 42
  },
  group5: {
    width: 265,
    height: 237,
    justifyContent: "space-between",
    marginTop: 33,
    marginLeft: 55
  },
  group: {
    width: 166,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  icon: {
    color: "rgba(243,114,76,1)",
    fontSize: 40
  },
  aftabHussain1: {
    fontFamily: "roboto-700",
    color: "rgba(18,18,18,1)",
    fontSize: 15,
    textAlign: "center"
  },
  group2: {
    width: 191,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  icon2: {
    color: "rgba(243,114,76,1)",
    fontSize: 40
  },
  b26ShabazTown: {
    fontFamily: "roboto-700",
    color: "rgba(18,18,18,1)",
    fontSize: 15,
    textAlign: "center"
  },
  group3: {
    width: 211,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  icon3: {
    color: "rgba(243,114,76,1)",
    fontSize: 40
  },
  aftabdarsGmailCom: {
    fontFamily: "roboto-700",
    color: "rgba(18,18,18,1)",
    fontSize: 15,
    textAlign: "center"
  },
  group4: {
    width: 191,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  icon4: {
    color: "rgba(243,114,76,1)",
    fontSize: 40
  },
  aftabdarsGmailCom1: {
    fontFamily: "roboto-700",
    color: "rgba(18,18,18,1)",
    fontSize: 15,
    textAlign: "center"
  }
});

export default Profile;
