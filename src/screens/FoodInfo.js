import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Image, Text, ScrollView, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from 'react-native-tab-view';
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import EntypoIcon from "react-native-vector-icons/Entypo";
import OcticonsIcon from "react-native-vector-icons/Octicons";
import { useFonts } from 'expo-font';

import ProgressBar from '../components/ProgressBar'
import { getProfile, getUserStats } from '../api/backend/User';
import { getUserToken } from "../storage/UserToken";
import { getLevels } from "../api/backend/Gamification";
import { ThemeContext, getColors } from '../assets/Theme';
import { useNavigation } from "@react-navigation/native";
import foodData from '../assets/dummy_food_feedback'


function FoodInfo(props) {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    //fetchuser
    const [userData, setUserData] = useState({username: 'Anonymous'});
    const [userStats, setUserStats] = useState();
    const [levelData, setLevelData] = useState();

    const navigation = useNavigation();

    const handleEditProfile = () => {
      navigation.navigate('EditProfile');
    }

    // Gets user profile
    useEffect(() => {
      const getUserProfile = async () => {
        const token = await getUserToken();
        console.log(token);
        getProfile(token.token)
        .then(response => {
          if (response.status == 200) {
            setUserData(response.data);
          }
        })
        .catch(error => {
          console.log(error);
        })
      }
      getUserProfile();
    }, []);

    // Gets user stats
    useEffect(() => {
      if (userData && userData.id) {
        const getMeUserStats = async () => {
          getUserStats(userData.id)
          .then(response => {
            console.log(response.data);
            if (response.status == 200) setUserStats(response.data);
          })
          .catch(error => {
            console.log(error);
          })
        }
        getMeUserStats();
      }
    }, [userData]);

    // Gets user level and level's data from user's current XP
    useEffect(() => {
      if (userStats) {
        const getLevelData = async () => {
          const params = { // Retrieves level row having xp_start >= user_xp <= xp_end
            'xp_start__lte': userStats? userStats.xp: 0,
            'xp_end__gte': userStats? userStats.xp: 199
          }
          getLevels(params)
          .then(response => {
            console.log(response.data);
            if (response.status == 200) setLevelData(response.data.results[0]);
          })
          .catch(error => {
            console.log(error);
          })
        }
        getLevelData();
      }
    }, [userStats]);

    //TABBED VIEW/////////////////////////////////
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'first', title: 'Active Foods' },
      { key: 'second', title: 'Swapped Foods' },
      { key: 'third', title: 'Shared Foods' },
    ]);
    /////////////////////////////////////////////


  const [loaded] = useFonts({
    'roboto-700': require('../assets/fonts/roboto-700.ttf'),
    'roboto-regular': require('../assets/fonts/roboto-regular.ttf')
  });

  if (!loaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profilecontainer}>
        <View style={styles.imageStack}>
          <Image
            source={{uri: foodData.food.image} || require("../assets/images/image_(1).png")}
            resizeMode="contain"
            style={styles.image}
          ></Image>
        </View>
        <Text style={styles.profileName}>{foodData.food.name}</Text>
        <Text style={[styles.profileName, {fontSize: 14, textDecorationLine:'underline'}]}>By {foodData.food.owner}</Text>

        <View style={{flex:1, alignItems:'center', justifyContent:'space-between', width: '100%', flexDirection: 'row'}}>
          <View style={{width: 150, marginRight:15}}>
            <Text style={{color:'#fff', fontFamily: "roboto-700", fontSize: 10}}>Upload: {foodData.food.date_added.substring(0,10)}</Text>
            <Text style={{color:'#fff', fontFamily: "roboto-700", fontSize: 10}}>Expiry: {foodData.food.date_added.substring(0,10)}</Text>
          </View>
          <MaterialButtonSuccess onPress={()=>{console.log('gotoprofile')}}>{foodData.food.up_for}</MaterialButtonSuccess>
          <View style={{width: 150, flex:1, alignItems:'flex-end'}}>
            <Text style={{color:'#fff', fontFamily: "roboto-700", fontSize: 10}}>Status: {foodData.food.is_being_shared? 'Being Shared' : foodData.food.is_being_swapped? 'Being Swapped' : 'Free'}</Text>
            <Text style={{color:'#fff', fontFamily: "roboto-700", fontSize: 10}}>{foodData.food.status} for {foodData.food.up_for}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.detailscontainer}>
        <Text style={styles.headings}>About</Text>
        <View style={styles.detailsgroup}>
        <Text style={styles.detailsfont}>{userData.about || 'Hidden'}</Text>
        </View>
      </View>

      <View style={styles.detailscontainer}>
        <Text style={styles.headings}>Details</Text>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="phone" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userData.phone || 'Hidden'}</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="location-pin" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userData.address || 'Hidden'}</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="email" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userData.email || 'Hidden'}</Text>
        </View>
        <View style={styles.detailsgroup}>
        <EntypoIcon name="calendar" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>Member Since {userData.date_joined? userData.date_joined.substring(0,4): 'Hidden'}</Text>
        </View>
        <View style={styles.detailsgroup}>
        <EntypoIcon name="add-user" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>Following {userStats? userStats.following_count : 0}</Text>
        </View>
        <View style={styles.detailsgroup}>
        <EntypoIcon name="remove-user" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>Followers {userStats? userStats.follower_count : 0}</Text>
        </View>
      </View>

      <View style={styles.detailscontainer}>
        <Text style={styles.headings}>Stats</Text>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="star" style={styles.icon}></EntypoIcon>
          <Text style={{color: colors.foreground, left: -32, fontFamily: "roboto-700", fontSize: 15, textAlign: "center"}}>{levelData? String(levelData.level).padStart(3, '0') : '000'}</Text>
          <ProgressBar xp={[userStats? userStats.xp : 0, levelData? levelData.xp_end : 1]} />
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="arrow-bold-up" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats? userStats.food_count : 0} food uploaded</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="swap" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats? userStats.foodswap_count : 0} food items swapped</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="level-down" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats? userStats.foodshare_count : 0} food items shared</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="level-up" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats? userStats.food_taken_count : 0} food items taken</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="bowl" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats? userStats.total_foodiez : 0} foodiez earned</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="trophy" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats? userStats.achievements_completed : 0} Achievements completed</Text>
        </View>
      </View>

      <TabView style={styles.tabbedcontainer}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
      {/* Acheivments */}
      <View style={styles.detailscontainer}>
        <Text style={styles.headings}>Achievements</Text>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="star" style={styles.icon}></EntypoIcon>
          <Text style={{color: colors.foreground, left: -32, fontFamily: "roboto-700", fontSize: 15, textAlign: "center"}}>001</Text>
          <ProgressBar xp={[30,60]} />
        </View>
      </View>
    </ScrollView>
  );
}

