import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import MaterialButtonDanger from "../components/MaterialButtonDanger";


function FoodPictureConfirmation() {
  const route = useRoute(); // Use useRoute to access route parameters
  const image = route.params?.image; // Access image from the route params
  const navigation = useNavigation();

  console.log(image);

  const handleDiscard = () => {
    console.log('Image discarded');
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }
  const handleConfirm = () => {
    console.log('Image confirmed');
    navigation.navigate('FoodUploadForm', {image: image});
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: image.uri }} style={styles.image} />
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
    justifyContent: 'center',
    backgroundColor: "rgba(215,215,215,1)"
  },
  image: {
    width: '90%',
    height: '85%', 
    resizeMode: 'contain',
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
});

export default FoodPictureConfirmation;
