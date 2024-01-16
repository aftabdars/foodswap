import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';

import { getColors, ThemeContext } from '../../assets/Theme';
import MaterialButtonSuccess from '../../components/MaterialButtonSuccess';
import MaterialButtonDanger from '../../components/MaterialButtonDanger';


const AdminManageFood = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const [editableFood, setEditableFood] = useState(null);
    const [itemStates, setItemStates] = useState({});

    const foodList = [
        {
            id: '1',
            title: 'Delicious Dish',
            description: 'Another amazing dish for foodies!',
            ownerName: 'John Doe',
            imageUrl: require("../../assets/images/default_food.png"),
            imageUrl2: require("../../assets/images/default_profile.jpg"),
        },
    ];

    const handleFieldClick = (foodList) => {
        setEditableFood(foodList);
        setItemStates((prevStates) => ({
            ...prevStates,
            [foodList.id]: {
                isEditing: !prevStates[foodList.id]?.isEditing,
                isDeleting: false,
            },
        }));
    };

    const handleFieldChange = (field, value) => {
        setEditableFood({
            ...editableFood,
            [field]: value,
        });
    };

    const handleDeleteClick = (foodList) => {
        setItemStates((prevStates) => ({
            ...prevStates,
            [foodList.id]: {
                isEditing: false,
                isDeleting: !prevStates[foodList.id],
            },
        }));
    };

    const renderItem = ({ item }) => {
        const isCurrentItemEditing = editableFood && editableFood.id === item.id;
        const { isEditing } = itemStates[item.id] || {};

        return (
            <View style={styles.itemContainer}>
                <Image source={item.imageUrl} style={styles.foodImage} />
                <View style={styles.detailsContainer}>
                    <View style={styles.editableContainer}>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={editableFood.title}
                                onChangeText={(text) => handleFieldChange('title', text)}
                            />
                        ) : (
                            <Text style={styles.title}>{item.title}</Text>
                        )}
                    </View>
                    <View style={styles.editableContainer}>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={editableFood.description}
                                onChangeText={(text) => handleFieldChange('description', text)}
                            />
                        ) : (
                            <Text style={styles.description}>{item.description}</Text>

                        )}
                    </View>
                    <View style={styles.imagecontainer}>
                        <Image source={item.imageUrl2} style={styles.profileimage} />
                    </View>
                    <Text style={styles.owner}>{item.ownerName}</Text>
                    <MaterialButtonSuccess style={styles.editbtn} onPress={() => handleFieldClick(item)}>
                        <Text style={styles.edttxt}>{isCurrentItemEditing ? 'Save' : 'Edit'}</Text>
                    </MaterialButtonSuccess>
                    <MaterialButtonDanger style={styles.delbtn} onPress={() => handleDeleteClick(item)}>
                        <Text style={styles.edttxt}>{isCurrentItemEditing ? 'Cancel' : 'Delete'}</Text>
                    </MaterialButtonDanger>
                </View>
            </View>
        );
    };
    return (
        <FlatList
            data={foodList}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.flatList}
        />
    );
};

function createStyles(colors) {
    return StyleSheet.create({
        flatList: {
            padding: 10,
            backgroundColor: colors.background
        },
        itemContainer: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: colors.background2,
            borderRadius: 16,
            top: 5,
            overflow: 'hidden',
            elevation: 3,
            marginBottom: 10,
        },
        foodImage: {
            width: 80,
            height: 80,
            marginRight: 8,
            marginLeft: 8,
            marginTop: 30,
            resizeMode: 'cover',
            borderRadius: 5,
        },
        profileimage: {
            width: 30,
            height: 30,
            marginRight: 5,
            marginLeft: 5,
            marginTop: 5,
            resizeMode: 'cover',
            borderRadius: 20,
        },
        editableContainer: {
            flexDirection: 'column',
            alignItems: 'center',
        },
        editbtn: {
            padding: 5,
            top: 10,
            right: 40,
            marginLeft: 25,
            marginRight: 25,
            borderRadius: 20,
        },
        edttxt: {
            color: 'white',
            textAlign: "center",
        },
        delbtn: {
            borderRadius: 20,
            padding: 5,
            left: 80,
            bottom: 20,
            marginLeft: 25,
            marginRight: 25,
        },
        detailsContainer: {
            flex: 1.8,
            marginRight: 80
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 8,
            color: colors.highlight1,
        },
        description: {
            fontSize: 14,
            marginBottom: 8,
            color: colors.foreground,
        },
        infoContainer: {
            flexDirection: 'row',
            marginBottom: 8,
        },
        owner: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.foreground,
        },
    });
}
export default AdminManageFood;