import React, { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext, getColors } from '../assets/Theme';

function MaterialNotificationIcon(props) {
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
      <View>
          <Icon name="bell-outline" size={24} color={colors.foreground}/>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    minWidth: 40,
    minHeight: 40,
    width: 40,
    height: 40,
  },
});

export default MaterialNotificationIcon;