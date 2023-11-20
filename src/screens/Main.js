import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Profile from './Profile';
import CupertinoFooter1 from '../components/CupertinoFooter1';
import FoodImageSelection from '../screens/FoodImageSelection';
import Settings from '../screens/Settings';
import Inbox from '../screens/Messages';
import Chat from '../screens/Chat';
import Colors from '../assets/Colors'


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MessagesContainer () {
    return (
        <Stack.Navigator initialRouteName={"Messages"}>
            <Stack.Screen name="Messages" component={Inbox} options={{headerTintColor:'#fff',headerStyle: {backgroundColor: '#007bff'}}}/>
            <Stack.Screen name="Chat" component={Chat} options={{headerShown:false}}/>
        </Stack.Navigator>
    )
}

const Main = () => {
  return (

      <Tab.Navigator tabBar={(props) => <CupertinoFooter1 {...props} />}>
        <Tab.Screen name="Home" component={Home} options={{headerShown:false}}/>
        <Tab.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
        <Tab.Screen name="FoodImageSelection" component={FoodImageSelection} options={{headerShown:false}}/>
        <Tab.Screen name="Settings" component={Settings} options={{headerShown:false}}/>
        <Tab.Screen name="MessagesContainer" component={MessagesContainer} options={{headerShown:false}}/>
      </Tab.Navigator>

  );
};

export default Main;