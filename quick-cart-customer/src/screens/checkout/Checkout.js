import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import uuid from "react-native-uuid";
import walletApi from "../../../api/wallet/wallet";
import { styles } from "./styles";
import { useCheckout } from "../../hooks/useCheckout";

function Checkout({ route, navigation }) {
  const { 
    currentStep, setCurrentStep, stepTwo, setStepTwo, selectedPaymentMethod, 
    setSelectedPaymentMethod, validateRequiredFields, makePayment, loading, requiredFieldsFilled, paymentMethods 
  } = useCheckout(navigation, route);

  const transactionId = uuid.v4();
  const [steps] = useState(["Review", "Shipping", "Payment", "Submit"]);
  const [stepOne] = useState({
    cartItemsIsLoading: false,
    cartItems: route.params.cartItems,
  });


  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={70}
      style={styles.keyBoardView}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.centerElement, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={25} color="#000" />
          </TouchableOpacity>
          <View style={[styles.centerElement, styles.headerTitle]}>
            <Text style={styles.headerTitleText}>Checkout</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={styles.progressBarInner}>
            <View style={{ alignItems: "center" }}>
              <View style={styles.progressLine} />
            </View>
            <View style={styles.stepContainer}>
              {steps.map((label, i) => (
                <View key={i} style={styles.stepItem}>
                  {i > currentStep && i != currentStep /* Not selected */ && (
                    <View style={styles.stepCircle}>
                      <Text style={styles.stepText}>{i + 1}</Text>
                    </View>
                  )}
                  {i < currentStep /* Checked */ && (
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#fff"
                      />
                    </View>
                  )}
                  {i == currentStep /* Selected */ && (
                    <View style={styles.selected}>
                      <Text style={{ fontSize: 13, color: "#ffffff" }}>
                        {i + 1}
                      </Text>
                    </View>
                  )}
                  <Text style={{ fontSize: 12 }}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <ScrollView keyboardShouldPersistTaps={"handled"}>
          {/* Step 1 */}
          {currentStep == 0 && (
            <View>
              {stepOne.cartItemsIsLoading ? (
                <View style={[styles.centerElement, { height: 300 }]}>
                  <ActivityIndicator size="large" color="#ef5739" />
                </View>
              ) : (
                <View>
                  {stepOne.cartItems &&
                    stepOne.cartItems.map((item, i) => (
                      <View key={i} style={styles.map}>
                        <View style={styles.mapInner}>
                          <TouchableOpacity
                            onPress={() => {
                              /*this.props.navigation.navigate('ProductDetails', {productDetails: item})*/
                            }}
                            style={{ paddingRight: 10 }}
                          >
                            <Image
                              source={{ uri: item.product.images[0] }}
                              style={[
                                styles.centerElement,
                                styles.productImage,
                              ]}
                            />
                          </TouchableOpacity>
                          <View style={styles.productName}>
                            <Text numberOfLines={1} style={{ fontSize: 15 }}>
                              {item.product.name}
                            </Text>
                            {item && item.selectedVariations && (
                              <Text
                                style={{ color: "#8f8f8f", marginBottom: 10 }}
                              >
                                Variation:{" "}
                                {Object.entries(item.selectedVariations)
                                  .map(
                                    ([variation, value]) =>
                                      `${variation}: ${value}`
                                  )
                                  .join(", ")}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View style={[styles.centerElement, { width: 60 }]}>
                          <Text style={{ color: "#333333" }}>
                            Qty. {item.quantity}
                          </Text>
                        </View>
                        <View style={[styles.centerElement, { width: 60 }]}>
                          <Text style={{ color: "#333333" }}>
                            $
                            {item.discountPrice
                              ? item.quantity * item.discountPrice
                              : item.quantity * item.amount}
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              )}

              <View style={styles.subTotalContainer}>
                <Text>Sub Total</Text>
                <Text style={{ fontWeight: "bold" }}>
                  ${subtotalPrice().toFixed(2)}
                </Text>
              </View>
            </View>
          )}
          {/* Step 2 */}
          {currentStep == 1 && (
            <View
              style={{ padding: 20, marginBottom: 20, backgroundColor: "#fff" }}
            >
              <View style={{ marginBottom: 25 }}>
                <Text style={styles.inputLabel}>
                  Full Name<Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(fullName) => {
                    setStepTwo((prevStepTwo) => ({ ...prevStepTwo, fullName }));
                  }}
                  value={stepTwo.fullName}
                />
              </View>
              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <View style={{ width: "60%" }}>
                  <Text style={styles.inputLabel}>
                    Street Address<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(streetAddress) => {
                      setStepTwo((prevStepTwo) => ({
                        ...prevStepTwo,
                        streetAddress,
                      }));
                    }}
                    value={stepTwo.streetAddress}
                  />
                </View>
                <View style={{ width: "40%", paddingLeft: 8 }}>
                  <Text style={styles.inputLabel}>Apt / Suite #</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(aptSuite) =>
                      setStepTwo((prevStepTwo) => ({
                        ...prevStepTwo,
                        aptSuite,
                      }))
                    }
                    value={stepTwo.aptSuite}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", marginBottom: 25 }}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(city) =>
                      setStepTwo((prevStepTwo) => ({ ...prevStepTwo, city }))
                    }
                    value={stepTwo.city}
                  />
                </View>
                <View style={{ width: "50%", paddingLeft: 8 }}>
                  <Text style={styles.inputLabel}>State</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(state) =>
                      setStepTwo((prevStepTwo) => ({ ...prevStepTwo, state }))
                    }
                    value={stepTwo.state}
                  />
                </View>
              </View>

              <View style={{ marginBottom: 25 }}>
                <Text style={styles.inputLabel}>
                  Phone<Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(phone) => {
                    setStepTwo((prevStepTwo) => ({ ...prevStepTwo, phone }));
                  }}
                  value={stepTwo.phone}
                  keyboardType="phone-pad"
                  placeholder="0881223344"
                  placeholderTextColor="#D3D3D3"
                />
              </View>
              <View>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(emailAddress) =>
                    setStepTwo((prevStepTwo) => ({
                      ...prevStepTwo,
                      emailAddress,
                    }))
                  }
                  value={stepTwo.emailAddress}
                  keyboardType="email-address"
                  placeholder="johnbrown@gmail.com"
                  placeholderTextColor="#D3D3D3"
                />
              </View>
            </View>
          )}
          {/* Step 3 */}
          {currentStep === 2 && (
            <View
              style={{ padding: 20, marginBottom: 20, backgroundColor: "#fff" }}
            >
              {/* Render payment method radio buttons */}
              {paymentMethods
                .filter((method) => {
                  // If item.amount exists, show only bank card and mobile money options
                  if (stepOne.cartItems.some((item) => item.amount)) {
                    return (
                      method.id === "bankCard" || method.id === "mobileMoney"
                    );
                  }
                  // Otherwise, show all payment methods
                  return true;
                })
                .map((method) => (
                  <View key={method.id} style={styles.paymentMethodContainer}>
                    <RadioButton
                      value={method.id}
                      status={
                        selectedPaymentMethod === method.id
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => setSelectedPaymentMethod(method.id)}
                    />
                    <TouchableOpacity
                      onPress={() => setSelectedPaymentMethod(method.id)}
                    >
                      <Text>{method.name}</Text>
                      <Image
                        source={method.icon}
                        style={styles.paymentMethodImage}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          )}
          {/* Step 4 */}
          {currentStep == 3 &&
            stepOne.cartItems &&
            stepOne.cartItems.map((item, i) => (
              <View key={i} style={{ padding: 15 }}>
                <Text style={{ fontSize: 17, marginBottom: 10 }}>
                  Shipping Address
                </Text>

                {/* Check if selectedPickupStation is available */}
                {item.selectedPickupStation ? (
                  // If selectedPickupStation is available, use its information
                  <>
                    <Text style={{ color: "#858585", marginBottom: 20 }}>
                      {item.selectedPickupStation.name}
                    </Text>
                    <Text style={{ color: "#858585" }}>
                      {item.selectedPickupStation.address.street}
                    </Text>
                    <Text style={{ color: "#858585" }}>
                      {item.selectedPickupStation.address.city}{" "}
                      {item.selectedPickupStation.address.state}
                    </Text>
                  </>
                ) : (
                  // If selectedPickupStation is not available, fall back to stepTwo
                  <>
                    <Text style={{ color: "#858585", marginBottom: 20 }}>
                      {stepTwo.fullName}
                    </Text>
                    <Text style={{ color: "#858585" }}>
                      {stepTwo.streetAddress}
                    </Text>
                    <Text style={{ color: "#858585" }}>
                      {stepTwo.city} {stepTwo.state}
                    </Text>
                  </>
                )}

                {/* Displaying other item information */}
                <View style={styles.productInfo}>
                  <Text style={{ color: "#858585" }}>Product</Text>
                  <Text style={{ fontWeight: "200" }}>
                    {item.product.name.substr(0, 12) + "..."}
                  </Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={{ color: "#858585" }}>Price</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    $
                    {item.amount
                      ? item.amount.toFixed(2)
                      : item.discountPrice.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.productInfo}>
                  <Text style={{ color: "#858585" }}>
                    {item.shipmentOption}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    ${item.deliveryFee ? item.deliveryFee.toFixed(2) : 0}
                  </Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={{ color: "#858585" }}>Sub Total</Text>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    $
                    {(
                      (item.amount ? item.amount : item.discountPrice) +
                      item.deliveryFee
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

          {/* Grand Total section */}
          {currentStep === 3 && (
            <View style={{ padding: 15 }}>
              <View style={styles.productInfo}>
                <Text style={{ color: "#858585" }}>Grand Total</Text>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  ${calculateGrandTotal().toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/*Step 5 (Thank you page)*/}
          {currentStep == 4 && (
            <View style={{ padding: 15, alignItems: "center", marginTop: 50 }}>
              <Text style={{ fontSize: 20 }}>Payment Complete</Text>
              <AntDesign
                name="checkcircleo"
                size={60}
                color="#26d06e"
                style={{ marginVertical: 25 }}
              />
              <TouchableOpacity
                style={[
                  styles.centerElement,
                  {
                    width: 165,
                    height: 35,
                    backgroundColor: "#6689ff",
                    elevation: 5,
                    borderRadius: 20,
                  },
                ]}
                onPress={async () => {
                  try {
                    // Check if it's a virtual order
                    if (stepOne.cartItems.some((item) => item.amount)) {
                      const topUpAmount = stepOne.cartItems.reduce(
                        (total, item) => total + item.amount,
                        0
                      );
                      // Call updateWalletBalance for virtual order
                      const walletApiResponse =
                        await walletApi.updateWalletBalance(
                          user.id,
                          topUpAmount
                        );
                      // Check if the wallet API call was successful
                      if (walletApiResponse && walletApiResponse.ok) {
                        console.log("Wallet balance updated successfully");
                      } else {
                        throw new Error("Failed to update wallet balance");
                      }
                    } else {
                      // It's a physical order, create the order
                      const orderDetails = {
                        products: stepOne.cartItems.map((item) => ({
                          product: item.product,
                          store: item.product.store,
                          quantity: item.quantity,
                          deliveryCharge: item.deliveryFee,
                          selectedVariations: item.selectedVariations,
                          deliveryMethod: item.shipmentOption,
                          paymentMethod: selectedPaymentMethod,
                          totalAmount:
                            parseFloat(subtotalPrice().toFixed(2)) +
                            parseFloat(item.deliveryFee.toFixed(2)),
                          type: "physical",
                        })),
                        user: user.id,
                        status: "Pending",
                        payment: {
                          transactionId: transactionId,
                          type: "Physical",
                        },
                      };

                      await createOrder(orderDetails);                     
                    }

                    // After updating the wallet balance and creating the order, navigate to the home screen
                    setCurrentStep({ currentStep: 0 });
                    navigation.navigate("Home");
                  } catch (error) {
                    console.error("Error processing payment:", error);
                    // Show an alert box to notify the user about the error
                    window.alert(
                      "An error occurred while processing the payment. Please try again later."
                    );
                  }
                }}
              >
                <Text style={{ color: "#fff" }}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Next, Prev, Finish buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            {currentStep > 0 && currentStep < 4 && (
              <TouchableOpacity
                style={[styles.centerElement, styles.NextButton]}
                onPress={() => {
                  if (currentStep > 0) {
                    setCurrentStep(currentStep - 1);
                  }
                }}
              >
                <Text style={{ color: "#fff" }}>Back</Text>
              </TouchableOpacity>
            )}
            {currentStep + 1 < steps.length /* add other conditions here */ && (
              <TouchableOpacity
                style={[styles.centerElement, styles.prevButton]}
                onPress={() => {
                  // Check if a payment method is selected
                  if (currentStep === 2 && !selectedPaymentMethod) {
                    alert("Please select a payment method to proceed.");
                  } else if (
                    currentStep + 1 < steps.length &&
                    validateRequiredFields()
                  ) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    alert("Please fill in all required fields");
                  }
                }}
              >
                <Text style={{ color: "#fff" }}>Next</Text>
              </TouchableOpacity>
            )}

            {/* Call API to process payment */}
            {currentStep + 1 === steps.length && (
              <TouchableOpacity
                style={[styles.centerElement, styles.NextButton]}
                onPress={() => {
                  makePayment();
                }}
              >
                <Text style={{ color: "#fff" }}>Pay Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
export default Checkout;