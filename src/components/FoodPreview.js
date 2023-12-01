import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { ThemeContext, getColors } from '../assets/Theme';
import { formatTimeDifferenceFuture } from "../utils/Format";
import { stringCapitalize } from "../utils/Utils";

function FoodPreview(props) {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    
    const foodData = props.foodData;
    const formatedExpiredTime = formatTimeDifferenceFuture(foodData.expire_time);

    const TITLE_MAX_LENGTH = 55;
  // Food preview click functionaly will be implemented here
  // On click it will take the user to that food's screen showing all details

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
      <Image
        source={{uri: foodData.image}}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>
        {foodData? 
          foodData.name .substring(0, TITLE_MAX_LENGTH) + (foodData.name .length > TITLE_MAX_LENGTH? '...' : '') 
        : 
          "Food Title"
        }
        </Text>
        <Text style={styles.infoText}>
          {formatedExpiredTime.timeExceeded? 
              `Expired: ${formatedExpiredTime.difference} ago`
            :
              `Expires In: ${formatedExpiredTime.difference}`
          }
        </Text>
        <Text style={styles.infoText}>{`Up for: ${foodData.up_for && stringCapitalize(foodData.up_for)}`}</Text>
      </View>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
      container: {
        borderRadius: 16,
        backgroundColor: colors.background2,
        overflow:'hidden',
        marginBottom:20,
        position: 'relative',
        },
      image: {
        width: '100%',
        height: 200,
        borderRadius: 16,
      },
      overlay: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: "center",
        alignItems: "center",
        padding: 6,
        left: 0,
        right: 0,
        bottom: 0,
      },
        title: {
        fontFamily: "roboto-regular",
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight:'bold',
        textAlign: 'center', 
        borderRadius: 16,
        marginVertical: 2
      },
      infoText: {
        fontFamily: "roboto-regular",
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight:'bold',
        textAlign: "center",
        borderRadius: 10,
      },
    }
  )
}

export default FoodPreview;
