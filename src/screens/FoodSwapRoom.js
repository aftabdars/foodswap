import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from "react-native-vector-icons/Entypo";
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { getProfile } from "../storage/User";
import { ThemeContext, getColors } from "../assets/Theme";
import { animateToNewCoordinates, calculateDistance, renderPolyline } from '../utils/Map';
import { formatDateTimeString, formatTimeDifferenceFuture } from '../utils/Format';
import MaterialButtonSuccess from '../components/MaterialButtonSuccess';
import MaterialButtonDanger from '../components/MaterialButtonDanger';
import CircularMarker from '../components/CircularMarker';
import { WSFoodSwap } from '../api/backend/WebSocket';
import { getFoodShare, getFoodSwap, updateFoodShare, updateFoodSwap } from '../api/backend/Food';
import { getUserToken } from '../storage/UserToken';
import { extractErrorMessage } from '../api/backend/utils/Utils';
import CustomMap from '../components/CustomMap';
import { useLoading } from '../assets/LoadingContext';

/*
    Note: FoodSwapRoom is for both FoodSwap and FoodShare, not to get confused because of name
*/

function FoodSwapRoom() {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    // Loading
    const { showLoading, hideLoading } = useLoading();

    const navigation = useNavigation();
    const route = useRoute();
    const mapRef = useRef(null);

    // States
    const [swapLocation, setSwapLocation] = useState();
    const [userLocation, setUserLocation] = useState();
    const [userID, setUserID] = useState();
    const [userUsername, setUserUsername] = useState();
    const [userProfilePic, setUserProfilePic] = useState();
    const [otherUserLocation, setOtherUserLocation] = useState();
    const [otherUserID, setOtherUserID] = useState();
    const [otherUserUsername, setOtherUserUsername] = useState();
    const [otherUserProfilePic, setOtherUserProfilePic] = useState();
    const [showError, setShowError] = useState();
    const [showErrorConnect, setShowErrorConnect] = useState();
    const [data, setData] = useState(route.params?.data);
    const [formatSwapEndTime, setFormatSwapEndTime] = useState();
    // Connection and WebSocket
    const [socket, setSocket] = useState(null);
    const [timer, setTimer] = useState(null);

    const swapID = route.params?.swapID; // for FoodSwap
    const shareID = route.params?.shareID; // for FoodShare

    // Get swap/share data either from route or API call if swapID/shareID is passed
    useEffect(() => {
        if (shareID) {
            const getMeShareData = async () => {
                const token = (await getUserToken()).token;
                await getFoodShare(shareID, token.token)
                    .then(response => {
                        console.log(response.data);
                        setData(response.data);
                    })
                    .catch(error => { })
            }
            getMeShareData();
        }
        else if (swapID) {
            const getMeSwapData = async () => {
                const token = (await getUserToken()).token;
                await getFoodSwap(swapID, token.token)
                    .then(response => {
                        setData(response.data);
                    })
                    .catch(error => { })
            }
            getMeSwapData();
        }
    }, []);
    // Extra formating in data
    useEffect(() => {
        if (data) {
            const END_TIME = data.expire_time;
            setFormatSwapEndTime(formatTimeDifferenceFuture(END_TIME));
        }
    }, [data]);

    // Location permissions
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log(status);
            if (status !== 'granted') {
                console.log('Location permissions denied');
                // Navigate back to FoodInfo page here
                return;
            }
            // Gets user's current location
            let location = await Location.getCurrentPositionAsync({});
            location = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
            setUserLocation(location);
        })();
    }, []);

    // Gets client user profile ID, username and profile pic
    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const profile = await getProfile();
                if (profile && profile !== null) {
                    setUserID(profile.id);
                    setUserUsername(profile.username);
                    setUserProfilePic(profile.profile_picture);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        getUserProfile();
    }, []);

    // Decide other user data, is it userA or userB
    useEffect(() => {
        if (data && userID) {
            if (shareID) { // If room is for FoodShare
                if (data.taker === userID) {
                    setOtherUserID(data.food_owner);
                    setOtherUserUsername(data.food_owner_username);
                    setOtherUserProfilePic(data.food_owner_profile_picture);
                }
                else {
                    setOtherUserID(data.taker);
                    setOtherUserUsername(data.taker_username);
                    setOtherUserProfilePic(data.taker_profile_picture);
                }
            }
            else { // else it is for FoodSwap
                if (data.food_a_owner !== userID) {
                    setOtherUserID(data.food_a_owner);
                    setOtherUserUsername(data.food_a_owner_username);
                    setOtherUserProfilePic(data.food_a_owner_profile_pic);
                }
                else {
                    setOtherUserID(data.food_b_owner);
                    setOtherUserUsername(data.food_b_owner_username);
                    setOtherUserProfilePic(data.food_b_owner_profile_pic);
                }
            }
        }
    }, [data, userID]);

    // Add swap marker on map and animate to it
    useEffect(() => {
        if (data) {
            // Update state and animate the mapview to that location with marker
            location = {
                latitude: parseFloat(data.location_latitude),
                longitude: parseFloat(data.location_longitude)
            }
            setSwapLocation(location);
            animateToNewCoordinates(mapRef, location.latitude, location.longitude, true);
        }
    }, [data]);

    // For FoodSwap
    const foodAImagePressed = () => {
        navigation.navigate('FoodInfo', { foodID: data.food_a });
    };
    const foodBImagePressed = () => {
        navigation.navigate('FoodInfo', { foodID: data.food_b });
    };
    // For FoodShare
    const foodImagePressed = () => {
        navigation.navigate('FoodInfo', { foodID: data.food });
    };
    const takerImagePressed = () => {
        navigation.navigate('PublicProfile', { userID: data.taker });
    };

    const donePressed = async () => { // For now done button ends the foodswap by updating the status of foodswap to done
        const token = (await getUserToken()).token;
        const body = { 'status': 'done' };
        let response;
        try {
            if (shareID) response = await updateFoodShare(data.id, token, body); // for FoodShare
            else response = await updateFoodSwap(data.id, token, body); // for FoodSwap
            console.log(response.data);

            showLoading(); // Showing loading here
            if (socket && socket.readyState === WebSocket.OPEN) socket.close();
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                })
            );
        }
        catch (error) {
            setShowError(extractErrorMessage(error.response ? error.response.data : 'Network Error'));
        }
    };

    const connectPressed = () => {
        if (socket && socket.readyState === WebSocket.OPEN) return;

        // Initiate a websocket connection
        setShowErrorConnect('');
        let swapRoom = data.id;
        const ws = WSFoodSwap(swapRoom);

        ws.onopen = () => {
            console.log(`WebSocket connected, swaproom: ${swapRoom}`);

            // Start the timer
            const newTimer = setInterval(async () => {
                // Gets user's current location
                let newLocation = await Location.getCurrentPositionAsync({});
                newLocation = {
                    latitude: newLocation.coords.latitude,
                    longitude: newLocation.coords.longitude
                }
                // Send location data to the other end
                if (userID && userLocation && newLocation && userLocation.latitude !== newLocation.latitude && userLocation.longitude !== newLocation.longitude) {
                    setUserLocation(newLocation); // Update user's current location
                    console.log("Sending data...");
                    ws.send(JSON.stringify({
                        'user_id': userID,
                        'location': userLocation
                    }));
                }
            }, 2000); // Timer is run every 2 seconds
            setTimer(newTimer);
        };

        // When socket receives data
        ws.onmessage = (event) => {
            let d = JSON.parse(event.data).data;
            if (typeof (d) === "string") d = JSON.parse(d);
            console.log("Received:", d, typeof (d));
            // Set or update other user's location on client screen if we receive their location
            if (d.user_id && d.user_id !== userID) {
                setOtherUserLocation(d.location);
            }
            else if (d.location_request) {
                console.log("Sending data...");
                ws.send(JSON.stringify({
                    'user_id': userID,
                    'location': userLocation
                }));
            }
        };

        ws.onclose = () => {
            if (!socket || socket === null) setShowErrorConnect('Could not connect');
            console.log(`WebSocket disconnected, swaproom: ${swapRoom}`);
            setSocket(null);
            // Stop the timer when socket is disconnected
            clearInterval(timer);
            setTimer(null);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    };

    const disconnectPressed = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
            clearInterval(timer);
            setTimer(null);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.sectionContainer}>
            <Text style={styles.headingText}>Information</Text>
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <Text style={styles.infoText}>
                        {data && data.status === 'in_progress' ? "In Progress" : (shareID ? "Shared" : "Swapped")}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Start date:</Text>
                    <Text style={styles.infoText}>{data && formatDateTimeString(data.timestamp)}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Ends in:</Text>
                    <Text style={styles.infoText}>{data && formatSwapEndTime && formatSwapEndTime.difference}</Text>
                </View>
                <View style={styles.otherInfoItem}>
                    <Text style={styles.infoLabel}>
                        {shareID && data && (data.taker === userID ? 'Took it?' : 'Shared it?')
                            || 'Swapped it?'} Press
                    </Text>
                    <MaterialButtonSuccess style={styles.button} onPress={donePressed}>Done</MaterialButtonSuccess>
                    <Text style={styles.infoLabel}>Or</Text>
                    <MaterialButtonDanger style={styles.button}>Cancel</MaterialButtonDanger>
                </View>
                {showError && (
                    <Text style={styles.errormsg}>
                        {showError}
                    </Text>
                )}
            </View>
            </View>
            <View style={styles.sectionContainer}>
            <Text style={styles.headingText}>Food Item{!shareID && 's'}</Text>
            {shareID ? (
                <View style={styles.foodImagesContainer}>
                    <TouchableOpacity onPress={foodImagePressed}>
                        <Text style={styles.foodImageHeading}>{data && data.food_owner_username}'s Food</Text>
                        <Image
                            source={data && data.food_image ? { uri: data.food_image } : require("../assets/images/default_food.png")}
                            style={styles.foodImage}
                        />
                    </TouchableOpacity>
                    <EntypoIcon name="level-down" style={styles.swapIcon}></EntypoIcon>
                    <TouchableOpacity onPress={takerImagePressed}>
                        <Text style={styles.foodImageHeading}>{data && data.taker_username}</Text>
                        <Image
                            source={data && data.taker_profile_picture ? { uri: data.taker_profile_picture } : require("../assets/images/default_profile.jpg")}
                            style={styles.userIcon}
                        />
                    </TouchableOpacity>
                </View>
                ) : (
                <View style={styles.foodImagesContainer}>
                    <TouchableOpacity onPress={foodBImagePressed}>
                        <Text style={styles.foodImageHeading}>{data && data.food_b_owner_username}'s Food</Text>
                        <Image
                            source={data && data.food_b_image ? { uri: data.food_b_image } : require("../assets/images/default_food.png")}
                            style={styles.foodImage}
                        />
                    </TouchableOpacity>
                    <Icon name="exchange" size={24} color={colors.highlight2} style={styles.swapIcon} />
                    <TouchableOpacity onPress={foodAImagePressed}>
                        <Text style={styles.foodImageHeading}>{data && data.food_a_owner_username}'s Food</Text>
                        <Image
                            source={data && data.food_a_image ? { uri: data.food_a_image } : require("../assets/images/default_food.png")}
                            style={styles.foodImage}
                        />
                    </TouchableOpacity>
                </View>
            )}
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Connect real-time:</Text>
                    {socket && socket.readyState === WebSocket.OPEN ?
                        <MaterialButtonDanger style={styles.button} onPress={disconnectPressed}>
                            Disconnect
                        </MaterialButtonDanger>
                        :
                        <MaterialButtonSuccess style={styles.button} onPress={connectPressed}>
                            Connect
                        </MaterialButtonSuccess>
                    }
                </View>
                {showErrorConnect && (
                    <Text style={styles.errormsg}>
                        {showErrorConnect}
                    </Text>
                )}
                {socket && socket.readyState === WebSocket.OPEN &&
                    <View style={styles.infoRealTimeContainerContainer}>
                        <View style={styles.infoRealTimeContainer}>
                            <Text style={styles.infoRealTimeHeading}>You</Text>
                            <View style={styles.infoRealTimeItem}>
                                <Text style={styles.infoRealTimeLabel}>Connection Status: </Text>
                                <Text style={styles.infoRealTimeText}>Online</Text>
                            </View>
                            <View style={styles.infoRealTimeItem}>
                                <Text style={styles.infoRealTimeLabel}>Distance: </Text>
                                <Text style={styles.infoRealTimeText}>{swapLocation && userLocation &&
                                    calculateDistance(swapLocation, userLocation)?.toFixed(3) + ' KM'
                                }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.infoRealTimeContainer}>
                            <Text style={styles.infoRealTimeHeading}>{otherUserUsername}</Text>
                            <View style={styles.infoRealTimeItem}>
                                <Text style={styles.infoRealTimeLabel}>Connection Status: </Text>
                                <Text style={styles.infoRealTimeText}>{otherUserLocation ? 'Online' : 'Offline'}</Text>
                            </View>
                            <View style={styles.infoRealTimeItem}>
                                <Text style={styles.infoRealTimeLabel}>Distance: </Text>
                                <Text style={styles.infoRealTimeText}>{swapLocation && otherUserLocation ?
                                    calculateDistance(swapLocation, otherUserLocation)?.toFixed(3) + ' KM' : 'NaN'
                                }
                                </Text>
                            </View>
                        </View>
                    </View>
                }
            </View>
            <View style={styles.sectionContainer}>
            <Text style={styles.headingText}>Map</Text>
            <CustomMap
                ref={mapRef}
                colors={colors}
            >
                {swapLocation && (
                    <Marker
                        coordinate={{ latitude: swapLocation.latitude, longitude: swapLocation.longitude }}
                        title={`${shareID && 'Share' || 'Swap'} Location`}
                        description={`Location for ${shareID && 'foodshare' || 'foodswap'}`}
                    />
                )}
                {userLocation && (
                    <CircularMarker
                        coordinate={userLocation}
                        image={userProfilePic ? { uri: userProfilePic } : require("../assets/images/default_profile.jpg")}
                        color="green"
                        title="Your Location"
                        description="Your current location"
                        colors={colors}
                    />
                )}
                {otherUserLocation && (
                    <CircularMarker
                        coordinate={otherUserLocation}
                        image={otherUserProfilePic ? { uri: otherUserProfilePic } : require("../assets/images/default_profile.jpg")}
                        color="blue"
                        title={otherUserUsername + "'s Location"}
                        description={otherUserUsername + "'s current location"}
                        colors={colors}
                    />
                )}
                {swapLocation && userLocation && renderPolyline(swapLocation, userLocation, "green")}
                {swapLocation && otherUserLocation && renderPolyline(swapLocation, otherUserLocation)}
            </CustomMap>
            </View>

           
        
        </ScrollView>
    );
}


