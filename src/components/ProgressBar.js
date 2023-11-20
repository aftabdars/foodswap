import React from 'react';
import { View, Text } from 'react-native';
import { Bar } from 'react-native-progress';
import { useTheme } from '@react-navigation/native';

const ProgressBar = ({ xp, width = 200, height = 15 }) => {
  const { colors } = useTheme();
  progress = xp[0]/xp[1]
  return (
    <View>
      <Text style={{color: colors.foreground}}>XP:   {xp[0]} / {xp[1]}</Text>
      <Bar color={colors.highlight1} progress={progress} width={width} height={height} />
    </View>
  );
};

export default ProgressBar;