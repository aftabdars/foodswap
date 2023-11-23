import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet,TouchableOpacity,Image, ScrollView } from 'react-native';
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import * as ImagePicker from 'expo-image-picker';

import { getUserToken } from '../storage/UserToken';
import { getProfile, updateUser } from '../api/backend/User';
import { ThemeContext, getColors } from '../assets/Theme';
import Editbutton from '../components/Editbutton';
import { SerializeImage } from '../api/backend/utils/Serialize';


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
    const [successMessage, setSuccessMessage] = useState('This is success message');

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

        console.log(SerializeImage(profilePicture, userData['username']));

        const isFormData = data['_parts'].length > 0;
        if (isFormData) {
          updateUser(userData['id'], token.token, data)
          .then(response => {
            console.log(response.status);
            console.log(response.data);
            setUserData(response.data);
            setSuccessMessage('Successfully update profile');
            console.log(`UserID: ${userData['id']}'s profile updated`);
          })
          .catch(error => {
            console.log(error);
            const errorMessages = error.response.data;
            setShowError(errorMessages[Object.keys(errorMessages)[0]][0]);
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
        const token = await getUserToken();
        getProfile(token.token)
        .then(response => {
          if (response.status == 200) {
            const userData = response.data;
            setUserData(response.data);

            setFirstName(userData['first_name']);
            setLastName(userData['last_name']);
            setAbout(userData['about']);
            setDob(userData['dob']);
            setProfilePicture(userData['profile_picture']);
          }
        })
        .catch(error => {
          const errorMessages = error.response.data;
          setShowError(errorMessages[Object.keys(errorMessages)[0]][0]);
        })
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
                source={profilePicture? {uri: profilePicture} : require("../assets/images/default_profile.jpg")}
                resizeMode="contain"
                  style={styles.image}
                ></Image> 
              </View>
            </TouchableOpacity>
        </View>

        {successMessage? 
          <Text style={styles.successMsg}>
            { successMessage }
          </Text>
          :
          showError && (
            <Text style={styles.errormsg}>
              { showError }
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
        flex: 1,
        paddingHorizontal: 38,
        backgroundColor: colors.background
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