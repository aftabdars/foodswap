import React, { useContext, useEffect } from "react";
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getLeaderboard } from "../api/backend/Gamification";
import { getUserToken } from "../storage/UserToken";
import { ThemeContext, getColors } from "../assets/Theme";

const Leaderboard = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    // States
    const [refresh, setRefresh] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0);
    const [data, setData] = useState();

    // Keeping this sample data for now
    /*const leaderboardData = [
        { id: '111', username: 'JohnDoe', xp: 1200, profilePicture: require('../assets/images/default_profile.jpg') },
        { id: '222', username: 'JaneSmith', xp: 1000, profilePicture: require('../assets/images/default_profile.jpg') },
        { id: '333', username: 'BobJohnson', xp: 800, profilePicture: require('../assets/images/default_profile.jpg') },
        { id: '444', username: 'AliceWilliams', xp: 700 },
        { id: '555', username: 'CharlieBrown', xp: 650 },
        { id: '666', username: 'EvaDavis', xp: 600 },
        { id: '77', username: 'FrankMiller', xp: 550 },
        { id: '88', username: 'GraceWilson', xp: 500 },
        { id: '99', username: 'HarryMoore', xp: 450 },
        { id: '100', username: 'IvyClark', xp: 400 },
    ]; */

    // Gets the data
    useEffect(() => {
        let completedCount = 0;
        const MAX_COUNT = 1;

        const checkAllDataFetched = () => {
            if (completedCount === MAX_COUNT) {
                setRefresh(false);
            }
        };

        (async () => {
            const token = (await getUserToken()).token;
            await getLeaderboard(token, { 'name': 'xp' })
                .then(response => {
                    console.log(response.status);
                    console.log(response.data);

                    // API request to user for Top 3 users' profile pictures here

                    setData(response.data.results);

                    completedCount++;
                    checkAllDataFetched();
                })
                .catch(error => {
                    console.log(error.response.data);
                });
        })();
    }, [refreshCount]);

    const renderLeaderboardItem = ({ item, index }) => {
        const isTopThree = index < 3;

        return (
            <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={() => handleProfilePress(item)}>
                {isTopThree ? (
                    <LinearGradient
                        colors={[colors.highlight2, colors.highlight1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.leaderboardItem, styles.topThreeItem]}
                    >
                        <View style={styles.positionContainer}>
                            {index === 0 && <Icon name="crown" size={24} color={colors.foreground} />}
                            {index === 1 && <Text style={styles.positionIcon}>🥈</Text>}
                            {index === 2 && <Text style={styles.positionIcon}>🥉</Text>}
                        </View>
                        <View style={styles.profileContainer}>
                            <Image source={item.profilePicture} style={styles.profilePicture} />
                            <Text style={styles.username}>{item.username}</Text>
                        </View>
                        <Text style={styles.xp}>{item.xp} XP</Text>
                    </LinearGradient>
                ) : (
                    <View style={[styles.leaderboardItem, { backgroundColor: colors.highlight2 }]}>
                        <View style={styles.positionContainer}>
                            <Text style={styles.position}>{index + 1}</Text>
                        </View>
                        <View style={styles.profileContainer}>
                            <Image source={item.profilePicture} style={styles.profilePicture} />
                            <Text style={styles.username}>{item.username}</Text>
                        </View>
                        <Text style={styles.xp}>{item.xp} XP</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };
    const handleProfilePress = (item) => {
        // Handle the press event for the profile item
        console.log(`Profile pressed: ${item.username}`);
    };

    const onRefresh = () => {
        setRefreshCount(refreshCount + 1);
        setRefresh(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleLeft}>Top 100 - XP</Text>
                {/*<Text style={styles.titleRight}>Weekly</Text>*/}
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderLeaderboardItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={onRefresh}
                        colors={[colors.highlight1, colors.highlight2]}
                        tintColor={colors.highlight2}
                    />
                }
            />
        </View>
    );
};

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: colors.background,
        },
        titleContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 5,
            marginBottom: 15
        },
        titleLeft: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.foreground
        },
        titleRight: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.foreground
        },
        leaderboardItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 8,
            padding: 12,
            marginVertical: 4,
            elevation: 2,
        },
        topThreeItem: {
            borderRadius: 16,
            backgroundColor: 'rgba(255, 223, 23, 0.8)', // Gold color for the top three
        },
        positionContainer: {
            marginRight: 12,
        },
        positionIcon: {
            fontSize: 24,
            color: colors.foreground,
        },
        position: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        profileContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        profilePicture: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
        },
        usernameContainer: {
            flex: 1,
        },
        username: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        xp: {
            fontSize: 18,
            color: colors.foreground,
        },
    });
}

export default Leaderboard;
