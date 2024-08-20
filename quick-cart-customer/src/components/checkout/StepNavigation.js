import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../../screens/checkout/styles';

const StepNavigation = ({ currentStep, setCurrentStep, steps, validateRequiredFields, makePayment, selectedPaymentMethod }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
      {currentStep > 0 && currentStep !== 4 && (
        <TouchableOpacity
          style={[styles.centerElement, styles.nextButton]}
          onPress={() => setCurrentStep(currentStep - 1)}
        >
          <Text style={{ color: "#fff" }}>Back</Text>
        </TouchableOpacity>
      )}
      {currentStep + 1 < steps.length && (
        <TouchableOpacity
          style={[styles.centerElement, styles.prevButton]}
          onPress={() => {
            if (currentStep === 2 && !selectedPaymentMethod) {
              alert("Please select a payment method to proceed.");
            } else if (validateRequiredFields()) {
              setCurrentStep(currentStep + 1);
            } else {
              alert("Please fill in all required fields");
            }
          }}
        >
          <Text style={{ color: "#fff" }}>Next</Text>
        </TouchableOpacity>
      )}
      {currentStep + 1 === steps.length && (
        <TouchableOpacity style={[styles.centerElement, styles.payButton]} onPress={makePayment}>
          <Text style={{ color: "#fff" }}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  

export default StepNavigation