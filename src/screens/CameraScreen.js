import React, {useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

function CameraScreen() {
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const image = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: true
        });
        if (image) {
          // In future, here ML checking will be done like if object in photo is actually Food item
  
          // Navigate to Confirm picture page where user can either continue to food details post page or back to camera
          navigation.navigate('FoodPictureConfirmation', {image: image});
        }
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraHeader}>
      </View>
      <Camera 
        style={styles.camera} 
        type={CameraType.back}
        ratio="16:9"
        ref={cameraRef}
      >
      </Camera>
      <View style={styles.cameraFooter}>
        <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 10,
  },
  cameraHeader: {
    flex: 1,
    backgroundColor: 'rgb(0, 0, 0)',
  },
  cameraFooter: {
    flex: 2,
    backgroundColor: 'rgb(0, 0, 0)',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'blue',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CameraScreen;
