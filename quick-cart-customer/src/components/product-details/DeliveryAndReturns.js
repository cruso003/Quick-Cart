import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import LocationModal from '../home/LocationModal';
import { Picker } from '@react-native-picker/picker';

const DeliveryAndReturns = ({
  colors,
  selectedPickupStation,
  setSelectedPickupStation,
  deliveryFee,
  expectedDeliveryDate,
  shipmentOption,
  setShipmentOption,
  selectedState,
  setSelectedState,
  handleStateChange,
  selectedCity,
  setSelectedCity,
  handleCityChange,
  pickupStations,
  filteredPickupStations,
  handlePickupStationSelect,
  isModalVisible,
  setIsModalVisible,
  loading,
  modalVisible,
  setModalVisible,
  deliveryAddresses,
  selectedAddress,
  setSelectedAddress,
  navigation,
  user,
}) => {
  return (
    <View style={{ paddingHorizontal: 15, paddingVertical: 15, backgroundColor: "#fff", marginVertical: 15 }}>
      {/** Shipment Options Section */}
      <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: "#f4f4f4" }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>Delivery Options</Text>
      </View>

      {/** Pickup Station Option */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <RadioButton
          value="Pickup Station"
          status={shipmentOption === "Pickup Station" ? "checked" : "unchecked"}
          onPress={() => {
            setShipmentOption("Pickup Station");
            setIsModalVisible(true); // Open the modal when "Pickup Station" is selected
          }}
        />
        <Entypo name="shop" size={24} color="black" />
        <View style={{ marginBottom: 10, flexDirection: "column", alignItems: "flex-start", marginLeft: 10 }}>
          <Text style={{ marginLeft: 2, fontWeight: "bold" }}>Pickup Station</Text>
          {shipmentOption === "Pickup Station" && (
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              style={{ flexDirection: "row", alignItems: "center", padding: 5 }}
            >
              <Text style={{ fontSize: 11, color: colors.danger, padding: 5 }}>
                {selectedPickupStation
                  ? `Pickup at ${selectedPickupStation.name} - Change Pickup Station`
                  : "Please select a pickup station"}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={{ fontSize: 11 }}>Delivery Fees ${deliveryFee}</Text>
          <Text style={{ fontSize: 11 }}>Pickup by {expectedDeliveryDate} when you order today</Text>
        </View>
      </View>

      {/** Modal for selecting pickup station */}
      <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          {loading ? (
            <View style={{ justifyContent: "center", alignItems: "center", height: 10 }}>
              <ActivityIndicator size="large" color="#ef5739" />
            </View>
          ) : (
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 8, width: "80%" }}>
              <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>Select State and City</Text>
              <Text style={{ fontSize: 14, marginBottom: 5 }}>Select State:</Text>
              <Picker selectedValue={selectedState} onValueChange={handleStateChange}>
                <Picker.Item label="Select State" value="" />
                {[...new Set(pickupStations.map((station) => station.address.state))].map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
              <Text style={{ fontSize: 14, marginBottom: 5, marginTop: 10 }}>Select City:</Text>
              <Picker selectedValue={selectedCity} onValueChange={handleCityChange}>
                <Picker.Item label="Please choose a city" value="Please choose a city" />
                {[...new Set(
                  pickupStations.filter((station) => station.address.state === selectedState)
                    .map((station) => station.address.city)
                )].map((city, index) => (
                  <Picker.Item key={index} label={city} value={city} />
                ))}
              </Picker>
              <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>Pickup Stations:</Text>
              <FlatList
                data={filteredPickupStations}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handlePickupStationSelect(item)}>
                    <Text style={{ paddingVertical: 10 }}>{item.name} - {item.address.street}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={{ color: "red", marginTop: 20, textAlign: "center" }}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {/** Door Delivery Option */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <RadioButton
          value="Door Delivery"
          status={shipmentOption === "Door Delivery" ? "checked" : "unchecked"}
          onPress={() => setShipmentOption("Door Delivery")}
        />
        <MaterialCommunityIcons name="truck-delivery" size={25} color="#000" />
        <View style={{ marginBottom: 10, flexDirection: "column", alignItems: "flex-start", marginLeft: 10 }}>
          <Text style={{ marginLeft: 2, fontWeight: "bold" }}>Door Delivery</Text>
          {shipmentOption === "Door Delivery" && (
            <Text style={{ fontSize: 11, color: "red" }}>
              Deliver to {selectedAddress?.name} - {selectedAddress?.street}
            </Text>
          )}
          <Text style={{ fontSize: 11 }}>Delivery Fees ${deliveryFee}</Text>
          <Text style={{ fontSize: 11 }}>Deliver by {expectedDeliveryDate} when you order today</Text>
        </View>
      </View>

      <LocationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        deliveryAddresses={deliveryAddresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        navigation={navigation}
        user={user}
      />

      {/** Return Policy Section */}
      <View style={{ marginBottom: 10, flexDirection: "row", alignItems: "center" }}>
        <FontAwesome6 name="clock-rotate-left" size={20} color="black" />
        <View style={{ marginLeft: 10, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 2 }}>Return Policy</Text>
          <Text style={{ fontSize: 11 }}>
            Our return policy allows for free returns within 7 days for eligible products.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DeliveryAndReturns;
