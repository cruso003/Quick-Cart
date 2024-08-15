import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
import SubCategoryItem from "../../components/categories/SubcategoryItem";
import ProductCard from "../../components/card/ProductCard";
import ErrorView from "../../components/ErrorView";
import Header from "../../components/Header";
import colors from "../../../theme/colors";
import categoryApi from "../../../api/category/category";
import productApi from "../../../api/product/product";
import All from "../../../assets/allgame.png";

const SingleCategory = ({ route, navigation }) => {
  const { categoryName } = route.params;
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  const getProducts = async (subCategory) => {
    setLoading(true);
    try {
      const response = (await productApi.getProducts()).data;

      // Filter products based on the selected subcategory
      const filteredProducts = response.filter(
        (product) =>
          product.categoryName === categoryName &&
          (!subCategory || product.subcategoryName === subCategory.name)
      );

      setProducts(filteredProducts);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
    getProducts();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = (await categoryApi.getCategories()).data;

      const selectedCategory = response.find(
        (category) => category.title === categoryName
      );

      if (!selectedCategory) {
        console.error("Category not found");
        return;
      }

      // Corrected: Use subcategories with lowercase 's'
      const selectedSubCategories = Array.isArray(
        selectedCategory.subcategories
      )
        ? selectedCategory.subcategories.map((subCategory) => ({
            id: subCategory.id,
            name: subCategory.title,
            image: subCategory.imageUrl,
          }))
        : [];

      setSubCategories(selectedSubCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSubcategoryPress = (subCategory) => {
    setSelectedSubCategory(subCategory);
    getProducts(subCategory);
  };

  const renderProduct = ({ item }) => <ProductCard item={item} />;

  const renderSubcategory = ({ item }) => (
    <SubCategoryItem item={item} onPress={() => handleSubcategoryPress(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />
      <Header title={categoryName} onBack={() => navigation.goBack()} />
      {subCategories.length > 0 ? (
        <View style={styles.categoryRow}>
          <TouchableOpacity
            onPress={() => {
              getProducts();
            }}
          >
            <Image style={styles.subCategoryImage} source={All} />
            <Text style={styles.subCategoryName}>All Products</Text>
          </TouchableOpacity>
          <FlatList
            data={subCategories}
            renderItem={renderSubcategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : (
        <Text style={styles.noSubCategoriesText}>
          No subcategories available
        </Text>
      )}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : error ? (
        <ErrorView
          onRetry={() => {
            setError(null);
            fetchSubcategories();
            getProducts(selectedSubCategory);
          }}
        />
      ) : products.length === 0 ? (
        <Text style={styles.noProductsText}>No products available</Text>
      ) : (
        <FlatList
          numColumns={2}
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  categoryRow: {
    padding: 10,
    flexDirection: "row",
    backgroundColor: colors.dark,
  },
  subcategoryList: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  noSubCategoriesText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.text,
    fontSize: 16,
  },
  noProductsText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  subCategoryImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
  },
  subCategoryName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SingleCategory;
