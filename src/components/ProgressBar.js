import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bar } from 'react-native-progress';
import { ThemeContext, getColors } from '../assets/Theme';


const ProgressBar = ({ xp, width = 200, height = 15, color, xpFront = false }) => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  progress = xp[0] / xp[1]
  return (
    <View>
      {!xpFront &&
        <Text style={styles.xpText}>XP:   {xp[0]} / {xp[1]}</Text>
      }
      <Bar style={styles.bar} color={color ? color : colors.highlight1} progress={progress} width={width} height={height}>
        {xpFront &&
          <Text style={styles.xpTextFront}>{xp[0]} / {xp[1]}</Text>
        }
      </Bar>
    </View>
  );
};

function createStyles(colors) {
  return StyleSheet.create({
    bar: {
      justifyContent: 'center'
    },
    xpText: {
      color: colors.foreground
    },
    xpTextFront: {
      color: colors.foreground,
      position: 'absolute', 
      alignSelf: 'center'
    }
  });
}

export default ProgressBar;