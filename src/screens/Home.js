import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, RefreshControl, Dimensions } from "react-native";
import MaterialButtonProfile from "../components/MaterialButtonProfile";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import Categorybutton from "../components/Categorybutton";
import { SafeAreaView } from "react-native-safe-area-context";
import SideMenu from 'react-native-side-menu-updated';
import * as Location from 'expo-location';

import { getProfile, getStats } from "../storage/User.js";
import { getFoodCategories, getFoods } from "../api/backend/Food.js";
import FoodCarousel from "../components/FoodCarousel.js";
import { ThemeContext, getColors } from '../assets/Theme';
import MaterialNotificationIcon from "../components/MaterialNotificationIcon.js";
import { useNavigation } from "@react-navigation/native";
import SideBar from "../components/SideBar";
import { getUserToken } from "../storage/UserToken.js";
import { useLoading } from "../assets/LoadingContext.js";
import { getLevels } from "../api/backend/Gamification.js";
import { animateToNewCoordinates } from "../utils/Map.js";
import CustomMap from "../components/CustomMap.js";
import CircularMarker from "../components/CircularMarker.js";
import { CheckBox } from "react-native-elements";


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
  const [userStats, setUserStats] = useState();
  const [levelData, setLevelData] = useState();
  const [foodItems, setFoodItems] = useState();
  const [foodCategories, setFoodCategories] = useState();
  const [location, setLocation] = useState();
  const [showMap, setShowMap] = useState(false);

  const navigation = useNavigation();
  const mapRef = useRef(null);

  // Fetches data
  useEffect(() => {
    let completedCount = 0;
    const MAX_COUNT = 5;

    const checkAllDataFetched = () => {
      if (completedCount === MAX_COUNT) {
        hideLoading(); // Hiding loading it may have been showing after Login Screen or other screens
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

    // Gets client user stats
    const getMeUserStats = async () => {
      try {
        const stats = await getStats();
        if (stats && stats !== null) {
          setUserStats(stats);
          completedCount++;
          checkAllDataFetched();

          getLevelData(stats.xp); // Get level data now
        }
      }
      catch (error) {
        console.log(error);
      }
    }

    // Gets user level and level's data from user's current XP
    const getLevelData = async (xp) => {
      const params = { // Retrieves level row having xp_start >= user_xp <= xp_end
        'xp_start__lte': xp || 0,
        'xp_end__gte': xp || 199
      }
      await getLevels(params)
        .then(response => {
          if (response.status == 200) {
            setLevelData(response.data.results[0]);
            completedCount++;
            checkAllDataFetched();
          }
        })
        .catch(error => {
          console.log(error);
        })
    }

    // Get food items
    const getFoodItems = async () => {
      const token = await getUserToken();
      if (token && token !== null) {
        const location = await getMeLocationAndAnimate();
        await getFoods(token.token, {
          "status": "up",
          "user_location_latitude": location.latitude,
          "user_location_longitude": location.longitude
        })
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
    getMeUserStats();
    getFoodItems();
    getMeFoodCategories();

  }, [refreshCount]);

  // Initial location permissions and user's location
  useEffect(() => {
    getMeLocationAndAnimate();
  }, []);

  // Location permissions and map's initial location set to user's current location if permissions provided and also return the location
  const getMeLocationAndAnimate = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permissions denied');
      hideLoading();
      return;
    }
    // Gets user's current location
    let location = await Location.getCurrentPositionAsync({});
    // Update state and animate the mapview to that location
    location = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }
    setLocation(location);
    animateToNewCoordinates(mapRef, location.latitude, location.longitude, true);

    return location
  };

  const onRefresh = () => {
    showLoading();
    setRefreshCount(refreshCount + 1);
    setRefresh(true);
  };

  const notificationButtonPressed = () => {
    navigation.navigate('Notifications');
  }

  const categoryBtnPressed = (category) => {
    navigation.navigate('Search', {
      categorySearch: true,
      category: category
    });
  }

  const findMePressed = (location) => {
    console.log(location)
    setLocation(location);
  }

  const handleMapFoodCalloutPress = (foodID) => {
    navigation.navigate('FoodInfo', { foodID: foodID })
  }

  const showMapPressed = () => {
    if (!showMap) getMeLocationAndAnimate();
    setShowMap(!showMap);
  }

  function HomePage(props) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <MaterialButtonProfile style={styles.profileIcon} userData={userData} onPress={() => { props.bar.setIsOpenState(true) }} />
          <CupertinoSearchBarBasic
            editable={false}
            inputStyle="Search for food"
            inputBox="rgba(255,255,255,1)"
            style={styles.foodsearch}
            onPressFirst={() => { navigation.navigate('Search') }}
          ></CupertinoSearchBarBasic>
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
          

          <Text style={styles.categoriesHeading}>Categories</Text>
          <ScrollView horizontal={true} style={styles.categoryButtonsContainer}>
            {foodCategories && foodCategories.map(foodCategory => (
              <Categorybutton
                key={foodCategory.id}
                style={styles.categorybutton}
                categoryData={foodCategory}
                onPress={() => categoryBtnPressed(foodCategory)}
              />
            ))}
          </ScrollView>

          <Text style={styles.heading}>Near You</Text>
          <FoodCarousel foodItems={foodItems} colors={colors} />

          <View style={styles.findInMapHeadingContainer}>
            <Text style={styles.heading}>Find in map</Text>
            <CheckBox
              checked={showMap}
              onPress={showMapPressed}
              checkedColor={colors.highlight2}
            />
          </View>
          {showMap &&
            <CustomMap
              ref={mapRef}
              colors={colors}
            /*onFindMePress={findMePressed}*/
            >
              {location && (
                <CircularMarker
                  coordinate={location}
                  image={userData && userData.profile_picture ? { uri: userData.profile_picture } : require("../assets/images/default_profile.jpg")}
                  color="green"
                  title="Your Location"
                  description="Your current location"
                  colors={colors}
                />
              )}
              {foodItems && foodItems.map(foodItem => (
                foodItem.show_on_map && foodItem.location_latitude && foodItem.location_longitude &&
                <CircularMarker
                  key={foodItem.id}
                  isFoodItem={true}
                  foodID={foodItem.id}
                  coordinate={{
                    latitude: parseFloat(foodItem.location_latitude),
                    longitude: parseFloat(foodItem.location_longitude)
                  }}
                  image={foodItem.image ? { uri: foodItem.image } : require("../assets/images/default_food.png")}
                  color="red"
                  title={foodItem.name}
                  description={foodItem.description}
                  colors={colors}
                  onCalloutPress={handleMapFoodCalloutPress}
                />
              ))}
            </CustomMap>
            ||
            <View style={styles.alternativeMapContainer}>
              <Text style={styles.alternativeMapText}>Check the box above to view map</Text>
            </View>
          }
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
        <HomePage bar={{ setIsOpenState }} />
      </SideMenu>
    )
  };

  const menu = <SideBar
    colors={colors}
    userData={userData}
    userStats={userStats}
    levelData={levelData}
  />

  //MAIN HOME FUNCTION RETURN
  return (
    <SideMenuWithState menu={menu} isOpen={false} />
  )
}

