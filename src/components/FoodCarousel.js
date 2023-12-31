import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import FoodPreview from "../components/FoodPreview.js";
import { useNavigation } from "@react-navigation/native";


function FoodCarousel(props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dummyFoodItems = [{ "id": -1, "name": " ", "descripttion": " ", "status": " " }];

  // References and others
  const carouselRef = useRef(null);
  const navigation = useNavigation();

  // Render food items in carousel
  const MemoizedFoodPreview = React.memo(({ item, index }) => (
    <FoodPreview key={item.id} foodData={item} navigation={navigation} />
  ));

  const handleSnapToItem = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  return (
    <View style={styles.foodCarousel}>
      <Carousel
        layout="default"
        ref={carouselRef}
        data={props.foodItems ? props.foodItems : dummyFoodItems}
        sliderWidth={300}
        itemWidth={330}
        renderItem={({ item, index }) => (
          <MemoizedFoodPreview item={item} index={index} />
        )}
        onSnapToItem={handleSnapToItem}
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