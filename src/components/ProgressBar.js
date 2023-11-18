import React from 'react';
import { View, Text } from 'react-native';
import { Bar } from 'react-native-progress';

const ProgressBar = ({ xp, width = 200, height = 15 }) => {
  progress = xp[0]/xp[1]
  return (
    <View>
      <Text>XP:   {xp[0]} / {xp[1]}</Text>
      <Bar color='#fe724c' progress={progress} width={width} height={height} />
    </View>
  );
};

export default ProgressBar;