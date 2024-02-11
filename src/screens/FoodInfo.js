import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import EntypoIcon from "react-native-vector-icons/Entypo";

import { getColors, ThemeContext } from '../assets/Theme';
import { formatDateTimeString, formatTimeDifferencePast } from '../utils/Format';
import { stringCapitalize } from '../utils/Utils';
import { getFoodFeedbacks, postFeedback } from '../api/backend/Social';
import { getUserToken } from '../storage/UserToken';
import { getProfile } from '../storage/User';
import { getFood, postFoodShareRequest } from '../api/backend/Food';
import MaterialButtonSuccess from '../components/MaterialButtonSuccess';


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
            setFoodItem(response.data);
          })
          .catch(error => { })
      }
      getMeFoodItem();
    }
  }, []);

  // Get food item's feedbacks
  useEffect(() => {
    if (foodItem) {
      getMeFoodFeedbacks();
    }
  }, [foodItem]);

  const getMeFoodFeedbacks = async () => {
    const token = await getUserToken();
    await getFoodFeedbacks(token.token, { 'food': foodItem.id, 'ordering': '-timestamp' })
      .then(response => {
        setFeedbacks(response.data.results);
      })
      .catch(error => {})
  }

  const handleRequest = async () => {
    if (foodItem.up_for === 'share') {
      const token = (await getUserToken()).token;
      await postFoodShareRequest(token, {food: foodItem.id})
      .then(response => {
        console.log(response.data);
        if (response.status === 201) { // 201 Created
          setFoodItem({
            ...foodItem,
            'has_client_already_made_request': true
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
    else {
      navigation.navigate('FoodSwapSelection', { foodItem: foodItem });
    }
  };

  const handleOwnerClick = () => {
    navigation.navigate('PublicProfile', { userID: foodItem.owner });
  };

  const handleSendFeedback = async () => {
    if (feedback && feedback.length > 0 && foodItem && userID) {
      const token = (await getUserToken()).token;
      const body = {
        'food': foodItem.id,
        'user': userID,
        'message': feedback,
      }
      await postFeedback(token, body)
        .then(response => {
          console.log(response.data);
          setFeedbacks((prevFeedback) => [response.data, ...prevFeedback]);
          setFeedback('');
        })
        .catch(error => { })
    }
  };

  const FeedbackItem = ({ feedbackData }) => (
    <View style={styles.userFeedback}>
      <View style={styles.feedbackTextContainer}>
      <Text style={styles.feedbackUsername}>{feedbackData.user_username}:</Text>
      <Text style={styles.feedback}>{feedbackData.message}</Text>
      </View>
      <Text style={styles.feedbackTimestamp}>
        {formatTimeDifferencePast(feedbackData.timestamp)} ago
      </Text>
    </View>
  );
  const backPressed = () => {
    if (navigation.canGoBack()) {
        navigation.goBack();
    }
}

  // Decides what to render if food item is being shared/swapped or has already been shared/swapped etc
  const RequestButtonOrAlternativeText = () => {
    if (foodItem.owner == userID) {
      return
    }
    else if (foodItem.status == 'up' && foodItem.has_client_already_made_request) {
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
        source={foodItem && foodItem.image ? { uri: foodItem.image } : require("../assets/images/default_food.png")}
        style={styles.foodImage}
      />
      <TouchableOpacity onPress={backPressed}>
                        <EntypoIcon name="chevron-thin-left" style={styles.icon}></EntypoIcon>
                    </TouchableOpacity>
      <View style={styles.containerGradient}>
        <LinearGradient
        colors={[colors.highlight1,colors.highlight2]}
        style={styles.gradient}
        start={{x:0,y:0}}
        end={{x:1,y:1}}
        >
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
        {foodItem &&
          (foodItem.status === 'up' ?
            (<Text style={styles.expireDate}>Expires:{' '}
              {formatDateTimeString(foodItem.expire_time, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
            </Text>)
            :
            (<Text style={styles.expireDate}>{stringCapitalize(foodItem.status)}{': '}
              {foodItem.end_time ? formatDateTimeString(foodItem.end_time, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              }) : 'NaN'}
            </Text>)
          )
        }
        <Text style={styles.owner} onPress={handleOwnerClick}>
          By: {foodItem && foodItem.owner_username}
        </Text>
        {foodItem && foodItem.status == 'up' &&
          <Text style={styles.upFor}>Up for: {foodItem && foodItem.up_for}</Text>
        }
        {/*<Text style={styles.status}>Status: {foodItem && (foodItem.status == 'up' ? 'Available' : stringCapitalize(foodItem.status))}</Text>*/}

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
        <MaterialButtonSuccess
          style={styles.sendFeedbackButton}
          onPress={handleSendFeedback}
        >
          <Text style={styles.sendFeedbackButtonText}>Send Feedback</Text>
        </MaterialButtonSuccess>
        </View>
        </LinearGradient>
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
    icon: {
      color: colors.highlight1,
      fontSize: 25,
      bottom:250,
      left:20,
     },
    foodImage: {
      height: 330,
      width:357,
      resizeMode: 'cover',
      borderRadius: 60,
      borderWidth:2,
      borderColor:colors.foreground,
      overflow:'hidden',
      marginBottom: -60,
      marginTop: 20,
      shadowColor: colors.foreground,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
    },
    detailsContainer: {
      flex: 1,
      borderRadius: 20,
      backgroundColor:'transparent',
      overflow:'hidden',
      elevation: 8,
      shadowColor: colors.foreground,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      marginHorizontal:20,
      marginVertical:10,
      padding: 24,
    },
    containerGradient: {
      flex: 1,
      borderRadius: 20,
      overflow: 'hidden',
      elevation: 8,
      marginHorizontal: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: colors.foreground,
    },
    gradient: {
      flex: 1,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 12,
      color: colors.foreground,
      textTransform:'uppercase',
      textAlign:'center',
    },
    category: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.highlight1,
      marginBottom: 12,
      textTransform:'capitalize',
    },
    description: {
      fontSize: 20,
      marginBottom: 20,
      color: colors.foreground,
      lineHeight:28,
    },
    uploadDate: {
      fontSize: 16,
      color: colors.foreground,
      marginBottom: 16,
    },
    expireDate: {
      fontSize: 16,
      color: colors.error,
      marginBottom: 12,
    },
    owner: {
      fontSize: 18,
      color: colors.foreground,
      marginBottom: 12,
      //textDecorationLine: 'underline',
    },
    upFor: {
      fontSize: 18,
      color: colors.foreground,
      marginBottom: 12,
    },
    status: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.foreground,
      marginTop: 10,
    },
    requestButton: {
      backgroundColor: colors.highlight2,
      paddingVertical:16,
      paddingHorizontal:24,
      borderRadius: 12,
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
      textAlign: 'center'
    },
    feedbackContainer: {
      backgroundColor: 'transparent',
      borderRadius: 20,
      overflow:'hidden',
      elevation: 8,
      shadowColor: colors.foreground,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      marginHorizontal:20,
      marginVertical:10,
      padding: 24,
    },
    feedbackHeader: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.highlight,
      textTransform:'uppercase',
      
    },
    userFeedback: {
      padding: 5,
      color: colors.foreground,
      marginBottom: 5,
    },
    feedbackTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap:'wrap',
    },
    feedbackUsername: {
      fontSize: 16,
      color: colors.foreground,
      marginBottom: 5,
      fontWeight:'bold',
      marginRight:5,
    },
    feedback: {
      fontSize: 14,
      color: colors.foreground,
      marginBottom:5,
      flexWrap:'wrap',
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
      height: 48,
      backgroundColor: colors.background2,
      color: colors.foreground,
      borderColor: colors.foreground,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal:28,
      fontSize:16,
    },
    sendFeedbackButton: {
      backgroundColor: colors.highlight1,
      paddingVertical:14,
      paddingHorizontal:20,
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
