import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import * as ImagePicker from 'expo-image-picker';

import { getProfile, setProfile } from '../storage/User';
import { getUserToken } from '../storage/UserToken';
import { updateUser } from '../api/backend/User';
import { ThemeContext, getColors } from '../assets/Theme';
import Editbutton from '../components/Editbutton';
import { SerializeImage } from '../api/backend/utils/Serialize';
import { extractErrorMessage } from '../api/backend/utils/Utils';


function EditProfile() {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);
  // States
  const [userData, setUserData] = useState();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [about, setAbout] = useState('');
  const [dob, setDob] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [showError, setShowError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveProfile = async () => {
    setShowError('');
    setSuccessMessage('');

    const token = await getUserToken();
    const data = new FormData();
    if (firstName && firstName !== userData['first_name'])
      data.append('first_name', firstName);
    if (lastName && lastName !== userData['last_name'])
      data.append('last_name', lastName);
    if (about && about !== userData['about'])
      data.append('about', about);
    if (profilePicture && profilePicture !== userData['profile_picture'])
      data.append('profile_picture', SerializeImage(profilePicture, userData['username']));
    //data.append('dob', dob);

    const isFormData = data['_parts'].length > 0;
    if (isFormData) {
      updateUser(userData['id'], token.token, data)
        .then(response => {
          console.log(response.status);
          console.log(response.data);
          setUserData(response.data);
          setProfile(response.data); // Also update in cache
          setSuccessMessage('Successfully updated profile');
          console.log(`UserID: ${userData['id']}'s profile updated`);
        })
        .catch(error => {
          console.log(error);
          setShowError(extractErrorMessage(error.response.data));
        })
    }
    else {
      setShowError("No changes have been made");
    }
  };

  const handleEditProfilePicture = async () => {
    try {
      const picture = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!picture.canceled) {
        setProfilePicture(picture.uri);
      }

    } catch (error) {
      console.error('Error picking image:', error);
      setShowError("Error picking image");
    }
  }

  // Gets user profile
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile && profile !== null) {
          setUserData(profile);

          setFirstName(profile['first_name']);
          setLastName(profile['last_name']);
          setAbout(profile['about']);
          setDob(profile['dob']);
          setProfilePicture(profile['profile_picture']);
        }
      }
      catch (error) {
        console.log(error);
        setShowError('Error getting profile');
        //const errorMessages = error.response.data;
        //setShowError(extractErrorMessage(error.response.data));
      }
    }
    getUserProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profilePictureContainer}>
        <Editbutton style={styles.editProfilePicture} onPress={handleEditProfilePicture}></Editbutton>
        <TouchableOpacity onPress={handleEditProfilePicture}>
          <View style={styles.imageStack}>
            <Image
              source={profilePicture ? { uri: profilePicture } : require("../assets/images/default_profile.jpg")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
        </TouchableOpacity>
      </View>

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
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
      />
      <Text style={styles.label}>About</Text>
      <TextInput
        style={styles.input}
        value={about}
        onChangeText={setAbout}
        placeholder="Tell us about yourself"
        multiline
        numberOfLines={3}
      />
      <Text style={styles.label}>Date of Birth</Text>
      <Text>DatePicker will be implemented here</Text>

      <MaterialButtonSuccess style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </MaterialButtonSuccess>
    </ScrollView>
  );
};

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 38,
      paddingVertical: 10,
      backgroundColor: colors.background,
    },
    profilePictureContainer: {
      //position:'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    editProfilePicture: {
      height: 44,
      width: 44,
      position: "relative",
      top: 20,
      left: 50
    },
    image: {
      width: 128,
      height: 128,
      borderRadius: 100,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 20,
      color: colors.foreground,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.background2,
      borderRadius: 8,
      padding: 8,
      marginTop: 10,
      color: colors.foreground,
      backgroundColor: colors.background2
    },
    saveButton: {
      padding: 12,
      borderRadius: 8,
      marginTop: 20,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    errormsg: {
      fontFamily: "roboto-regular",
      color: colors.error,
      marginTop: 20,
      textAlign: "center"
    },
    successMsg: {
      fontFamily: "roboto-regular",
      color: colors.highlight2,
      marginTop: 20,
      textAlign: "center"
    },
  });
}

export default EditProfile;