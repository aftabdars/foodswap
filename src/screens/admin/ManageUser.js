import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import EntypoIcon from "react-native-vector-icons/Entypo";
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'react-native-elements/dist/helpers';

import { getColors, ThemeContext } from '../../assets/Theme';
import MaterialButtonSuccess from "../../components/MaterialButtonSuccess";


const AdminManageUser = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const handleAction = (action) => {
        console.log(`Performing ${action}`);
    };

    const [isContainerOpen, setContainerOpen] = useState(false);
    const [selectedStat, setSelectedStat] = useState(null);
    const [isResetFieldVisible, setResetFieldVisible] = useState(false);

    const toggleContainer = () => {
        setContainerOpen(!isContainerOpen);
        setSelectedStat(null); // Reset selectedStat when closing the container
        setResetFieldVisible(false); // Hide reset field when closing the container
    };

    const containerHeight = useSharedValue(0);

    const toggleContainerAnimation = () => {
        containerHeight.value = withTiming(isContainerOpen ? 0 : 1);
    };

    const containerStyle = useAnimatedStyle(() => {
        return {
            height: `${containerHeight.value * 35}%`,
        };
    });

    const [editedUser, setEditedUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        // Add other fields as needed
    });

    const handleFieldClick = (field) => {
        // Assuming you want to edit only one field at a time
        setEditedUser({ ...editedUser, [field]: user[field] });
    };

    const handleFieldChange = (field, value) => {
        setEditedUser({ ...editedUser, [field]: value });
    };

    const user = {
        imageUrl: require("../../assets/images/default_profile.jpg"),
        firstName: 'MUHAMMAD',
        lastName: 'KHAN',
        username: 'MK',
        about: 'I am a programmer',
        phone: '123-456-7890',
        location: 'City, Country',
        email: 'user@example.com',
        memberSince: 'January 1, 2022',
    };

    const statsData = [
        { label: 'Uploaded', value: 4 },
        { label: 'Swapped', value: 3 },
        { label: 'Food Item Shared', value: 0 },
        { label: 'Food Item Taken', value: 1000 },
        { label: 'Foodiez Earned', value: 1 },
        { label: 'Achievement Completed', value: 0 },
        { label: 'Followers', value: 10 },
        { label: 'Following', value: 100 },

    ];

    const fakeUserData = {
        userId: '123',
        username: 'MK',
        firstName: 'MUHAMMAD',
        lastName: 'KHAN',
        imageUrl: require("../../assets/images/default_profile.jpg"),
    };

    const handleStatClick = (index) => {
        setSelectedStat(statsData[index]);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.userInfoContainer}>
                    <Image source={fakeUserData.imageUrl} style={styles.profilePic} />
                    <Text style={styles.username}>{fakeUserData.username}</Text>
                    <Text>{`${fakeUserData.firstName} ${fakeUserData.lastName}`}</Text>
                </View>


                <MaterialButtonSuccess style={styles.button}
                    onPress={() => handleAction('Ban User')}>
                    <Text style={styles.buttonText}>Ban User</Text>
                </MaterialButtonSuccess>

                <View style={styles.detailscontainer}>
                    <Text style={styles.headings}>Reset profile</Text>

                    <TouchableOpacity onPress={() => handleFieldClick('firstName')}>
                        <View style={styles.detailsgroup}>
                            <EntypoIcon name="phone" style={styles.icon}></EntypoIcon>
                            <Text style={styles.detailLabel}>firstName:</Text>
                            {editedUser.firstName ? (
                                <TextInput
                                    style={styles.detailValue}
                                    value={editedUser.firstName}
                                    onChangeText={(text) => handleFieldChange('firstName', text)}
                                />
                            ) : (
                                <Text style={styles.detailValue}>{user.firstName}</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleFieldClick('lastName')}>
                        <View style={styles.detailsgroup}>
                            <EntypoIcon name="phone" style={styles.icon}></EntypoIcon>
                            <Text style={styles.detailLabel}>lastName:</Text>
                            {editedUser.lastName ? (
                                <TextInput
                                    style={styles.detailValue}
                                    value={editedUser.lastName}
                                    onChangeText={(text) => handleFieldChange('lastName', text)}
                                />
                            ) : (
                                <Text style={styles.detailValue}>{user.lastName}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleFieldClick('username')}>
                        <View style={styles.detailsgroup}>
                            <EntypoIcon name="phone" style={styles.icon}></EntypoIcon>
                            <Text style={styles.detailLabel}>username:</Text>
                            {editedUser.username ? (
                                <TextInput
                                    style={styles.detailValue}
                                    value={editedUser.username}
                                    onChangeText={(text) => handleFieldChange('userName', text)}
                                />
                            ) : (
                                <Text style={styles.detailValue}>{user.username}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleFieldClick('phone')}>
                        <View style={styles.detailsgroup}>
                            <EntypoIcon name="phone" style={styles.icon}></EntypoIcon>
                            <Text style={styles.detailLabel}>Phone:</Text>
                            {editedUser.phone ? (
                                <TextInput
                                    style={styles.detailValue}
                                    value={editedUser.phone}
                                    onChangeText={(text) => handleFieldChange('phone', text)}
                                />
                            ) : (
                                <Text style={styles.detailValue}>{user.phone}</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleFieldClick('location')}>
                        <View style={styles.detailsgroup}>
                            <EntypoIcon name="location-pin" style={styles.icon}></EntypoIcon>
                            <Text style={styles.detailLabel}>Location:</Text>
                            {editedUser.location ? (
                                <TextInput
                                    style={styles.detailValue}
                                    value={editedUser.location}
                                    onChangeText={(text) => handleFieldChange('location', text)}
                                />
                            ) : (
                                <Text style={styles.detailValue}>{user.location}</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleFieldClick('email')}>
                        <View style={styles.detailsgroup}>
                            <EntypoIcon name="email" style={styles.icon}></EntypoIcon>
                            <Text style={styles.detailLabel}>Email:</Text>
                            {editedUser.email ? (
                                <TextInput
                                    style={styles.detailValue}
                                    value={editedUser.email}
                                    onChangeText={(text) => handleFieldChange('email', text)}
                                />
                            ) : (
                                <Text style={styles.detailValue}>{user.email}</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleFieldClick('membersince')}>
                        <View style={styles.detailsgroup}>
                            <EntypoIcon name="calendar" style={styles.icon}></EntypoIcon>
                            <Text style={styles.detailLabel}>Member Since:</Text>
                            {editedUser.memberSince ? (
                                <TextInput
                                    style={styles.detailValue}
                                    value={editedUser.memberSince}
                                    onChangeText={(text) => handleFieldChange('membersince', text)}
                                />
                            ) : (
                                <Text style={styles.detailValue}>{user.memberSince}</Text>
                            )}
                        </View>
                    </TouchableOpacity>



                    <MaterialButtonSuccess style={styles.savebtn}
                        onPress={() => handleAction('Save')}>
                        <Text style={styles.buttonText}>Save</Text>
                    </MaterialButtonSuccess>
                </View>



                <TouchableOpacity style={styles.stateContainer} onPress={() => {
                    toggleContainer();
                    toggleContainerAnimation();
                    setResetFieldVisible(false);
                }}
                >
                    {!isContainerOpen ? (
                        <Text style={styles.sectionHeading}>Reset Stats</Text>
                    ) : (
                        <>
                            <Animated.View style={containerStyle}>
                                <View style={styles.statsRow}>
                                    {statsData.map((stat, index) => (

                                        <TouchableOpacity
                                            key={index}
                                            style={styles.statsBox}
                                            onPress={() => {
                                                handleStatClick(index);
                                                setResetFieldVisible(true);
                                            }}
                                        >
                                            <Icon name="exchange" style={styles.icons} />
                                            <Text style={styles.statValue}>{stat.value}</Text>
                                            <Text style={styles.statLabel}>{stat.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <MaterialButtonSuccess style={styles.savebtn}
                                    onPress={() => handleAction('Save')}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </MaterialButtonSuccess>
                            </Animated.View>
                            {isResetFieldVisible && selectedStat && (
                                <View style={styles.resetFieldContainer}>
                                    <Text style={styles.resetFieldLabel}>Reset {selectedStat.label}:</Text>
                                    <TextInput
                                        style={styles.resetFieldInput}
                                        placeholder={`Enter new value for ${selectedStat.label}`}
                                        keyboardType="numeric"
                                        onChangeText={(text) => console.log(text)} // Handle the input value
                                    />
                                    <TouchableOpacity
                                        style={styles.resetFieldButton}
                                        onPress={() => {
                                            // Handle the reset action
                                            console.log(`Resetting ${selectedStat.label} to the new value`);
                                            setSelectedStat(null);
                                            setResetFieldVisible(false); // Hide reset field after resetting
                                        }}
                                    >
                                        <Text style={styles.resetFieldButtonText}>Reset</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {isContainerOpen && !isResetFieldVisible && (
                                <TouchableOpacity onPress={() => { }}>


                                    <Text style={styles.tapToCloseText} onPress={() => { toggleContainer(); toggleContainerAnimation(); }}>Tap to close</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        userInfoContainer: {
            alignItems: 'center',
            marginBottom: 20,
            top: 10,
        },
        profilePic: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 10,
            top: 40,
        },
        username: {
            color: colors.foreground,
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
            top: 45,
        },
        button: {
            marginVertical: 20,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: colors.highlight1,
            borderRadius: 20,
            padding: 20,
            elevation: 3,
        },
        detailscontainer: {
            marginVertical: 20,
            marginLeft: 20,
            marginRight: 20,
            backgroundColor: colors.highlight1,
            borderRadius: 10,
            padding: 30,
            elevation: 3,
        },
        headings: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.foreground,
            fontSize: 22,
            marginLeft: 0
        },
        detailsgroup: {
            minWidth: 200,
            height: 40,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: 10,
        },
        icon: {
            color: colors.highlight2,
            fontSize: 30
        },
        detailLabel: {
            color: colors.foreground,
            fontSize: 15,
            left: 12
        },
        detailValue: {
            fontSize: 14,
            left: 20,
            color: colors.foreground,
        },
        stateContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingVertical: 20,
            borderRadius: 15,
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 16,
            justifyContent: 'space-evenly',
            backgroundColor: colors.highlight1,
            marginVertical: 10,
            elevation: 3,
        },
        sectionHeading: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        statsRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            width: '90%',
        },
        statsBox: {
            justifyContent: 'flex-start',
            backgroundColor: colors.background,
            borderRadius: 15,
            padding: 5,
            left: 12,
            marginVertical: 25,
            width: '48%',
            marginBottom: 0,
            borderColor: colors.highlight2,
            borderWidth: 2,
        },
        statIcon: {
            fontSize: 30,
            color: colors.highlight1,
        },
        statTextContainer: {
            marginLeft: 10
        },
        statValue: {
            fontSize: 16,
            color: colors.foreground,
            fontWeight: 'bold',
        },
        statLabel: {
            fontSize: 10,
            color: colors.foreground,
            fontWeight: 'bold',
            flexWrap: 'wrap',
        },
        tapToCloseText: {
            marginTop: 20,
            bottom: 190,
            color: 'blue', // Adjust color based on your theme
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
        },
        buttonText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.foreground, // Use your theme color here
        },
        resetFieldContainer: {
            marginTop: 10,
            padding: 10,
            backgroundColor: colors.background,
            borderRadius: 15,
        },
        resetFieldLabel: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 5,
            color: colors.foreground,
        },
        resetFieldInput: {
            borderWidth: 1,
            borderColor: colors.highlight1,
            borderRadius: 10,
            padding: 8,
            marginBottom: 10,
            color: colors.foreground,
        },
        resetFieldButton: {
            backgroundColor: '#4CAF50', // Use your theme color here
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
        },
        resetFieldButtonText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ffffff', // Use your theme color here
        },
        savebtn: {
            width: '50%',
            paddingVertical: 20,
            left: 70,
            top: 10,
            borderRadius: 15,
            marginBottom: 16,
            backgroundColor: color.highlight1,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.highlight2,
        },

    });
}

export default AdminManageUser;