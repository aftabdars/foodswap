import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SceneMap } from "react-native-tab-view";

import CustomTabView from "./CustomTabView";
import { ThemeContext, getColors } from "../assets/Theme";
import { getFoods } from "../api/backend/Food";
import { getUserToken } from "../storage/UserToken";
import FoodCarousel from "./FoodCarousel";


const UserFoodTabs = (props) => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const userID = props.userID;
    const routes = [
        { key: 'first', title: 'Active Foods' },
        { key: 'second', title: 'Swapped Foods' },
        { key: 'third', title: 'Shared Foods' },
    ]

    const [foodItemsUp, setFoodItemsUp] = useState();
    const [foodItemsSwapped, setFoodItemsSwapped] = useState();
    const [foodItemsShared, setFoodItemsShared] = useState();

    useEffect(() => {
        if (userID) {
            (async () => {
                setFoodItemsUp(await getUserFoodItems({ 'status': 'up' }));
                setFoodItemsSwapped(await getUserFoodItems({ 'status': 'swapped' }));
                setFoodItemsShared(await getUserFoodItems({ 'status': 'shared' }));
            })()
        }
    }, [userID]);

    // Get food items
    const getUserFoodItems = async (moreParams) => {
        let results = [];
        const token = await getUserToken();
        if (token && token !== null) {
            await getFoods(token.token, { 'owner': userID, ...moreParams })
                .then(response => {
                    results = response.data.results;
                })
                .catch(error => { });
        }
        return results;
    };

    const TabBody = ({ tabID, colors, data }) => {
        return (
            <View style={styles.tabBody}>
                {data && data.length > 0 &&
                    <FoodCarousel foodItems={data} />
                    ||
                    <Text style={styles.alternativeText}>No data</Text>
                }
            </View>
        );
    };

    const FirstRoute = ({ colors }) => (
        <TabBody tabID={0} colors={colors} data={foodItemsUp} />
    )

    const SecondRoute = ({ colors }) => (
        <TabBody tabID={1} colors={colors} data={foodItemsSwapped} />
    )

    const ThirdRoute = ({ colors }) => (
        <TabBody tabID={2} colors={colors} data={foodItemsShared} />
    )

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute
    });

    return (
        <CustomTabView
            colors={colors}
            style={props.style}
            routes={routes}
            renderScene={renderScene}
        />
    );
}

function createStyles(colors) {
    return StyleSheet.create({
        tabBody: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
        },
        alternativeText: {
            color: colors.foreground
        },
    })
}

export default UserFoodTabs;