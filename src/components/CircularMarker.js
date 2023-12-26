import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const CircularMarker = ({ coordinate, image, color, title, description }) => {
    return (
        <Marker coordinate={coordinate}
            pinColor={color}
            title={title}
            description={description}
        >
            <View style={styles.markerContainer}>
                <Image source={image} style={[styles.circularImage, {borderColor: color}]} />
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circularImage: {
        width: 40, // Adjust size as needed
        height: 40, // Adjust size as needed
        borderRadius: 20, // Half of width and height for circular shape
        borderWidth: 3
    },
});

export default CircularMarker;
