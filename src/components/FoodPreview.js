import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text, ImageBackground } from "react-native";
import { ThemeContext, getColors } from '../assets/Theme';
import { formatTimeDifferenceFuture } from "../utils/Format";
import { navigationPreviousScreenName, stringCapitalize } from "../utils/Utils";


function FoodPreview(props) {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  const foodData = props.foodData;
  const formatedExpiredTime = formatTimeDifferenceFuture(foodData.expire_time);

  const navigation = props.navigation;

  const TITLE_MAX_LENGTH = 55;
 
  const handlePress = () => {
    if (navigationPreviousScreenName(navigation) === 'FoodInfo') {
      navigation.push('FoodInfo', { foodID: foodData.id });
    }
    else{
      navigation.navigate('FoodInfo', { foodID: foodData.id });
    }
  }

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={handlePress}>
      {foodData ? (
        <ImageBackground
          source={{ uri: foodData.image }}
          resizeMode="cover"
          style={styles.image}
          imageStyle={styles.imageOverlay}
        >
      <View style={styles.overlay}>
        <Text style={styles.title}numberOfLines={2}>
          {foodData &&
            foodData.name.substring(0, TITLE_MAX_LENGTH) + 
            (foodData.name.length > TITLE_MAX_LENGTH ? '...' : '')
          }
        </Text>
        <Text style={styles.infoText}>
          {formatedExpiredTime.timeExceeded ?
            `Expired: ${formatedExpiredTime.difference} ago`
            :
            `Expires In: ${formatedExpiredTime.difference}`
          }
        </Text>
        <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
        {foodData && `Up for: ${foodData.up_for && stringCapitalize(foodData.up_for)}`}
        </Text>
      </View>
      </View>
      </ImageBackground>
      ) : (
        <View style={styles.imageAlternateContainer} />
      )}
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 20,
      elevation:5,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 16,
      overflow:'hidden',
    },
    imageOverlay:{
      borderRadius:16,
    },
    imageAlternateContainer: { 
      width: '100%', 
      height: 200,
      borderRadius: 16,
      backgroundColor: colors.background2 
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      padding: 16,
      borderRadius:16,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    title: {
      fontFamily: "roboto-regular",
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom:8,

    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    infoText: {
      fontFamily: "roboto-regular",
      fontSize: 14,
      color: '#FFFFFF',
      fontWeight: 'bold',
      textAlign: "center",
      marginBottom:4,
      opacity:0.8,
    },
  }
  )
}

export default FoodPreview;
