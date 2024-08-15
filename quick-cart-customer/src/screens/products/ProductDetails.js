import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import colors from "../../../theme/colors";
import { AirbnbRating } from "react-native-ratings";
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { useWishlist } from "../../../context/wishlist";
import { useCart } from "../../../context/cart";
import { RadioButton } from "react-native-paper";
import { format } from "date-fns";
import { useAuth } from "../../../context/auth";
import messageApi from "../../../api/message/message";
import storeApi from "../../../api/store/store";
import usersApi from "../../../api/user/user";
import shipmentApi from "../../../api/shipment/shipment";
import { useDeliveryAddress } from "../../../context/DeliveryAddress";
import LocationModal from "../../components//home/LocationModal";
import { Picker } from "@react-native-picker/picker";
import Header from "../../components/Header";
import styles from "./styles";

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addToCart, cart } = useCart();
  const { addToWishlist, isProductInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const user = useAuth();
  const [selectedCity, setSelectedCity] = useState("Please choose a city");
  const { selectedAddress, setSelectedAddress } = useDeliveryAddress();
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [pickupStations, setPickupStations] = useState([]);
  const [selectedPickupStation, setSelectedPickupStation] = useState(null);
  const [selectedState, setSelectedState] = useState("Montserrado");
  const [filteredPickupStations, setFilteredPickupStations] = useState([]);
  const [shipmentOption, setShipmentOption] = useState(null);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(null);
  const [seller, setSeller] = useState([]);
  const [buyer, setBuyer] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const maskUserName = (userName) => {
    if (userName.length < 3) return userName;
    const firstChar = userName.charAt(0);
    const lastChar = userName.charAt(userName.length - 1);
    return `${firstChar}***${lastChar}`;
  };

  const fetchSender = async () => {
    if (user && user.user && user.user.id) {
      const userId = user.user.id;
      try {
        const response = await usersApi.getUserById(userId);
        setBuyer(response.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
  };
  const fetchStore = async () => {
    const { product } = route.params;
    const storeName = product.store;
    try {
      const response = await storeApi.getStoreByName(storeName);
      setSeller(response.data);
    } catch (error) {
      console.error("Error fetching store:", error);
    }
  };

  const fetchPickupStations = async () => {
    try {
      setLoading(true);
      const response = await shipmentApi.getPickupStations();
      const stations = response.data;
      setPickupStations(stations);

      // Set filtered stations based on the selected state and city
      // Assuming `selectedState` and `selectedCity` are defined elsewhere
      const filteredStations = stations.filter((station) =>
        selectedState
          ? station.address.state === selectedState &&
            (selectedCity === "All" || station.address.city === selectedCity)
          : true
      );
      setFilteredPickupStations(filteredStations);
    } catch (error) {
      console.error("Error fetching pickup stations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle state selection and filter cities
  const handleStateChange = (state) => {
    setSelectedState(state);

    // Calculate filtered pickup stations based on selected state
    const filteredStations = pickupStations.filter(
      (station) => station.address.state === state
    );

    // Set filtered pickup stations
    setFilteredPickupStations(filteredStations);

    // Extract unique cities from filtered stations
    const uniqueCities = [
      "All",
      ...new Set(filteredStations.map((station) => station.address.city)),
    ];

    // Set the selected city to the first city in the uniqueCities array
    // or to 'All' if 'All' exists.
    setSelectedCity(uniqueCities[0]);
  };

  // Function to handle city selection and filter pickup stations
  const handleCityChange = (city) => {
    setSelectedCity(city);

    let filteredStations;

    if (city === "All") {
      filteredStations = pickupStations.filter(
        (station) => station.address.state === selectedState
      );
    } else {
      filteredStations = pickupStations.filter(
        (station) =>
          station.address.city === city &&
          station.address.state === selectedState
      );
    }

    setFilteredPickupStations(filteredStations);
  };

  // Function to handle selection of a pickup station
  const handlePickupStationSelect = (station) => {
    setSelectedPickupStation(station);
    // Close the modal once a pickup station is selected
    setIsModalVisible(false);
  };

  const handleSelectedAddressChange = (address) => {
    setSelectedAddress(address);
  };

  const handleSendMessage = async () => {
    const { product } = route.params;

    try {
      // Ensure product, product.store, and product.images are defined
      if (
        product &&
        product.store &&
        product.images &&
        product.images.length > 0
      ) {
        // Check if a user is logged in
        if (user && user.user && user.user.id) {
          const messageData = {
            sender: buyer.id,
            receiver: seller.owner,
            lastChat: "Hello, I'm interested in your product!",
            image: product.images[0],
          };

          // Send the new message to the server
          const response = await messageApi.createMessage(messageData);

          if (response && response.data) {
            // Emit a socket event when a new message is sent
            messageApi.socket.emit("newMessage", response.data);

            // Navigate to the MessageSingle screen with the newly created message
            navigation.navigate("MessageSingle", {
              messageData: response.data,
            });
          } else {
            console.error("Invalid response from server");
          }

          // Add any additional logic you want to perform after sending the message
        } else {
          // Navigate to the login page if no user is logged in
          navigation.navigate("Login", {
            reason: "Please log in to send a message.",
          });
        }
      } else {
        console.error("Product information is incomplete");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const { product } = route.params;

    setProduct(product);
    if (product) {
      // Check if the product is in the cart
      if (cart && cart.length > 0) {
        const productInCart = cart.find(
          (item) => item.product?.id === product?.id
        );
        setIsInCart(!!productInCart);
      }

      // Check if the product is in the wishlist
      const productInWishlist = isProductInWishlist(product.id);
      setIsInWishlist(productInWishlist);

      // Calculate expected pickup/delivery date
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 2); // Assuming 2 days for delivery

      // Format the date in a human-readable format (e.g., Feb 2)
      const formattedDate = format(deliveryDate, "MMM d");

      // Set the formatted date to your state variable or use it as needed
      setExpectedDeliveryDate(formattedDate);

      let isSpecificCategory;

      // Calculate delivery fee based on conditions
      if (shipmentOption === "Door Delivery") {
        let baseFee = 1; // Default delivery fee

        // Extract category of the current product
        const category = product?.subcategory;

        // Determine store, user delivery address, and pickup station locations
        const storeCity = seller.city;
        const storeState = seller.state;

        const userCity = selectedAddress?.city;
        const userState = selectedAddress?.state;

        // Check if category is defined before proceeding
        if (category) {
          isSpecificCategory =
            category === "Appliances" ||
            category === "TVs and Audio" ||
            category === "Computers and Laptops" ||
            category === "Furnitures";

          // Check selected state and adjust fees accordingly
          if (storeCity === userCity && storeState === userState) {
            baseFee = isSpecificCategory ? 1.5 : 1;
          } else if (storeState === userState) {
            baseFee = isSpecificCategory ? 2 : 1.5;
          } else {
            baseFee = isSpecificCategory ? 5 : 3;
          }

          setDeliveryFee(baseFee);
        }
      } else {
        // Handle pickup fees
        let pickupFee;

        // Extract category of the current product
        const category = product?.subcategory;

        // Determine store, user delivery address, and pickup station locations
        const storeCity = seller.city;
        const storeState = seller.state;

        const pickupCity =
          pickupStations && selectedPickupStation
            ? selectedPickupStation.address.city
            : "";
        const pickupState =
          pickupStations && selectedPickupStation
            ? selectedPickupStation.address.state
            : "";

        // Check if category is defined before proceeding
        if (category) {
          isSpecificCategory =
            category === "Appliances" ||
            category === "TVs and Audio" ||
            category === "Computers and Laptops" ||
            category === "Furnitures";

          // Check conditions for pickup fees
          if (storeCity === pickupCity && storeState === pickupState) {
            pickupFee = isSpecificCategory ? 1 : 0.5;
          } else if (storeState === pickupState) {
            pickupFee = isSpecificCategory ? 1.5 : 1;
          } else {
            pickupFee = isSpecificCategory ? 4 : 2;
          }
          setDeliveryFee(pickupFee);
        }
      }
    }
    fetchStore();
    fetchSender();

    if (shipmentOption === "Pickup Station") {
      fetchPickupStations();
    } else if (shipmentOption === "delivery") {
      handleSelectedAddressChange();
    }

    // Check if the user is available and has deliveryAddresses
    if (user && user.user && user.user.deliveryAddresses) {
      // Extract the delivery addresses from the user object
      const userDeliveryAddresses = user.user.deliveryAddresses;

      // Set the deliveryAddresses state using the extracted delivery addresses
      setDeliveryAddresses(userDeliveryAddresses);
    }
  }, [
    selectedState,
    selectedCity,
    shipmentOption,
    product,
    cart,
    selectedAddress,
    selectedPickupStation,
    deliveryFee,
  ]);

  if (!product) {
    return null;
  }

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const addProductToCart = async () => {
    const userId = user && user.user ? user.user._id : null;
    // Check if the delivery method is chosen
    if (!shipmentOption) {
      Alert.alert("Please choose a delivery method.");
      return;
    }

    // Check if variations are chosen
    const allVariationsChosen = product.variations.every(
      (variation) => selectedVariations[variation.name] !== undefined
    );

    if (!allVariationsChosen) {
      Alert.alert("Please choose all variations.");
      return;
    }
    const productId = product.id;
    // Create the cart item
    const cartItem = {
      user: userId ? userId : null,
      product: productId,
      salePrice: product.discount_price
        ? product.discount_price
        : product.price,
      selectedVariations,
      shipmentOption,
      deliveryFee,
      selectedPickupStation,
      selectedAddress,
    };

    Alert.alert(
      "Product added to cart, do you want to proceed to the cart?",
      "",
      [
        {
          text: "No, keep shopping",
          onPress: () => navigation.goBack(),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            navigation.navigate("Cart");
          },
        },
      ],
      { cancelable: false }
    );
    addToCart(cartItem);
    setIsInCart(true);
  };

  const addProductToWishlist = () => {
    if (!isInWishlist) {
      addToWishlist(product);
      setIsInWishlist(true);
      Alert.alert(
        "Product added to Wishlist, do you want to switch to your wishlist?",
        "",
        [
          {
            text: "No, keep shopping",
            onPress: () => navigation.goBack(),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              navigation.navigate("Wishlist");
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleVariationSelect = (variationName, option) => {
    setSelectedVariations((prevState) => ({
      ...prevState,
      [variationName]: option,
    }));
  };

  const inStock = product?.stock > 0;
  const regularPrice = product.price ? `$${product.price}` : null;
  const discountPrice = product.discount_price
    ? `$${product.discount_price}`
    : null;
  const priceComponent = discountPrice ? (
    <View style={styles.pricesContainer}>
      <View style={styles.pricesDirection}>
        <Text style={styles.regularPrice}>{regularPrice}</Text>
        <Text style={styles.salePrice}>{discountPrice}</Text>
      </View>
      {product.price && product.discount_price && (
        <Text style={styles.discount}>
          {(
            ((product.price - product.discount_price) / product.price) *
            100
          ).toFixed(0) + "% OFF"}
        </Text>
      )}
    </View>
  ) : (
    <Text style={styles.productPrice}>{regularPrice}</Text>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f6f6f6",
        marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
      }}
    >
         <Header title={product.name} onBackPress={() => navigation.goBack()} />
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginBottom: 10,
            backgroundColor: "#fff",
          }}
        >
          <View style={{ height: 175, marginBottom: 10 }}>
            <Swiper
              loop={true}
              autoplay={true}
              autoplayTimeout={2.5}
              activeDotColor={"#ff4800"}
              bounces={true}
              paginationStyle={{ position: "absolute", bottom: 0 }}
            >
              {product.images.map((image, i) => (
                <View key={i} style={{ alignItems: "center" }}>
                  <Image
                    source={{ uri: image }}
                    style={[styles.centerElement, { width: 200, height: 175 }]}
                  />
                </View>
              ))}
            </Swiper>
          </View>
          <Text style={{ fontSize: 16, marginBottom: 15 }}>{product.name}</Text>
          <View style={styles.vendorLabel}>
            <Text style={{ fontSize: 14, color: "#999" }}>
              Condition:{" "}
              <Text style={styles.vendorName}>{product.condition}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "start",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <View style={styles.vendorContainer}>
              {product.store && (
                <View style={styles.vendorLabel}>
                  <Text style={{ fontSize: 14, color: "#999" }}>
                    Sold By:{" "}
                    <Text style={styles.vendorName}>{product.store}</Text>
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={addProductToWishlist}
              >
                <AntDesign
                  name={isInWishlist ? "heart" : "hearto"}
                  size={24}
                  color={isInWishlist ? "red" : "black"}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, color: colors.black }}>
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Text>
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.productPrice}>{priceComponent}</Text>
              <View style={styles.airbnbRatingContainer}>
                <Text style={styles.vendorLabel}>Overall Rating:</Text>
                <AirbnbRating
                  defaultRating={product.rating ? product.rating : 0}
                  size={15}
                  showRating={false}
                />
              </View>
            </View>

            <View style={styles.container}>
              <View style={styles.ratingContainer}>
                <Text style={styles.vendorLabel}>Customer Reviews:</Text>
          
                  <TouchableOpacity onPress={() => setShowModal(true)}>
                    <View style={styles.ratingItem}>
                      <View style={{ flexDirection: "row" }}>
                        <MaterialIcons name="person" size={18} />
                        <Text>
                          Customer: Test
                        </Text>
                      </View>
                      <Text>
                        Rating:
                        <AirbnbRating
                          defaultRating={4}
                          size={13}
                          showRating={false}
                        />
                      </Text>
                      <Text>Comment:Test</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text>See All Reviews</Text>
                        <AntDesign name="arrowright" size={20} color="#000" />
                      </View>
                    </View>
                  </TouchableOpacity>
    
               
              </View>
            </View>
            {/* Modal to display all reviews */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showModal}
              onRequestClose={() => setShowModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowModal(false)}
                  >
                    <MaterialIcons name="close" size={24} />
                  </TouchableOpacity>
                
                </View>
              </View>
            </Modal>
          </View>
          {/**Delivery & Returns */}
          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 15,
              backgroundColor: "#fff",
              marginVertical: 15,
            }}
          >
            {/* Shipment Options Section */}
            <View
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: "#f4f4f4",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}
              >
                Delivery Options
              </Text>
            </View>

            {/* Render "Pickup Station" option */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton
                value="Pickup Station"
                status={
                  shipmentOption === "Pickup Station" ? "checked" : "unchecked"
                }
                onPress={() => {
                  setShipmentOption("Pickup Station");
                  setIsModalVisible(true); // Open the modal when "Pickup Station" is selected
                }}
              />
              <Entypo name="shop" size={24} color="black" />
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginLeft: 10,
                }}
              >
                <Text style={{ marginLeft: 2, fontWeight: "bold" }}>
                  Pickup Station
                </Text>

                {/* TouchableOpacity for selecting or changing a pickup station */}
                {shipmentOption === "Pickup Station" && (
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(true)} // Open the modal on press
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: colors.danger,
                        padding: 5,
                      }}
                    >
                      {/* Display appropriate text based on whether a pickup station is selected */}
                      {selectedPickupStation
                        ? `Pickup at ${selectedPickupStation.name} - Change Pickup Station`
                        : "Please select a pickup station"}
                    </Text>
                  </TouchableOpacity>
                )}
                <Text style={{ fontSize: 11 }}>
                  Delivery Fees ${deliveryFee}
                </Text>
                <Text style={{ fontSize: 11 }}>
                  Pickup by {expectedDeliveryDate} when you order today
                </Text>
              </View>
            </View>

            {/* Modal for selecting pickup station */}
            <Modal
              visible={isModalVisible}
              onRequestClose={() => setIsModalVisible(false)}
              transparent={true}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                {loading ? (
                  <View style={[styles.centerElement, { height: 10 }]}>
                    <ActivityIndicator size="large" color="#ef5739" />
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 20,
                      borderRadius: 8,
                      width: "80%",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginBottom: 10,
                      }}
                    >
                      Select State and City
                    </Text>

                    {/* State dropdown */}
                    <Text style={{ fontSize: 14, marginBottom: 5 }}>
                      Select State:
                    </Text>
                    <Picker
                      selectedValue={selectedState}
                      onValueChange={handleStateChange}
                    >
                      {/* Provide options for the available states */}
                      <Picker.Item label="Select State" value="" />
                      {[
                        ...new Set(
                          pickupStations.map((station) => station.address.state)
                        ),
                      ].map((state, index) => (
                        <Picker.Item key={index} label={state} value={state} />
                      ))}
                    </Picker>

                    {/* City dropdown */}
                    <Text
                      style={{ fontSize: 14, marginBottom: 5, marginTop: 10 }}
                    >
                      Select City:
                    </Text>
                    <Picker
                      selectedValue={selectedCity}
                      onValueChange={handleCityChange}
                    >
                      {/* Provide options for the available cities based on the selected state */}
                      <Picker.Item
                        label="Please choose a city"
                        value="Please choose a city"
                      />
                      {[
                        ...new Set(
                          pickupStations
                            .filter(
                              (station) =>
                                station.address.state === selectedState
                            )
                            .map((station) => station.address.city)
                        ),
                      ].map((city, index) => (
                        <Picker.Item key={index} label={city} value={city} />
                      ))}
                    </Picker>

                    {/* List of filtered pickup stations */}
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 10,
                      }}
                    >
                      Pickup Stations:
                    </Text>
                    <FlatList
                      data={filteredPickupStations}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => handlePickupStationSelect(item)}
                        >
                          <Text style={{ paddingVertical: 10 }}>
                            {item.name} - {item.address.street}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />

                    {/* Close modal button */}
                    <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                      <Text
                        style={{
                          color: "red",
                          marginTop: 20,
                          textAlign: "center",
                        }}
                      >
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Modal>

            {/* Render "Door Delivery" option */}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton
                value="Door Delivery"
                status={
                  shipmentOption === "Door Delivery" ? "checked" : "unchecked"
                }
                onPress={() => setShipmentOption("Door Delivery")}
              />
              <MaterialCommunityIcons
                name="truck-delivery"
                size={25}
                color="#000"
              />
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginLeft: 10,
                }}
              >
                <Text style={{ marginLeft: 2, fontWeight: "bold" }}>
                  Door Delivery
                </Text>
                {/* If door delivery is selected, show the default delivery address */}
                {shipmentOption === "Door Delivery" && (
                  <Text style={{ fontSize: 11, color: "red" }}>
                    Deliver to {selectedAddress?.name} -{" "}
                    {selectedAddress?.street}
                  </Text>
                )}
                
                <Text style={{ fontSize: 11 }}>
                  Delivery Fees ${deliveryFee}
                </Text>
                <Text style={{ fontSize: 11 }}>
                  Deliver by {expectedDeliveryDate} when you order today
                </Text>
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

            {/* Return Policy Section */}
            <View
              style={{
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesome6 name="clock-rotate-left" size={20} color="black" />
              <View style={{ marginLeft: 10, marginTop: 10 }}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 14, marginBottom: 2 }}
                >
                  Return Policy
                </Text>
                {/* Display return policy details */}
                <Text style={{ fontSize: 11 }}>
                  Our return policy allows for free returns within 7 days for
                  eligible products.
                  {/* Add more details here */}
                </Text>
              </View>
            </View>
          </View>

          {/** Product Details */}
          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 15,
              backgroundColor: "#fff",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderColor: "#f4f4f4",
              }}
            >
              Product Details
            </Text>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: "#f4f4f4",
              }}
            >
              <Text style={{ width: "50%", color: "#939393" }}>In Stock:</Text>
              <Text style={{ width: "50%" }}>{product.stock}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: "#f4f4f4",
              }}
            >
              <Text style={{ width: "50%", color: "#939393" }}>Brand:</Text>
              <Text style={{ width: "50%" }}>
                {product.brand ? product.brand : "N/A"}
              </Text>
            </View>
            {/* Render variations only if variations exist */}
            {product.variations && product.variations.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderColor: "#f4f4f4",
                }}
              >
                <Text style={{ width: "50%", color: "#939393" }}>
                  Variations:
                </Text>
                <View style={{ width: "50%" }}>
                  {product.variations.map((variation, index) => (
                    <View key={index}>
                      <Text>{variation.name}:</Text>
                      {variation.options.map((option, optionIndex) => (
                        <View
                          key={optionIndex}
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <RadioButton
                            value={option}
                            status={
                              selectedVariations[variation.name] === option
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() =>
                              handleVariationSelect(variation.name, option)
                            }
                          />
                          <Text>{option}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            )}
            <Text style={{ paddingVertical: 10, color: "#939393" }}>
              {product.description}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View style={styles.store}>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => {}}
            >
              <FontAwesome5 name="store" size={35} color="#000" />
              <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                Visit Store
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              style={[
                styles.button,
                !inStock && styles.buttonDisabled,
                isInCart && { backgroundColor: "#ccc" },
              ]}
              disabled={!inStock || isInCart}
              onPress={inStock && !isInCart ? addProductToCart : undefined}
            >
              <Text style={styles.buttonText}>
                {isInCart
                  ? "Already In Cart"
                  : inStock
                  ? "Add to Cart"
                  : "Out of stock"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginRight: 5 }}>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={handleSendMessage}
            >
              <Ionicons name="chatbubbles" size={35} color="black" />
              <Text style={{ fontWeight: "bold" }}>Message Seller</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default ProductDetails;
