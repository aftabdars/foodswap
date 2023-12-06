import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, useWindowDimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
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

const FoodiezTransaction = ({item, userData, styles}) => {
    let message = undefined;
    let color = 'green';
    if (item.type == 'account_transfer') {
        if (item.user == userData.id) {
            message = `Received foodiez from ${item.user_from_username}`;
            color = 'green';
        }
        else if (item.user_from == userData.id) {
            message = `Sent foodiez to ${item.user_username}`;
            color = 'red';
        }
    }

    return (
        <View style={styles.transactionItem}>
            <FontAwesome name="cutlery" size={24} color="#FFA726" style={styles.icon} />
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
            <Text style={{ color: color }}>
                {color == 'green'? '+' : '-'}{item.amount}
            </Text>
        </View>
    )
}

const XPTransaction = ({item, userData, styles}) => {
    return (
        <View style={styles.transactionItem}>
            <FontAwesome name="star" size={24} color="#4CAF50" style={styles.icon} />
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
            <Text style={{ color: "green"}}>{item.amount} XP</Text>
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
                getFoodiezTransactions(token.token, params)
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
                    <FoodiezTransaction item={item} userData={userData} styles={styles}/>
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
                    <FoodiezTransaction item={item} userData={userData} styles={styles}/>
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
                getXPTransactions(token.token, params)
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
                    <XPTransaction item={item} userData={userData} styles={styles}/>
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
            padding: 16,
            backgroundColor: colors.background,
        },
        header: {
            marginBottom: 10,
            color: colors.foreground,
        },
        transactionItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
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
            marginRight: 16,
        },
        transactionDetails: {
            flex: 1,
        },
        message: {
            fontSize: 16,
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