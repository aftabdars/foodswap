import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";

import ProgressBar from './ProgressBar';
import SidebarButton from "./SidebarButton";
import { useLoading } from "../assets/LoadingContext";
import { logoutUser } from "../utils/Auth";

const SideBar = (props) => {
  //Theme
  const colors = props.colors;
  const styles = createStyles(colors);
  // Loading
  const { showLoading, hideLoading } = useLoading();

  // States
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigation = useNavigation();

  // Data
  const userData = props.userData;
  const userStats = props.userStats;
  const levelData = props.levelData;

  const buttonPressed = (name, routeParams = {}) => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);

      if (name.toLowerCase() === 'logout') {
        logoutUser(navigation, showLoading, hideLoading);
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
          <Text style={styles.level}>{`Level ${levelData && levelData.level ? levelData.level : 0}`}</Text>
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
          icon="swap"
          iconType="entypo"
        />
        <SidebarButton
          title="Active FoodShares"
          onPress={() => buttonPressed('ActiveFoodShares')}
          icon="level-down"
          iconType="entypo"
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
        {userData && userData.is_staff === true &&
          < SidebarButton
            title="Admin Panel"
            onPress={() => buttonPressed('AdminPanel')}
            icon="dashboard"
          />
        }
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
