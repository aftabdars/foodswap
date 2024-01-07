import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";


function MaterialSpinner(props) {
  const colors = props.colors;

  return (
    <View style={[styles.container, props.style]}>
      <ActivityIndicator color={colors.highlight2} style={styles.activityIndicator1}></ActivityIndicator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: '0%',
    alignSelf: 'center',
    alignItems: "center",
    justifyContent: "center"
  },
  activityIndicator1: {
    width: 32,
    height: 32,
  }
});

export default MaterialSpinner;
