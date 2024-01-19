import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker';

import { getColors, ThemeContext } from '../assets/Theme';
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import { getUserToken } from "../storage/UserToken";
import { getBugReportTypeChoices, postBugReport } from "../api/backend/AppInsight";
import { extractErrorMessage } from "../api/backend/utils/Utils";


const BugReport = () => {
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const [bugTypes, setBugTypes] = useState([]);
    const [bugType, setBugType] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showError, setShowError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Get bug report type choices
    useEffect(() => {
        (async () => {
            const token = (await getUserToken()).token;
            let response;
            try {
                response = await getBugReportTypeChoices(token);
                setBugTypes(response.data);
            }
            catch (error) {
                console.log(error.response.data);
            }
        })();
    }, []);

    const handleBugTypechange = (value) => {
        setBugType(value);
    }

    const handleSubmit = async () => {
        setShowError('');
        setSuccessMessage('');

        if (bugType && title && description) {
            const token = (await getUserToken()).token;
            let response;
            try {
                response = await postBugReport(token, {
                    type: bugType,
                    title: title.trim(),
                    description: description.trim(),
                    platform: 'mobile'
                });
                setSuccessMessage('Successfully reported the bug. Thank you for your support!');
            }
            catch (error) {
                setShowError(extractErrorMessage(error.response ? error.response.data : 'Network Error'));
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Bug Type:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={bugType}
                    onValueChange={handleBugTypechange}
                    style={styles.picker}
                    dropdownIconColor={colors.foreground}
                    dropdownIconRippleColor={colors.highlight2}
                >
                    <Picker.Item label="Select Bug Type" value="" style={styles.pickerItem} />
                    {bugTypes && bugTypes.map((type, index) => (
                        <Picker.Item key={index} label={type[1]} value={type[0]} style={styles.pickerItem} />
                    ))}
                </Picker>
            </View>
            <Text style={styles.label}>Title:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Bug Title"
                value={title}
                onChangeText={(text) => setTitle(text)}
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Enter Bug Description"
                multiline
                value={description}
                onChangeText={(text) => setDescription(text)}
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
                style={styles.submitButton}
                captionStyle={styles.submitButtonText}
                onPress={handleSubmit}
                disabled={!bugType || !title || !description}
            >
                Submit
            </MaterialButtonSuccess>
        </View>

    )
}
function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: colors.background,
        },
        label: {
            fontSize: 16,
            fontWeight: "bold",
            color: colors.foreground,
            marginTop: 20,
            marginBottom: 5
        },
        pickerContainer: {
            borderColor: colors.highlight2,
            borderWidth: 1,
            borderRadius: 8,
            paddingBottom: 5,
            marginBottom: 10,
            overflow: 'hidden'
        },
        picker: {
            height: 40,
        },
        pickerItem: {
            backgroundColor: colors.background,
            color: colors.foreground
        },
        input: {
            height: 40,
            borderColor: colors.highlight2,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 10,
            paddingHorizontal: 10,
            color: colors.foreground,
        },
        submitButton: {
            //backgroundColor: colors.highlight1,
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 5
        },
        submitButtonText: {
            fontSize: 16,
            fontWeight: "bold",
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

export default BugReport;