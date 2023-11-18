import { useFonts } from 'expo-font';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import EmailConfirmation from './src/screens/EmailConfirmation';
import Forgot from './src/screens/Forgot';
import Forgot2 from './src/screens/Forgot2';
import Forgot3 from './src/screens/Forgot3';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import FoodImageSelection from './src/screens/FoodImageSelection';
import FoodUploadForm from './src/screens/FoodUploadForm';
import Settings from './src/screens/Settings';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

//the home will be outside of navigation and a state will be used (or itll bug out)
export default function App() {
  const [loaded] = useFonts({
    'roboto-700': require('./src/assets/fonts/roboto-700.ttf'),
    'roboto-regular': require('./src/assets/fonts/roboto-regular.ttf')
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Login"}>
        <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
        <Stack.Screen name="EmailConfirmation" component={EmailConfirmation} options={{title:'Account Verification', headerStyle: {backgroundColor:'#f4511e'}, headerTintColor: '#fff'}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Forgot" component={Forgot} options={{title:'Forgot', headerStyle: {backgroundColor:'#f4511e'}, headerTintColor: '#fff'}}/>
        <Stack.Screen name="Forgot2" component={Forgot2} options={{title:'Forgot', headerStyle: {backgroundColor:'#f4511e'}, headerTintColor: '#fff'}}/>
        <Stack.Screen name="Forgot3" component={Forgot3} options={{title:'Forgot', headerStyle: {backgroundColor:'#f4511e'}, headerTintColor: '#fff'}}/>
        <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
        <Stack.Screen name="Profile" options={{headerShown:false}}>{(props) => <Profile {...props} username=''/>}</Stack.Screen>
        <Stack.Screen name="FoodImageSelection" component={FoodImageSelection} options={{title:'Food Image Selection', headerStyle: {backgroundColor:'#333'}, headerTintColor: '#fff'}}/>
        <Stack.Screen name="FoodUploadForm" component={FoodUploadForm} options={{title:'Food Upload', headerStyle: {backgroundColor:'#f4511e'}, headerTintColor: '#fff'}}/>
        <Stack.Screen name="Settings" component={Settings} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}