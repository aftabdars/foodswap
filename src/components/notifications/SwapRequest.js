import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Button } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";

import MaterialButtonSuccess from "../../components/MaterialButtonSuccess";
import MaterialButtonDanger from "../../components/MaterialButtonDanger";
import { formatTimestamp } from "../../utils/Format";
import CustomMap from "../CustomMap.js";
import { animateToNewCoordinates } from "../../utils/Map.js";
import { Marker } from "react-native-maps";


const SwapRequest = ({ colors, data, userID, navigation, swapDecline, swapAccept }) => {
    const styles = createStyles(colors);

    const [proposedLocation, setProposedLocation] = useState();
    const [showMap, setShowMap] = useState(false);
    const mapRef = useRef(null);

    // Animate map to initial coordinates (NOTE: It is not animating, gotta fix it)
    useEffect(() => {
        if (showMap && data) {
            let location = {
                latitude: parseFloat(data.content_object.proposed_location_latitude),
                longitude: parseFloat(data.content_object.proposed_location_longitude),
            }
            setProposedLocation(location)
            if (mapRef && mapRef.current) {
                animateToNewCoordinates(mapRef,
                    location.latitude,
                    location.longitude,
                    true
                );
            }
        }
    }, [showMap]);

    const onAccept = () => {
        swapAccept(data.id, data.object_id, data.content_object);
    }

    const onDecline = () => {
        swapDecline(data.id, data.object_id);
    }

    const onView = () => {
        setShowMap(!showMap);
    }

    const onRepropose = () => {
        navigation.navigate('LocationSelection', {
            rePropose: true,
            swapRequestID: data.object_id
        });
    }

    const foodAImagePressed = () => {
        navigation.navigate('FoodInfo', { foodID: data.content_object.food_a })
    }

    const foodBImagePressed = () => {
        navigation.navigate('FoodInfo', { foodID: data.content_object.food_b })
    }

    return (
        <View style={styles.swapRequestContainer}>
            <View style={styles.swapBodyContainer}>
                <View style={styles.swapRequestTextContainer}>
                    <Text style={styles.swapRequestTitle}>Swap Request</Text>
                    <Text style={styles.swapRequestMessage}>{data.message}</Text>
                    <Text style={styles.swapRequestTimestamp}>{formatTimestamp(data.timestamp)}</Text>
                </View>
                <View style={styles.foodImagesContainer}>
                    <TouchableOpacity onPress={foodBImagePressed}>
                        <Image
                            source={data.content_object.food_b_image ? { uri: data.content_object.food_b_image } : require("../../assets/images/default_food.png")}
                            style={styles.foodImage}
                        />
                    </TouchableOpacity>
                    <EntypoIcon name="swap" style={styles.swapIcon}></EntypoIcon>
                    <TouchableOpacity onPress={foodAImagePressed}>
                        <Image
                            source={data.content_object.food_a_image ? { uri: data.content_object.food_a_image } : require("../../assets/images/default_food.png")}
                            style={styles.foodImage}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            
            {data.content_object.is_location_reproposed && userID && data.content_object.food_a_owner === userID ? (
                <>
                    <TouchableOpacity style={[styles.viewButton, {alignSelf: 'center', marginTop: 10}]} onPress={onView}>
                        <Text style={styles.swapRequestButtonText}>View</Text>
                    </TouchableOpacity>
                    <Text style={styles.swapRequestReproposedText}>You reproposed the location!</Text>
                </>
            ) : (
                <View style={styles.swapRequestButtonsContainer}>
                    <MaterialButtonSuccess style={styles.swapRequestButton} onPress={onAccept}>
                        <Text style={styles.swapRequestButtonText}>Accept</Text>
                    </MaterialButtonSuccess>
                    <TouchableOpacity style={styles.viewButton} onPress={onView}>
                        <Text style={styles.swapRequestButtonText}>View</Text>
                    </TouchableOpacity>
                    <MaterialButtonDanger style={styles.swapRequestButton} onPress={onDecline}>
                        <Text style={styles.swapRequestButtonText}>Decline</Text>
                    </MaterialButtonDanger>
                </View>
            )}
            {showMap &&
                <CustomMap
                    style={styles.swapMap}
                    ref={mapRef}
                    colors={colors}
                >
                    {proposedLocation && (
                        <Marker
                            coordinate={proposedLocation}
                            title="Proposed Location"
                            description="Porposed location for foodswap"
                        />
                    )}
                </CustomMap>
            }
            {showMap && !data.content_object.is_location_reproposed && (
                <MaterialButtonSuccess style={[styles.swapRequestButton, { alignSelf: 'center' }]} onPress={onRepropose}>
                    <Text style={styles.swapRequestButtonText}>Repropose</Text>
                </MaterialButtonSuccess>
            )}
        </View>
    )
};

function createStyles(colors) {
    return StyleSheet.create({
        swapRequestContainer: {
            borderWidth: 1,
            borderColor: colors.background2,
            borderRadius: 8,
            padding: 8,
            marginVertical: 6,
            elevation: 2,
            backgroundColor: colors.background2,
        },
        swapBodyContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        swapRequestTextContainer: {
            flex: 1,
            marginBottom: 6,
        },
        foodImagesContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 3,
            alignItems: 'center',
            verticalAlign: 'middle',
        },
        foodImage: {
            width: 64,
            height: 64,
            resizeMode: 'cover',
            borderRadius: 5,
        },
        swapIcon: {
            fontSize: 25,
            color: colors.highlight2,
        },
        swapRequestTitle: {
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        swapRequestMessage: {
            fontSize: 12,
            color: colors.foreground,
            paddingTop: 5
        },
        swapRequestButtonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 6,
        },
        swapRequestButton: {
            borderRadius: 8,
            padding: 8,
            width: '30%',
            alignItems: 'center',
        },
        swapRequestButtonText: {
            fontSize: 12,
            color: colors.foreground,
        },
        swapRequestTimestamp: {
            fontSize: 10,
            color: colors.foreground,
            marginTop: 6,
        },
        swapRequestReproposedText: {
            color: colors.highlight2,
            textAlign: 'center',
            marginTop: 5
        },
        swapMap: {
            marginTop: 6
        },
        viewButton: {
            borderRadius: 8,
            padding: 8,
            width: '30%',
            alignItems: 'center',
            backgroundColor: colors.highlight1
        }
    });
}

export default SwapRequest;