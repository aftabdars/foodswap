import  React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { formatDateTimeString } from "../utils/Format";
import { stringCapitalize } from "../utils/Utils";

function SearchedFoodPreview(props) {
    //Theme
    const colors = props.colors;
    const styles = createStyles(colors);
    // Food Item's Data
    const item = props.foodData;
  
    const DESCRIPTION_MAX_LENGTH = 100;

    const handlePress = () => {
      // Navigation will be handled here
    }

    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.container}>
          <Image source={{uri: item.image}} style={styles.foodImage} />
          <View style={styles.detailsContainer}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.category}>{item.category_name}</Text>
              <Text style={styles.description}>
                {item.description.substring(0, DESCRIPTION_MAX_LENGTH)}
                {item.description.length > DESCRIPTION_MAX_LENGTH? '...' : ''}
              </Text>
              <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Uploaded on</Text>
                  <Text style={styles.infoText}>
                    {formatDateTimeString(item.date_added, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    })}
                  </Text>
              </View>
              <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Expires on</Text>
                  <Text style={styles.infoText}>
                  {formatDateTimeString(item.expire_time, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    })}
                  </Text>
              </View>
              <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={styles.infoText}>{item.status == 'up'? 'Available' : stringCapitalize(item.status)}</Text>
              </View>
              </View>
              <Text style={styles.owner}>{`By: ${item.owner_username}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
};
  
function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colors.background2,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 3,
      marginBottom: 5,
      paddingHorizontal: 10,
      alignItems:'center'
    },
    foodImage: {
      width: 80,
      height: 80,
      resizeMode: 'cover',
      borderRadius:5,
    },
    detailsContainer: {
        flex: 1.8,
        paddingVertical: 16,
        paddingLeft: 16,
      },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 4,
      color: colors.highlight1,
    },
    category: {
      fontSize: 16,
      marginBottom: 4,
      color: colors.highlight2,
    },
    description: {
      fontSize: 14,
      marginBottom: 8,
      color: colors.foreground,
    },
    infoContainer: {
        flexDirection: 'column',
        marginBottom: 8,
    },
    infoItem: {
      marginBottom: 3
    },
    infoLabel: {
      fontSize: 12,
      color: colors.foreground,
    },
    infoText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    owner: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.foreground,
    },
  });
}
  
export default SearchedFoodPreview;