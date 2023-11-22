import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CommonActions, useRoute, useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialButtonDanger from "../components/MaterialButtonDanger";

import { getFoodCategories, postFood } from '../api/backend/Food';
import { getUserToken } from '../storage/Token';
import { SerializeImage } from '../api/backend/utils/Serialize';

function FoodUploadForm() {
    // Theme
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const navigation = useNavigation();
    const route = useRoute(); // Use useRoute to access route parameters

    // States
    const image = route.params?.image;
    const [showError, setShowError] = useState();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(-1);
    const [foodFor, setFoodFor] = useState("swap");
    const [foodCategories, setFoodCategories] = useState();
    const [filteredCategories, setFilteredCategories] = React.useState();
    const [searchText, setSearchText] = React.useState('');

    //if (image)
        //console.log(image, typeof(image));

    // Get food categories
    useEffect(() => {
        const getMeFoodCategories = async () => {
        getFoodCategories()
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
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = foodCategories.filter((category) =>
            category.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCategories(filtered);
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
        console.log('Food Upload confirmed');

        if (category == -1) {
            setShowError("Please select category");
        }
        else if (!title) {
            setShowError("Title cannot be empty");
        }
        else
        {
            console.log(image)

            const token = await getUserToken();
            
            if (token) {
                const data = new FormData();
                data.append('name', title);
                data.append('description', description);
                data.append('image', SerializeImage(image, title));
                data.append('category', category);
                data.append('up_for', foodFor);
    
                postFood(token.token, data)
                .then(response => {
                    console.log(response.status);
                    console.log(response.data);
                    navigation.navigate('Home');
                })
                .catch(error => {
                    const errorMessages = error.response.data;
                    console.log(error)
                    console.log(errorMessages)
                    const errorMessage = errorMessages[Object.keys(errorMessages)[0]];
                    setShowError(errorMessage)
                })
            }
            else{
                console.log('Something wrong with fetching token');
            }
        }
    }

    return (
        <View style={styles.container}>
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
                    placeholder='Select Category'
                    style={styles.categoryPicker}
                    selectedValue={category}
                    onValueChange={(itemValue, itemIndex) => setCategory(itemValue) }
                >
                    <Picker.Item label="Select Category" value={-1} />
                    {filteredCategories &&
                        filteredCategories.map(foodCategory => (
                            <Picker.Item key={foodCategory.id} label={foodCategory.name} value={foodCategory.id} />
                    ))}
                </Picker>
                <Text styles={styles.foodForText}>
                    Food For:
                </Text>
                <Picker
                    style={styles.foodForPicker}
                    selectedValue={foodFor}
                    onValueChange={(itemValue, itemIndex) => setFoodFor(itemValue) }
                >
                    <Picker.Item label="Swap" value="swap" />
                    <Picker.Item label="Share" value="share" />
                </Picker>
                {showError && (
                    <Text style={styles.errormsg}>
                        { showError }
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
    </View>
  );
}

function createStyles(colors) {
    return(
        {
            container: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'top',
                backgroundColor: colors.background
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
                marginTop: 30,
            },
            titleInput: {
                height: 43,
                width: 300,
                backgroundColor: colors.foreground,
                borderRadius: 9,
                paddingHorizontal: 10,
                fontSize: 18,
                marginBottom: 50,
            },
            descriptionInput: {
                height: 150,
                width: 300,
                backgroundColor: colors.foreground,
                borderRadius: 9,
                paddingHorizontal: 10,
                fontSize: 16,
                marginBottom: 50,
                //multiline: true,
            },
            searchInput: {
                height: 43,
                width: 300,
                backgroundColor: colors.foreground,
                borderRadius: 9,
                paddingHorizontal: 10,
                fontSize: 18,
                marginBottom: 5,
            },
            categoryPicker: {
                width: 300,
                backgroundColor: colors.foreground,
                marginBottom: 50,
            },
            foodForText: {
                fontSize: 18,
                fontWeight: 'bold',
            },
            foodForPicker: {
                width: 300,
                backgroundColor: colors.foreground,
                marginBottom: 30,
            },
            errormsg: {
                fontFamily: "roboto-regular",
                color: colors.error,
                marginBottom: 10,
                textAlign: "center"
              },
        }
    )
}

export default FoodUploadForm;
