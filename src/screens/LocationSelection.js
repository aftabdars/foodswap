import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Dimensions, StyleSheet, Switch, TextInput, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import { ThemeContext, getColors } from '../assets/Theme';
import MaterialButtonSuccess from '../components/MaterialButtonSuccess';
import { postFoodSwapRequest, updateFoodSwapRequest } from '../api/backend/Food';
import { getUserToken } from '../storage/UserToken';

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
            animateToNewCoordinates(location.latitude, location.longitude, 0.003);
        })();
    }, []);

    console.log(location, typeof location);

    const animateToNewCoordinates = (latitude, longitude, delta) => {
        if (mapRef && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: delta && delta,
                    longitudeDelta: delta && delta,
                },
                1000 // Duration in milliseconds for the animation
            );
        }
    };

    const findMePressed = async () => {
        // Gets user's current location
        let location = await Location.getCurrentPositionAsync({});
        // Update state and animate the mapview to that location
        location = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }
        setLocation(location);
        animateToNewCoordinates(location.latitude, location.longitude, 0.003);
    }

    const mapPressed = (event) => {
        console.log(event.nativeEvent);
        const loc = event.nativeEvent;
        // Update state and animate the mapview to that location
        let location = {
            latitude: loc?.coordinate.latitude,
            longitude: loc?.coordinate.longitude
        }
        setLocation(location);
        animateToNewCoordinates(location.latitude, location.longitude, false);
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
                    onPress={mapPressed}
                >
                    {location && (
                        <Marker
                            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            title="Selected Location"
                            description="Location for foodswap"
                        />
                    )}
                </MapView>
                <View style={styles.overlay}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                    // Implement functionality for search here
                    />
                    <Switch
                        style={styles.switchButton}
                    // Implement functionality for 3D view switch here
                    />
                    <Button
                        title="Find Me"
                        onPress={findMePressed}
                    />
                </View>
            </View>
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

const screenHeight = Dimensions.get('window').height;
const containerHeight = screenHeight * 0.5;

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            height: '100%',
            backgroundColor: colors.background,
        },
        mapContainer: {
            height: containerHeight,
            margin: 15,
            elevation: 3,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        map: {
            width: '100%',
            height: '100%',
        },
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        searchInput: {
            flex: 1,
            marginRight: 10,
            paddingHorizontal: 10,
            backgroundColor: 'white',
            borderRadius: 5,
        },
        switchButton: {
            marginRight: 10,
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