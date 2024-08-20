import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import walletApi from "../../../api/wallet/wallet";
import paymentApi from "../../../api/payment/payment";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../context/auth";
import colors from "../../../theme/colors";

const WalletScreen = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const userId = user.id;

  useFocusEffect(
    useCallback(() => {
      const fetchWalletDetails = async () => {
        if (!userId) {
          return;
        }
        try {
          const walletBalanceResponse = await walletApi.getWalletBalance(
            userId
          );

          const walletBalance = walletBalanceResponse.data.balance;
          setBalance(walletBalance);

          const transactionHistoryResponse = await walletApi.transactions(
            userId
          );
          console.log(transactionHistoryResponse);

          //const transactions = transactionHistoryResponse.data.transactions;
          //setTransactions(transactions || []);
        } catch (error) {
          console.error(
            "Error fetching wallet details:",
            error.response ? error.response.data : error.message
          );
        }
      };

      fetchWalletDetails();
    }, [userId])
  );

  const handleTopUp = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setAmountToAdd("");
    setPhoneNumber("");
  };

  const handleModalSubmit = async () => {
    const totalAmount = parseFloat(amountToAdd);

    if (!phoneNumber || !amountToAdd) {
      Alert.alert(
        "Valid phone number and amount are required for Mobile Money payment"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await paymentApi.requestToPay(
        totalAmount.toString(),
        phoneNumber
      );

      if (response.success) {
        Alert.alert("Payment successful.");
        const amount = totalAmount;

        // Call backend to update the wallet balance
        const updateResponse = await walletApi.updateWalletBalance(
          userId,
          amount
        );
        if (updateResponse.status === 200) {
          setBalance((prevBalance) => prevBalance + totalAmount);
          setTransactions((prevTransactions) => [
            ...prevTransactions,
            {
              id: prevTransactions.length + 1,
              type: "topup",
              amount: totalAmount,
              date: new Date().toISOString(),
            },
          ]);
          handleCloseModal();
        } else {
          Alert.alert("Failed to update wallet balance. Please try again.");
        }
      } else {
        Alert.alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting Mobile Money payment:", error);
      Alert.alert(
        "An error occurred during Mobile Money payment. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <LinearGradient
          colors={[colors.primary, colors.gray]}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceText}>Wallet Balance:</Text>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            ${balance}.00
          </Text>
        </LinearGradient>
        <TouchableOpacity
          onPress={handleTopUp}
          style={[
            styles.button,
            styles.buttonOutline,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          disabled={loading}
        >
          {loading && <ActivityIndicator size="small" color="#000" />}
          <MaterialCommunityIcons
            name="wallet-plus"
            size={24}
            color="black"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.buttonText}>Top Up</Text>
        </TouchableOpacity>
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionsTitle}>Transaction History:</Text>
          <ScrollView>
            {transactions.map((transaction, index) => (
              <View key={transaction.id || index} style={styles.transaction}>
                <Text style={styles.transactionType}>
                  {transaction.type === "topup" ? "Top Up" : "Purchase"}
                </Text>
                <Text style={styles.transactionAmount}>
                  ${transaction.amount.toFixed(2)}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString()}{" "}
                  {new Date(transaction.date).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Top Up Wallet</Text>
              <TextInput
                placeholder="Enter amount"
                placeholderTextColor="grey"
                keyboardType="numeric"
                value={amountToAdd}
                onChangeText={(text) => setAmountToAdd(text)}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Enter phone number"
                placeholderTextColor="grey"
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
                style={styles.modalInput}
              />
              <Image
                source={require("../../../assets/momo.jpg")}
                style={styles.modalImage}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleModalSubmit}
                  style={{}}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.gray]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 100,
                      height: 53,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#000" />
                    ) : (
                      <Text>TopUp</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
  },
  centerElement: { justifyContent: "center", alignItems: "center" },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 30,
  },
  balanceCard: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  balanceText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 5,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    height: 53,
    width: 100,
    marginLeft: 10,
  },
  buttonOutline: {
    borderColor: colors.black,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  buttonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    maxHeight: 300,
    marginVertical: 10,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.black,
  },
  transaction: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  transactionType: {
    fontSize: 16,
    color: colors.black,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
  },
  transactionDate: {
    fontSize: 14,
    color: "#555",
  },
  transactionOrganizer: {
    fontSize: 14,
    color: "#555",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.black,
  },
  modalInput: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    padding: 10,
    color: colors.black,
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default WalletScreen;
