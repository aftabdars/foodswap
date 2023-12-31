import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import { getProfile } from "../storage/User";
import { ThemeContext, getColors } from "../assets/Theme";
import { animateToNewCoordinates, calculateDistance, renderPolyline } from '../utils/Map';
import { addHoursToTimestamp, formatDateTimeString, formatTimeDifferenceFuture } from '../utils/Format';
import MaterialButtonSuccess from '../components/MaterialButtonSuccess';
import MaterialButtonDanger from '../components/MaterialButtonDanger';
import CircularMarker from '../components/CircularMarker';
import { WSFoodSwap } from '../api/backend/WebSocket';
import { getFoodSwap, updateFoodSwap } from '../api/backend/Food';
import { getUserToken } from '../storage/UserToken';
import { extractErrorMessage } from '../api/backend/utils/Utils';


function FoodSwapRoom() {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

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
    const [data, setData] = useState(route.params?.data);
    const [formatSwapEndTime, setFormatSwapEndTime] = useState();
    // Connection and WebSocket
    const [socket, setSocket] = useState(null);
    const [timer, setTimer] = useState(null);

    /* data = {
            "id": 2,
            "food_a": 8,
            "food_a_owner": 12,
            "food_a_owner_username": "asfandsoomro",
            "food_a_owner_profile_pic": null,
            "food_a_image": "http://192.168.18.7:8000/media/food/Few-nuts.jpeg",
            "food_b": 10,
            "food_b_owner": 1,
            "food_b_owner_username": "admin",
            "food_b_owner_profile_pic": "http://192.168.18.7:8000/media/profile_pics/admin.jpeg",
            "food_b_image": "http://192.168.18.7:8000/media/food/Chicken-Handi_White.jpeg",
            "timestamp": "2023-12-25T16:09:39.558133Z",
            "location_latitude": "25.392482",
            "location_longitude": "68.332274",
            "status": "in_progress"
        } */

    // Get swap data either from route or API call if swapID is passed
    useEffect(() => {
        const swapID = route.params?.swapID;
        if (swapID) {
            const getMeSwapData = async () => {
                const token = (await getUserToken()).token;
                await getFoodSwap(swapID, token.token)
                    .then(response => {
                        console.log(response.data);
                        setData(response.data);
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    })
            }
            getMeSwapData();
        }
    }, []);
    // Extra formating in data
    useEffect(() => {
        if (data) {
            const FOODSWAP_END_TIME = addHoursToTimestamp(data.timestamp, 3);
            setFormatSwapEndTime(formatTimeDifferenceFuture(FOODSWAP_END_TIME));
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

    const foodAImagePressed = () => {
        navigation.navigate('FoodInfo', { foodID: data.food_a })
    };

    const foodBImagePressed = () => {
        navigation.navigate('FoodInfo', { foodID: data.food_b })
    };

    const donePressed = async () => { // For now done button ends the foodswap by updating the status of foodswap to done
        const token = (await getUserToken()).token;
        updateFoodSwap(data.id, token, {
            'status': 'done'
        })
            .then(response => {
                console.log(response.data);
                if (socket && socket.readyState === WebSocket.OPEN) socket.close();
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    })
                );
            })
            .catch(error => {
                console.log(error.response.data);
                setShowError(extractErrorMessage(error.response.data));
            })
    };

    const connectPressed = () => {
        if (socket && socket.readyState === WebSocket.OPEN) return;

        // Initiate a websocket connection
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
            <Text style={styles.headingText}>Information</Text>
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <Text style={styles.infoText}>{data && data.status === 'in_progress' ? "In Progress" : "Swapped"}</Text>
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
                    <Text style={styles.infoLabel}>Swapped it? Press</Text>
                    <MaterialButtonSuccess style={styles.button} onPress={donePressed}>Done</MaterialButtonSuccess>
                </View>
                {showError && (
                    <Text style={styles.errormsg}>
                        {showError}
                    </Text>
                )}
            </View>
            <Text style={styles.headingText}>Food Items</Text>
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
            <Text style={styles.headingText}>Map</Text>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: 0.0,
                        longitude: 0.0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {swapLocation && (
                        <Marker
                            coordinate={{ latitude: swapLocation.latitude, longitude: swapLocation.longitude }}
                            title="Swap Location"
                            description="Location for foodswap"
                        />
                    )}
                    {userLocation && (
                        <CircularMarker
                            coordinate={userLocation}
                            image={userProfilePic ? { uri: userProfilePic } : require("../assets/images/default_profile.jpg")}
                            color="green"
                            title="Your Location"
                            description="Your current location"
                        />
                    )}
                    {otherUserLocation && (
                        <CircularMarker
                            coordinate={otherUserLocation}
                            image={otherUserProfilePic ? { uri: otherUserProfilePic } : require("../assets/images/default_profile.jpg")}
                            color="blue"
                            title={otherUserUsername + "'s Location"}
                            description={otherUserUsername + "'s current location"}
                        />
                    )}
                    {swapLocation && userLocation && renderPolyline(swapLocation, userLocation, "green")}
                    {swapLocation && otherUserLocation && renderPolyline(swapLocation, otherUserLocation)}
                </MapView>
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
        </ScrollView>
    );
}

const screenHeight = Dimensions.get('window').height;
const containerHeight = screenHeight * 0.5;

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flexGrow: 1,
            backgroundColor: colors.background,
            padding: 10,
        },
        headingText: {
            fontWeight: 'bold',
            fontSize: 25,
            marginVertical: 5,
            color: colors.foreground
        },
        infoContainer: {
            marginBottom: 10,
        },
        infoItem: {
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        otherInfoItem: {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        infoLabel: {
            fontSize: 16,
            color: colors.foreground,
            marginHorizontal: 5,
        },
        infoText: {
            flex: 1,
            flexWrap: 'wrap',
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        infoRealTimeContainerContainer: {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        infoRealTimeContainer: {
            padding: 5,
            marginBottom: 10,
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
            marginHorizontal: 3,
        },
        infoRealTimeText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        button: {
            padding: 2,
        },
        foodImagesContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            alignItems: 'center',
            verticalAlign: 'middle',
        },
        foodImage: {
            width: 150,
            height: 150,
            resizeMode: 'cover',
            borderRadius: 5,
        },
        foodImageHeading: {
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 15,
            color: colors.foreground
        },
        swapIcon: {
            fontSize: 30,
            color: colors.highlight2,
            marginHorizontal: 5
        },
        mapContainer: {
            height: containerHeight,
            elevation: 3,
            marginBottom: 15,
        },
        map: {
            width: '100%',
            height: '100%',
        },
        errormsg: {
            fontFamily: "roboto-regular",
            color: colors.error,
            marginTop: 20,
            textAlign: "center"
        },
    });
}

export default FoodSwapRoom;