import { useState, useEffect } from "react";
import { ActivityIndicator, Alert, Image, Text, Modal, TextInput, TouchableOpacity, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import paymentApi from "../../api/payment/payment";
import ordersApi from "../../api/order/order";
import walletApi from "../../api/wallet/wallet";
import cartApi from "../../api/cart/cart";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { styles } from "../screens/checkout/styles";

export const useCheckout = (navigation, route) => {
  const { user } = useAuth();
  const { subtotalPrice, setCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const userId = user.id;

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await walletApi.getWalletBalance(userId);
      if (response.ok) {
        setWalletBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const calculateGrandTotal = () => {
    let grandTotal = 0;
    stepOne.cartItems.forEach((item) => {
      const subtotal = item.discountPrice
        ? item.discountPrice + item.deliveryFee
        : item.amount;
      grandTotal += subtotal;
    });
    return grandTotal;
  };

  const validateRequiredFields = () => {
    if (currentStep === 1) {
      const { fullName, streetAddress, phone } = stepTwo;
      const allRequiredFieldsFilled =
        fullName.trim() !== "" &&
        streetAddress.trim() !== "" &&
        phone.trim() !== "";
      setRequiredFieldsFilled(allRequiredFieldsFilled);
      return allRequiredFieldsFilled;
    }
    return true;
  };

  const bankPayment = async () => {
    const totalAmount = Math.floor(
      (subtotalPrice() +
        stepOne.cartItems.reduce(
          (total, item) =>
            item.deliveryFee ? total + item.deliveryFee : total,
          0
        )) *
        100
    );

    const response = await paymentApi.createPaymentIntent(totalAmount);
    if (response.error) {
      Alert.alert("Something went wrong");
      return;
    }

    const initResponse = await initPaymentSheet({
      merchantDisplayName: "Swift Cart",
      paymentIntentClientSecret: response.data.paymentIntent,
      defaultBillingDetails: {
        name: `${stepTwo.fullName}`,
        address: `${stepTwo.streetAddress}`,
        phone: `${stepTwo.phone}`,
        email: `${stepTwo.emailAddress}`,
      },
    });

    if (initResponse.error) {
      Alert.alert("Something went wrong");
      return;
    }

    const paymentResult = await presentPaymentSheet();
    if (paymentResult.error) {
      Alert.alert("Payment failed. Please try again.");
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleModalSubmit = async (onSuccess) => {
    const totalAmount = calculateGrandTotal();
    const response = await paymentApi.requestToPay(totalAmount, phoneNumber);
    console.log(response);
  
    if (response.error) {
      alert("Payment failed. Please try again.");
      setIsModalVisible(false);
    } else {
      alert("Payment successful. Thank you for your order!");
      setIsModalVisible(false);
      // Call clearCartAfterOrder here after payment success
      await clearCartAfterOrder();
      onSuccess();
    }
  };
  
  

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const makePayment = async () => {
    try {
      setLoading(true);
      let paymentSuccess = false;
  
      if (selectedPaymentMethod === "bankCard") {
        paymentSuccess = await bankPayment();
      } else if (selectedPaymentMethod === "mobileMoney") {
        // Set the modal visible and wait for the result
        setIsModalVisible(true);
        await new Promise((resolve) => {
          handleModalSubmit(resolve);
        });
        paymentSuccess = true;
      } else if (selectedPaymentMethod === "wallet") {
        const totalAmount = calculateGrandTotal();
        if (walletBalance >= totalAmount) {
          const updatedBalance = walletBalance - totalAmount;
          const response = await walletApi.updateWalletBalance(user.id, -totalAmount);
          if (response.ok) {
            setWalletBalance(updatedBalance);
            paymentSuccess = true;
          } else {
            throw new Error("Failed to update wallet balance");
          }
        } else {
          alert("Insufficient balance in your wallet");
          return;
        }
      } else if (selectedPaymentMethod === "cashOnDelivery") {
        paymentSuccess = true;
        cashOnDelivery();
      }
  
      // Call clearCartAfterOrder only if payment was successful
      if (paymentSuccess) {
        await clearCartAfterOrder();
        setCurrentStep(currentStep + 1);
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("An error occurred while processing the payment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const createOrder = async (orderDetails) => {
    try {
      const response = await ordersApi.placeOrder(orderDetails);
      
      if (response.status === 201) {
        alert("Order created successfully");
      } else {
        alert("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order", error);
      alert("An error occurred while trying to create your order");
    }
  };

  const clearCartAfterOrder = async () => {
    try {
      if (!Array.isArray(stepOne.cartItems)) {
        console.error("cartItems is not an array");
        return;
      }

      const itemIds = stepOne.cartItems.map((item) => item.id);
      if (!itemIds || itemIds.length === 0) {
        console.error("No item IDs to remove");
        return;
      }

      const response = await cartApi.removeCartItems(userId, itemIds);
      if (response && response.status === 200) {
        const updatedCartResponse = await cartApi.getUserCartItems(userId);
        if (Array.isArray(updatedCartResponse.data)) {
          setCart(updatedCartResponse.data);
          if (updatedCartResponse.data.length === 0) {
            setCart([]);
          }
        } else {
          console.error("Failed to fetch updated cart data.");
        }
      } else {
        console.error("Failed to remove cart items.");
      }
    } catch (error) {
      console.error("Error clearing cart after order:", error);
    }
  };

  const cashOnDelivery = () => {
    setCurrentStep(currentStep + 1);
  };

  const [steps] = useState(["Review", "Shipping", "Payment", "Submit"]);
  const [stepOne] = useState({
    cartItemsIsLoading: false,
    cartItems: route.params.cartItems,
  });

  // Check if there are any cart items
  const hasCartItems = stepOne.cartItems && stepOne.cartItems.length > 0;

  // Define an initial selectedAddress from the first cart item if there are any items
  const initialSelectedAddress = hasCartItems
    ? stepOne.cartItems[0].selectedAddress
    : null;

  // Initialize stepTwo based on the selectedAddress of the first cart item
  const [stepTwo, setStepTwo] = useState({
    fullName: initialSelectedAddress ? initialSelectedAddress.name : user.name,
    streetAddress: initialSelectedAddress ? initialSelectedAddress.street : "",
    aptSuite: initialSelectedAddress ? initialSelectedAddress.landmark : "",
    city: initialSelectedAddress ? initialSelectedAddress.city : "",
    state: initialSelectedAddress ? initialSelectedAddress.state : "",
    phone: initialSelectedAddress ? initialSelectedAddress.mobileNo : "",
    emailAddress: user.email ? user.email : "",
  });

  const paymentMethods = [
    {
      id: "cashOnDelivery",
      name: "Pay on Delivery",
      icon: require("../../assets/cash-on-delivery.jpg"),
    },
    {
      id: "bankCard",
      name: "Bank Card",
      icon: require("../../assets/cards.jpg"),
    },
    {
      id: "wallet",
      name: `Swift Pay - Wallet balance: $${walletBalance.toFixed(2)}`,
      icon: require("../../assets/wallet.jpg"),
    },
    {
      id: "mobileMoney",
      name: "Mobile Money",
      icon: require("../../assets/momo.jpg"),
    },
  ];

  // Render modal component within a React component
  const RenderModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Pay with Mobile Money</Text>
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
            source={require("../../assets/momo.jpg")}
            style={styles.modalImage}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleModalSubmit}
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.buttonText}>Pay</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={[styles.submitButton, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return {
    currentStep,
    setCurrentStep,
    stepTwo,
    setStepTwo,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    fetchWalletBalance,
    validateRequiredFields,
    makePayment,
    createOrder,
    cashOnDelivery,
    clearCartAfterOrder,
    loading,
    requiredFieldsFilled,
    paymentMethods,
    stepOne,
    steps,
    subtotalPrice,
    calculateGrandTotal,
    userId,
    RenderModal
  };
};
