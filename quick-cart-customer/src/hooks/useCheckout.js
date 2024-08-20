import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import paymentApi from "../../api/payment/payment";
import ordersApi from "../../api/order/order";
import walletApi from "../../api/wallet/wallet";
import cartApi from "../../api/cart/cart";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { styles } from "../screens/checkout/styles";
import uuid from "react-native-uuid";

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
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [modalSubmitHandler, setModalSubmitHandler] = useState(null);

  const userId = user.id;
  const paymentId = uuid.v4();
  

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
      return false; // Indicate failure
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
      return false; // Indicate failure
    }

    const paymentResult = await presentPaymentSheet();
    if (paymentResult.error) {
      Alert.alert("Payment failed. Please try again.");
      return false; // Indicate failure
    }

    // Payment succeeded
    return true;
  };

  const mobilePayment = async () => {
    return new Promise((resolve) => {
      const handleClose = (success) => {
        setIsModalVisible(false);
        resolve(success);
      };
  
      const handleModalSubmit = async () => {    
  
        const totalAmount = calculateGrandTotal();
        try {
          setLoading(true);
          const response = await paymentApi.requestToPay(totalAmount, phoneNumber);
  
          if (response.error) {
            Alert.alert("Payment failed. Please try again.");
            handleClose(false);
          } else {
            Alert.alert("Payment successful. Thank you for your order!");
            handleClose(true);
          }
        } catch (error) {
          Alert.alert("An error occurred. Please try again.");
          handleClose(false);
        } finally {
          setLoading(false);
        }
      };
  
      setModalSubmitHandler(() => handleModalSubmit);
      setIsModalVisible(true);
    });
  };
  

  const RenderModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}
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
              onPress={async () => {
                if (!phoneNumber.trim()) {
                  Alert.alert("Please enter your phone number.");
                  return;
                }
                await modalSubmitHandler();
              }}
              style={styles.submitButton}
            >
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={[styles.submitButton, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  

  const makePayment = async () => {
    try {
      setLoading(true);
      let isPaymentSuccessful = false;

      if (selectedPaymentMethod === "bankCard") {
        isPaymentSuccessful = await bankPayment();
      } else if (selectedPaymentMethod === "mobileMoney") {
        isPaymentSuccessful = await mobilePayment();
      } else if (selectedPaymentMethod === "wallet") {
        const totalAmount = calculateGrandTotal();
        if (walletBalance >= totalAmount) {
          const response = await walletApi.updateWalletBalance(
            userId,
            -totalAmount
          );
          if (response.ok) {
            setWalletBalance(walletBalance - totalAmount);
            isPaymentSuccessful = true;
          } else {
            throw new Error("Failed to update wallet balance");
          }
        } else {
          alert("Insufficient balance in your wallet");
          return;
        }
      } else if (selectedPaymentMethod === "cashOnDelivery") {
        isPaymentSuccessful = true;
        cashOnDelivery();
      }

      if (isPaymentSuccessful) {
        const orderDetails = {
          products: stepOne.cartItems.map((item) => ({
            product: item.product,
            productId: item.productId,
            quantity: item.quantity,
            deliveryCharge: item.deliveryFee,
            selectedVariations: item.selectedVariations,
            deliveryMethod: item.shipmentOption,
            paymentMethod: selectedPaymentMethod,
            store: item.store,
            totalAmount:
              parseFloat(subtotalPrice().toFixed(2)) +
              parseFloat(item.deliveryFee.toFixed(2)),
            type: "physical",
          })),
          userId: userId,
          status: "Pending",
          paymentId: paymentId,
          deliveryCharge: stepOne.cartItems.reduce(
            (total, item) => total + item.deliveryFee,
            0
          ),
          totalAmount: stepOne.cartItems.reduce(
            (total, item) =>
              total + item.quantity * item.product.price + item.deliveryFee,
            0
          ),
          deliveryMethod: stepOne.cartItems.map((item) => item.shipmentOption),
          paymentMethod: selectedPaymentMethod,
          type: "physical",
        };

        const orderResponse = await createOrder(orderDetails);

        if (orderResponse && orderResponse.status === 201) {
          await clearCartAfterOrder();
          setPaymentSuccess(true);
        } else {
          setPaymentSuccess(false);
        }
        setCurrentStep(4);
      } else {
        setPaymentSuccess(false);
        setCurrentStep(4);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentSuccess(false);
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderDetails) => {
    try {
      const response = await ordersApi.placeOrder(orderDetails);
      if (response.status === 201) {
        return response;
      } else {
        return response;
      }
    } catch (error) {
      console.error("Error creating order", error);
      return { status: 500 };
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
    RenderModal,
    paymentSuccess,
  };
};
