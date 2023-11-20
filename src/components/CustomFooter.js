import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../assets/Colors'

const CustomFooter = ({ state, descriptors, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: Colors.background }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', padding: 10 }}
            key={index}
          >
            <Ionicons name={options.iconName} size={24} color={isFocused ? Colors.highlight1 : Colors.foreground} />
            <Text style={{ color: isFocused ? '#007BFF' : 'gray' }}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomFooter;