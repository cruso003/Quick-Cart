import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import useApi from "../hooks/useApi";
import ProductsApi from "../api/products";
import ActivityIndicator from "./ActivityIndicator";
import { useCart } from "./context/CartContext";
import ProductCard from "../card/ProductCard";

function FlashDeals({ navigation }) {
  const getProductsApi = useApi(ProductsApi.getProducts);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart } = useCart();
  
  useEffect(() => {
    getProductsApi.request();
  }, []);

  useEffect(() => {
    if (getProductsApi.data) {
      const filteredSaleProducts = getProductsApi.data.filter(
        (product) => product.discount_price
      );
      setProducts(filteredSaleProducts);
      setLoading(false);
    } else if (getProductsApi.error) {
      setLoading(false);
    }
  }, [getProductsApi.data, getProductsApi.error]);

  const navigateToProductDetails = (product) => {
    navigation.navigate("ProductDetails", {
      product: { ...product },
    });
  };

  if (loading) {
    return <ActivityIndicator visible={loading} />;
  }

  if (getProductsApi.error) {
    return <ErrorView message="There was an error while loading the data. Please try again later." onRetry={() => getProductsApi.request()} />;
  }

  if (products.length === 0) {
    Alert.alert("No available product yet");
    return null;
  }

  const ProductRow = ({ products }) => (
    <View style={styles.productRow}>
      {products.map((product) => (
        <View key={product.id} style={styles.productColumn}>
          <ProductCard item={product} navigateToProductDetails={navigateToProductDetails} />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.centerElement} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={25} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flash Deals</Text>
        <TouchableOpacity style={styles.centerElement} onPress={() => {}}>
          <Feather name="share" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.centerElement} onPress={() => navigation.navigate("Cart")}>
          <MaterialIcons name="shopping-cart-checkout" size={28} color="#fff" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {products
          .reduce((acc, curr, i) => {
            if (i % 2 === 0) {
              acc.push([curr]);
            } else {
              acc[acc.length - 1].push(curr);
            }
            return acc;
          }, [])
          .map((row, i) => (
            <ProductRow key={i} products={row} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default FlashDeals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "grey",
    padding: 10,
  },
  centerElement: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
  },
  cartBadge: {
    width: 18,
    height: 18,
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: colors.secondary,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    fontSize: 10,
    color: "white",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  productColumn: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
  },
});
