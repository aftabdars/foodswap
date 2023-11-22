import React, { useContext } from "react";
import { View, Text, Image } from "react-native";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialRightIconTextbox from "../components/MaterialRightIconTextbox";
import { ThemeContext, getColors } from '../assets/Theme'

function Forgot3({navigation}) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.congratulations}>Congratulations!</Text>
      <Text style={styles.errormsg}>
        Sorry the two passwords don&#39;t match
      </Text>
      <MaterialButtonSuccess
        style={styles.nextbtn}
        onPress={()=>{navigation.navigate('Login')}}
      >Next</MaterialButtonSuccess>
      <Text style={styles.loremIpsum3}>Please enter the new Password</Text>
      <Image
        source={require("../assets/images/unlock.png")}
        resizeMode="contain"
        style={styles.image2}
      ></Image>
      <View style={styles.group}>
        <MaterialRightIconTextbox
          placeholder="Password"
          style={styles.passinput}
        ></MaterialRightIconTextbox>
        <MaterialRightIconTextbox
          placeholder="Retype Password"
          style={styles.passinput2}
        ></MaterialRightIconTextbox>
      </View>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background
      },
      congratulations: {
        fontFamily: "abeezee-regular",
        color: colors.foreground,
        fontSize: 24,
        marginTop: 378,
        marginLeft: 93
      },
      errormsg: {
        fontFamily: "roboto-regular",
        color: colors.error,
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
        color: colors.foreground,
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
        backgroundColor: colors.background2,
        color: colors.foreground,
        borderRadius: 9
      },
      passinput2: {
        height: 43,
        width: 283,
        backgroundColor: colors.background2,
        color: colors.foreground,
        borderRadius: 9
      }
    }
  )
}

export default Forgot3;
