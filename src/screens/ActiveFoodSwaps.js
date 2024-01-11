import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import EntypoIcon from "react-native-vector-icons/Entypo";
import { Icon as IconE } from 'react-native-elements';

import { ThemeContext, getColors } from '../assets/Theme';
import { getFoodSwaps } from '../api/backend/Food';
import { getProfile } from "../storage/User";
import { getUserToken } from '../storage/UserToken';

const ActiveFoodSwaps = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    // States
    const [userFoodSwaps, setUserFoodSwaps] = useState([]);
    const [resultCount, setResultCount] = useState(0);

    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();

    // Gets user's active foodswaps
    useEffect(() => {
        getMeUserFoodSwaps();
    }, []);

    const FoodSwapPreview = ({ item }) => {

        const handlePress = () => {
            navigation.navigate('FoodSwapRoom', { swapID: item.id });
        }

        return (
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.previewContainer}>
                    <View style={styles.foodImagesContainer}>
                        <Image
                            source={item.food_b_image ? { uri: item.food_b_image } : require("../assets/images/default_food.png")}
                            style={styles.foodImage}
                        />
                        <EntypoIcon name="swap" style={styles.swapIcon}></EntypoIcon>
                        <Image
                            source={item.food_a_image ? { uri: item.food_a_image } : require("../assets/images/default_food.png")}
                            style={styles.foodImage}
                        />
                    </View>
                    <IconE
                        name='arrow-right'
                        type='feather'
                        color={colors.highlight2}
                        size={24}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    const renderItem = ({ item }) => {
        return <FoodSwapPreview key={item.id} item={item}></FoodSwapPreview>
    }

    const getMeUserFoodSwaps = async () => {
        try {
            const token = await getUserToken();
            const userID = (await getProfile()).id;
            const response_a = await getFoodSwaps(token.token, {
                'status': 'in_progress',
                'food_a__owner': userID,
                'page': page
            });
            const response_b = await getFoodSwaps(token.token, {
                'status': 'in_progress',
                'food_b__owner': userID,
                'page': page
            });
            setUserFoodSwaps((prevResults) => [
                ...prevResults,
                ...[...response_a.data.results, ...response_b.data.results].sort((a, b) => {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                })
            ]);
            setResultCount(response_a.data.count + response_b.data.count);
            setHasNextPage(response_a.data.next !== null || response_b.data.next !== null);
            setPage((response_a.data.next !== null || response_b.data.next !== null) ? page + 1 : 1);
        }
        catch (error) { }
    };

    const handleLoadMore = async () => {
        if (loading || !hasNextPage) {
            return;
        }

        setLoading(true);
        await getMeUserFoodSwaps();
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {userFoodSwaps && userFoodSwaps.length > 0 &&
                <FlatList
                    data={userFoodSwaps}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    style={styles.flatList}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.2}
                />
                ||
                <Text style={styles.alternativeText}>
                    You don't have any active foodswaps at the moment.
                </Text>
            }
        </View>
    );
};

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            //padding: 10,
            backgroundColor: colors.background,
        },
        flatList: {
            padding: 0,
        },
        alternativeText: {
            fontSize: 16,
            color: colors.foreground,
            margin: 5,
            textAlign: 'center',
        },
        previewContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 1,
            padding: 5,
            backgroundColor: colors.background2,
            borderRadius: 1,
            elevation: 3,
        },
        foodImagesContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            margin: 3,
            alignItems: 'center',
            verticalAlign: 'middle',
        },
        foodImage: {
            width: 80,
            height: 80,
            resizeMode: 'cover',
            borderRadius: 5,
            marginHorizontal: 5
        },
        swapIcon: {
            fontSize: 40,
            color: colors.highlight2,
        },
    });
}

export default ActiveFoodSwaps;
