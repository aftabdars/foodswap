import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { getColors, ThemeContext } from '../assets/Theme';
import { formatDateTimeString, formatTimeDifferencePast } from '../utils/Format';
import { stringCapitalize } from '../utils/Utils';
import { getFoodFeedbacks } from '../api/backend/Social';
import { getUserToken } from '../storage/UserToken';
import { getProfile } from '../storage/User';
import { getFood } from '../api/backend/Food';


const FoodInfo = () => {
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  const navigation = useNavigation();

  const route = useRoute();

  const [userID, setUserID] = useState();
  const [feedback, setFeedback] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [foodItem, setFoodItem] = useState(route.params?.foodItem);

  // Get user's ID
  useEffect(() => {
    const getMeUserID = async () => {
      setUserID((await getProfile()).id);
    }
    getMeUserID();
  }, []);

  // Get foodItem either from route or API call if foodID is passed
  useEffect(() => {
    const foodID = route.params?.foodID;
    if (foodID) {
      const getMeFoodItem = async () => {
        const token = await getUserToken();
        await getFood(foodID, token.token)
          .then(response => {
            console.log(response.data);
            setFoodItem(response.data);
          })
          .catch(error => {
            console.log(error.response.data);
          })
      }
      getMeFoodItem();
    }
  }, []);

  // Get food item's feedbacks
  useEffect(() => {
    const getMeFoodFeedbacks = async () => {
      if (foodItem) {
        const token = await getUserToken();
        getFoodFeedbacks(token.token, { 'food': foodItem.id })
          .then(response => {
            console.log(response.data);
            setFeedbacks(response.data.results);
          })
          .catch(error => {
            console.log(error.response.data);
          })
      }
      getMeFoodFeedbacks();
    }
  }, [foodItem]);

  const handleRequest = () => {
    console.log('Sending swap request...');
    navigation.navigate('FoodSwapSelection', { foodItem: foodItem });
  };

  const handleOwnerClick = () => {
    console.log(`Clicked on owner: ${foodItem.owner_username}`);
  };

  const handleSendFeedback = () => {
    // replace actual timestamp logic here 
    const timestamp = new Date();
    // Create a new feedback object with timestamp
    const newFeedback = {
      "message": feedback,
      "timestamp": timestamp,
      "food": 1,
      "user": 1,
      "user_username": "admin"
    };

    // Adding newlyyy feedbacks to the userFeedback like an arry
    setFeedbacks((prevFeedback) => [newFeedback, ...prevFeedback]);

    // Cleared the feedback inputs here 
    setFeedback('');
  };

  const FeedbackItem = ({ feedbackData }) => (
    <View style={styles.userFeedback}>
      <Text style={styles.feedbackUsername}>{feedbackData.user_username}</Text>
      <Text style={styles.feedback}>{feedbackData.message}</Text>
      <Text style={styles.feedbackTimestamp}>
        {formatTimeDifferencePast(feedbackData.timestamp)} ago
      </Text>
    </View>
  );

  // Decides what to render if food item is being shared/swapped or has already been shared/swapped etc
  const RequestButtonOrAlternativeText = () => {
    if (foodItem.owner == userID) {
      return
    }
    else if (foodItem.has_client_already_made_request) {
      return (
        <Text style={styles.requestButtonAlternativeText}>
          You have already sent request, waiting for response...
        </Text>
      )
    }
    else if (foodItem.status == 'up') {
      return (
        <TouchableOpacity style={styles.requestButton} onPress={handleRequest}>
          <Text style={styles.requestButtonText}>Send Request</Text>
        </TouchableOpacity>
      )
    }
    else if (foodItem.is_being_shared) {
      return (
        <Text style={styles.requestButtonAlternativeText}>
          This food is currently being shared
        </Text>
      )
    }
    else if (foodItem.is_being_swapped) {
      return (
        <Text style={styles.requestButtonAlternativeText}>
          This food is currently being swapped
        </Text>
      )
    }
    return (
      <Text style={styles.requestButtonAlternativeText}>
        This food has been {stringCapitalize(foodItem.status)}
      </Text>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={foodItem && foodItem.image ? { uri: foodItem.image } : require("../assets/images/image_2023-10-27_183534741.png")}
        style={styles.foodImage}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{foodItem && foodItem.name}</Text>
        <Text style={styles.description}>{foodItem && foodItem.description}</Text>
        <Text style={styles.category}>{foodItem && foodItem.category_name}</Text>
        <Text style={styles.uploadDate}>Uploaded:{' '}
          {foodItem && formatDateTimeString(foodItem.date_added, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          })}
        </Text>
        <Text style={styles.expireDate}>Expires:{' '}
          {foodItem && formatDateTimeString(foodItem.expire_time, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          })}
        </Text>
        <Text style={styles.owner} onPress={handleOwnerClick}>
          Owner: {foodItem && foodItem.owner_username}
        </Text>
        <Text style={styles.upFor}>Up for: {foodItem && foodItem.up_for}</Text>
        <Text style={styles.status}>Status: {foodItem && (foodItem.status == 'up' ? 'Available' : stringCapitalize(foodItem.status))}</Text>

        {foodItem && userID &&
          <RequestButtonOrAlternativeText />
        }
      </View>

      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackHeader}>Feedbacks:</Text>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedbackItem, index) => (
            <FeedbackItem
              key={index}
              feedbackData={feedbackItem}
            />
          ))
        ) : (
          <Text style={styles.noFeedback}>No feedbacks</Text>
        )}

        <TextInput
          style={styles.feedbackInput}
          placeholder="Type your feedback here"
          value={feedback}
          onChangeText={(text) => setFeedback(text)}
        />
        <TouchableOpacity
          style={styles.sendFeedbackButton}
          onPress={handleSendFeedback}
        >
          <Text style={styles.sendFeedbackButtonText}>Send Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    foodImage: {
      height: 330,
      resizeMode: 'cover',
      borderRadius: 20,
      marginBottom: -40,
      marginTop: 23,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    detailsContainer: {
      flex: 1,
      borderRadius: 20,
      backgroundColor: colors.background2,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      margin: 16,
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 12,
      color: colors.foreground
    },
    category: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.highlight2,
      marginBottom: 6,
    },
    description: {
      fontSize: 18,
      marginBottom: 12,
      color: colors.foreground
    },
    uploadDate: {
      fontSize: 16,
      color: colors.foreground,
      marginBottom: 6,
    },
    expireDate: {
      fontSize: 16,
      color: colors.error,
      marginBottom: 6,
    },
    owner: {
      fontSize: 18,
      color: colors.foreground,
      marginBottom: 6,
      textDecorationLine: 'underline',
    },
    upFor: {
      fontSize: 18,
      color: colors.foreground,
      marginBottom: 6,
    },
    status: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.foreground,
      marginTop: 10,
    },
    requestButton: {
      backgroundColor: colors.highlight2,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 15,
    },
    requestButtonText: {
      color: colors.foreground,
      fontSize: 18,
      fontWeight: 'bold',
    },
    requestButtonAlternativeText: {
      fontSize: 16,
      color: colors.error,
      marginVertical: 6,
      alignSelf: 'center',
    },
    feedbackContainer: {
      marginTop: 10,
      padding: 20,
      backgroundColor: colors.background2,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    feedbackHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.foreground,
    },
    userFeedback: {
      padding: 10,
      borderWidth: 1,
      color: colors.foreground,
      borderColor: colors.foreground,
      borderRadius: 8,
      marginBottom: 10,
    },
    feedbackUsername: {
      fontSize: 16,
      color: colors.foreground,
      marginBottom: 5,
      color: colors.highlight2
    },
    feedback: {
      fontSize: 14,
      color: colors.foreground,
      marginBottom: 10,
    },
    feedbackTimestamp: {
      fontSize: 12,
      color: colors.foreground,
    },
    noFeedback: {
      fontSize: 16,
      color: colors.foreground,
      marginBottom: 10,
    },
    feedbackInput: {
      height: 40,
      backgroundColor: colors.background2,
      color: colors.foreground,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 10,
      padding: 10,
    },
    sendFeedbackButton: {
      backgroundColor: colors.highlight2,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    sendFeedbackButtonText: {
      color: colors.foreground,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
}

export default FoodInfo;
