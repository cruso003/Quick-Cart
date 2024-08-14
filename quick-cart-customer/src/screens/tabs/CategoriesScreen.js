import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  ActivityIndicator,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CategoryItem from "../../components/categories/CategoryItem";
import SubCategoryItem from "../../components/categories/SubcategoryItem";
import colors from "../../../theme/colors";
import categoryApi from "../../../api/category/category";

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = (await categoryApi.getCategories()).data;
 
      const result =
        response &&
        response.map((item) => ({
          id: item.id,
          name: item.title,
          image: item.imageUrl,
        }));

      setCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchSubCategory = async (categoryId) => {
    try {
        const response = await categoryApi.getCategories();
        const category = response.data.find((cat) => cat.id === categoryId);

        if (category && category.subcategories) {
            setSubcategories((prevSubcategories) => ({
                ...prevSubcategories,
                [categoryId]: category.subcategories.map((subCategory) => ({
                    id: subCategory.id,
                    name: subCategory.title,
                    image: subCategory.imageUrl,
                })),
            }));
        }
    } catch (error) {
        console.error("Error fetching subcategories:", error);
    }
};


  const renderCategory = ({ item }) => (
    <CategoryItem
      item={item}
      isSelected={item.id === selectedCategory?.id}
      onPress={() => {
        setSelectedCategory(item);
        fetchSubCategory(item.id);
      }}
    />
  );
  
  const renderSubCategory = ({ item }) => (
    <SubCategoryItem
      item={item}
      onPress={() => {
        navigation.navigate("SingleCategory", {
          categoryId: selectedCategory.id,
          subCategoryId: item.id,
          categoryName: selectedCategory.name,
        });
      }}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />
      <View style={styles.leftContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <View style={styles.rightContainer}>
        {selectedCategory && (
          <View>
            <Image
              source={{ uri: selectedCategory.image }}
              style={styles.headerImage}
            />

            <Text style={styles.headerText}>{selectedCategory.title}</Text>
            {subcategories[selectedCategory.id] && (
              <FlatList
                data={subcategories[selectedCategory.id]}
                numColumns={3}
                renderItem={renderSubCategory}
                keyExtractor={(item) => item.id.toString()}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.black,
    justifyContent: "center",
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
  },
  leftContainer: {
    width: "25%",
    backgroundColor: colors.danger,
    margin: 5,
    marginBottom: 5,
  },
  rightContainer: {
    width: "75%",
    backgroundColor: colors.bg,
    margin: 5,
    marginBottom: 5,
  },
  headerImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default CategoriesScreen;
