import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, SafeAreaView, Platform, StatusBar, View, Text, TouchableOpacity } from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import userApi from "../../../api/user/user";
import Header from "../../components/home/Header";
import AddressBar from "../../components/home/AddressBar";
import LocationModal from "../../components/home/LocationModal";
import { useDeliveryAddress } from "../../../context/DeliveryAddress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Categories from "../../components/categories/Categories";
import Banners from "../../components/home/Banners";
import FlashDeals from "../../components/home/FlashDeals";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import colors from "../../../theme/colors";
import BrandedProducts from "../../components/home/BrandedProducts";
import FeaturedCollection from "../../components/home/FeaturedProducts";

const HomeScreen = () => {
  const [cartLength, setCartLength] = useState(0);
  const navigation = useNavigation();
  const [timerDuration, setTimerDuration] = useState(15 * 60 * 60);
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedAddress, setSelectedAddress } = useDeliveryAddress();
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const getData = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [getData])
  );

  const handleSelectedAddressChange = (address) => {
    setSelectedAddress(address);
  };

  const fetchUserDeliveryAddresses = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUserById(user.id);
      if (response && response.data.data.deliveryAddresses) {
        const addresses = response.data.data.deliveryAddresses;
        const defaultAddress = addresses.find(
          (address) => address.default === true
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
        setDeliveryAddresses(addresses);
      }
    } catch (error) {
      console.error("Error fetching user delivery addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchUserDeliveryAddresses();
      }
    }, [user])
  );

  useEffect(() => {
    if (!user) {
      setSelectedAddress("");
    }
  }, [user]);

 /* useEffect(() => {
    /*if (cart) {
      setCartLength(cart.length);
    }
  }, [cart]);*/

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleMessageOpen = () => {
    if (user) {
      navigation.navigate("Messages");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#f6f6f6",
        marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
      }}
    >
      <Header
        navigation={navigation}
        cartLength={cartLength}
        handleMessageOpen={handleMessageOpen}
      />
      <AddressBar
        user={user}
        toggleModal={toggleModal}
        selectedAddress={selectedAddress}
        loading={loading}
      />
      <LocationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        deliveryAddresses={deliveryAddresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        navigation={navigation}
        user={user}
      />
      <ScrollView>
        <View style={{ marginVertical: 10 }}>
          <Categories />
        </View>
        <View style={{ marginVertical: 3 }}>
          <Banners navigation={navigation} />
        </View>
        {/* Flash Deals with Timer */}
        <View>
          <View
            style={{
              marginTop: 5,
              marginHorizontal: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: colors.danger,
              padding: 10,
              borderRadius: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="discount" size={15} color="#fff" />
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>
                FLASH DEALS
              </Text>
            </View>
            {/* Timer with icon */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("FlashDeals")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    See{" "}
                  </Text>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    More{" "}
                  </Text>
                </View>
                <AntDesign name="arrowright" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 5, marginHorizontal: 10 }}>
            <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ flexDirection: "row" }}>
                <FlashDeals navigation={navigation} />
              </View>
            </ScrollView>
          </View>
        </View>
         {/* Top Products */}
         <View>
          <View
            style={{
              marginTop: 5,
              marginHorizontal: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Branded PRODUCTS
            </Text>
          </View>

          <View style={{ marginTop: 5, marginHorizontal: 10 }}>
            <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ flexDirection: "row" }}>
                {/* TopProducts Component */}

                <BrandedProducts navigation={navigation} />
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Featured Collections */}
        <View>
          <View style={{ marginTop: 5, marginHorizontal: 10 }}>
            <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ flexDirection: "row" }}>
                {/* FeaturedProducts Component */}
                <FeaturedCollection navigation={navigation} />
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
