import React from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "./styles";
import { useCheckout } from "../../hooks/useCheckout";
import Header from "../../components/checkout/Header";
import ProgressBar from "../../components/checkout/ProgressBar";
import StepNavigation from "../../components/checkout/StepNavigation";
import OrderSummary from "../../components/checkout/OrderSummary";
import PaymentMethodSelector from "../../components/checkout/PaymentMethodSelector";
import CartItem from "../../components/checkout/CartItem";
import AddressForm from "../../components/checkout/AddressForm";
import OrderStatus from "../../components/checkout/OrderStatus";

function Checkout({ route, navigation }) {
  const {
    currentStep,
    setCurrentStep,
    stepTwo,
    setStepTwo,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    validateRequiredFields,
    makePayment,
    RenderModal,
    calculateGrandTotal,
    paymentMethods,
    stepOne,
    steps,
    subtotalPrice,
    loading,
    paymentSuccess,
  } = useCheckout(navigation, route);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={70}
      style={styles.keyBoardView}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <View style={styles.container}>
        <Header title="Checkout" onBackPress={() => navigation.goBack()} />
        <ProgressBar steps={steps} currentStep={currentStep} />
        <ScrollView keyboardShouldPersistTaps={"handled"}>
          {currentStep == 0 &&
            (stepOne.cartItemsIsLoading ? (
              <View style={[styles.centerElement, { height: 300 }]}>
                <ActivityIndicator size="large" color="#ef5739" />
              </View>
            ) : (
              stepOne.cartItems.map((item, i) => (
                <CartItem key={i} item={item} />
              ))
            ))}

          {currentStep == 1 && (
            <AddressForm stepTwo={stepTwo} setStepTwo={setStepTwo} />
          )}

          {currentStep == 2 && (
            <PaymentMethodSelector
              paymentMethods={paymentMethods}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
          )}

          {currentStep == 3 && (
            <OrderSummary
              stepOne={stepOne}
              stepTwo={stepTwo}
              selectedPaymentMethod={selectedPaymentMethod}
              subtotalPrice={subtotalPrice}
              calculateGrandTotal={calculateGrandTotal}
            />
          )}

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>Processing your order...</Text>
            </View>
          )}

          {currentStep === 4 && !loading && (
            <OrderStatus
              status={paymentSuccess ? "success" : "failure"}
              message={paymentSuccess ? "Order Successful!" : "Order Failed!"}
              onButtonPress={() => {
                if (paymentSuccess) {
                  setCurrentStep(0);
                  navigation.navigate("Home");
                } else {
                  setCurrentStep(3);
                }
              }}
            />
          )}

          <StepNavigation
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            steps={steps}
            validateRequiredFields={validateRequiredFields}
            makePayment={makePayment}
            selectedPaymentMethod={selectedPaymentMethod}
          />
        </ScrollView>
        {RenderModal()}
      </View>
    </KeyboardAvoidingView>
  );
}
export default Checkout;