//TABBED VIEWS////////////////////////////////////////////////

const FirstRoute = (colors) => (
  <View style={{ flex: 1, backgroundColor: colors.background }} />
);

const SecondRoute = (colors) => (
  <View style={{ flex: 1, backgroundColor: colors.background }} />
);

const ThirdRoute = (colors) => (
  <View style={{ flex: 1, backgroundColor: colors.background }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute
});
//////////////////////////////////////////////////////////////


function createStyles(colors) {
  return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
        //opacity: 0.77
      },
      profilecontainer: {
        minHeight: 330,
        paddingTop: 50,
        minWidth: 100,
        backgroundColor: colors.highlight1,
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0
      },
      image: {
        width: 155,
        height: 155,
        position: "relative",
        borderRadius: 100
      },
      editProfilePicture: {
        height: 44,
        width: 44,
        position: "relative",
        bottom: 155,
        left: 130
      },
      imageStack: {
        width: 181,
        height: 155,
        left: 13
      },
      profileName: {
        fontFamily: "roboto-700",
        color: '#fff',
        fontSize: 22,
        textAlign: "center",
      },
      ignorethis: {
        height: 36,
        width: 100,
        marginTop: 352,
        marginLeft: 138
      },
      headings: {
        fontFamily: "roboto-700",
        color: colors.foreground,
        fontSize: 22,
        marginLeft: 0
      },
      detailscontainer: {
        width: 265,
        height: 'auto',
        justifyContent: "space-between",
        marginTop: 33,
        marginLeft: 55
      },
      detailsgroup: {
        minWidth: 200,
        height: 40,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
      },
      icon: {
        color: colors.highlight1,
        fontSize: 40
      },
      detailsfont: {
        fontFamily: "roboto-700",
        color: colors.foreground,
        fontSize: 15,
        left: 25
      },
      tabbedcontainer: {
        width: '100%',
        height: 360,
        justifyContent: "space-between",
        marginTop: 33,
        marginLeft: 0,
      }
    }
  )
}
export default FoodInfo;