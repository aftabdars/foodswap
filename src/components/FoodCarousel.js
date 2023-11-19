import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import FoodPreview from "../components/FoodPreview.js";

function FoodCarousel(props) { 
  const [activeIndex, setActiveIndex] = useState(0);

  // References and others
  const carouselRef = useRef(null);
  const dummyFoodItems = [{"id": 0, "name": "food", "descripttion": "Healthy food", "status": "up"}];

  // Render food items in carousel
  const renderItem = ({ item, index }) => (
    <FoodPreview foodData={item}></FoodPreview>
  );

  return (
    <View style={styles.foodCarousel}>
      <Carousel
        layout="default"
        ref={carouselRef}
        data={props.foodItems? props.foodItems : dummyFoodItems}
        sliderWidth={300}
        itemWidth={330}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  foodCarousel: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center',
   }
});

export default FoodCarousel;