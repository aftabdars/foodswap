import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialRightIconTextbox from "../components/MaterialRightIconTextbox";
import { ThemeContext, getColors } from '../assets/Theme'
import { extractErrorMessage } from "../api/backend/utils/Utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import { updateResetPassword } from "../api/backend/Auth";

function Forgot3({ navigation }) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);
  // States
  const [password, setPassword] = useState();
  const [rePassword, setRePassword] = useState();
  const [showError, setShowError] = useState();

  const route = useRoute();

  const code = route.params?.code;
  const userID = route.params?.userID;

  const handlePress = async () => {
    if (userID && code) {
      if (!password || !rePassword) {
        setShowError('Please enter password in both fields');
        return;
      }
      else if (password !== rePassword) {
        setShowError('Passwords don\'t match');
        return;
      }
      await updateResetPassword(userID, { 
        code: code,
        password: password
      })
        .then(response => {
          console.log(response.data);
          navigation.navigate('Login');
        })
        .catch(error => {
          setShowError(extractErrorMessage(error.response? error.response.data: 'Network Error'));
        })
    }
    else {
      setShowError('Something went wrong');
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container2}>
      <Image
        source={require("../assets/images/unlock.png")}
        resizeMode="contain"
        style={styles.image2}
      ></Image>
      <Text style={styles.congratulations}>Congratulations!</Text>
      <Text style={styles.loremIpsum3}>Please enter the new Password</Text>
      <View style={styles.group}>
        <MaterialRightIconTextbox
          placeholder="Password"
          style={styles.passinput}
          onChangeText={(text) => setPassword(text)}
        ></MaterialRightIconTextbox>
        <MaterialRightIconTextbox
          placeholder="Retype Password"
          style={styles.passinput2}
          onChangeText={(text) => setRePassword(text)}
        ></MaterialRightIconTextbox>
      </View>
      {showError &&
        <Text style={styles.errormsg}>
          {showError}
        </Text>
      }
      <MaterialButtonSuccess
        style={styles.nextbtn}
        onPress={handlePress}
      >Next</MaterialButtonSuccess>
      </View>
    </KeyboardAwareScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    container2: {
      flex: 1,
      backgroundColor: colors.background,
      width: '100%',
      alignItems: 'center'

    },
    congratulations: {
      fontFamily: "abeezee-regular",
      color: colors.foreground,
      fontSize: 24,
      marginTop: 40,
      // marginLeft: 93
    },
    errormsg: {
      fontFamily: "roboto-regular",
      color: colors.error,
      marginTop: 20,
      textAlign: "center"
    },
    nextbtn: {
      height: 36,
      width: 100,
      borderRadius: 9,
      marginTop: 30,
      // marginLeft: 135
    },
    loremIpsum3: {
      fontFamily: "roboto-regular",
      color: colors.foreground,
      marginTop: 20,
      // marginLeft: 90
    },
    image2: {
      width: 223,
      height: 223,
      marginTop: 100,
      // marginLeft: 74
    },
    group: {
      width: 283,
      height: 96,
      justifyContent: "space-between",
      marginTop: 30,
      // marginLeft: 44
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
