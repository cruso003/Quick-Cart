import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FlashDeals from "./components/FlashDeals";
import CategorySection from "./components/CategorySection";
import AllProducts from "./AllProducts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddressSelector from "../../components/home/AddressSelector";
import Header from "../../components/home/Header";
import ProductSection from "../../components/home/ProductSection";
import LocationModal from "../../components/home/LocationModal";
import Banners from "../../components/home/Banners";

const HomeScreen = () => {
  const [cartLength, setCartLength] = useState(0);
  const navigation = useNavigation();
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

  useEffect(() => {
    if (cart) {
      setCartLength(cart.length);
    }
  }, [cart]);

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="MyEcommerce" cartLength={cartLength} navigation={navigation} />
      {user && (
        <AddressSelector
          loading={loading}
          selectedAddress={selectedAddress}
          toggleModal={toggleModal}
        />
      )}
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
        <CategorySection />
        <Banners navigation={navigation} />
        <FlashDeals navigation={navigation} />
        <ProductSection title="Branded PRODUCTS" component={TopProducts} />
        <ProductSection title="Featured Collections" component={FeaturedCollection} />
        <AllProducts navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f6f6f6",
    marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
  },
});

export default HomeScreen;
