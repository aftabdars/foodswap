import React, { useContext } from "react";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput } from 'react-native';
import MaterialButtonSuccess from "../components/MaterialButtonSuccess";
import { ThemeContext, getColors } from "../assets/Theme";
import { postClientFoodiezTransferTransactions } from "../api/backend/Gamification";
import { getUserToken } from "../storage/UserToken";
import { getUsers } from "../api/backend/User";
import { useNavigation } from "@react-navigation/native";


const TransferFoodiez = () => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showError, setShowError] = useState("");

  const navigation = useNavigation();

  const handleTransfer = async () => {
    if (!recipient) {
      setShowError("Please enter the recipient's name");
    }
    else if (!amount) {
      setShowError("Please enter the amount");
    }
    else if (amount && amount <= 0) {
      setShowError("Amount must be greater than 0");
    }
    else {
      const token = (await getUserToken()).token;
      // Get recipient user id
      let recipientID = undefined;
      try {
        const recipientData = (await getUsers({ 'username': recipient })).data
        console.log(recipientData);
        if (recipientData && recipientData.count == 1) {
          recipientID = recipientData.results[0].id;
        }
        else {
          setShowError("Cannot find user with that username");
          return;
        }
      }
      catch (error) {
        console.log(error);
      }
      // Transfer the foodiez if recipient's id is fetched
      console.log(`Transferring ${amount} coins to ${recipient}`);
      if (recipientID) {
        const body = {
          'user': recipientID,
          'amount': amount
        }
        postClientFoodiezTransferTransactions(token, body)
          .then(response => {
            setShowError("");
            console.log(response.status, response.data);

            navigation.navigate('TransferFoodiezSuccess', {amount: parseFloat(amount)});
          })
          .catch(error => {
            errorMessages = error.response.data;
            console.log(errorMessages);

            setShowError(errorMessages[Object.keys(errorMessages)[0]][0]);
          })
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Foodiez</Text>

      <TextInput
        style={styles.input}
        placeholder="Recipient's Username"
        value={recipient}
        onChangeText={(text) => setRecipient(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount (e.g 10.00)"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />

      {showError && (
        <Text style={styles.errormsg}>
          {showError}
        </Text>
      )}

      <MaterialButtonSuccess
        title="Transfer"
        onPress={handleTransfer}
        style={styles.transferButton}
      >
        Send
      </MaterialButtonSuccess>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: "center",
      backgroundColor: colors.background
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: colors.foreground
    },
    input: {
      height: 40,
      borderColor: colors.highlight2,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 20,
      paddingLeft: 10,
      color: colors.foreground
    },
    transferButton: {
      padding: 10,
      borderRadius: 8,
      marginTop: 10
    },
    errormsg: {
      fontFamily: "roboto-regular",
      color: colors.error,
      textAlign: "center",
      marginBottom: 10
    },
  });
}

export default TransferFoodiez;