import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import MaterialButtonDanger from "../components/MaterialButtonDanger";
import { useNavigation, CommonActions, useTheme } from '@react-navigation/native';

import { getUserToken, removeUserToken } from "../storage/UserToken";
import { postLogout } from "../api/backend/Auth";
import { getColors, ThemeContext } from "../assets/Theme";
import { removeUserTheme, setUserTheme } from "../storage/UserSettings";

function Settings() {
  // Theme
  const {
    theme,
    setTheme
  } = useContext(ThemeContext);
  const colors = getColors(theme);
  const styles = createStyles(colors);
  const [ themeEnabled, setThemeEnabled ] = useState(theme === 'light'? false : true);
  // States
  const[ notificationEnabled, setNotificationEnabled ] = useState(false);

  const navigation = useNavigation();

  const handleSwitchTheme = async () => {
    const toTheme = (theme === 'light') ? 'dark' : 'light';
    setThemeEnabled(!themeEnabled); 
    setTheme(toTheme); // Updates user theme in real-time by changing the theme State

    // Save user theme settings in cache and storage
    await setUserTheme(toTheme);
  }

  const handleLogout = async () => {
    const token = await getUserToken();
      postLogout(token.token)
      .then(response => { // Response status 204 if deleted
        console.log(response.status);
        console.log(response.data);

        // Remove user's token and theme settings from cache and local storage
        removeUserToken();
        removeUserTheme();

        // Navigate to initial page like Login (forgetting current screens)
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <View style={styles.container}>
        <Text style={styles.subHeading}>Display and notification</Text>
        <View style={styles.parentView}>
            <Text style={[styles.childText,styles.commonStyle]}>Notification</Text>
            <Text style={styles.notification}>You will receive app notifications.</Text>
            <Text style={[styles.childText1,styles.commonStyle]}>Dark Theme</Text>
            <Text style={styles.theme}>Change the theme that which you want.</Text>
            <Text style={[styles.childText2,styles.commonStyle]}>Privacy Notice</Text>
            
            <Switch style={[styles.childText3,styles.commonStyle]}
            value={notificationEnabled}
            onValueChange={() => setNotificationEnabled(!notificationEnabled)}
            />
            <Switch  
                style={[styles.childText4,styles.commonStyle]}
                value={themeEnabled}
                onValueChange={ handleSwitchTheme } 
            /> 
        </View>
        <MaterialButtonDanger style={styles.logoutButton} onPress={handleLogout}>
            Logout
        </MaterialButtonDanger>     
    </View>
   
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: colors.background,
      flexDirection: 'row',
    
    },
    subHeading:{
      position:'absolute',
      color: colors.foreground,
      fontWeight:'800',
      marginLeft:45,
      marginTop:20
    },
    parentView:{
      position:'absolute',
      width:"95%",
      height:230,
      marginTop: 50,
      marginHorizontal:10,
      backgroundColor: colors.background2,
      marginLeft:10,
      borderRadius:25,
    },
    childText:{
     color: colors.foreground,
     borderBottomWidth:1,
     borderBottomLeftRadius:-1,
     borderBottomRightRadius:40,
     borderBottomColor: colors.foreground,
     borderRadius:100,
     marginTop:5,
     marginLeft:15
    },
    childText1:{
     color: colors.foreground,
     borderBottomWidth:1,
     borderBottomLeftRadius:-1,
     borderBottomRightRadius:40,
     borderBottomColor: colors.foreground,
     borderRadius:100,
     marginLeft:15,
     marginTop:-15
    },
    childText2:{
      color:colors.foreground,
      marginLeft:15,
      marginTop:-10
    },
    childText3:{
      position:'absolute',
      marginLeft:310,
      marginTop:0,
    },
    childText4:{
      position:'absolute',
      marginLeft:310,
      marginTop:75,
     
    },
    commonStyle:{
      fontSize:20,
      //padding:25,
      paddingVertical:25,
    },
    notification:{
      position:'absolute',
      marginTop:60,
      marginLeft:12
    },
    theme:{
     position:'absolute',
     marginTop:123,
     marginLeft:12,
    },
    logoutButton: {
      position:'absolute',
      width: 40,
      height: 30,
      marginHorizontal: 150,
      marginVertical: 20,
      bottom: 0,
    }
  })
}


export default Settings;
