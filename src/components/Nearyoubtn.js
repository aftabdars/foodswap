import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";

function Nearyoubtn(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <View style={styles.group}>
        <Image
          source={require("../assets/images/image_2023-10-27_183534741.png")}
          resizeMode="contain"
          style={styles.image}
        ></Image>
        <Text style={styles.free}>Free</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9
  },
  group: {
    width: 96,
    height: 121,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 22
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 64
  },
  free: {
    fontFamily: "roboto-regular",
    color: "#121212"
  }
});

export default Nearyoubtn;
