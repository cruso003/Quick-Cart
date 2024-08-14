import React, { useState, useEffect } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import ProductCard from "../card/ProductCard";
import useApi from "../../hooks/useApi";
import ProductsApi from "../../../api/product/product"


function FlashDeals({ navigation }) {
  const getProductsApi = useApi(ProductsApi.getProducts);
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    getProductsApi.request();
  }, []);

  useEffect(() => {
    if (getProductsApi.data) {
      const filteredSaleProducts = getProductsApi.data.filter(
        (product) => product.discountPrice
      );
      setSaleProducts(filteredSaleProducts);
    }
  }, [getProductsApi.data]);

  const navigateToProductDetails = (product) => {
    navigation.navigate("ProductDetails", { product });
  };

  return (
      <FlatList
        data={saleProducts}
        renderItem={({ item }) => (
          <ProductCard item={item} navigateToProductDetails={navigateToProductDetails} />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
  );
}

export default FlashDeals;
