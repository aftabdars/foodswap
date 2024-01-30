import React, { useContext } from 'react';
import { Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from './Home';
import Profile from './Profile';
import EditProfile from './EditProfile';
import FoodImageSelection from '../screens/FoodImageSelection';
import Settings from '../screens/Settings';
import Inbox from '../screens/Messages';
import Chat from '../screens/Chat';
import FoodInfo from '../screens/FoodInfo'
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemeContext, getColors } from '../assets/Theme';
import FoodUploadForm from './FoodUploadForm';
import Notifications from './Notifications';
import Search from './Search';
import TransactionsHistory from './TransactionsHistory';
import TransferFoodiez from './TransferFoodiez';
import LocationSelection from './LocationSelection'
import FoodSwapSelection from './FoodSwapSelection';
import TransferFoodiezSuccess from './TransferFoodiezSuccess';
import FoodSwapRoom from './FoodSwapRoom';
import ActiveFoodSwaps from './ActiveFoodSwaps';
import ActiveFoodShares from './ActiveFoodShares';
import Leaderboard from './Leaderboard';
import Achievements from './Achievements';
import PublicProfile from './PublicProfile';
import AdminPanel from './admin/Panel';
import AdminManageUser from './admin/ManageUser';
import AdminManageFood from './admin/ManageFood';
import BugReports from './admin/BugReports';
import BugReport from './BugReport';
import UserFeedback from './UserFeedback';


const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const Main = () => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);

  return (
    <Stack.Navigator
      initialRouteName={"MainTabs"}
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: colors.highlight1 },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />

      <Stack.Screen name="PublicProfile" component={PublicProfile} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
      <Stack.Screen name="FoodUploadForm" component={FoodUploadForm} options={{ title: 'Food Upload' }} />
      <Stack.Screen name="FoodInfo" component={FoodInfo} options={{ headerTintColor: '#fff', headerShown: false }} />
      <Stack.Screen name="FoodSwapSelection" component={FoodSwapSelection} options={{ title: 'Food Selection' }} />
      <Stack.Screen name="LocationSelection" component={LocationSelection} options={{ title: 'Location Selection', }} />
      <Stack.Screen name="FoodSwapRoom" component={FoodSwapRoom} options={{ title: 'FoodSwap Room', }} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="TransactionsHistory" component={TransactionsHistory} options={{ title: 'Foodiez and XP' }} />
      <Stack.Screen name="TransferFoodiez" component={TransferFoodiez} options={{ title: 'Transfer Foodiez' }} />
      <Stack.Screen name="TransferFoodiezSuccess" component={TransferFoodiezSuccess} options={{ title: 'Transfer Foodiez' }} />
      <Stack.Screen name="Leaderboard" component={Leaderboard} options={{ title: 'Leaderboard' }} />
      <Stack.Screen name="ActiveFoodSwaps" component={ActiveFoodSwaps} options={{ title: 'Active FoodSwaps' }} />
      <Stack.Screen name="ActiveFoodShares" component={ActiveFoodShares} options={{ title: 'Active FoodShares' }} />
      <Stack.Screen name="Achievements" component={Achievements} options={{ title: 'Achievements' }} />
      <Stack.Screen name="BugReport" component={BugReport} options={{ title: 'Bug Report' }} />
      <Stack.Screen name="UserFeedback" component={UserFeedback} options={{ title: 'Feedback' }} />

      {/* Admin Panel Screens*/}
      <Stack.Screen name="AdminPanel" component={AdminPanel} options={{ title: 'Admin Panel' }} />
      <Stack.Screen name="AdminManageUser" component={AdminManageUser} options={{ title: 'Manage User' }} />
      <Stack.Screen name="AdminManageFood" component={AdminManageFood} options={{ title: 'Manage Food' }} />
      <Stack.Screen name="AdminBugReports" component={BugReports} options={{ title: 'Manage Food' }} />
    </Stack.Navigator>
  )
};

const MainTabs = () => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);

  return (
    <Tab.Navigator tabBarPosition='bottom'
    initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Profile': iconName = 'account-circle'; break;
            case 'Home': iconName = 'home-minus'; break;
            case 'Camera': iconName = 'camera'; break;
            case 'Messages': iconName = 'message-processing'; break;
            case 'Settings': iconName = 'cog'; break;
          }

          return <MaterialCommunityIconsIcon name={iconName} size={23} color={color} />;
        },
        tabBarActiveTintColor: colors.highlight1,
        tabBarInactiveTintColor: colors.foreground,
        tabBarActiveBackgroundColor: colors.background,
        tabBarInactiveBackgroundColor: colors.background,
        tabBarLabelStyle: { fontSize: 11 },
        tabBarLabel: () => {
          let label = route.name
          // return <Text style={{ color: colors.foreground }}>{label}</Text>
        },
        tabBarItemStyle: { padding: 0, margin: 0 },
        tabBarStyle: {
          backgroundColor: colors.background2,
          paddingBottom: 8,
          shadowOffset: -100,
          shadowOpacity: 100,
          shadowRadius: 3
        }
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: true }} />
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: true }} />
      <Tab.Screen name="Camera" component={CameraStack} options={{ headerShown: true }} />
      <Tab.Screen name="Messages" component={MessagesStack} options={{ headerShown: true }} />
      <Tab.Screen name="Settings" component={SettingsStack} options={{ headerShown: true }} />
    </Tab.Navigator>

  );
};

const CameraStack = () => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);

  return (
    <Stack.Navigator initialRouteName={"FoodImageSelection"}>
      <Stack.Screen name="FoodImageSelection" component={FoodImageSelection} options={{ title: 'Food Upload', headerStyle: { backgroundColor: colors.highlight1 }, headerTintColor: '#fff' }} />
    </Stack.Navigator>
  )
}

const MessagesStack = () => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);

  return (
    <Stack.Navigator initialRouteName={"Messages "}>
      <Stack.Screen name="Messages " component={Inbox} options={{ headerTintColor: '#fff', headerStyle: { backgroundColor: colors.highlight1 } }} />
    </Stack.Navigator>
  )
}

const SettingsStack = () => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);

  return (
    <Stack.Navigator initialRouteName={"Settings "}>
      <Stack.Screen name="Settings " component={Settings} options={{ headerTintColor: '#fff', headerStyle: { backgroundColor: colors.highlight1 } }} />
    </Stack.Navigator>
  )
}

export default Main;