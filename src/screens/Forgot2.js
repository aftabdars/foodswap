import React, { useContext } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import { ThemeContext, getColors } from '../assets/Theme';


function Forgot2({navigation}) {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/key.png")}
        resizeMode="contain"
        style={styles.keylogo}
      ></Image>
      <Text style={styles.loremIpsum1}>We found your account</Text>
      <Text style={styles.loremIpsum2}>
        Please enter the code we just emailed you
      </Text>
      <MaterialFixedLabelTextbox
        placeholder="000000"
        style={styles.materialFixedLabelTextbox1}
      ></MaterialFixedLabelTextbox>
      <MaterialButtonSuccess
        style={styles.nextbtn}
        onPress={()=>{navigation.navigate('Forgot3')}}
      >Next</MaterialButtonSuccess>
      <Text style={styles.errormsg}>Sorry that&#39;s not the right code</Text>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background
      },
      keylogo: {
        width: 244,
        height: 244,
        marginTop: 91,
        alignSelf: "center"
      },
      loremIpsum1: {
        fontFamily: "abeezee-regular",
        color: colors.foreground,
        fontSize: 24,
        marginTop: 43,
        alignSelf: "center"
      },
      loremIpsum2: {
        fontFamily: "roboto-regular",
        color: colors.foreground,
        marginTop: 16,
        marginLeft: 57
      },
      materialFixedLabelTextbox1: {
        height: 43,
        width: 278,
        backgroundColor: colors.background2,
        color: colors.foreground,
        borderRadius: 9,
        marginTop: 45,
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
        marginLeft: 97
      }
    }
  )
}
export default Forgot2;
