import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Images from "../assets/images/categorybuttons/Images";

function Categorybutton(props) {
  // function getImage (name){
  //   const file = props.categoryData ? props.categoryData.name : "Category"
  //   const source = `../assets/images/categorybuttons/${file}.png`
  //   // const image = require(source);
  //   let image = ''
  //   require(['source'], function(module){
  //   // do something with fooModule
  //   image = module;
  //   })
  //   return image
  // }

  return (
    <TouchableOpacity style={[styles.container, props.style, {backgroundColor: props.style.backgroundColor}]} onPress={props.onPress}>
      <Image source = {props.categoryData.name == 'Dairy Product'?  Images.Dairy : Images[props.categoryData.name]} style = {styles.icon} />
      <Text style={[styles.category, {color: props.style.color}]}>{props.categoryData ? (props.categoryData.name == 'Dairy Product'? 'Dairy' : props.categoryData.name) : "Category"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18
  },
  icon: {
    height: 26,
    width: 22
  },
  category: {
    fontFamily: "roboto-regular",
    color: "#121212"
  }
});

export default Categorybutton;
