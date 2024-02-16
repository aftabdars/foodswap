import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import FoodPreview from "../components/FoodPreview.js";
import { useNavigation } from "@react-navigation/native";


function FoodCarousel(props) {
  // Theme
  const colors = props.colors;
  const styles = createStyles(colors);

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
      {props.foodItems && props.foodItems.length > 0 &&
        <Carousel
          layout="default"
          ref={carouselRef}
          data={props.foodItems ? props.foodItems : dummyFoodItems}
          sliderWidth={300}
          itemWidth={330}
          renderItem={({ item, index }) => (
            <MemoizedFoodPreview key={item.id} item={item} index={index} />
          )}
          onSnapToItem={handleSnapToItem}
        />
        ||
        <Text style={styles.alternativeText}>
          No food items available in your area
        </Text>
      }

    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    foodCarousel: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    alternativeText: {
      color: colors.foreground,
      textAlign: 'center',
      justifyContent: 'center',
      margin: 10
    },
  })
};

export default FoodCarousel;