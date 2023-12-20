import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { ThemeContext, getColors } from '../assets/Theme';
import { getFoods } from '../api/backend/Food';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProfile } from "../storage/User";
import { Icon } from 'react-native-elements';

const FoodSwapSelection = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    // States
    const [userFoods, setUserFoods] = useState([]);
    const [resultCount, setResultCount] = useState(0);

    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const foodItem = route.params?.foodItem;

    // Gets user's active food items that are up for swap
    useEffect(() => {
        getUserFoodItemsForSwap();
    }, []);

    const FoodPreview = ({item}) => {

        const handlePress = () => {
            navigation.navigate('LocationSelection', {
                foodA: foodItem,
                foodB: item
            });
        }

        return (
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.foodItem}>
                    <Image source={{ uri: item.image }} style={styles.foodImage} />
                    <View style={styles.textContainer}>
                        <Text style={styles.foodTitle}>{item.name}</Text>
                    </View>
                    <Icon
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
        return <FoodPreview item={item}></FoodPreview>
    }

    const getUserFoodItemsForSwap = async () => {
        try {
            const response = await getFoods({
                'up_for': 'swap',
                'status': 'up',
                'owner': (await getProfile()).id,
                'page': page
            });
            setUserFoods((prevResults) => [
                ...prevResults,
                ...response.data.results,
            ]);
            setResultCount(response.data.count);
            setHasNextPage(response.data.next !== null);
            setPage(response.data.next !== null ? page + 1 : 1);
        }
        catch (error) {
            console.log(error.response.data);
        }
    };

    const handleLoadMore = async () => {
        if (loading || !hasNextPage) {
            return;
        }

        setLoading(true);
        await getUserFoodItemsForSwap();
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {userFoods &&
                <FlatList
                    data={userFoods}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    style={styles.flatList}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.2}
                />
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
        foodItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 1,
            padding: 5,
            backgroundColor: colors.background2,
            borderRadius: 1,
            elevation: 3,
        },
        foodImage: {
            width: 80,
            height: 80,
            resizeMode: 'cover',
            borderRadius: 5,
            margin: 10,
        },
        textContainer: {
            flex: 1
        },
        foodTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.foreground,
        },
    });
}

export default FoodSwapSelection;
