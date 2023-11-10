import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialButtonDanger from "../components/MaterialButtonDanger";


function FoodUploadForm() {
    const navigation = useNavigation();
    const route = useRoute(); // Use useRoute to access route parameters

    const image = route.params?.image;
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("category");
    const [foodFor, setFoodFor] = React.useState("swap");

    const handleDiscard = () => {
        console.log('Food Upload Discarded');
        if (navigation.canGoBack()) {
            navigation.navigate('Home');
        }
    }
    const handleConfirm = () => {
        console.log('Food Upload confirmed');
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
                />
                <Picker
                    placeholder='Select Category'
                    style={styles.categoryPicker}
                    selectedValue={category}
                    onValueChange={(itemValue, itemIndex) => setCategory(itemValue) }
                >
                    <Picker.Item label="Select Category" value="select" />
                    <Picker.Item label="Category 1" value="category1" />
                    <Picker.Item label="Category 2" value="category2" />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'top',
        backgroundColor: "rgba(215,215,215,1)"
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
        borderBottomWidth: 1,
        fontSize: 18,
        marginBottom: 50,
    },
    descriptionInput: {
        borderBottomWidth: 1,
        fontSize: 16,
        marginBottom: 50,
        height: 120,
        //multiline: true,
    },
    searchInput: {
        borderBottomWidth: 1,
        fontSize: 18,
        marginBottom: 20,
    },
    categoryPicker: {
        marginBottom: 50,
    },
    foodForText: {
    },
    foodForPicker: {
        marginBottom: 50,
    },
});

export default FoodUploadForm;
