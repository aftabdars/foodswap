import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SceneMap } from "react-native-tab-view";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { Icon as IconE } from 'react-native-elements';

import { getFoodShares } from "../api/backend/Food";
import { getProfile } from "../storage/User";
import { getUserToken } from "../storage/UserToken";
import { ThemeContext, getColors } from "../assets/Theme";
import CustomTabView from "../components/CustomTabView";
import PaginatedFlatList from "../components/PaginatedFlatList";


const ActiveFoodShares = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const [userID, setUserID] = useState();

    const navigation = useNavigation();

    // Gets client user data
    useEffect(() => {
        const getUserProfile = async () => {
            try {
                setUserID((await getProfile()).id);
            }
            catch (error) {
                console.log(error);
            }
        }
        getUserProfile();
    }, []);

    const FoodSharePreview = ({ item }) => {

        const handlePress = () => {
            navigation.navigate('FoodSwapRoom', { shareID: item.id });
        }

        return (
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.previewContainer}>
                    <View style={styles.foodImagesContainer}>
                        <Image
                            source={item.food_image ? { uri: item.food_image } : require("../assets/images/default_food.png")}
                            style={styles.foodImage}
                        />
                        <EntypoIcon name="level-down" style={styles.shareIcon}></EntypoIcon>
                        <Image
                            source={item.taker_profile_picture ? { uri: item.taker_profile_picture } : require("../assets/images/default_profile.jpg")}
                            style={styles.userIcon}
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

    const TabBody = ({ loadData, renderItem }) => {
        return (
            <View style={styles.tabContainer}>
                {userID &&
                    <PaginatedFlatList
                        colors={colors}
                        loadData={loadData}
                        renderItem={renderItem}
                        alternativeText={'Nothing to see'}
                    />
                }
            </View>
        );
    };

    const FirstRoute = () => {
        // Gets active FoodShares where client user is sharing food item
        const getFoodSharesClientSharing = async (page) => {
            const token = (await getUserToken()).token;
            const params = {
                'status': 'in_progress',
                'food__owner': userID,
                'page': page
            };
            let response;
            try {
                response = await getFoodShares(token, params);
                return response.data; // Returned data will be used in the PaginatedFlatList component
            }
            catch (error) { }
        }

        return (
            <TabBody
                loadData={getFoodSharesClientSharing}
                renderItem={({ item }) => (
                    <FoodSharePreview key={item.id} item={item} />
                )}
            />
        )
    }

    const SecondRoute = () => {
        // Gets active FoodShares where client user is taking the food item
        const getFoodSharesClientTaking = async (page) => {
            const token = (await getUserToken()).token;
            const params = {
                'status': 'in_progress',
                'taker': userID,
                'page': page
            };
            let response;
            try {
                response = await getFoodShares(token, params);
                return response.data; // Returned data will be used in the PaginatedFlatList component
            }
            catch (error) { }
        }

        return (
            <TabBody
                loadData={getFoodSharesClientTaking}
                renderItem={({ item }) => (
                    <FoodSharePreview key={item.id} item={item} />
                )}
            />
        )
    }

    // Tab Routes
    const routes = [
        { key: 'first', title: 'Sharing' },
        { key: 'second', title: 'Taking' },
    ];

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    return (
        <View style={styles.container}>
            <CustomTabView
                colors={colors}
                routes={routes}
                renderScene={renderScene}
            />
        </View>
    );
};

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        tabContainer: {
            flex: 1,
            backgroundColor: colors.background,
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
        userIcon: {
            width: 80,
            height: 80,
            resizeMode: 'cover',
            borderRadius: 80,
        },
        shareIcon: {
            fontSize: 40,
            color: colors.highlight2,
        },
    });
}

export default ActiveFoodShares;