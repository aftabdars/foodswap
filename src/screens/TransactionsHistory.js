import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, useWindowDimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { SceneMap, TabView, TabBar } from "react-native-tab-view";
import { getUserToken } from "../storage/UserToken";
import { getClientFoodiezTransferTransactions, getFoodiezTransactions, getXPTransactions } from "../api/backend/Gamification";
import { getProfile } from "../storage/User";
import { formatDateTimeString } from "../utils/Format";
import { ThemeContext, getColors } from "../assets/Theme";

const TransactionsHistory = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    //TABBED VIEW/////////////////////////////////
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Foodiez' },
        { key: 'second', title: 'Transaction' },
        { key: 'third', title: 'XP' },
    ]);

	return (
		<View style={styles.container}>
            <TabView
                style={styles.tabbedContainer}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
		</View>
	);
};

const FoodiezTransaction = ({item, userData, styles, colors}) => {
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
                <Text style={styles.message}>{message? message : item.message}</Text>
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
                {color == colors.highlight2? '+' : '-'}{item.amount}
            </Text>
        </View>
    )
}

const XPTransaction = ({item, userData, styles, colors}) => {
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
            <Text style={{ alignSelf: 'center', color: colors.highlight2}}>{item.amount} XP</Text>
      </View>
    )
}

//TABBED VIEWS////////////////////////////////////////////////
const FirstRoute = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    
    const [userData, setUserData] = useState();
    const [transactions, setTransactions] = useState();

    // Gets client user data
    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const profile = await getProfile();
                if (profile && profile !== null) setUserData(profile);
            }
            catch(error) {
                console.log(error);
            }
        }
        getUserProfile();
    }, []);

    // Gets user's foodiez earning transactions 
    useEffect(() => {
        if (userData) {
            const getTransactionsData = async () => {
                const token = await getUserToken();
                const params = {
                    user: userData.id
                }
                await getFoodiezTransactions(token.token, params)
                .then(response => {
                    setTransactions(response.data.results);
                })
                .catch(error => {
                    console.log(error);
                })
            }
            getTransactionsData();
        }
    }, [userData]);

    return (
        <View style={styles.tabContainer}>
            <Text style={styles.header}>Foodiez Earning History</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <FoodiezTransaction item={item} userData={userData} styles={styles} colors={colors}/>
                )}
            />
        </View>
    );
}

const SecondRoute = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    
    const [userData, setUserData] = useState();
    const [transactions, setTransactions] = useState();

    // Gets client user data
    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const profile = await getProfile();
                if (profile && profile !== null) setUserData(profile);
            }
            catch(error) {
                console.log(error);
            }
        }
        getUserProfile();
    }, []);

    // Gets user's foodiez transactions 
    useEffect(() => {
        const getTransactionsData = async () => {
            const token = await getUserToken();
            getClientFoodiezTransferTransactions(token.token)
            .then(response => {
                setTransactions(response.data.results);
            })
            .catch(error => {
                console.log(error);
            })
        }
        getTransactionsData();
    }, []);

    return (
        <View style={styles.tabContainer}>
            <Text style={styles.header}>Foodiez Transactions History</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <FoodiezTransaction item={item} userData={userData} styles={styles} colors={colors}/>
                )}
            />
        </View>
    );
}

const ThirdRoute = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    
    const [userData, setUserData] = useState();
    const [transactions, setTransactions] = useState();

    // Gets client user data
    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const profile = await getProfile();
                if (profile && profile !== null) setUserData(profile);
            }
            catch(error) {
                console.log(error);
            }
        }
        getUserProfile();
    }, []);

    // Gets user's xp transactions 
    useEffect(() => {
        if (userData) {
            const getTransactionsData = async () => {
                const token = await getUserToken();
                const params = {
                    user: userData.id
                }
                await getXPTransactions(token.token, params)
                .then(response => {
                    setTransactions(response.data.results);
                })
                .catch(error => {
                    console.log(error);
                })
            }
            getTransactionsData();
        }
    }, [userData]);

    return (
        <View style={styles.tabContainer}>
            <Text style={styles.header}>XP Earning History</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <XPTransaction item={item} userData={userData} styles={styles} colors={colors}/>
                )}
            />
        </View>
    );
}
  
const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute
});
//////////////////////////////////////////////////////////////


function createStyles(colors) {
    return StyleSheet.create({
        tabbedContainer: {
            flex: 1
        },
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