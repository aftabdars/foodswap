import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import { useFonts } from 'expo-font';
import { useTheme } from '@react-navigation/native';

function Forgot({navigation}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [loaded] = useFonts({
    'abeezee-regular': require('../assets/fonts/abeezee-regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  

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
        placeholder="Email@xyz.com"
        style={styles.emailinput}
      ></MaterialFixedLabelTextbox>
      <MaterialButtonSuccess
        style={styles.nextbtn}
        onPress={()=>{navigation.navigate('Forgot2')}}
      >Next</MaterialButtonSuccess>
      <Text style={styles.errormsg}>
        Sorry that email doesn&#39;t match an account
      </Text>
    </View>
  );
}

function createStyles(colors) {
  return (
    {
      container: {
        flex: 1,
        backgroundColor: colors.background
      },
      locklogo: {
        width: 219,
        height: 219,
        marginTop: 97,
        marginLeft: 78
      },
      loremIpsum: {
        fontFamily: "abeezee-regular",
        color: colors.foreground,
        fontSize: 24,
        marginTop: 62,
        alignSelf: "center"
      },
      loremIpsum2: {
        fontFamily: "roboto-regular",
        color: colors.foreground,
        marginTop: 14,
        marginLeft: 95
      },
      emailinput: {
        height: 43,
        width: 278,
        backgroundColor: colors.background2,
        color: colors.foreground,
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
        color: colors.error,
        marginTop: -69,
        marginLeft: 57
      }
    }
  )
}
export default Forgot;
