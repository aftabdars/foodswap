import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { ThemeContext, getColors } from '../assets/Theme';
import { getFoods } from '../api/backend/Food';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProfile } from "../storage/User";
import { Icon } from 'react-native-elements';
import { getUserToken } from '../storage/UserToken';
import PaginatedFlatList from '../components/PaginatedFlatList';


const FoodSwapSelection = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const navigation = useNavigation();
    const route = useRoute();
    const foodItem = route.params?.foodItem;

    const FoodPreview = ({ item }) => {

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

    // Get client user's food items that are available and up for swap
    const getUserFoodItemsForSwap = async (page) => {
        try {
            const token = await getUserToken();
            const response = await getFoods(token.token, {
                'up_for': 'swap',
                'status': 'up',
                'owner': (await getProfile()).id,
                'page': page
            });
            return response.data;
        }
        catch (error) { }
    };

    return (
        <View style={styles.container}>
            <PaginatedFlatList
                colors={colors}
                loadData={getUserFoodItemsForSwap}
                renderItem={renderItem}
                alternativeText={"You don't have any food items up for swap"}
            />
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
