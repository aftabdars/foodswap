import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Callout, Marker } from 'react-native-maps';

const CircularMarker = ({ coordinate, image, color, title, description, isFoodItem, foodID, colors, onCalloutPress }) => {
    const styles = createStyles(colors);

    const MAX_TITLE_LENGTH = 20;
    const MAX_DESCRIPTION_LENGTH = 34;

    return (
        <Marker coordinate={coordinate}
            pinColor={color}
            title={title}
            description={description}
        >
            <View style={styles.markerContainer}>
                <Image source={image} style={[styles.circularImage, { borderColor: color }]} />
            </View>
            <Callout tooltip onPress={() => foodID && onCalloutPress && onCalloutPress(foodID)}>
                <View style={styles.calloutContainer}>
                    <Text style={styles.title}>
                        {title.substring(0, MAX_TITLE_LENGTH)}
                        {title.length > MAX_TITLE_LENGTH && '...'}
                    </Text>
                    <Text style={styles.description}>
                        {description.substring(0, MAX_DESCRIPTION_LENGTH)}
                        {description.length > MAX_DESCRIPTION_LENGTH && '...'}
                    </Text>
                    {isFoodItem && (
                        <TouchableOpacity>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Click to visit</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </Callout>
        </Marker>
    );
};

function createStyles(colors) {
    return StyleSheet.create({
        markerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        circularImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 3
        },
        calloutContainer: {
            width: 150,
            paddingVertical: 5,
            paddingHorizontal: 3,
            backgroundColor: 'white',
            borderRadius: 8,
            alignItems: 'center',
        },
        title: {
            fontWeight: 'bold',
        },
        description: {
            textAlign: 'center'
        },
        button: {
            marginTop: 5,
            backgroundColor: colors.highlight2,
            padding: 5,
            borderRadius: 5,
        },
        buttonText: {
            color: colors.foreground,
            fontWeight: 'bold',
        },
    });
}

export default CircularMarker;
