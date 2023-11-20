import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Profile from './Profile';
import CupertinoFooter1 from '../components/CupertinoFooter1';
import FoodImageSelection from '../screens/FoodImageSelection';
import Settings from '../screens/Settings';
import Inbox from '../screens/Messages';
import Chat from '../screens/Chat';


const Tab = createBottomTabNavigator();

const Main = () => {
  return (

      <Tab.Navigator tabBar={(props) => <CupertinoFooter1 {...props} />}>
        <Tab.Screen name="Home" component={Home} options={{headerShown:false}}/>
        <Tab.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
        <Tab.Screen name="FoodImageSelection" component={FoodImageSelection} options={{headerShown:false}}/>
        <Tab.Screen name="Settings" component={Settings} options={{headerShown:false}}/>
        <Tab.Screen name="Messages" component={Inbox} options={{headerShown:false}}/>
        <Tab.Screen name="Chat" component={Chat} options={{headerShown:false}}/>
        
      </Tab.Navigator>

  );
};

export default Main;