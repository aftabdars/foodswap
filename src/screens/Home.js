import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import CupertinoFooter1 from "../components/CupertinoFooter1";
import MaterialButtonProfile from "../components/MaterialButtonProfile";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import MaterialSpinner from "../components/MaterialSpinner";
import Categorybutton from "../components/Categorybutton";
import FoodPreview from "../components/FoodPreview.js";
import { useFonts } from 'expo-font';
import Carousel from "react-native-snap-carousel";

import { getProfile } from '../api/backend/User';
import { getUserToken } from "../storage/Token";
import { getFoodCategories, getFoods } from "../api/backend/Food.js";
import { SafeAreaView } from "react-native-safe-area-context";


function Home(props) {
  // States
  const [userData, setUserData] = useState({username: 'Anonymous'}); 
  const [activeIndex, setActiveIndex] = useState(0);
  const [foodItems, setFoodItems] = useState([{"id": 0, "name": "food", "descripttion": "Gealthy food", "status": "up"}]);
  const [foodCategories, setFoodCategories] = useState();
  
  // References
  const carouselRef = useRef(null);

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

  // Render food items in carousel
  const renderItem = ({ item, index }) => (
    <FoodPreview foodData={item}></FoodPreview>
  );

  const [loaded] = useFonts({
    'roboto-700': require('../assets/fonts/roboto-700.ttf'),
    'roboto-regular': require('../assets/fonts/roboto-regular.ttf')
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.hiUser}>Hi, {userData && userData.username}</Text>
          <MaterialButtonProfile style={styles.profileIcon}></MaterialButtonProfile>
        </View>

        <CupertinoSearchBarBasic
          inputStyle="Search for food"
          inputBox="rgba(255,255,255,1)"
          style={styles.foodsearch}
        ></CupertinoSearchBarBasic>
        <MaterialSpinner style={styles.materialSpinner}></MaterialSpinner>

        <Text style={styles.categoriesHeading}>Categories</Text>
        <ScrollView horizontal={true} style={styles.categoryButtonsContainer}>
          {foodCategories && foodCategories.map(foodCategory => (
            <Categorybutton key={foodCategory.id} style={styles.categorybutton} categoryData={foodCategory} />
          ))}
        </ScrollView>

        <Text style={styles.heading}>Near You</Text>
        <View style={styles.foodCarousel}>
          <Carousel
            layout="default"
            ref={carouselRef}
            data={foodItems}
            sliderWidth={300}
            itemWidth={330}
            renderItem={renderItem}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
        </View>

        <Text style={styles.heading}>Find in map</Text>
        <View style={{ width: 340, height: 250, marginBottom: 20, alignSelf: 'center', borderWidth: 1, borderColor: '#fff' }}>
          <Image
            source={require("../assets/images/map_preview.png")}
            //resizeMode="contain"
            style={{width: '100%', height: '100%'}}
          ></Image>
        </View>
      </ScrollView>

      <CupertinoFooter1 style={styles.cupertinoFooter1}></CupertinoFooter1>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(215,215,215,1)",
    paddingTop: 20,
    paddingBottom: 50 + 5, // This is the height of Footer + 5
  },
  cupertinoFooter1: {
    position: 'absolute',
    height: 50,
    width: 375,
    bottom: 0
  },
  hiUser: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 24,
    position: 'absolute',
    left: 0,
    marginTop: 9
  },
  profileIcon: {
    position: 'absolute',
    right: 0
  },
  header: {
    height: 46,
    flexDirection: "row",
    marginTop: 0,
    marginLeft: 29,
    marginRight: 23
  },
  foodsearch: {
    height: 44,
    width: 323,
    backgroundColor: "rgba(255,255,255,1)",
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
    color: "#121212",
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
    marginRight: 25
  },
  heading: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    marginTop: 56,
    marginBottom: 10,
    marginLeft: 29
  },
  foodCarousel: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
   }
});

export default Home;
