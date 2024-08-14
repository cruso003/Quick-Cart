import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import SubCategoryItem from "../../components/categories/SubcategoryItem";
import ProductCard from "../../components/card/ProductCard";
import ErrorView from "../../components/ErrorView";
import Header from "../../components/Header";
import colors from "../../../theme/colors";
import { categoriesData } from "../../components/demo/DemoData";

const SingleCategory = () => {
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const categoryName = route?.params?.categoryName;
  const subCategoryId = route?.params?.subCategoryId;
  const categoryId = route?.params?.categoryId;

  useEffect(() => {
    // Filter the subcategories and products based on the selected subcategory ID
    const selectedCategory = categoriesData.find(
      (category) => category.id === categoryId
    );

    if (selectedCategory) {
      const filteredSubcategories = selectedCategory.subCategories || [];
      setSubcategoryList(filteredSubcategories);

      const selectedSubcategory = filteredSubcategories.find(
        (subcategory) => subcategory.id === subCategoryId
      );
      const filteredProducts = selectedSubcategory ? selectedSubcategory.products : [];
      setProducts(filteredProducts);
    }
  }, [categoryId, subCategoryId]);

  const renderProduct = ({ item }) => <ProductCard product={item} />;

  const renderSubcategory = ({ item }) => (
    <SubCategoryItem
      item={item}
      onPress={() => {
        navigation.navigate('SingleCategory', {
          categoryId: categoryId,
          subCategoryId: item.id,
          categoryName: categoryName,
        });
      }}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />
      <Header title={categoryName} onBackPress={() => navigation.goBack()} />
      <View style={styles.subcategoryList}>
        <FlatList
          data={subcategoryList}
          renderItem={renderSubcategory}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {error ? (
        <ErrorView
          onRetry={() => {
            setError(false);
            // Retry logic can be added here
          }}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  subcategoryList: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default SingleCategory;
