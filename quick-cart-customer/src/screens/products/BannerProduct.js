import {
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    Platform,
    StatusBar,
    ScrollView,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState, useCallback } from "react";
  import BannersApi from "../../../api/banner/banner";
  import ProductCard from "../../components/card/ProductCard";
  import Header from "../../components/Header"; 
  
  function BannerProducts({ route, navigation }) {
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cartLength, setCartLength] = useState(0);
  
    const fetchBannerProducts = useCallback(async () => {
      try {
        setLoading(true);
        const bannerId = route.params.bannerId;
        const response = await BannersApi.getBanners();
        const result = response.data.find((banner) => banner.id === bannerId);
        setBanners(result);
        setProducts(result.linkedProducts);
      } catch (error) {
        console.error("Error fetching banner products:", error);
        setError("Error fetching banner products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }, [route.params.bannerId]);
  
    useEffect(() => {
      fetchBannerProducts();
    }, [fetchBannerProducts]);
  
    const navigateToProductDetails = (product) => {
      const modifiedProduct = {
        ...product,
      };
      navigation.navigate("ProductDetails", {
        product: modifiedProduct,
      });
    };
  
    if (loading) {
      return (
        <View style={{ height: 20 }}>
          <ActivityIndicator size="small" color="#ef5739" />
        </View>
      );
    }
  
    if (error) {
      return (
        <View>
          <Text style={styles.errorMessage}>
            There was an error while loading the data. Please try again later.
          </Text>
          <Button
            title="Retry"
            onPress={() => {
              fetchBannerProducts();
            }}
          />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <Header
          title={banners.name}
          cartLength={cartLength}
          onBack={() => navigation.goBack()}
          onCart={() => navigation.navigate("Cart")}
          onShare={() => {}}
          onMore={() => {}}
        />
        <View>
          <Image
            source={{ uri: banners.imageUrl }}
            style={{ width: "100%", height: 150 }}
          />
        </View>
        <ScrollView>
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
              <View key={i} style={styles.productRow}>
                {row.map((product) => (
                  <View key={product.id} style={styles.productColumn}>
                    <ProductCard item={product} navigateToProductDetails={navigateToProductDetails} />
                  </View>
                ))}
              </View>
            ))}
        </ScrollView>
      </View>
    );
  }
  
  export default BannerProducts;
  
  const styles = StyleSheet.create({
    container: {
      minHeight: "100%",
      height: "100%",
      marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
      backgroundColor: "grey",
    },
    errorMessage: {
      fontSize: 16,
      color: "red",
      textAlign: "center",
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
  