import React from "react";
import  {useState} from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import MaterialButtonDanger from "../components/MaterialButtonDanger";
import { useNavigation, CommonActions } from '@react-navigation/native';

import { getUserToken, removeUserToken } from "../storage/Token";
import { postLogout } from "../api/backend/Auth";

function Settings() {
  const[notificationEnabled,setNotificationEnabled] = useState(false);
  const [themeEnabled, setThemeEnabled] = useState(false);

  const navigation = useNavigation();

  const handleLogout = async () => {
    const token = await getUserToken();
      postLogout(token.token)
      .then(response => { // Response status 204 if deleted
        console.log(response.status);
        console.log(response.data);

        // Remove user's token from cache and local storage
        removeUserToken();

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
        <Text style={styles.settings}>Settings</Text>
        <Text style={styles.heading}>Display and notification</Text>
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
                onValueChange={() => setThemeEnabled(!themeEnabled)}      
            /> 
        </View>
        <MaterialButtonDanger style={styles.logoutButton} onPress={handleLogout}>
            Logout
          </MaterialButtonDanger>     
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#009688',
    flexDirection: 'row',
  
  },
  settings:{
  fontSize:30,
  color:'white',
  fontWeight:'bold',
  alignItems:'center',
  marginLeft:50,
  marginTop:35
  },
  heading:{
    position:'absolute',
    color:'black',
    fontWeight:'800',
    marginLeft:45,
    marginTop:94
  },
  parentView:{
    position:'absolute',
    width:"95%",
    height:230,
    marginTop: 120,
    marginHorizontal:10,
    backgroundColor:'#009658',
    marginLeft:10,
    borderRadius:25,
  },
  childText:{
   color:'black',
   borderBottomWidth:1,
   borderBottomLeftRadius:-1,
   borderBottomRightRadius:40,
   borderBottomColor:'black',
   borderRadius:100,
   marginTop:5,
   marginLeft:15
  },
  childText1:{
   color:'black',
   borderBottomWidth:1,
   borderBottomLeftRadius:-1,
   borderBottomRightRadius:40,
   borderBottomColor:'black',
   borderRadius:100,
   marginLeft:15,
   marginTop:-15
  },
  childText2:{
    color:'black',
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
   marginLeft:12
  },
  logoutButton: {
    position:'absolute',
    width: 40,
    height: 30,
    marginHorizontal: 150,
    marginVertical: 20,
    bottom: 0,
  }
});

export default Settings;
