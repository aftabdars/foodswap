import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Image, Text, ScrollView } from "react-native";
import Editbutton from "../components/Editbutton";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useFonts } from 'expo-font';

import ProgressBar from '../components/ProgressBar'
import { getProfile, getStats } from "../storage/User";
import { getLevels } from "../api/backend/Gamification";
import { ThemeContext, getColors } from '../assets/Theme';
import { useNavigation } from "@react-navigation/native";


function Profile(props) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  //fetchuser
  const [userData, setUserData] = useState();
  const [userStats, setUserStats] = useState();
  const [levelData, setLevelData] = useState();

  const navigation = useNavigation();

  // Handle functionality for user profile other than client himself here

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  }

  useEffect(() => {
    // Gets client user profile
    const getUserProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile && profile !== null) setUserData(profile);
      }
      catch (error) {
        console.log(error);
      }
    }
    // Gets client user stats
    const getMeUserStats = async () => {
      try {
        const stats = await getStats();
        if (stats && stats !== null) setUserStats(stats);
      }
      catch (error) {
        console.log(error);
      }
    }
    getUserProfile();
    getMeUserStats();
  }, []);

  // Gets user level and level's data from user's current XP
  useEffect(() => {
    if (userStats) {
      const getLevelData = async () => {
        const params = { // Retrieves level row having xp_start >= user_xp <= xp_end
          'xp_start__lte': userStats ? userStats.xp : 0,
          'xp_end__gte': userStats ? userStats.xp : 199
        }
        await getLevels(params)
          .then(response => {
            //console.log(response.data);
            if (response.status == 200) setLevelData(response.data.results[0]);
          })
          .catch(error => {
            console.log(error);
          })
      }
      getLevelData();
    }
  }, [userStats]);

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
            source={userData && userData.profile_picture ? { uri: userData.profile_picture } : require("../assets/images/default_profile.jpg")}
            resizeMode="contain"
            style={styles.image}
          ></Image>
          <Editbutton style={styles.editProfilePicture} onPress={handleEditProfile} colors={colors}></Editbutton>
        </View>
        <Text style={styles.profileName}>{userData && userData.first_name} {userData && userData.last_name}</Text>
        <Text style={styles.profileName}>{userData && userData.username}</Text>
      </View>

      <View style={styles.detailscontainer}>
        <Text style={styles.headings}>About</Text>
        <View style={styles.detailsgroup}>
          <Text style={styles.detailsfont}>{userData && userData.about || 'Hidden'}</Text>
        </View>
      </View>

      <View style={styles.detailscontainer}>
        <Text style={styles.headings}>Details</Text>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="phone" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userData && userData.phone || 'Hidden'}</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="location-pin" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userData && userData.address || 'Hidden'}</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="email" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userData && userData.email || 'Hidden'}</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="calendar" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>Member Since {userData && userData.date_joined ? userData.date_joined.substring(0, 4) : 'Hidden'}</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="add-user" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>Following {userStats ? userStats.following_count : 0}</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="remove-user" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>Followers {userStats ? userStats.follower_count : 0}</Text>
        </View>
      </View>

      <View style={styles.detailscontainer}>
        <Text style={styles.headings}>Stats</Text>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="star" style={styles.icon}></EntypoIcon>
          <Text style={{ color: colors.foreground, left: -32, fontFamily: "roboto-700", fontSize: 15, textAlign: "center" }}>{levelData ? String(levelData.level).padStart(3, '0') : '000'}</Text>
          <ProgressBar xp={[userStats ? userStats.xp : 0, levelData ? levelData.xp_end : 1]} />
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="arrow-bold-up" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats ? userStats.food_count : 0} food uploaded</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="swap" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats ? userStats.foodswap_count : 0} food items swapped</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="level-down" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats ? userStats.foodshare_count : 0} food items shared</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="level-up" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats ? userStats.food_taken_count : 0} food items taken</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="bowl" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats ? userStats.total_foodiez : 0} foodiez earned</Text>
        </View>
        <View style={styles.detailsgroup}>
          <EntypoIcon name="trophy" style={styles.icon}></EntypoIcon>
          <Text style={styles.detailsfont}>{userStats ? userStats.achievements_completed : 0} Achievements completed</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      //opacity: 0.77
    },
    profilecontainer: {
      minWidth: 100,
      minHeight: 340,
      backgroundColor: colors.highlight1,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
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
      color: colors.foreground,
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
      marginVertical: 33,
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
  }
  )
}
export default Profile;
