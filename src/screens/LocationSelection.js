import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { ThemeContext, getColors } from '../assets/Theme';
import MaterialButtonSuccess from '../components/MaterialButtonSuccess';
import { postFoodSwapRequest, updateFoodSwapRequest } from '../api/backend/Food';
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
    const foodA = route.params?.foodA;
    const foodB = route.params?.foodB;

    const rePropose = route.params?.rePropose;
    const requestID = route.params?.requestID;

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
        const token = await getUserToken();
        // Round latitude and longitude to 6 decimal places
        const roundedLatitude = location.latitude.toFixed(6);
        const roundedLongitude = location.longitude.toFixed(6);

        if (rePropose) { // If it is the reporposal of the location (currently for FoodSwap only)
            body = {
                'proposed_location_latitude': parseFloat(roundedLatitude),
                'proposed_location_longitude': parseFloat(roundedLongitude),
                'is_location_reproposed': true
            }
            updateFoodSwapRequest(requestID, token.token, body)
                .then(response => {
                    console.log(response.data);
                    navigation.navigate('Home');
                })
                .catch(error => {
                    console.log(error.response.data);
                    setShowError('Error sending request');
                })
        }
        else { // else it is the initial request
            body = {
                'food_a': foodA.id,
                'food_b': foodB.id,
                'proposed_location_latitude': parseFloat(roundedLatitude),
                'proposed_location_longitude': parseFloat(roundedLongitude),
            }
            postFoodSwapRequest(token.token, body)
                .then(response => {
                    console.log(response.data);
                    navigation.navigate('Home');
                })
                .catch(error => {
                    console.log(error.response.data);
                    setShowError('Error making swap request');
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