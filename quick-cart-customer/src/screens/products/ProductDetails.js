import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform, StatusBar, ScrollView, SafeAreaView, } from "react-native";
import {Ionicons,FontAwesome5} from "@expo/vector-icons";
import colors from "../../../theme/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useWishlist } from "../../../context/wishlist";
import { useCart } from "../../../context/cart";
import { format } from "date-fns";
import { useAuth } from "../../../context/auth";
import messageApi from "../../../api/message/message";
import usersApi from "../../../api/user/user";
import shipmentApi from "../../../api/shipment/shipment";
import { useDeliveryAddress } from "../../../context/DeliveryAddress";
import Header from "../../components/Header";
import styles from "./styles";
import { CustomerReviews, DeliveryAndReturns, ImageSlider, PriceRating,WishlistButton, ProductInfo, VendorInfo, DetailsSection } from "../../components/product-details/index.js";
import { addProductToCart, addProductToWishlist, maskUserName } from "../../utils/utils";

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
  const [loading, setLoading] = useState(false);


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

  const fetchPickupStations = async () => {
    try {
      setLoading(true);
      const response = await shipmentApi.getPickupStations();
      const stations = response.data;
      setPickupStations(stations);

      // Set filtered stations based on the selected state and city
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
        product && product.store && product.images && product.images.length > 0) {
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


  const handleAddToCart = async () => {
    await addProductToCart({user,product,selectedVariations,shipmentOption,deliveryFee,selectedPickupStation,selectedAddress,navigation,addToCart,setIsInCart,
    });
};
 
const handleAddToWishlist = () => {
  addProductToWishlist({
      isInWishlist,
      product,
      addToWishlist,
      setIsInWishlist,
      navigation,
  });
};

  const handleVariationSelect = (variationName, option) => {
    setSelectedVariations((prevState) => ({
      ...prevState,
      [variationName]: option,
    }));
  };

  const inStock = product?.stock > 0;
  const regularPrice = product.price ? `$${product.price}` : null;
  const discountPrice = product.discountPrice
    ? `$${product.discountPrice}`
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
      <Header title={product.name} onBack={() => navigation.goBack()} />
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: "#fff",
          }}
        >
          <ImageSlider images={product.images} />
          <ProductInfo name={product.name} condition={product.condition} />
        </View>
        <View style={styles.detailsContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "start",
              justifyContent: "space-between",
              marginVertical: 5,
            }}
          >
            <VendorInfo store={product.store.businessName} />
            <WishlistButton
              isInWishlist={isInWishlist}
              onPress={handleAddToWishlist}
            />
          </View>
          <PriceRating
            priceComponent={priceComponent}
            rating={product.rating}
          />
          <CustomerReviews
            ratings={product.ratings}
            maskUserName={maskUserName}
          />
          {/**Delivery & Returns */}
          <DeliveryAndReturns
            colors={colors} selectedPickupStation={selectedPickupStation} setSelectedPickupStation={setSelectedPickupStation} deliveryFee={deliveryFee}
            expectedDeliveryDate={expectedDeliveryDate} shipmentOption={shipmentOption} setShipmentOption={setShipmentOption} selectedState={selectedState} setSelectedState={setSelectedState}
            handleStateChange={handleStateChange} selectedCity={selectedCity} setSelectedCity={setSelectedCity}
            handleCityChange={handleCityChange} pickupStations={pickupStations}
            filteredPickupStations={filteredPickupStations} handlePickupStationSelect={handlePickupStationSelect} isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible} loading={loading} modalVisible={modalVisible}
            setModalVisible={setModalVisible} deliveryAddresses={deliveryAddresses}
            selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress}
            navigation={navigation} user={user}
          />
        <DetailsSection
        product={product}
        selectedVariations={selectedVariations}
        handleVariationSelect={handleVariationSelect}
      />
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
              onPress={inStock && !isInCart ? handleAddToCart : undefined}
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
