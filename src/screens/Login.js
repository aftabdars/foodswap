import { React, useState, useEffect, useContext } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Image, Text, Platform } from "react-native";
import { CommonActions } from '@react-navigation/native';
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialRightIconTextbox from "../components/MaterialRightIconTextbox";
import MaterialButtonWithVioletText from "../components/MaterialButtonWithVioletText";
import { useFonts } from 'expo-font';
import MaterialButtonWithOrangeText from "../components/MaterialButtonWithOrangeText";

import { postLogin } from "../api/backend/Auth";
import { getUserToken, setUserToken } from "../storage/UserToken";
import { ThemeContext, getColors } from '../assets/Theme';


function Login({navigation}) {
  
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

  // States
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [showError, setShowError] = useState();
  
  // Check if user already has a token in storage, if so then route to Home otherwise Login
  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await getUserToken();
        if (token && token !== null) {
          // Navigate to home forgetting login and previous screens
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkUserToken();
  }, []);

  const handleLogin = () => {
    // Check if all of the fields are not empty
    if (!username || !password) {
      setShowError("Please fill out all the fields");
    }

    body = {
      'username': username,
      'password': password
    }
    postLogin(body)
    .then(response => {
      console.log(response.status);
      console.log(response.data);
      if (response.status == 200) {
        setUserToken(response.data);
        
        // Navigate to home forgetting login and previous screens
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          })
        );
      }
    })
    .catch(error => {
      console.log(error)
      console.log(error.response.data)
      errorMessages = error.response.data;

      if (error.response.status == 401) { // Unauthorized
        navigation.navigate('EmailConfirmation');
      }
      else {
        setShowError(errorMessages[Object.keys(errorMessages)[0]][0]);
      }
    })
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image
        source={require("../assets/images/logo.png")}
        resizeMode="contain"
        style={styles.foodswaplogo}
      ></Image>
      <MaterialFixedLabelTextbox
        placeholder="Username"
        style={styles.usernameinput}
        onChangeText={(text) => setUsername(text)}
      ></MaterialFixedLabelTextbox>
      <MaterialButtonSuccess
        style={styles.loginbtn}
        onPress={ handleLogin }
      >Login</MaterialButtonSuccess>
      <MaterialRightIconTextbox
        placeholder="Password"
        style={styles.passwordinput}
        onChangeText={(text) => setPassword(text)}
      ></MaterialRightIconTextbox>
      <MaterialButtonWithVioletText
        caption="Forgot Password?"
        style={styles.forgotpasswordbtn}
        onPress={()=>{navigation.navigate('Forgot')}}
      ></MaterialButtonWithVioletText>
      {showError && (
        <Text style={styles.errormsg}>
          { showError }
        </Text>
      )}
      <View style={styles.notAUserRow}>
        <Text style={styles.notAUser}>Not a user ?</Text>
        <MaterialButtonWithOrangeText
          caption="Sign Up"
          style={styles.signupbtn}
          onPress={()=>{navigation.navigate('SignUp')}}
        ></MaterialButtonWithOrangeText>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background
      },
      foodswaplogo: {
        width: 375,
        height: 375,
        marginTop: 58
      },
      usernameinput: {
        height: 43,
        width: 278,
        backgroundColor: colors.background2,
        color: colors.foreground,
        borderRadius: 9,
        marginTop: 37,
        marginLeft: 49
      },
      loginbtn: {
        height: 36,
        width: 100,
        borderRadius: 9,
        marginTop: 68,
        marginLeft: 138
      },
      passwordinput: {
        height: 43,
        width: 278,
        borderRadius: 9,
        backgroundColor: colors.background2,
        color: colors.foreground,
        marginTop: -93,
        marginLeft: 49
      },
      forgotpasswordbtn: {
        height: 36,
        width: 200,
        marginTop: 50,
        marginLeft: 88,
        color: colors.highlight2
      },
      notAUser: {
        fontFamily: "roboto-regular",
        color: colors.foreground,
        marginTop: 9
      },
      signupbtn: {
        height: 36,
        width: 100
      },
      notAUserRow: {
        height: 36,
        flexDirection: "row",
        marginTop: 60,
        marginLeft: 114,
        marginRight: 87
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

export default Login;
