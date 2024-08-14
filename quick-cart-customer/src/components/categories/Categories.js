import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableNativeFeedback,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import categoryApi from "../../../api/category/category";
import colors from "../../../theme/colors";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={[styles.centerElement, { height: 20 }]}>
          <ActivityIndicator size="large" color="#ef5739" />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <View style={styles.categoryContainer}>
              <TouchableNativeFeedback
                onPress={() => {
                  navigation.navigate("CategorySingle", {
                    categoryName: item.name,
                  });
                }}
              >
                <View style={styles.categoryCard}>
                  <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.categoryImage}
                    imageStyle={styles.imageStyle}
                  >
                    <View style={styles.overlay}>
                      <Text style={styles.categoryName}>{item.name}</Text>
                    </View>
                  </ImageBackground>
                </View>
              </TouchableNativeFeedback>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 5,
    backgroundColor: colors.bg,
  },
  categoryCard: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.border,
    marginRight: 10,
    overflow: 'hidden',
  },
  categoryImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 8,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    alignItems: 'center',
  },
  categoryName: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerElement: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Categories;
