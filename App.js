import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import EmailConfirmation from './src/screens/EmailConfirmation';
import Forgot from './src/screens/Forgot';
import Forgot2 from './src/screens/Forgot2';
import Forgot3 from './src/screens/Forgot3';
import Main from './src/screens/Main';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeContext, getColors } from './src/assets/Theme'
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { getUserTheme, setUserTheme } from './src/storage/UserSettings';
import { LoadingProvider } from './src/assets/LoadingContext';

const Stack = createNativeStackNavigator();

//the home will be outside of navigation and a state will be used (or itll bug out)
export default function App() {
  const [theme, setTheme] = useState('auto');
  const colors = getColors(theme);
  const systemTheme = useColorScheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check and get user's theme settings from cache or storage
        const userThemeSettings = await getUserTheme();
        console.log(userThemeSettings)
        // If user has theme settings, then set the theme to that
        if (userThemeSettings && userThemeSettings !== null) {
          userThemeSettings == 'auto' ? setTheme(systemTheme) : setTheme(userThemeSettings);
        } else {
          // Also save in cache and storage
          setUserTheme('auto');
          // Otherwise get user's color scheme (aka mobile theme light or dark mode)
          setTheme(systemTheme);
        }
      } catch (error) {
        console.error('Error fetching user theme:', error);
      }
    };
    fetchData();
  }, [systemTheme, theme]);

  const [loaded] = useFonts({
    'roboto-700': require('./src/assets/fonts/roboto-700.ttf'),
    'roboto-regular': require('./src/assets/fonts/roboto-regular.ttf')
  });

  if (!loaded) {
    return null;
  }

  return (

    <ThemeContext.Provider
      value={
        { theme, setTheme }
      }
    >
      <LoadingProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={"Login"}>
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="EmailConfirmation" component={EmailConfirmation} options={{ title: 'Account Verification', headerStyle: { backgroundColor: colors.highlight1 }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Forgot" component={Forgot} options={{ title: 'Forgot', headerStyle: { backgroundColor: colors.highlight1 }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Forgot2" component={Forgot2} options={{ title: 'Forgot', headerStyle: { backgroundColor: colors.highlight1 }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Forgot3" component={Forgot3} options={{ title: 'Forgot', headerStyle: { backgroundColor: colors.highlight1 }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </LoadingProvider>
    </ThemeContext.Provider>
  );
}

