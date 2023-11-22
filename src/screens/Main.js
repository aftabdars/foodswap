import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {View} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from './Home';
import Profile from './Profile';
import CupertinoFooter1 from '../components/CupertinoFooter1';
import FoodImageSelection from '../screens/FoodImageSelection';
import Settings from '../screens/Settings';
import Inbox from '../screens/Messages';
import Chat from '../screens/Chat';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from '@react-navigation/native';


const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function MessagesContainer() {
    const { colors } = useTheme();
    return (
        <Stack.Navigator initialRouteName={"Messages2"}>
            <Stack.Screen name="Messages2" component={Inbox} options={{headerTintColor:'#fff',headerStyle: {backgroundColor:colors.highlight1}}}/>
            <Stack.Screen name="Chat" component={Chat} options={{headerShown:false}}/>
        </Stack.Navigator>
    )
}

const Main = () => {
  const { colors } = useTheme();
  
  return (

      <Tab.Navigator tabBarPosition='bottom'
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

          return <MaterialCommunityIconsIcon name={iconName} size={23} color={color} />;
        },
        tabBarActiveTintColor: colors.highlight1,
        tabBarInactiveTintColor: colors.foreground,
        tabBarActiveBackgroundColor: colors.background,
        tabBarInactiveBackgroundColor: colors.background,
        tabBarLabelStyle: {fontSize :11},
        tabBarItemStyle: {padding:0, margin: 0}
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