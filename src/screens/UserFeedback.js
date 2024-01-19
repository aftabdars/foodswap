import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getColors, ThemeContext } from '../assets/Theme';
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import { getUserToken } from "../storage/UserToken";
import { postUserAppFeedback } from "../api/backend/AppInsight";
import { extractErrorMessage } from "../api/backend/utils/Utils";


const UserFeedback = () => {
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const [message, setMessage] = useState("");
    const [stars, setStars] = useState(0);
    const [showError, setShowError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleStarpress = (starCount) => {
        setStars(starCount);
    };

    const handleSubmit = async () => {
        if (message && stars && stars > 0) {
            const token = (await getUserToken()).token;
            let response;
            try {
                response = await postUserAppFeedback(token, {
                    rating: stars.toFixed(1),
                    message: message.trim(),
                });
                setSuccessMessage('Successfully submitted the feedback. Thank you!');
            }
            catch (error) {
                setShowError(extractErrorMessage(error.response ? error.response.data : 'Network Error'));
            }
        }
    }

    const renderStarIcons = () => {
        const starIcons = [];

        for (let i = 1; i <= 5; i++) {
            starIcons.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handleStarpress(i)}
                    style={styles.starButton}
                >
                    <MaterialCommunityIcons
                        name={stars >= i ? 'star' : 'star-outline'}
                        size={30}
                        color={colors.foreground}
                    />
                </TouchableOpacity>
            )
        }
        return starIcons;
    }
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Thank you for taking the time to share your feedback with us!
                We truly value your input, and it helps us improve our app for everyone.
                Your thoughts are important to us, and we appreciate your support.
                If you have any additional comments or suggestions, feel free to share them below. Happy exploring!
            </Text>

            <Text style={styles.label}>Rating:</Text>
            <View style={styles.starsContainer}>
                {renderStarIcons()}
            </View>

            <Text style={styles.label}>Feedback:</Text>
            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Enter your feedback"
                multiline
                value={message}
                onChangeText={(text) => setMessage(text)}
            />
            {successMessage ?
                <Text style={styles.successMsg}>
                    {successMessage}
                </Text>
                :
                showError && (
                    <Text style={styles.errormsg}>
                        {showError}
                    </Text>
                )
            }
            <MaterialButtonSuccess
                title="Send Feedback"
                onPress={handleSubmit}
                disabled={!message || stars === 0}
                style={styles.submitButton}
                captionStyle={styles.submitButtonText}
            >
                Submit
            </MaterialButtonSuccess>
        </View>
    );
};
function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: colors.background,
        },
        text: {
            fontSize: 16,
            color: colors.foreground,
            marginTop: 20,
            marginBottom: 5,
            textAlign: 'center'
        },
        label: {
            fontSize: 16,
            fontWeight: "bold",
            color: colors.foreground,
            marginTop: 20,
            marginBottom: 5
        },
        input: {
            height: 40,
            borderColor: colors.highlight2,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 16,
            paddingHorizontal: 10,
            color: colors.foreground,
        },
        starsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 16,
        },
        starButton: {
            flex: 1,
            marginHorizontal: 4,
        },
        submitButton: {
            //backgroundColor: colors.highlight1,
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 5
        },
        submitButtonText: {
            fontSize: 16,
        },
        errormsg: {
            fontFamily: "roboto-regular",
            color: colors.error,
            margin: 20,
            textAlign: "center"
        },
        successMsg: {
            fontFamily: "roboto-regular",
            color: colors.highlight2,
            margin: 20,
            textAlign: "center"
        },
    });
};

export default UserFeedback;