import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getColors, ThemeContext } from '../assets/Theme';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import EntypoIcon from "react-native-vector-icons/Entypo";

import ProgressBar from "../components/ProgressBar";
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialButtonDanger from "../components/MaterialButtonDanger";
import { useRoute } from '@react-navigation/native';
import { getUser, getUserStats } from '../api/backend/User';
import { getUserToken } from '../storage/UserToken';
import { getProfile } from "../storage/User";
import { getLevels, getUserAchievements } from '../api/backend/Gamification';
import { deleteFollow, postFollow } from '../api/backend/Social';
import CustomModal from '../components/CustomModal';
import CustomModalButton from '../components/CustomModalButton';
import { formatDateTimeString, formatNumberMetricPrefix } from '../utils/Format';
import UserFoodTabs from '../components/UserFoodTabs';
import PaginatedFlatList from '../components/PaginatedFlatList';


const PublicProfile = ({ navigation }) => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const route = useRoute();
    const containerHeight = useSharedValue(0);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isContainerOpen, setContainerOpen] = useState(false);
    const [clientUserID, setClientUserID] = useState();
    const [userData, setUserData] = useState(route.params?.userData);
    const [userStats, setUserStats] = useState();
    const [levelData, setLevelData] = useState();

    // Gets client user profile ID
    useEffect(() => {
        const getClientUserProfile = async () => {
            try {
                setClientUserID((await getProfile()).id);
            }
            catch (error) {
                console.log(error);
            }
        }
        getClientUserProfile();
    }, []);

    // Get userData either from route or API call if userID is passed
    useEffect(() => {
        const userID = route.params?.userID;
        if (userID) {
            const getMeUserData = async () => {
                const token = await getUserToken();
                await getUser(userID, token.token)
                    .then(response => {
                        setUserData(response.data);
                    })
                    .catch(error => { })
            }
            getMeUserData();
        }
    }, []);

    // Gets user's stats data
    useEffect(() => {
        if (userData) {
            const getMeUserStats = async () => {
                const token = (await getUserToken()).token;
                await getUserStats(userData.id, token)
                    .then(response => {
                        setUserStats(response.data);
                    })
                    .catch(error => { })
            }
            getMeUserStats();
        }
    }, [userData]);

    // Gets user's completed achievements (PaginatedFlatList will handle the calling to this function)
    const getMeUserAchievements = async (page) => {
        const token = (await getUserToken()).token;
        const params ={
            user: userData.id,
            page: page
        };
        let response;
        try {
            response = await getUserAchievements(token, params);
            return response.data;
        }
        catch(error) {}
    }

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
                    .catch(error => { })
            }
            getLevelData();
        }
    }, [userStats]);

    const toggleContainerAnimation = () => {
        containerHeight.value = withTiming(isContainerOpen ? 0 : 1);
    };

    /*const containerStyle = useAnimatedStyle(() => {
        return {
            height: `${containerHeight.value * 22}%`,
        };
    });*/

    const toggleContainer = () => {
        setContainerOpen(!isContainerOpen);
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const backPressed = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }

    const followPressed = async () => {
        const token = (await getUserToken()).token;
        await postFollow(token, { 'user': userData.id, 'follower': clientUserID })
            .then(response => {
                setUserData(prevData => {
                    return {
                        ...prevData,
                        client_follow_object_id: response.data.id
                    };
                });
                console.log(response.data);
            })
            .catch(error => { });
    }
    const unfollowPressed = async () => {
        const token = (await getUserToken()).token;
        await deleteFollow(userData.client_follow_object_id, token)
            .then(response => {
                setUserData(prevData => {
                    return {
                        ...prevData,
                        client_follow_object_id: null
                    };
                });
                console.log(response.data);
            })
            .catch(error => { });
    }

    const StatsBox = ({ title, value, iconName }) => (
        <View style={styles.statsBox}>
            <EntypoIcon name={iconName} style={styles.statIcon}></EntypoIcon>
            <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{title}</Text>
            </View>
        </View>
    )

    const AchievementBox = ({ name, level, image }) => (
        <TouchableOpacity>
            <View style={styles.achievementBox}>
                <Image
                    source={require("../assets/images/default_achievement.png")}
                    style={styles.achievementImage}
                    resizeMode='contain'
                />
                <Text style={styles.achievementTitle}>{name} {level}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.profileContainer}>
                    <View style={styles.topButtonsContainer}>
                        <TouchableOpacity onPress={backPressed}>
                            <EntypoIcon name="chevron-thin-left" style={styles.backButton}></EntypoIcon>
                        </TouchableOpacity>
                        {userData && clientUserID && userData.id != clientUserID &&
                            <TouchableOpacity onPress={toggleModal}>
                                <EntypoIcon name="dots-three-vertical" style={styles.dotsButton} />
                            </TouchableOpacity>
                        }
                        <CustomModal
                            style={{ marginTop: 15, marginRight: 10 }}
                            visible={isModalVisible}
                            onRequestClose={toggleModal}
                            colors={colors}
                        >
                            <CustomModalButton colors={colors} onPress={() => { console.log('Message') }}>
                                Message
                            </CustomModalButton>
                            <CustomModalButton colors={colors} onPress={() => { console.log('Block pressed') }}>
                                Block
                            </CustomModalButton>
                        </CustomModal>
                    </View>
                    <View style={styles.profileImageAndNameContainer}>
                        <Image
                            source={userData && userData.profile_picture ? { uri: userData.profile_picture } : require("../assets/images/default_profile.jpg")}
                            style={styles.profileImage}
                            resizeMode='contain'
                        />
                        {userData && (userData.first_name || userData.last_name) &&
                            <Text style={styles.name}>{`${userData.first_name} ${userData.last_name}`}</Text>
                        }
                        <Text style={styles.username}>{`@${userData && userData.username || '_foodswapuser'}`}</Text>
                    </View>
                    <View style={styles.levelContainer}>
                        <EntypoIcon name="star" style={styles.levelIcon}></EntypoIcon>
                        <Text style={styles.levelText}>{levelData ? String(levelData.level).padStart(3, '0') : '000'}</Text>
                    </View>
                    <ProgressBar
                        xp={[userStats ? userStats.xp : 0, levelData ? levelData.xp_end : 199]}
                        width={300}
                        color={colors.background}
                        xpFront={true}
                    />
                    {userData && clientUserID && userData.id != clientUserID &&
                        (
                            userData.client_follow_object_id != null ?
                                <MaterialButtonDanger
                                    style={styles.followbtn}
                                    captionStyle={styles.followBtnCaption}
                                    onPress={unfollowPressed}
                                >
                                    Unfollow
                                </MaterialButtonDanger>
                                :
                                <MaterialButtonSuccess
                                    style={styles.followbtn}
                                    captionStyle={styles.followBtnCaption}
                                    onPress={followPressed}
                                >
                                    Follow
                                </MaterialButtonSuccess>
                        )
                    }
                </View>
                {userData && userData.about && userData.about !== null &&
                    <View style={styles.aboutContainer}>
                        <Text style={styles.headingText}>About:</Text>
                        <Text style={styles.detailabout}>{userData.about}</Text>
                    </View>
                }
                <Text style={styles.headingText}>Details:</Text>
                <TouchableOpacity style={styles.sectionContainer} onPress={() => { toggleContainer(); toggleContainerAnimation(); }}>
                    {!isContainerOpen ?
                        <Text style={styles.closedContainerText}>Tap to view</Text>
                        : (
                            <Animated.View styles={styles.sectionAnimatedContainer}>
                                <View style={styles.detailGroup}>
                                    <EntypoIcon name="phone" style={styles.icon}></EntypoIcon>
                                    <Text style={styles.detailLabel}>Phone:</Text>
                                    <Text style={styles.detailValue}>{userData && userData.phone || 'Hidden'}</Text>
                                </View>
                                <View style={styles.detailGroup}>
                                    <EntypoIcon name="location-pin" style={styles.icon}></EntypoIcon>
                                    <Text style={styles.detailLabel}>Location:</Text>
                                    <Text style={styles.detailValue}>{userData && userData.location || 'Hidden'}</Text>
                                </View>
                                <View style={styles.detailGroup}>
                                    <EntypoIcon name="email" style={styles.icon}></EntypoIcon>
                                    <Text style={styles.detailLabel}>Email:</Text>
                                    <Text style={styles.detailValue}>{userData && userData.email || 'Hidden'}</Text>
                                </View>
                                <View style={styles.detailGroup}>
                                    <EntypoIcon name="calendar" style={styles.icon}></EntypoIcon>
                                    <Text style={styles.detailLabel}>Member Since:</Text>
                                    <Text style={styles.detailValue}>
                                        {userData && userData.date_joined &&
                                            formatDateTimeString(userData.date_joined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })
                                            || 'Hidden'}
                                    </Text>
                                </View>
                                <View style={styles.detailGroup}>
                                    <EntypoIcon name="add-user" style={styles.icon}></EntypoIcon>
                                    <Text style={styles.detailLabel}>Following:</Text>
                                    <Text style={styles.detailValue}>{userStats && userStats.following_count || 0}</Text>
                                </View>
                                <View style={styles.detailGroup}>
                                    <EntypoIcon name="remove-user" style={styles.icon}></EntypoIcon>
                                    <Text style={styles.detailLabel}>Followers:</Text>
                                    <Text style={styles.detailValue}>{userStats && userStats.follower_count || 0}</Text>
                                </View>
                            </Animated.View>)}
                </TouchableOpacity>

                <Text style={styles.headingText}>Stats:</Text>
                {userStats &&
                    <View style={styles.statsContainer}>
                        <StatsBox title='Food Uploaded' value={userStats.food_count} iconName='arrow-bold-up' />
                        <StatsBox title='Food Swapped' value={userStats.foodswap_count} iconName='swap' />
                        <StatsBox title='Food Shared' value={userStats.foodshare_count} iconName='level-down' />
                        <StatsBox title='Food Taken' value={userStats.food_taken_count} iconName='level-up' />
                        <StatsBox title='Total Foodiez Earned' value={formatNumberMetricPrefix(userStats.total_foodiez)} iconName='bowl' />
                        <StatsBox title='Achievements Completed' value={userStats.achievements_completed} iconName='trophy' />
                    </View>
                }
                <Text style={styles.headingText}>Achievements:</Text>
                <View style={styles.achievementsContainer}>
                    {userData &&
                        <PaginatedFlatList
                            colors={colors}
                            loadData={getMeUserAchievements}
                            horizontal={true}
                            renderItem={({ item }) => (
                                <AchievementBox
                                    key={item.id}
                                    name={item.achievement_name}
                                    level={item.achievement_level}
                                    image={item.achievement_image}
                                />
                            )}
                            alternativeText={"User hasn't completed any achievements"}
                            alternativeTextStyle={styles.noAchievementsText}
                        />
                    }
                </View>
                <Text style={styles.headingText}>Food:</Text>
                {userData &&
                    <UserFoodTabs style={{ marginTop: 10 }} userID={userData.id} />
                }
            </ScrollView>
        </View>
    );
};

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        profileContainer: {
            minWidth: 100,
            minHeight: 340,
            backgroundColor: colors.highlight1,
            flex: 1,
            justifyContent: 'space-around',
            alignItems: 'center',
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            paddingVertical: 25
        },
        profileImageAndNameContainer: {
            alignItems: 'center',
            marginBottom: 10
        },
        levelContainer: {
            minWidth: 200,
            height: 40,
            marginLeft: 32,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        levelText: {
            color: colors.foreground,
            fontSize: 15,
            left: -32,
            fontFamily: "roboto-700",
            textAlign: 'center',
        },
        levelIcon: {
            color: colors.background,
            fontSize: 40,
        },
        icon: {
            color: colors.highlight1,
            fontSize: 40,
        },
        followbtn: {
            width: '60%',
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: 20,
        },
        followBtnCaption: {
            color: 'white',
            fontWeight: 'bold',
        },
        topButtonsContainer: {
            width: '100%',
            flexDirection: "row",
            justifyContent: "space-between",
        },
        backButton: {
            color: '#fff',
            fontSize: 25,
            marginLeft: 10
        },
        dotsButton: {
            color: '#fff',
            fontSize: 25,
            marginRight: 10
        },
        profileImage: {
            width: 155,
            height: 155,
            position: "relative",
            borderRadius: 100
        },
        name: {
            color: colors.foreground,
            fontSize: 22,
            textAlign: "center",
        },
        username: {
            fontSize: 16,
            color: colors.foreground,
            marginTop: 5,
        },
        aboutContainer: {
            marginVertical: 10,
        },
        detailabout: {
            fontSize: 16,
            color: colors.foreground,
            fontWeight: 'bold',
            marginTop: 10,
            marginLeft: 20,
        },
        sectionContainer: {
            flexGrow: 1,
            marginBottom: 20,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 10,
            padding: 20,
            elevation: 3,
        },
        sectionAnimatedContainer: {

        },
        closedContainerText: {
            textAlign: 'center',
            fontSize: 16,
            color: colors.foreground,
        },
        detailGroup: {
            flexDirection: "row",
            flexWrap: 'wrap',
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: 10,
        },
        detailLabel: {
            color: colors.foreground,
            fontSize: 15,
            left: 25
        },
        detailValue: {
            flexWrap: 'wrap',
            fontSize: 14,
            left: 30,
            color: colors.foreground,
        },
        statsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            paddingHorizontal: 10,
            marginBottom: 10,
        },
        headingText: {
            color: colors.foreground,
            fontSize: 24,
            fontWeight: 'bold',
            marginTop: 10,
            marginLeft: 8,
        },
        statsBox: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            backgroundColor: colors.background,
            borderRadius: 15,
            padding: 10,
            paddingRight: 35,
            marginVertical: 25,
            //marginHorizontal: 5,
            width: '45%',
            marginBottom: 0,
            borderColor: colors.highlight1,
            borderWidth: 2,
        },
        statIcon: {
            fontSize: 30,
            color: colors.highlight1,
        },
        statTextContainer: {
            marginLeft: 10,
        },
        statValue: {
            fontSize: 16,
            color: colors.foreground,
            fontWeight: 'bold',
        },
        statLabel: {
            fontSize: 12,
            color: colors.foreground,
            fontWeight: 'bold',
            flexWrap: 'wrap',
        },
        achievementsContainer: {
            borderRadius: 1,
            borderColor: colors.highlight1,
            borderWidth: 2,
            flexDirection: 'row',
            margin: 10,
        },
        achievementBox: {
            backgroundColor: colors.background,
            padding: 15,
            margin: 0,
            borderRightColor: colors.highlight1,
            borderRightWidth: 2,
            alignItems: 'center',
        },
        achievementImage: {
            width: 80,
            height: 120,
            borderRadius: 10,
            marginBottom: 10,
        },
        achievementTitle: {
            flexWrap: 'wrap',
            fontSize: 14,
            color: colors.foreground,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        noAchievementsText: {
            color: colors.foreground,
            margin: 10,
        },
    });
}

export default PublicProfile;