function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flexGrow: 1,
            backgroundColor: colors.background,
            padding: 20,
        },
        sectionContainer:{
            marginBottom:15,
            backgroundColor:colors.background,
            borderRadius:15,
            padding:5,
            elevation:5,
        },
        headingText: {
            fontWeight: 'bold',
            fontSize: 22,
            marginVertical: 10,
            color: colors.foreground
        },
        infoContainer: {
            marginBottom: 15,
        },
        infoItem: {
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems:'center',
            marginBottom:10,
        },
        otherInfoItem: {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        infoLabel: {
            fontSize: 15,
            color: colors.foreground,
            marginHorizontal: 5,
        },
        infoText: {
            flex: 1,
            flexWrap: 'wrap',
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        infoRealTimeContainerContainer: {
            marginTop: 10,
            right:11,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        infoRealTimeContainer: {
            padding: 2,
            borderWidth: 2,
            borderColor: colors.foreground,
            flexDirection: 'column',
        },
        infoRealTimeHeading: {
            fontSize: 14,
            color: colors.highlight2,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 2
        },
        infoRealTimeItem: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        infoRealTimeLabel: {
            fontSize: 14,
            color: colors.foreground,
            marginHorizontal: 1,
        },
        infoRealTimeText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        button: {
            padding: 2,
            borderRadius:10,
        },
        foodImagesContainer: {
         flexDirection:"row",
         justifyContent:'space-evenly',
         marginBottom:10,
        },
        foodImage: {
            width: 80,
            height: 80,
            resizeMode: 'cover',
            borderRadius: 5,
        },
        userIcon: {
            width: 150,
            height: 150,
            resizeMode: 'cover',
            borderRadius: 150,
        },
        foodImageHeading: {
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 10,
            color: colors.foreground
        },
        swapIcon: {
            fontSize: 30,
            color: colors.highlight2,
            marginHorizontal: 5
        },
        errormsg: {
            fontFamily: "roboto-regular",
            color: colors.error,
            marginTop: 1,
            textAlign: "center"
        },
    });
}

export default FoodSwapRoom;