import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";

const LocationModal = ({
  modalVisible,
  setModalVisible,
  deliveryAddresses,
  selectedAddress,
  setSelectedAddress,
  navigation,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close-outline" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Choose your Location</Text>
          <Text style={styles.modalSubtitle}>Select a delivery location</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {deliveryAddresses?.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedAddress(item)}
                style={[
                  styles.addressContainer,
                  {
                    backgroundColor:
                      selectedAddress === item ? "#FBCEB1" : "white",
                  },
                ]}
              >
                <View style={styles.addressDetails}>
                  <Text style={styles.addressName}>{item?.name}</Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>
                <Text numberOfLines={1} style={styles.addressLine}>
                  {item?.landmark}, {item?.street}
                </Text>
                <Text numberOfLines={1} style={styles.addressLine}>
                  {item?.state}, Liberia
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("AddAddressScreen");
              }}
              style={styles.addAddressContainer}
            >
              <Text style={styles.addAddressText}>Add an Address</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  modalSubtitle: {
    color: "gray",
    marginBottom: 10,
  },
  addressContainer: {
    width: 140,
    height: 140,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    marginTop: 10,
  },
  addressDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  addressName: {
    fontSize: 13,
    fontWeight: "bold",
  },
  addressLine: {
    width: 130,
    fontSize: 13,
    textAlign: "center",
  },
  addAddressContainer: {
    width: 140,
    height: 140,
    borderColor: "#D0D0D0",
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addAddressText: {
    textAlign: "center",
    color: "#0066b2",
    fontWeight: "500",
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  locationText: {
    color: "#0066b2",
    fontWeight: "400",
    marginLeft: 5,
  },
});

export default LocationModal;
