import React, { useEffect, useState } from "react";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";

import ProgressBar from './ProgressBar';
import SidebarButton from "./SidebarButton";
import { getProfile, getStats, removeProfile, removeStats } from "../storage/User";
import { getLevels } from "../api/backend/Gamification";
import { getUserToken, removeUserToken } from "../storage/UserToken";
import { postLogout } from "../api/backend/Auth";
import { useLoading } from "../assets/LoadingContext";

const SideBar = (props) => {
  //Theme
  const colors = props.colors;
  const styles = createStyles(colors);
  // Loading
  //const { showLoading, hideLoading } = useLoading();

  // States
  const [userData, setUserData] = useState();
  const [userStats, setUserStats] = useState();
  const [levelData, setLevelData] = useState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigation = useNavigation();

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
            if (response.status == 200) setLevelData(response.data.results[0]);
          })
          .catch(error => {
            console.log(error);
          })
      }
      getLevelData();
    }
  }, [userStats]);

  const handleLogout = async () => {
    //showLoading();
    const token = (await getUserToken()).token;
    await postLogout(token)
      .then(response => { // Response status 204 if deleted
        console.log(response.status);
        console.log(response.data);

        // Clears some data from user storage
        removeProfile();
        removeStats();
        removeUserToken();
        //removeUserTheme();

        // Navigate to initial page like Login
        navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
        //hideLoading();
      })
  }

  const buttonPressed = (name, routeParams = {}) => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);

      if (name.toLowerCase() === 'logout') {
        handleLogout();
      }
      else {
        navigation.navigate(name, routeParams);
      }
      
      // Lock will release after 2 seconds
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 2000);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{userData && userData.username}</Text>
          <Text style={styles.level}>{`Level ${levelData && levelData.level? levelData.level : 0}`}</Text>
          <ProgressBar xp={[userStats ? userStats.xp : 0, levelData ? levelData.xp_end : 1]} height={8} />
        </View>
        <Avatar
          rounded
          style={styles.avatar}
          size="large"
          source={userData && userData.profile_picture ? { uri: userData.profile_picture } : require("../assets/images/default_profile.jpg")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <SidebarButton
          title="Find Users"
          onPress={() => buttonPressed('Search', { userSearch: true })}
          icon="search"
        />
        <SidebarButton
          title="Active FoodSwaps"
          onPress={() => buttonPressed('ActiveFoodSwaps')}
          icon="check"
        />
        <SidebarButton
          title="Leaderboard"
          onPress={() => buttonPressed('Leaderboard')}
          icon="star"
        />
        <SidebarButton
          title="Achievements"
          onPress={() => buttonPressed('Achievements')}
          icon="trophy"
          iconType="entypo"
        />
        <SidebarButton
          title="Transactions History"
          onPress={() => buttonPressed('TransactionsHistory')}
          icon="timeline"
        />
        <SidebarButton
          title="Send Foodiez"
          onPress={() => buttonPressed('TransferFoodiez')}
          icon="credit-card"
        />
        <SidebarButton
          title="Logout"
          onPress={() => buttonPressed('Logout')}
          icon="sign-out"
          iconType="font-awesome"
        />
      </View>
    </View>
  )
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      paddingTop: 50,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    buttonContainer: {
      marginTop: 10,
    },
    avatar: {
      position: 'absolute',
      right: 10,
      top: -10,
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    userInfo: {
      marginLeft: 0,
    },
    username: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.foreground,
      marginBottom: 5,
    },
    level: {
      fontSize: 18,
      marginTop: 5,
      color: colors.foreground,
    },
    xp: {
      fontSize: 16,
      color: colors.foreground,
      marginTop: 5,
    },
  });
}

export default SideBar
