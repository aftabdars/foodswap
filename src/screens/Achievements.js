import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";

import { getColors, ThemeContext } from '../assets/Theme';
import { getAchievements } from "../api/backend/Gamification";
import { getUserToken } from "../storage/UserToken";
import { getStats } from "../storage/User";


const Achievements = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const [achievements, setAchievements] = useState();
    const [totalAchhivements, setTotalAchievements] = useState(1);
    const [completedAchievements, setCompletedAchievements] = useState(0);

    // Get achievements data
    useEffect(() => {
        (async () => {
            const token = (await getUserToken()).token;
            getAchievements(token)
                .then(response => {
                    setTotalAchievements(response.data.count);
                    setAchievements(response.data.results);
                })
                .catch(error => {
                    console.log(error.response.data);
                });
        })();
    }, []);

    // Get user's completed achievements
    useEffect(() => {
        (async () => {
            setCompletedAchievements((await getStats()).achievements_completed);
        })();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.achievementItem}>
            {/*Using default achievement image for now since there are not achivement pictures in database*/}
            <Image source={require("../assets/images/default_achievement.png")} style={styles.achievementImage}
                resizeMode="contain"
            />
            <View style={styles.textContainers}>
                <Text style={styles.achievementName}>{item.name} {item.level}</Text>
                <Text style={styles.detailText}>{item.description}</Text>
                <Text style={styles.rewardText}>Rewards: {item.xp && `+${item.xp} XP`} {item.foodiez && `+${item.foodiez} Foodiez`}</Text>
            </View>
            {item.has_client_completed?
                <EntypoIcon name="check" style={styles.iconCheck}></EntypoIcon>
            : 
                <EntypoIcon name="cross" style={styles.iconCross}></EntypoIcon>
            }
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    Completed {" "} 
                    {completedAchievements && completedAchievements} / {totalAchhivements && totalAchhivements}
                </Text>
                <Text>Filter</Text>
            </View>
            <FlatList
                data={achievements}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    )
};

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 5,
            paddingVertical: 10,
            backgroundColor: colors.background,
        },
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
            marginBottom: 10
        },
        headerText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.foreground
        },
        achievementItem: {
            flexDirection: 'row',
            backgroundColor: colors.background2,
            padding: 14,
            marginBottom: 10,
            borderRadius: 69,
            elevation: 3,
        },
        achievementImage: {
            width: '28%',
            height: 66,
            marginTop: 4,
            borderRadius: 0,
        },
        achievementName: {
            fontSize: 16,
            fontWeight: 'bold',
            marginLeft: 5,
            marginBottom: 4,
            textAlign: 'left',
            color: colors.foreground,
        },
        textContainers: {
            flex: 1,
            justifyContent: 'space-between',
            flexWrap: 'wrap',
        },
        detailText: {
            color: colors.foreground,
            fontSize: 14,
            marginLeft: 5,
            marginBottom: 4,
            width: '100%',
        },
        rewardText: {
            fontSize: 12,
            color: colors.highlight2,
            marginLeft: 5,
            fontWeight: 'bold',
        },
        iconCheck: {
            fontSize: 30,
            color: colors.highlight2,
            verticalAlign: 'middle',
        },
        iconCross: {
            fontSize: 30,
            color: colors.highlight1,
            verticalAlign: 'middle',
        }
    });
}
export default Achievements;






