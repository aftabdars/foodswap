import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { ThemeContext, getColors } from '../assets/Theme';
import MaterialButtonSuccess from '../components/MaterialButtonSuccess';
import { deleteFoodShareRequest, postFoodShare, postFoodSwapRequest, updateFoodSwapRequest } from '../api/backend/Food';
import { getUserToken } from '../storage/UserToken';
import { animateToNewCoordinates } from '../utils/Map';
import CustomMap from '../components/CustomMap';

function LocationSelection() {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    // States
    const [location, setLocation] = useState(null);
    const [showError, setShowError] = useState();

    const mapRef = useRef(null);
    const navigation = useNavigation();

    const route = useRoute();
    // Route params if initital swap request location selection
    const foodA = route.params?.foodA;
    const foodB = route.params?.foodB;
    // Route params if location reproposal of swap request
    const rePropose = route.params?.rePropose;
    const swapRequestID = route.params?.swapRequestID;
    // Route params if location selection for accepting share request
    const food = route.params?.food;
    const taker = route.params?.taker;
    const shareRequestID = route.params?.shareRequestID;

    // Location permissions and map's initial location set to user's current location if permissions provided
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Location permissions denied');
                // Navigate back to FoodInfo page here
                return;
            }
            // Gets user's current location
            let location = await Location.getCurrentPositionAsync({});
            // Update state and animate the mapview to that location
            location = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
            setLocation(location);
            animateToNewCoordinates(mapRef, location.latitude, location.longitude, true);
        })();
    }, []);

    const findMePressed = (location) => {
        setLocation(location);
    }

    const mapPressed = (location) => {
        setLocation(location);
    };

    const handleSend = async () => {
        // Make the foodswap request
        const token = (await getUserToken()).token;
        // Round latitude and longitude to 6 decimal places
        const roundedLatitude = location.latitude.toFixed(6);
        const roundedLongitude = location.longitude.toFixed(6);

        if (rePropose && swapRequestID) { // If it is the reporposal of the location (currently for FoodSwap only)
            body = {
                'proposed_location_latitude': parseFloat(roundedLatitude),
                'proposed_location_longitude': parseFloat(roundedLongitude),
                'is_location_reproposed': true
            }
            await updateFoodSwapRequest(swapRequestID, token, body)
                .then(response => {
                    console.log(response.data);
                    navigation.navigate('Home');
                })
                .catch(error => {
                    setShowError('Error sending request');
                })
        }
        else if (foodA && foodB) { // or it is the initial swap request location selection
            body = {
                'food_a': foodA.id,
                'food_b': foodB.id,
                'proposed_location_latitude': parseFloat(roundedLatitude),
                'proposed_location_longitude': parseFloat(roundedLongitude),
            }
            await postFoodSwapRequest(token, body)
                .then(response => {
                    console.log(response.data);
                    navigation.navigate('Home');
                })
                .catch(error => {
                    setShowError('Error making swap request');
                })
        }
        else if (food && taker && shareRequestID) { // or it is the foodshare request accept location selection
            body = {
                'food': food,
                'taker': taker,
                'location_latitude': parseFloat(roundedLatitude),
                'location_longitude': parseFloat(roundedLongitude),
            }
            await postFoodShare(token, body)
                .then(async (response) => {
                    console.log(response.data);
                    // Delete share request from backend
                    await deleteFoodShareRequest(shareRequestID, token, { 'accepted': true });

                    navigation.navigate('FoodSwapRoom', { shareID: response.data.id });
                })
                .catch(error => {
                    setShowError('Error accepting share request');
                })
        }
    }

    return (
        <View style={styles.container}>
            <CustomMap
                ref={mapRef}
                colors={colors}
                onPress={mapPressed}
                onFindMePress={findMePressed}
            >
                {location && (
                    <Marker
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                        title="Selected Location"
                        description="Location for foodswap"
                    />
                )}
            </CustomMap>
            {showError && (
                <Text style={styles.errormsg}>
                    {showError}
                </Text>
            )}
            <MaterialButtonSuccess style={styles.sendButton} onPress={handleSend}>
                Send
            </MaterialButtonSuccess>
        </View>
    );
}

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            height: '100%',
            backgroundColor: colors.background,
        },
        sendButton: {
            padding: 10,
            borderRadius: 5,
            margin: 10,
        },
        errormsg: {
            fontFamily: "roboto-regular",
            color: colors.error,
            marginTop: 20,
            marginRight: 15,
            textAlign: "center"
        },
    });
}

export default LocationSelection;