import { View, Text, TextInput } from "react-native";
import React from "react";
import { styles } from "../../screens/checkout/styles";

const AddressForm = ({ stepTwo, setStepTwo }) => (
  <View style={{ padding: 20, marginBottom: 20, backgroundColor: "#fff" }}>
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
        maxLength={10}
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
);

export default AddressForm;