const screenHeight = Dimensions.get('window').height;
const containerHeight = screenHeight * 0.5;

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.highlight1,
      paddingVertical: 20,
      //paddingBottom: 50 + 5, // This is the height of Footer + 5
    },
    profileIcon: {
      // position: 'absolute',
      // left: 20
    },
    notificationIcon: {
      // position: 'absolute',
      // right: 20,
    },
    header: {
      backgroundColor: colors.highlight1,
      height: 45,
      flexDirection: "row",
      width: '100%',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 20,
    },
    body: {
      backgroundColor: colors.background,
      minHeight: '105%'
    },
    foodsearch: {
      height: 44,
      width: 240,
      backgroundColor: colors.highlight1,
      borderRadius: 18,
      // marginTop: 9,
      // marginLeft: 29
    },
    categoriesHeading: {
      fontFamily: "roboto-700",
      color: colors.foreground,
      fontSize: 22,
      marginTop: 50,
      marginLeft: 29
    },
    categoryButtonsContainer: {
      width: '100%',
      height: 61,
      flexDirection: "row",
      marginTop: 20
      //justifyContent: "space-between",
      // marginLeft: 26
    },
    categorybutton: {
      height: 61,
      width: 68,
      marginRight: 25,
      color: colors.foreground,
      backgroundColor: colors.background2,
    },
    heading: {
      fontFamily: "roboto-700",
      color: colors.foreground,
      fontSize: 22,
      marginTop: 56,
      marginBottom: 10,
      marginLeft: 29
    },
    findInMapHeadingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    alternativeMapContainer: {
      width: '90%',
      height: 300,
      borderWidth: 1,
      borderColor: colors.foreground,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    alternativeMapText: {
      color: colors.foreground
    },
  });
}

export default Home;
