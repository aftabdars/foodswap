import React from 'react';
import { Dimensions, View, StyleSheet, TextInput, Button, Switch } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';

import { animateToNewCoordinates } from '../utils/Map';


const CustomMap = React.forwardRef((props, ref) => {
    // Theme
    const colors = props.colors;
    const styles = createStyles(colors);

    const findMePressed = async () => {
        // Gets user's current location
        let location = await Location.getCurrentPositionAsync({});
        // Update state and animate the mapview to that location
        location = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }
        animateToNewCoordinates(ref, location.latitude, location.longitude, true);

        props.onFindMePress && props.onFindMePress(location);
    }

    const mapPressed = (event) => {
        if (props.onPress) {
            console.log(event.nativeEvent);
            const loc = event.nativeEvent;
            // Update state and animate the mapview to that location
            let location = {
                latitude: loc?.coordinate.latitude,
                longitude: loc?.coordinate.longitude
            }
            animateToNewCoordinates(ref, location.latitude, location.longitude);

            props.onPress(location);
        }
    };

    return (
        <View style={[styles.mapContainer, props.style]}>
            <MapView
                style={styles.map}
                ref={ref}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 0.0,
                    longitude: 0.0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={mapPressed}
            >
                {props.children}
            </MapView>
            <View style={styles.overlay}>
                {/* 
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                // Implement functionality for search here
                />
                <Switch
                    style={styles.switchButton}
                // Implement functionality for 3D view switch here
                /> */}
                <Button
                    title="Find Me"
                    onPress={findMePressed}
                />
            </View>
        </View>
    )
})

const screenHeight = Dimensions.get('window').height;
const containerHeight = screenHeight * 0.5;

function createStyles(colors) {
    return StyleSheet.create({
        mapContainer: {
            height: containerHeight,
            elevation: 3,
            marginBottom: 15,
        },
        map: {
            width: '100%',
            height: '100%',
        },
        overlay: {
            position: 'absolute',
            top: 0,
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
    });
}
export default CustomMap;