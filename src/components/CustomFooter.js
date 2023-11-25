import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext, getColors } from '../assets/Theme';

const CustomFooter = ({ state, descriptors, navigation }) => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
    
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.background }}>
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
            <Ionicons name={options.iconName} size={24} color={isFocused ? colors.highlight1 : colors.foreground} />
            <Text style={{ color: isFocused ? '#007BFF' : colors.foreground }}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomFooter;