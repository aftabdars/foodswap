import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { Bar } from 'react-native-progress';
import { ThemeContext, getColors } from '../assets/Theme';


const ProgressBar = ({ xp, width = 200, height = 15, color }) => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);

  progress = xp[0]/xp[1]
  return (
    <View>
      <Text style={{color: colors.foreground}}>XP:   {xp[0]} / {xp[1]}</Text>
      <Bar color={color? color : colors.highlight1} progress={progress} width={width} height={height} />
    </View>
  );
};

export default ProgressBar;