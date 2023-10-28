import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

function MaterialSpinner(props) {
  return (
    <View style={[styles.container, props.style]}>
      <ActivityIndicator style={styles.activityIndicator1}></ActivityIndicator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  activityIndicator1: {
    width: 22,
    height: 22
  }
});

export default MaterialSpinner;
