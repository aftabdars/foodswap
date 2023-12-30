import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, ScrollView, Image, RefreshControl } from "react-native";
import MaterialButtonProfile from "../components/MaterialButtonProfile";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import Categorybutton from "../components/Categorybutton";
import { SafeAreaView } from "react-native-safe-area-context";
import SideMenu from 'react-native-side-menu-updated';

import { getProfile } from "../storage/User.js";
import { getFoodCategories, getFoods } from "../api/backend/Food.js";
import FoodCarousel from "../components/FoodCarousel.js";
import { ThemeContext, getColors } from '../assets/Theme';
import MaterialNotificationIcon from "../components/MaterialNotificationIcon.js";
import { useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import SideBar from "../components/SideBar";
import { getUserToken } from "../storage/UserToken.js";
import { useLoading } from "../assets/LoadingContext.js";


function Home(props) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);
  // Loading
  const { showLoading, hideLoading } = useLoading();

  // States
  const [refresh, setRefresh] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [userData, setUserData] = useState({ username: 'Anonymous' });
  const [foodItems, setFoodItems] = useState();
  const [foodCategories, setFoodCategories] = useState();

  const navigation = useNavigation();

  // Fetches data
  useEffect(() => {
    let completedCount = 0;
    const MAX_COUNT = 3;

    const checkAllDataFetched = () => {
      if (completedCount === MAX_COUNT) {
        hideLoading(); // Hiding loading it may have been showing after Login Screen
        if (refresh) setRefresh(false);
      }
    };

    // Gets user profile
    const getUserProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile && profile !== null) {
          setUserData(profile);
          completedCount++;
          checkAllDataFetched();
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Get food items
    const getFoodItems = async () => {
      const token = await getUserToken();
      if(token && token !== null){
        await getFoods(token.token)
        .then(response => {
          setFoodItems(response.data.results);
          completedCount++;
          checkAllDataFetched();
        })
        .catch(error => {
          console.log(error);
        });
      }
    };

    // Get food categories
    const getMeFoodCategories = async () => {
      await getFoodCategories()
        .then(response => {
          setFoodCategories(response.data.results);
          completedCount++;
          checkAllDataFetched();
        })
        .catch(error => {
          console.log(error);
        });
    };

    getUserProfile();
    getFoodItems();
    getMeFoodCategories();

  }, [refreshCount]);

  const onRefresh = () => {
    setRefreshCount(refreshCount + 1);
    setRefresh(true);
  };

  const notificationButtonPressed = () => {
    navigation.navigate('Notifications');
  }

  function HomePage(props, { navigation }) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <MaterialButtonProfile style={styles.profileIcon} userData={userData} onPress={() => { props.bar.setIsOpenState(true) }} />
          <MaterialNotificationIcon style={styles.notificationIcon} onPress={notificationButtonPressed}></MaterialNotificationIcon>
        </View>

        <ScrollView style={styles.body}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              colors={[colors.highlight1, colors.highlight2]}
              tintColor={colors.highlight2}
            />
          }
        >
          <CupertinoSearchBarBasic
            inputStyle="Search for food"
            inputBox="rgba(255,255,255,1)"
            style={styles.foodsearch}
            onPressIn={(e) => navigation.navigate('Search')}
          ></CupertinoSearchBarBasic>

          <Text style={styles.categoriesHeading}>Categories</Text>
          <ScrollView horizontal={true} style={styles.categoryButtonsContainer}>
            {foodCategories && foodCategories.map(foodCategory => (
              <Categorybutton key={foodCategory.id} style={styles.categorybutton} categoryData={foodCategory} />
            ))}
          </ScrollView>

          <Text style={styles.heading}>Near You</Text>
          <FoodCarousel foodItems={foodItems} />

          <Text style={styles.heading}>Find in map</Text>
          <View style={{ width: 340, height: 250, marginBottom: 20, alignSelf: 'center', borderWidth: 1, borderColor: '#fff' }}>
            <Image
              source={require("../assets/images/map_preview.png")}
              //resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
            ></Image>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

const SideMenuWithState = (props) => {
  // Create a state variable isOpenState with an initial value from the prop
  const [isOpenState, setIsOpenState] = useState(props.isOpen);

  function onchange(opened) {
    setIsOpenState(opened)
  }
  // Render the original SideMenu component with the modified prop
  return (
    <SideMenu isOpen={isOpenState} menu={props.menu} onChange={onchange}>
      <HomePage bar={{setIsOpenState}} />
    </SideMenu>
  )
};

  const menu = <SideBar colors={colors}/>
  //MAIN HOME FUNCTION RETURN
  return (
        <SideMenuWithState menu={menu} isOpen={false} />
  )
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 20,
      //paddingBottom: 50 + 5, // This is the height of Footer + 5
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
