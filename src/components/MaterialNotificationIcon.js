import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext, getColors } from '../assets/Theme';

import { getUserToken } from "../storage/UserToken.js";
import { getClientIsNewNotification } from "../api/backend/User.js";

function MaterialNotificationIcon(props) {
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);

  const [isNewNotification, setIsNewNotification] = useState(false);

  useEffect(() => {
    const getMeIsNewNotification = async () => {
      const token = await getUserToken();
      if (token && token !== null) {
        await getClientIsNewNotification(token.token)
          .then(response => {
            setIsNewNotification(response.data.is_new_notification);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }

    getMeIsNewNotification();
  }, [props.refresh]);

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
      <View style={styles.iconContainer}>
        <Icon name="bell-outline" size={24} color={colors.foreground} />
        {isNewNotification && <View style={styles.redDot} />}
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
  iconContainer: {
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'red',
  },
});

export default MaterialNotificationIcon;
