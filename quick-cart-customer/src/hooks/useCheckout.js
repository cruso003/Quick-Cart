import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import paymentApi from "../../api/payment/payment";
import ordersApi from "../../api/order/order";
import walletApi from "../../api/wallet/wallet";
import cartApi from "../../api/cart/cart";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";

export const useCheckout = (navigation, route) => {
  const { user } = useAuth();
  const { subtotalPrice, setCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await walletApi.getWalletBalance(user.id);
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

  const createOrder = async (orderDetails) => {
    try {
      const response = await ordersApi.placeOrder(orderDetails);
      if (response.ok) {
        alert("Order created successfully");
      } else {
        alert("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order", error);
      alert("An error occurred while trying to create your order");
    }
  };

  const makePayment = async () => {
    try {
      setLoading(true);

      switch (selectedPaymentMethod) {
        case "bankCard":
          await bankPayment();
          break;
        case "mobileMoney":
          const phoneNumber = prompt("Please enter your mobile money phone number");
          if (!phoneNumber) {
            alert("Phone number is required for Mobile Money payment");
            break;
          }
          const response = await paymentApi.requestToPay(totalAmount, phoneNumber);
          if (response.error) {
            alert("Payment failed. Please try again.");
          } else {
            alert("Payment successful. Thank you for your order!");
            setCurrentStep(currentStep + 1);
          }
          break;
        case "wallet":
          if (walletBalance >= calculateGrandTotal()) {
            const updatedBalance = walletBalance - calculateGrandTotal();
            const response = await walletApi.updateWalletBalance(
              user.id,
              -calculateGrandTotal()
            );
            if (response.ok) {
              setWalletBalance(updatedBalance);
              setCurrentStep(currentStep + 1);
            } else {
              console.error("Failed to update wallet balance:", response.error);
              alert("Failed to update wallet balance. Please try again later.");
            }
          } else {
            alert("Insufficient balance in your wallet");
          }
          break;
        case "cashOnDelivery":
          cashOnDelivery();
          break;
        default:
          break;
      }

      await clearCartAfterOrder();
      setLoading(false);
    } catch (error) {
      console.error("Error processing payment:", error);
      window.alert("An error occurred while processing the payment. Please try again later.");
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

      const response = await cartApi.removeCartItems(user.id, itemIds);
      if (response && response.status === 200) {
        const updatedCartResponse = await cartApi.getUserCartItems(user.id);
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
    paymentMethods
  };
};
