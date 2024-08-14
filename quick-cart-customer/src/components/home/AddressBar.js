import React from "react";
import { Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const AddressBar = ({
  user,
  toggleModal,
  selectedAddress,
  loading,
}) => {
  return (
    user && (
      <TouchableOpacity
        onPress={toggleModal}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          padding: 10,
          backgroundColor: "#AFEEEE",
        }}
      >
        <Ionicons name="location-outline" size={24} color="black" />
        {loading ? (
          <Text>Loading Address..</Text>
        ) : (
          <Pressable>
            {selectedAddress ? (
              <Text>
                Deliver to {selectedAddress?.name} - {selectedAddress?.street}
              </Text>
            ) : (
              <Text style={{ fontSize: 13, fontWeight: "500" }}>
                Add Delivery Address
              </Text>
            )}
          </Pressable>
        )}
        <MaterialIcons name="keyboard-arrow-down" size={30} color="black" />
      </TouchableOpacity>
    )
  );
};

export default AddressBar;
