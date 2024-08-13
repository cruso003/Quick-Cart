import React from "react";
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const AddressSelector = ({ loading, selectedAddress, toggleModal }) => {
  return (
    <TouchableOpacity onPress={toggleModal} style={styles.container}>
      <Ionicons name="location-outline" size={24} color="black" />
      {loading ? (
        <Text>Loading Address..</Text>
      ) : (
        <Pressable>
          {selectedAddress ? (
            <Text>Deliver to {selectedAddress.name} - {selectedAddress.street}</Text>
          ) : (
            <Text style={styles.addAddressText}>Add Delivery Address</Text>
          )}
        </Pressable>
      )}
      <MaterialIcons name="keyboard-arrow-down" size={30} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#AFEEEE",
  },
  addAddressText: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default AddressSelector;
