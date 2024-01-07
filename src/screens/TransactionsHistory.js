import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { SceneMap } from "react-native-tab-view";

import { getUserToken } from "../storage/UserToken";
import { getClientFoodiezTransferTransactions, getFoodiezTransactions, getXPTransactions } from "../api/backend/Gamification";
import { getProfile } from "../storage/User";
import { formatDateTimeString } from "../utils/Format";
import { ThemeContext, getColors } from "../assets/Theme";
import CustomTabView from "../components/CustomTabView";
import PaginatedFlatList from "../components/PaginatedFlatList";

const TransactionsHistory = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const [userData, setUserData] = useState();

    // Gets client user data
    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const profile = await getProfile();
                if (profile && profile !== null) setUserData(profile);
            }
            catch (error) {
                console.log(error);
            }
        }
        getUserProfile();
    }, []);

    const TabBody = ({ heading, loadData, renderItem }) => {
        return (
            <View style={styles.tabContainer}>
                <Text style={styles.header}>{heading}</Text>
                {userData &&
                    <PaginatedFlatList
                        colors={colors}
                        loadData={loadData}
                        renderItem={renderItem}
                    />
                }
            </View>
        );
    };

    const FirstRoute = ({ }) => {
        // Gets user's foodiez earning transactions 
        const getTransactionsData = async (page) => {
            const token = await getUserToken();
            const params = {
                'user': userData.id,
                'page': page
            };
            let response;
            try {
                response = await getFoodiezTransactions(token.token, params);
                return response.data; // Returned data will be used in the PaginatedFlatList component
            }
            catch (error) { }
        }

        return (
            <TabBody
                heading='Foodiez Earning History'
                loadData={getTransactionsData}
                renderItem={({ item }) => (
                    <FoodiezTransaction key={item.id} item={item} userData={userData} styles={styles} colors={colors} />
                )}
            />
        )
    }
    const SecondRoute = () => {
        // Gets user's foodiez transactions 
        const getTransactionsData = async (page) => {
            const token = await getUserToken();
            const params = {
                'page': page
            };
            let response;
            try {
                response = await getClientFoodiezTransferTransactions(token.token, params)
                return response.data; // Returned data will be used in the PaginatedFlatList component
            }
            catch (error) { }
        }

        return (
            <TabBody
                heading='Foodiez Transactions History'
                loadData={getTransactionsData}
                renderItem={({ item }) => (
                    <FoodiezTransaction key={item.id} item={item} userData={userData} styles={styles} colors={colors} />
                )}
            />
        )
    }

    const ThirdRoute = ({ }) => {
        // Gets user's foodiez transactions 
        const getTransactionsData = async (page) => {
            const token = await getUserToken();
            const params = {
                user: userData.id,
                page: page
            };
            let response;
            try {
                response = await getXPTransactions(token.token, params)
                return response.data; // Returned data will be used in the PaginatedFlatList component
            }
            catch (error) { }
        }

        return (
            <TabBody
                heading='XP Earning History'
                loadData={getTransactionsData}
                renderItem={({ item }) => (
                    <XPTransaction key={item.id} item={item} userData={userData} styles={styles} colors={colors} />
                )}
            />
        )
    }
    
    // Tab Routes
    const routes = [
        { key: 'first', title: 'Foodiez' },
        { key: 'second', title: 'Transaction' },
        { key: 'third', title: 'XP' },
    ];

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute
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

// Foodiez Transaction Component
const FoodiezTransaction = ({ item, userData, styles, colors }) => {
    let message = undefined;
    let color = colors.highlight2;
    if (item.type == 'account_transfer') {
        if (userData && userData.id == item.user) {
            message = `Received foodiez from ${item.user_from_username}`;
            color = colors.highlight2;
        }
        else if (userData && userData.id == item.user_from) {
            message = `Sent foodiez to ${item.user_username}`;
            color = colors.error;
        }
    }

    return (
        <View style={styles.transactionItem}>
            <EntypoIcon name="bowl" style={styles.icon}></EntypoIcon>
            <View style={styles.transactionDetails}>
                <Text style={styles.message}>{message ? message : item.message}</Text>
                <Text style={styles.timestamp}>
                    {formatDateTimeString(item.timestamp, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                    })}
                </Text>
            </View>
            <Text style={{ alignSelf: 'center', color: color }}>
                {color == colors.highlight2 ? '+' : '-'}{item.amount}
            </Text>
        </View>
    )
}

// XP Transaction Component
const XPTransaction = ({ item, userData, styles, colors }) => {
    return (
        <View style={styles.transactionItem}>
            <EntypoIcon name="star" style={styles.icon}></EntypoIcon>
            <View style={styles.transactionDetails}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.timestamp}>
                    {formatDateTimeString(item.timestamp, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                    })}
                </Text>
            </View>
            <Text style={{ alignSelf: 'center', color: colors.highlight2 }}>{item.amount} XP</Text>
        </View>
    )
}

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        tabContainer: {
            flex: 1,
            paddingVertical: 16,
            backgroundColor: colors.background,
        },
        header: {
            marginLeft: 16,
            marginBottom: 10,
            color: colors.foreground,
        },
        transactionItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
            padding: 16,
            backgroundColor: colors.background2,
            borderRadius: 12,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        icon: {
            color: colors.highlight1,
            fontSize: 30,
            marginRight: 12,
            alignSelf: 'center'
        },
        transactionDetails: {
            flex: 1,
            marginRight: 3,
        },
        message: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        timestamp: {
            fontSize: 12,
            color: colors.foreground,
            marginTop: 10,
        }
    });
}

export default TransactionsHistory;