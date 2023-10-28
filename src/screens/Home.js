import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import CupertinoFooter1 from "../components/CupertinoFooter1";
import MaterialButtonShare from "../components/MaterialButtonShare";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import MaterialSpinner from "../components/MaterialSpinner";
import Categorybutton from "../components/Categorybutton";
import Nearyoubtn from "../components/Nearyoubtn";

function Home(props) {
  return (
    <View style={styles.container}>
      <CupertinoFooter1 style={styles.cupertinoFooter1}></CupertinoFooter1>
      <View style={styles.hiAftabRow}>
        <Text style={styles.hiAftab}>Hi, Aftab</Text>
        <MaterialButtonShare style={styles.logoButton}></MaterialButtonShare>
      </View>
      <CupertinoSearchBarBasic
        inputStyle="Search"
        inputBox="#EFEFF4"
        inputStyle="Search for food"
        inputBox="rgba(255,255,255,1)"
        style={styles.foodsearch}
      ></CupertinoSearchBarBasic>
      <MaterialSpinner style={styles.materialSpinner}></MaterialSpinner>
      <Text style={styles.categories}>Categories</Text>
      <View style={styles.categorybuttons}>
        <Categorybutton style={styles.categorybutton}></Categorybutton>
        <Categorybutton style={styles.categorybutton1}></Categorybutton>
        <Categorybutton style={styles.categorybutton3}></Categorybutton>
        <Categorybutton style={styles.categorybutton2}></Categorybutton>
      </View>
      <Text style={styles.nearYou}>Near You</Text>
      <View style={styles.nearyoubtn1Row}>
        <Nearyoubtn style={styles.nearyoubtn1}></Nearyoubtn>
        <Nearyoubtn style={styles.nearyoubtn2}></Nearyoubtn>
      </View>
      <View style={styles.nearyoubtn3Row}>
        <Nearyoubtn style={styles.nearyoubtn3}></Nearyoubtn>
        <Nearyoubtn style={styles.nearyoubtn4}></Nearyoubtn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(215,215,215,1)"
  },
  cupertinoFooter1: {
    height: 49,
    width: 375,
    marginTop: 725
  },
  hiAftab: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 24,
    marginTop: 9
  },
  logoButton: {
    height: 46,
    width: 46,
    marginLeft: 183
  },
  hiAftabRow: {
    height: 46,
    flexDirection: "row",
    marginTop: -717,
    marginLeft: 29,
    marginRight: 23
  },
  foodsearch: {
    height: 44,
    width: 323,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 9,
    marginTop: 9,
    marginLeft: 29
  },
  materialSpinner: {
    width: 323,
    height: 31,
    marginLeft: 29
  },
  categories: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    marginTop: 23,
    marginLeft: 29
  },
  categorybuttons: {
    width: 323,
    height: 61,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 26
  },
  categorybutton: {
    height: 61,
    width: 63
  },
  categorybutton1: {
    height: 61,
    width: 63
  },
  categorybutton3: {
    height: 61,
    width: 63
  },
  categorybutton2: {
    height: 61,
    width: 63
  },
  nearYou: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    marginTop: 56,
    marginLeft: 29
  },
  nearyoubtn1: {
    width: 139,
    height: 130
  },
  nearyoubtn2: {
    width: 139,
    height: 130,
    marginLeft: 23
  },
  nearyoubtn1Row: {
    height: 130,
    flexDirection: "row",
    marginTop: 14,
    marginLeft: 29,
    marginRight: 45
  },
  nearyoubtn3: {
    width: 139,
    height: 130
  },
  nearyoubtn4: {
    width: 139,
    height: 130,
    marginLeft: 22
  },
  nearyoubtn3Row: {
    height: 130,
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 29,
    marginRight: 46
  }
});

export default Home;
