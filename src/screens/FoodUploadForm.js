import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CommonActions, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialButtonDanger from "../components/MaterialButtonDanger";
import { getFoodCategories, postFood } from '../api/backend/Food';
import { getUserToken } from '../storage/UserToken';
import { SerializeImage } from '../api/backend/utils/Serialize';
import { ThemeContext, getColors } from '../assets/Theme';
import { useLoading } from '../assets/LoadingContext';
import { extractErrorMessage } from '../api/backend/utils/Utils';
import { CheckBox } from 'react-native-elements';


function FoodUploadForm() {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    // Loading
    const { showLoading, hideLoading } = useLoading();

    const navigation = useNavigation();
    const route = useRoute(); // Use useRoute to access route parameters

    const categoryPickerRef = useRef();

    // States
    const image = route.params?.image;
    const [showError, setShowError] = useState();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(-1);
    const [foodFor, setFoodFor] = useState("swap");
    const [showOnMap, setShowOnMap] = useState(false);
    const [foodCategories, setFoodCategories] = useState();
    const [filteredCategories, setFilteredCategories] = React.useState();
    const [searchText, setSearchText] = React.useState('');

    // Get food categories
    useEffect(() => {
        if (!foodCategories) {
            const getMeFoodCategories = async () => {
                await getFoodCategories()
                    .then(response => {
                        console.log(response.data);
                        setFoodCategories(response.data.results);
                        setFilteredCategories(response.data.results);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            };
            getMeFoodCategories();
        }
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = foodCategories.filter((category) =>
            category.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCategories(filtered);
        if (filtered.length > 0) {
            setCategory(filtered[0].id);
        }
    }
    const handleDiscard = () => {
        console.log('Food Upload Discarded');
        if (navigation.canGoBack()) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                })
            );
        }
    }
    const handleConfirm = async () => {
        if (category == -1) {
            setShowError("Please select category");
        }
        else if (!title) {
            setShowError("Title cannot be empty");
        }
        else {
            // Location permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Location permissions denied');
                return;
            }

            showLoading();

            // Gets user's current location
            let location = await Location.getCurrentPositionAsync({});
            location = {
                latitude: parseFloat(location.coords.latitude.toFixed(6)),
                longitude: parseFloat(location.coords.longitude.toFixed(6))
            }
            const token = await getUserToken();
            if (token) {
                const data = new FormData();
                data.append('name', title);
                data.append('image', SerializeImage(image, title));
                data.append('category', category);
                data.append('up_for', foodFor);
                if (description) data.append('description', description);
                if (location.latitude) data.append('location_latitude', location.latitude);
                if (location.longitude) data.append('location_longitude', location.longitude);
                if (showOnMap) data.append('show_on_map', showOnMap);

                await postFood(token.token, data)
                    .then(response => {
                        console.log(response.status);
                        console.log(response.data);

                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    { name: 'Main' },
                                    /*{
                                        name: 'FoodInfo',
                                        params: { foodID: response.data.id }
                                    } */
                                ],
                            })
                        );
                    })
                    .catch(error => {
                        console.log(error.response.data);
                        setShowError(extractErrorMessage(error.response.data));
                        hideLoading();
                    })
            }
            else {
                console.log('Something wrong with fetching token');
                hideLoading();
            }
        }
    }

    return (
        <KeyboardAvoidingView behavior="height" style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Title"
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Description"
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for category"
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                    <Picker
                        ref={categoryPickerRef}
                        placeholder='Select Category'
                        style={styles.categoryPicker}
                        dropdownIconColor={colors.foreground}
                        dropdownIconRippleColor={colors.highlight2}
                        selectedValue={category}
                        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                    >
                        <Picker.Item label="Select Category" value={-1} style={styles.pickerItem} />
                        {filteredCategories &&
                            filteredCategories.map(foodCategory => (
                                <Picker.Item
                                    key={foodCategory.id}
                                    label={foodCategory.name}
                                    value={foodCategory.id}
                                    color={colors.foreground}
                                    style={styles.pickerItem}
                                />
                            ))}
                    </Picker>
                    <Text style={styles.foodForText}>
                        Food For:
                    </Text>
                    <Picker
                        style={styles.foodForPicker}
                        dropdownIconColor={colors.foreground}
                        dropdownIconRippleColor={colors.highlight2}
                        selectedValue={foodFor}
                        onValueChange={(itemValue, itemIndex) => setFoodFor(itemValue)}
                    >
                        <Picker.Item label="Swap" value="swap" style={styles.pickerItem} />
                        <Picker.Item label="Share" value="share" style={styles.pickerItem} />
                    </Picker>
                    <View style={styles.checkboxContainer}>
                        <Text style={styles.label}>Show this food to other users on map?</Text>
                        <CheckBox
                            checked={showOnMap}
                            onPress={() => setShowOnMap(!showOnMap)}
                            checkedColor={colors.highlight2}
                        />
                    </View>
                    {showError && (
                        <Text style={styles.errormsg}>
                            {showError}
                        </Text>
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    <MaterialButtonDanger style={styles.button} onPress={handleDiscard}>
                        Discard
                    </MaterialButtonDanger>
                    <MaterialButtonSuccess style={styles.button} onPress={handleConfirm}>
                        Confirm
                    </MaterialButtonSuccess>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flexGrow: 1,
            backgroundColor: colors.background,
            paddingVertical: 30,
        },
        scrollContainer: {
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
            marginTop: 15,
        },
        button: {
            padding: 10,
            borderRadius: 5,
            flex: 1,
            margin: 5,
        },
        inputContainer: {
            width: '80%',
        },
        titleInput: {
            height: 43,
            width: '100%',
            backgroundColor: colors.background2,
            color: colors.foreground,
            borderRadius: 9,
            paddingHorizontal: 10,
            fontSize: 18,
            marginBottom: 20,
        },
        descriptionInput: {
            height: 150,
            width: '100%',
            backgroundColor: colors.background2,
            color: colors.foreground,
            borderRadius: 9,
            paddingHorizontal: 10,
            fontSize: 16,
            marginBottom: 20,
            //multiline: true,
        },
        searchInput: {
            height: 43,
            width: '100%',
            backgroundColor: colors.background2,
            color: colors.foreground,
            borderRadius: 9,
            paddingHorizontal: 10,
            fontSize: 18,
            marginBottom: 20,
        },
        categoryPicker: {
            width: '100%',
            backgroundColor: colors.background2,
            color: colors.foreground,
            marginBottom: 20,
        },
        foodForText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.foreground,
            marginBottom: 10,
        },
        foodForPicker: {
            width: '100%',
            backgroundColor: colors.background2,
            marginBottom: 20,
            color: colors.foreground
        },
        pickerItem: {
            backgroundColor: colors.background2,
            color: colors.foreground
        },
        checkboxContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: 10
        },
        label: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        errormsg: {
            fontFamily: "roboto-regular",
            color: colors.error,
            marginBottom: 10,
            textAlign: "center"
        },
    });
}

export default FoodUploadForm;
