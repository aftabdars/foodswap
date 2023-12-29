import { useContext, useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
} from 'react-native-reanimated';

import { ThemeContext, getColors } from "../assets/Theme";

const TIPS = [
    'You can earn more Foodiez by sharing a food item than swapping it!',
    'Watch out! Your food item automatically expires after 24 hours, so be done with it before it expires.'
]

const Loading = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    // States and other
    const [randomTip, setRandomTip] = useState(null);
    const rotation = useSharedValue(0);

    // Gets a random tip
    useEffect(() => {
        const getRandomTip = () => {
            const randomIndex = Math.floor(Math.random() * TIPS.length);
            setRandomTip(TIPS[randomIndex]);
        };

        getRandomTip();
    }, []); // Empty dependency array to run only once

    const animatedRotation = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }]
        };
    });

    useEffect(() => {
        rotation.value = withTiming(360, {
            duration: 2000,
            easing: Easing.linear,
            loop: -1, // Setting loop to -1 makes the animation loop indefinitely
        });
    }, [rotation]);

    return (
        <View style={styles.overlay}>
            <Animated.Image
                source={require("../assets/images/loading.png")}
                resizeMode="contain"
                style={[styles.graphic, animatedRotation]}
            />
            <Text style={styles.tipText}>
                Tip: {randomTip}
            </Text>
        </View>
    )
};


const screenHeight = Dimensions.get('window').height;

function createStyles(colors) {
    return StyleSheet.create({
        overlay: {
            position: 'absolute',
            backgroundColor: colors.background, //'rgba(0, 0, 0, 0.5)',
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            top: 0,
            left: 0,
            right: 0,
            height: screenHeight
        },
        graphic: {
            width: '50%',
            height: '50%'
        },
        tipText: {
            position: 'absolute',
            bottom: 50,
            color: colors.foreground,
            fontSize: 15,
            textAlign: 'center',
        },
    });
}

export default Loading;