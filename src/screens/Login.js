import { React, useState, useEffect, useContext } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Image, Text, Platform } from "react-native";
import { CommonActions } from '@react-navigation/native';
import MaterialFixedLabelTextbox from "../components/MaterialFixedLabelTextbox";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialRightIconTextbox from "../components/MaterialRightIconTextbox";
import MaterialButtonWithVioletText from "../components/MaterialButtonWithVioletText";
import MaterialButtonWithOrangeText from "../components/MaterialButtonWithOrangeText";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenValidation, postLogin } from "../api/backend/Auth";
import { getUserToken, removeUserToken, setUserToken } from "../storage/UserToken";
import { ThemeContext, getColors } from '../assets/Theme';
import { setProfile, setStats } from "../storage/User";
import { getClientProfile, getClientStats } from "../api/backend/User";
import { useLoading } from "../assets/LoadingContext";
import { extractErrorMessage } from "../api/backend/utils/Utils";


function Login({ navigation }) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);
  // Loading
  const { showLoading, hideLoading } = useLoading();

  // States
  const [username, setUsername] = useState();
  const [password2, setPassword2] = useState();
  const [showError, setShowError] = useState();

  // Check if user already has a token in storage, if so then route to Home otherwise Login
  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await getUserToken();
        if (token && token !== null) {
          // Check Token validition
          let tokenValidationResponse;
          try {
            tokenValidationResponse = await getTokenValidation(token.token);
            console.log(tokenValidationResponse.data);
          }
          catch (error) {
            if (error.response) {
              removeUserToken(); // For better remove the invalid(expired) token from user's cache and storage
            }
          }

          // Navigate to home if token is valid
          if (tokenValidationResponse && tokenValidationResponse.status == 200) {
            // Navigate to home forgetting login and previous screens
            showLoading();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              })
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkUserToken();
    hideLoading(); // After logout loading may be shown or the above token may raise error
  }, []);

  const handleLogin = () => {
    // Check if all of the fields are not empty
    if (!username || !password) {
      setShowError("Please fill out all the fields");
      return;
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
          showLoading();
          // Set some user data and token to storage
          const setSomeData = async () => {
            try {
              const profileResponse = await getClientProfile(response.data.token);
              const statsResponse = await getClientStats(response.data.token);

              if (profileResponse && statsResponse) {
                await setUserToken(response.data);
                console.log(profileResponse.data);
                await setProfile(profileResponse.data);
                console.log(statsResponse.data);
                await setStats(statsResponse.data);

                // Navigate to home forgetting login and previous screens
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                  })
                );
              }
            }
            catch (error) {
              console.error(error.response.data);
              hideLoading();
            }
          }
          setSomeData();
        }
      })
      .catch(error => {
        hideLoading();
        console.log(error);
        

        if (error.response.status == 401) { // Unauthorized (Meaning in this case, that user is not verified)
          navigation.navigate('EmailConfirmation', {
            fromLogin: true // From login specifies that we are navigating from login screen (and not from SignUp)
          });
        }
        else {
          setShowError(extractErrorMessage(error.response? error.response.data: 'Network Error'));
        }
      })
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container2}>
        <View style={styles.container2}>
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
            onPress={handleLogin}
          >Login</MaterialButtonSuccess>
          <MaterialRightIconTextbox
            placeholder="Password"
            style={styles.passwordinput}
            onChangeText={(text) => setPassword2(text)}
          ></MaterialRightIconTextbox>
          <MaterialButtonWithVioletText
            caption="Forgot Password?"
            style={styles.forgotpasswordbtn}
            onPress={() => { navigation.navigate('Forgot') }}
          ></MaterialButtonWithVioletText>
          {showError && (
            <Text style={styles.errormsg}>
              {showError}
            </Text>
          )}
        </View>
        <View style={styles.notAUserRow}>
          <Text style={styles.notAUser}>Not a user ?</Text>
          <MaterialButtonWithOrangeText
            caption="Sign Up"
            style={styles.signupbtn}
            onPress={() => { navigation.navigate('SignUp') }}
          ></MaterialButtonWithOrangeText>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: colors.background
    },
    container2: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
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
      // marginLeft: 49
    },
    loginbtn: {
      height: 36,
      width: 100,
      borderRadius: 9,
      marginTop: 68,
      // marginLeft: 138
    },
    passwordinput: {
      height: 43,
      width: 278,
      borderRadius: 9,
      backgroundColor: colors.background2,
      color: colors.foreground,
      marginTop: -93,
      // marginLeft: 49
    },
    forgotpasswordbtn: {
      height: 36,
      width: 200,
      marginTop: 50,
      // marginLeft: 88,
      color: colors.highlight2
    },
    notAUser: {
      fontFamily: "roboto-regular",
      color: colors.foreground,
      // marginTop: 9
    },
    signupbtn: {
      height: 36,
      width: 100
    },
    notAUserRow: {
      // alignSelf: 'center',
      height: 36,
      width: '100%',
      flexDirection: "row",
      margin: 5,
      justifyContent: 'center',
      alignItems: 'center'
      // marginLeft: 14,
    },
    errormsg: {
      fontFamily: "roboto-regular",
      color: colors.error,
      marginTop: 20,
      textAlign: "center"
    },
  }
  )
}

export default Login;
