import React, { Component, useContext } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { ThemeContext, getColors } from '../assets/Theme';
import { LinearGradient } from "expo-linear-gradient";

function FoodPreview(props) {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);
    
  // Food preview click functionaly will be implemented here
  // On click it will take the user to that food's screen showing all details

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
          <Image
            source={{uri: props.foodData.image}}
            resizeMode="cover"
            style={styles.image}
          ></Image>
         <View style={styles.overlay}>
        <Text style={styles.title}>
          {props.foodData? props.foodData.name : "Food Title"}
          </Text>
          <Text style={styles.infoText}>{`Expire Date: 2023-12-31`}</Text>
          <Text style={styles.infoText}>Swap</Text>
      
     
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
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        padding: 0,
        marginTop:90,
      
      },
      
        title: {
        fontFamily: "roboto-regular",
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight:'bold',
        textAlign: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 16,
        padding: 45,
        marginBottom: -40,
      },
      infoText: {
        fontFamily: "roboto-regular",
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight:'bold',
        textAlign: "center",
        borderRadius: 10,
        padding: 10,
        marginTop: -18,
       
      },
    }
  )
}

export default FoodPreview;
