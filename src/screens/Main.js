import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {View} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Profile from './Profile';
import CupertinoFooter1 from '../components/CupertinoFooter1';
import FoodImageSelection from '../screens/FoodImageSelection';
import Settings from '../screens/Settings';
import Inbox from '../screens/Messages';
import Chat from '../screens/Chat';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from '../assets/Colors'


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MessagesContainer () {
    return (
        <Stack.Navigator initialRouteName={"Messages2"}>
            <Stack.Screen name="Messages2" component={Inbox} options={{headerTintColor:'#fff',headerStyle: {backgroundColor: '#007bff'}}}/>
            <Stack.Screen name="Chat" component={Chat} options={{headerShown:false}}/>
        </Stack.Navigator>
    )
}

const Main = () => {
  return (

      <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home' : iconName = 'home-minus'; break;
            case 'Profile' : iconName = 'account-circle'; break;
            case 'Camera' : iconName = 'camera'; break;
            case 'Messages' : iconName = 'message-processing'; break;
            case 'Settings' : iconName = 'account-settings'; break;
          }

          return <MaterialCommunityIconsIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.highlight1,
        tabBarInactiveTintColor: Colors.foreground,
        tabBarActiveBackgroundColor: Colors.background,
        tabBarInactiveBackgroundColor: Colors.background
      })}
      >
        
        <Tab.Screen name="Home" component={Home} options={{headerShown:false}}/>
        <Tab.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
        <Tab.Screen name="Camera" component={FoodImageSelection} options={{headerShown:false}}/>
        <Tab.Screen name="Messages" component={MessagesContainer} options={{headerShown:false}}/>
        <Tab.Screen name="Settings" component={Settings} options={{headerShown:false}}/>
      </Tab.Navigator>

  );
};

export default Main;