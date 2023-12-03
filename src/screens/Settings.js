import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Switch, Pressable } from "react-native";
import MaterialButtonDanger from "../components/MaterialButtonDanger";
import { useNavigation, CommonActions, useTheme } from '@react-navigation/native';

import { getUserToken, removeUserToken } from "../storage/UserToken";
import { postLogout } from "../api/backend/Auth";
import { getColors, ThemeContext } from "../assets/Theme";
import { removeUserTheme, setUserTheme, getUserTheme } from "../storage/UserSettings";
import Icon from "react-native-vector-icons/Ionicons";
import { removeProfile, removeStats } from "../storage/User";

function Settings() {
  // Theme
  const {
    theme,
    setTheme
  } = useContext(ThemeContext);
  const colors = getColors(theme);
  const styles = createStyles(colors);

  // States
  const[ notificationEnabled, setNotificationEnabled ] = useState(false);

  const navigation = useNavigation();

  const handleSwitchTheme = async (toTheme) => {
    // const toTheme = (theme === 'light') ? 'dark' : 'light';
    // setThemeEnabled(!themeEnabled); 
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

        // Clears some data from user storage
        removeUserToken();
        removeProfile();
        removeStats();
        //removeUserTheme();

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
            <Text style={[styles.notification, {color: colors.foreground}]}>You will receive app notifications.</Text>
            <Text style={[styles.childText1,styles.commonStyle]}>Theme</Text>
            <Text style={[styles.theme, {color:colors.foreground}]}>DarkMode preference.</Text>
            <Text style={[styles.childText2,styles.commonStyle]}>Privacy Notice</Text>
            
            <Switch style={[styles.childText3,styles.commonStyle]}
            value={notificationEnabled}
            onValueChange={() => setNotificationEnabled(!notificationEnabled)}
            />
            {/* <Switch  
                style={[styles.childText4,styles.commonStyle]}
                value={themeEnabled}
                onValueChange={ handleSwitchTheme } 
            />  */}
            <View style={[styles.childText4,styles.commonStyle, {flex:1,flexDirection:'row', justifyContent: "space-between", width: 80, marginLeft: 260}]}>
              <Pressable onPress={()=>{handleSwitchTheme('light')}}><Icon name="sunny" style={{fontSize:20, color: theme=='light'? colors.highlight1 : colors.foreground}}></Icon></Pressable>
              <Pressable onPress={()=>{handleSwitchTheme('dark')}}><Icon name="moon" style={{fontSize:20, color: theme=='dark'? colors.highlight1 : colors.foreground}}></Icon></Pressable>
              <Pressable onPress={()=>{handleSwitchTheme('auto')}}><Icon name="contrast" style={{fontSize:20, color:colors.foreground}}></Icon></Pressable>
            </View>
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
