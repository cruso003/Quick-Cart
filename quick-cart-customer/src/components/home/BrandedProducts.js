import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import useApi from "../../hooks/useApi";
import ProductsApi from "../../../api/product/product";
import ProductCard from "../card/ProductCard";

function BrandedProducts({ navigation }) {
  const getProductsApi = useApi(ProductsApi.getProducts);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    getProductsApi.request();
  }, []);

  useEffect(() => {
    if (getProductsApi.data) {
      // Example: Filtering based on total sell count or high ratings
      const filteredTopProducts = getProductsApi.data.filter(
        (product) => product.brand
      );
      setTopProducts(filteredTopProducts);
    }
  }, [getProductsApi.data]);

  const navigateToProductDetails = (product) => {
    const modifiedProduct = {
      ...product,
    };
    navigation.navigate("ProductDetails", {
      product: modifiedProduct,
    });
  };

  return (
      <FlatList
        data={topProducts}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            navigateToProductDetails={navigateToProductDetails}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

  );
}

export default BrandedProducts;
