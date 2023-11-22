import { useFonts } from 'expo-font';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import EmailConfirmation from './src/screens/EmailConfirmation';
import Forgot from './src/screens/Forgot';
import Forgot2 from './src/screens/Forgot2';
import Forgot3 from './src/screens/Forgot3';
import Main from './src/screens/Main';
import FoodUploadForm from './src/screens/FoodUploadForm';
import { NavigationContainer, Appearance } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from './src/assets/Colors'
import { useColorScheme } from 'react-native';
import {DefaultTheme, DarkTheme} from './src/assets/Colors'

const Stack = createNativeStackNavigator();

//the home will be outside of navigation and a state will be used (or itll bug out)
export default function App() {

  const scheme = useColorScheme();

  const [loaded] = useFonts({
    'roboto-700': require('./src/assets/fonts/roboto-700.ttf'),
    'roboto-regular': require('./src/assets/fonts/roboto-regular.ttf')
  });

  if (!loaded) {
    return null;
  }
  
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName={"Login"}>
        <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
        <Stack.Screen name="EmailConfirmation" component={EmailConfirmation} options={{title:'Account Verification', headerStyle: {backgroundColor: Colors.highlight1}, headerTintColor: '#fff'}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Forgot" component={Forgot} options={{title:'Forgot', headerStyle: {backgroundColor: Colors.highlight1}, headerTintColor: '#fff'}}/>
        <Stack.Screen name="Forgot2" component={Forgot2} options={{title:'Forgot', headerStyle: {backgroundColor: Colors.highlight1}, headerTintColor: '#fff'}}/>
        <Stack.Screen name="Forgot3" component={Forgot3} options={{title:'Forgot', headerStyle: {backgroundColor: Colors.highlight1}, headerTintColor: '#fff'}}/>
        <Stack.Screen name="Main" component={Main} options={{headerShown:false}}/>
        <Stack.Screen name="FoodUploadForm" component={FoodUploadForm} options={{title:'Food Upload', headerStyle: {backgroundColor: Colors.highlight1}, headerTintColor: '#fff'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}