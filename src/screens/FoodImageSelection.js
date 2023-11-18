import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Colors from '../assets/Colors'

function FoodImageSelection() {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('FoodSwap needs your permission to access camera!');
            }
        })();
    }, []);

    const handleTakePicture = async () => {
        try {
            const picture = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
    
            if (!picture.canceled) {
                setSelectedImage(picture);
              }

        } catch (error) {
            console.error('Error taking picture', error);
        }
    };

    const handlePickPicture = async () => {
        try {
          const picture = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!picture.canceled) {
            setSelectedImage(picture);
          }

        } catch (error) {
          console.error('Error picking image:', error);
        }
    };

    const handleContine = () => {
        // In future, here ML checking will be done like if object in photo is actually Food item

        navigation.navigate('FoodUploadForm', {image: selectedImage});
    }

    // Use selectedImage.assets.uri in future (currently it is not working though)
    return (
        <View style={styles.container}>
            {selectedImage && 
                <Image 
                    source={{ uri: selectedImage.uri }} 
                    style={styles.image} 
                />
            }
            <TouchableOpacity style={styles.button} onPress={handlePickPicture}>
                <Text style={styles.buttonText}>Select Picture from Library</Text>
            </TouchableOpacity>
            <Text style={styles.text}>or</Text>
            <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
                <Text style={styles.buttonText}>Take a new Picture</Text>
            </TouchableOpacity>

            {selectedImage && 
            <TouchableOpacity style={styles.buttonContinue} onPress={handleContine}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    image: {
        width: 350,
        height: 250,
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#333',
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContinue: {
        backgroundColor: '#009688',
        position: 'absolute',
        bottom: 0,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginVertical: 20,
        borderRadius: 8,
    },
    text: {
        color: Colors.background,
        fontSize: 18,
    },
});

export default FoodImageSelection;
