import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialRightIconTextbox from "../components/MaterialRightIconTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialButtonWithOrangeText from "../components/MaterialButtonWithOrangeText";
import { useFonts } from 'expo-font';

import { postSignup } from "../api/backend/User";
import { ThemeContext, getColors } from '../assets/Theme';
import { extractErrorMessage } from "../api/backend/utils/Utils";


function SignUp({ navigation }) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  // States
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [rePassword, setRePassword] = useState();
  const [showError, setShowError] = useState(false);

  const onPressSignup = async () => {
    // Check if all of the fields are not empty
    if (!username || !email || !password) {
      setShowError("Please fill out all the fields");
    }
    // Check if re-typed password matches password
    else if (password != rePassword) {
      setShowError('Re-typed password does not match');
    }
    else {
      body = {
        'username': username,
        'email': email,
        'password': password
      }

      // Register the user and navigate to verification screen for confirmation
      postSignup(body)
        .then(response => {
          console.log(response.status);
          console.log(response.data);
          if (response.status == 201) { // 201 => Created
            navigation.navigate('EmailConfirmation');
          }
        })
        .catch(error => {
          console.log(error);
          console.log(error.response.data)
          errorMessage = error.response.data;
          if ("username" in errorMessage) {
            setShowError(error.response.data["username"][0])
          }
          else if ("email" in errorMessage) {
            setShowError(error.response.data["email"][0])
          }
          else {
            setShowError(extractErrorMessage(error.response.data));
          }
        })

    }
  }

  const [loaded] = useFonts({
    'roboto-regular': require('../assets/fonts/roboto-regular.ttf'),
    'roboto-700': require('../assets/fonts/roboto-700.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>SIGN UP</Text>
      <View style={styles.group}>
        <MaterialFixedLabelTextbox
          placeholder="Username"
          style={styles.input}
          onChangeText={(text) => setUsername(text)}
        ></MaterialFixedLabelTextbox>
        <MaterialFixedLabelTextbox
          placeholder="abc@xyz.com"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
        ></MaterialFixedLabelTextbox>
        <MaterialRightIconTextbox
          placeholder="Password"
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
        ></MaterialRightIconTextbox>
        <MaterialRightIconTextbox
          placeholder="Retype Password"
          style={styles.input}
          onChangeText={(text) => setRePassword(text)}
        ></MaterialRightIconTextbox>
      </View>
      <MaterialButtonSuccess
        style={styles.materialButtonSuccess1}
        onPress={onPressSignup}
      >Sign Up</MaterialButtonSuccess>

      {showError && (
        <Text style={styles.errormsg}>
          {showError}
        </Text>
      )}

      <View style={styles.alreadyContainer}>
        <MaterialButtonWithOrangeText
          caption="Sign In"
          style={styles.materialButtonWithVioletText1}
          onPress={() => { navigation.navigate('Login') }}
        ></MaterialButtonWithOrangeText>
        <Text style={styles.notAUser1}>Already have an account?</Text>
      </View>
    </ScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: colors.background
    },
    text: {
      fontFamily: "roboto-700",
      color: colors.foreground,
      fontSize: 24,
      marginTop: 92,
      marginLeft: 49
    },
    group: {
      width: 278,
      height: 306,
      justifyContent: "space-between",
      marginTop: 64,
      marginLeft: 49
    },
    input: {
      height: 43,
      width: 278,
      backgroundColor: colors.background2,
      color: colors.foreground,
      borderRadius: 9
    },
    materialButtonSuccess1: {
      height: 36,
      width: 100,
      borderRadius: 9,
      marginTop: 46,
      marginLeft: 138
    },
    materialButtonWithVioletText1: {
      height: 36,
      width: 100,
      position: "absolute",
      left: 138,
      top: 0
    },
    notAUser1: {
      top: 9,
      left: 0,
      position: "absolute",
      fontFamily: "roboto-regular",
      color: colors.foreground,
    },
    alreadyContainer: {
      width: 238,
      height: 36,
      marginTop: 76,
      marginLeft: 79,
      flexDirection: "column",
    },
    errormsg: {
      fontFamily: "roboto-regular",
      color: colors.error,
      marginTop: 20,
      marginRight: 15,
      textAlign: "center"
    },
  }
  )
}

export default SignUp;
