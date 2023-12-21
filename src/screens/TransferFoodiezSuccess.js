import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { getColors, ThemeContext } from '../assets/Theme';
import { useRoute } from '@react-navigation/native';


const TransferFoodiezSuccess = () => {
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const [timer, setTimer] = useState(0);
    const animatedValue = new Animated.Value(0);

    const route = useRoute();
    const transactionAmount = route.params?.amount;

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer < transactionAmount) {
                setTimer((prevTimer) => prevTimer + 1);
            } else {
                clearInterval(interval);
            }
        }, -30);

        return () => clearInterval(interval);
    }, [timer]);

    const scale = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.1],
    });

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [animatedValue]);


    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.timerText, { transform: [{ scale }] }]}>
                {timer < transactionAmount? timer.toFixed(2) : transactionAmount.toFixed(2)}
            </Animated.Text>
            {timer >= transactionAmount && (
                <Animated.Text
                    style={[
                        styles.transferText,
                        {
                            opacity: 1,
                            transform: [{ rotate: '360deg' }],
                        },
                    ]}
                >
                    Transfer Complete
                </Animated.Text>
            )}
        </View>
    );
};
function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background, // Set a background color
        },

        timerText: {
            fontSize: 48, // Increase font size
            fontWeight: 'bold',
            color: colors.highlight2, // Set a text color
            fontFamily: 'Roboto', // Use a custom font (make sure to import the font)
        },
        transferText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.highlight1, // Set the color you desire
            marginTop: 20,
        },
    });
}

export default TransferFoodiezSuccess;