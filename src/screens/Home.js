import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, ScrollView, Image, RefreshControl } from "react-native";
import CupertinoFooter1 from "../components/CupertinoFooter1";
import MaterialButtonProfile from "../components/MaterialButtonProfile";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import MaterialSpinner from "../components/MaterialSpinner";
import Categorybutton from "../components/Categorybutton";
import { SafeAreaView } from "react-native-safe-area-context";

import { getProfile } from '../api/backend/User';
import { getUserToken } from "../storage/UserToken.js";
import { getFoodCategories, getFoods } from "../api/backend/Food.js";
import FoodCarousel from "../components/FoodCarousel.js";
import { ThemeContext, getColors } from '../assets/Theme';
import MaterialNotificationIcon from "../components/MaterialNotificationIcon.js";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import SideBar from "../components/SideBar";


function Home(props) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  const navigation = useNavigation();

  // States
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({username: 'Anonymous'}); 
  const [foodItems, setFoodItems] = useState();
  const [foodCategories, setFoodCategories] = useState();

  // Gets user profile
  useEffect(() => {
    const getUserProfile = async () => {
      const token = await getUserToken();
      console.log(token);
      getProfile(token.token)
      .then(response => {
        if (response.status == 200) setUserData(response.data);
      })
      .catch(error => {
        console.log(error);
      })
    }
    getUserProfile();
  }, []);

  // Get food items
  useEffect(() => {
    const getFoodItems = async () => {
      getFoods() // In future add params, status = 'up'
      .then(response => {
        console.log(response.data);
        setFoodItems(response.data.results);
      })
      .catch(error => {
        console.log(error);
      })
    };
    getFoodItems();
  }, []);

  
  // Get food categories
  useEffect(() => {
    const getMeFoodCategories = async () => {
      getFoodCategories()
      .then(response => {
        console.log(response.data);
        setFoodCategories(response.data.results);
      })
      .catch(error => {
        console.log(error);
      })
    };
    getMeFoodCategories();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // What things to refresh here
    setRefreshing(false);
  };

  const openSidebar = () => {
    // navigation.dispatch(DrawerActions.toggleDrawer());
    navigation.toggleDrawer();
  };

  const notificationButtonPressed = () => {
    navigation.navigate('Notifications');
  }
  
  function HomePage({navigation}){
    return(
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <MaterialButtonProfile style={styles.profileIcon} userData={userData} onPress={()=>{navigation.toggleDrawer()}}/>
          <MaterialNotificationIcon style={styles.notificationIcon} onPress={notificationButtonPressed}></MaterialNotificationIcon>
      </View>

      <ScrollView style={styles.body}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#009688', '#009688']}
            tintColor={'#009688'}
          />
        }
      >

        <CupertinoSearchBarBasic
          inputStyle="Search for food"
          inputBox="rgba(255,255,255,1)"
          style={styles.foodsearch}
          onPressIn={(e) => navigation.navigate('Search')}
        ></CupertinoSearchBarBasic>
        {/* <MaterialSpinner style={styles.materialSpinner}></MaterialSpinner> */}

        <Text style={styles.categoriesHeading}>Categories</Text>
        <ScrollView horizontal={true} style={styles.categoryButtonsContainer}>
          {foodCategories && foodCategories.map(foodCategory => (
            <Categorybutton key={foodCategory.id} style={styles.categorybutton} categoryData={foodCategory} />
          ))}
        </ScrollView>

        <Text style={styles.heading}>Near You</Text>
        <FoodCarousel foodItems={foodItems}/>

        <Text style={styles.heading}>Find in map</Text>
        <View style={{ width: 340, height: 250, marginBottom: 20, alignSelf: 'center', borderWidth: 1, borderColor: '#fff' }}>
          <Image
            source={require("../assets/images/map_preview.png")}
            //resizeMode="contain"
            style={{width: '100%', height: '100%'}}
          ></Image>
        </View>
      </ScrollView>

      {/* <CupertinoFooter1 style={styles.cupertinoFooter1}></CupertinoFooter1> */}
    </SafeAreaView>
    )
  }

  //MAIN RETURN/////////
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator screenOptions={{headerShown: false}} initialRouteName="HomePage" drawerContent={(props) => <SideBar {...props} colors={colors}/>}>
      <Drawer.Screen name="HomePage" component={HomePage} />
    </Drawer.Navigator>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 20,
        //paddingBottom: 50 + 5, // This is the height of Footer + 5
      },
      cupertinoFooter1: {
        position: 'absolute',
        height: 50,
        width: 375,
        bottom: 0
      },
      profileIcon: {
        position: 'absolute',
        left: 20
      },
      notificationIcon: {
        position: 'absolute',
        right: 20,
      },
      header: {
        backgroundColor: colors.background,
        height: 45,
        flexDirection: "row",
        left: 0,
        right: 0,
      },
      body: {
        backgroundColor: colors.background,
      },
      foodsearch: {
        height: 44,
        width: 323,
        backgroundColor: colors.background,
        borderRadius: 9,
        marginTop: 9,
        marginLeft: 29
      },
      materialSpinner: {
        width: 323,
        height: 31,
        marginLeft: 29
      },
      categoriesHeading: {
        fontFamily: "roboto-700",
        color: colors.foreground,
        fontSize: 22,
        marginTop: 23,
        marginLeft: 29
      },
      categoryButtonsContainer: {
        width: 323,
        height: 61,
        flexDirection: "row",
        //justifyContent: "space-between",
        marginLeft: 26
      },
      categorybutton: {
        height: 61,
        width: 63,
        marginRight: 25,
        color: colors.foreground
      },
      heading: {
        fontFamily: "roboto-700",
        color: colors.foreground,
        fontSize: 22,
        marginTop: 56,
        marginBottom: 10,
        marginLeft: 29
      },
    }
  )
}

export default Home;
