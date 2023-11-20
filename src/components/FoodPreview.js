import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { useTheme } from '@react-navigation/native';


function FoodPreview(props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  // Food preview click functionaly will be implemented here
  // On click it will take the user to that food's screen showing all details

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: props.foodData.image}}
            resizeMode="cover"
            style={styles.image}
          ></Image>
        </View>
        <Text style={styles.title}>
          {props.foodData? props.foodData.name : "Food Title"}
        </Text>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return (
    {
      container: {
        borderRadius: 9,
        backgroundColor: colors.background2,
        borderRadius: 5,
        height: 250,
        padding: 15,
        marginLeft: 25,
        marginRight: 25,
      },
      imageContainer: {
        width: 250,
        height: 150,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontFamily: "roboto-regular",
        color: colors.foreground,
        fontSize: 20,
        textAlign: 'center', 
      }
    }
  )
}

export default FoodPreview;
