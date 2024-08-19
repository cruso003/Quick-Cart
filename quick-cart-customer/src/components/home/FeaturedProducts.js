import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Button,
  Platform,
  StyleSheet,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import useApi from "../../hooks/useApi";
import ProductsApi from "../../../api/product/product";

function FeaturedCollection({ navigation }) {
  const getListingsApi = useApi(ProductsApi.getProducts);
  const [featuredCollections, setFeaturedCollections] = useState([]);

  useEffect(() => {
    getListingsApi.request();
  }, []);

  useEffect(() => {
    if (getListingsApi.data) {
      const filteredListings = getListingsApi.data.filter(
        (item) => item.featured === true
      );

      setFeaturedCollections(filteredListings);
    }
  }, [getListingsApi.data]);
  const styles = StyleSheet.create({
    centerElement: { justifyContent: "center", alignItems: "center" },
  });
  let TouchablePlatformSpecific =
    Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

  const navigateToProductDetails = (product) => {
    const modifiedProduct = {
      ...product,
    };
    navigation.navigate("ProductDetails", {
      product: modifiedProduct,
    });
  };

  return (
    <View>
      <View
        style={{
          marginTop: 5,
          marginHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          FEATURED COLLECTIONS
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AllFeatured", { featuredCollections })
          }
        >
          <Text style={{ alignSelf: "center", fontSize: 12 }}>
            See More <AntDesign name="arrowright" size={12} color="#000000" />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 5, marginHorizontal: 10 }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row" }}>
            {featuredCollections &&
              featuredCollections.map((item, i) => (
                <TouchableNativeFeedback
                  key={i}
                  onPress={() => navigateToProductDetails(item)}
                  background={TouchableNativeFeedback.Ripple("#888", false)}
                  useForeground={true}
                >
                  <View
                    pointerEvents="box-only"
                    style={{
                      width: 250,
                      height: 170,
                      backgroundColor: "#fff",
                      marginRight: 5,
                    }}
                  >
                    <View style={{ flexDirection: "row", margin: 5 }}>
                      <Image
                        source={{ uri: item.images[0] }}
                        style={{
                          height: 115,
                          backgroundColor: "#eeeeee",
                          width: "60%",
                        }}
                      />
                      <View style={{ width: "40%" }}>
                        <Image
                          source={{
                            uri: item.images[1] && item.images[1],
                          }}
                          style={{
                            height: 55,
                            backgroundColor: "#eeeeee",
                            marginLeft: 5,
                            marginBottom: 5,
                          }}
                        />
                        <Image
                          source={{
                            uri: item.images[2] && item.images[2],
                          }}
                          style={{
                            height: 55,
                            backgroundColor: "#eeeeee",
                            marginLeft: 5,
                          }}
                        />
                      </View>
                    </View>
                    <View style={{ marginHorizontal: 5 }}>
                      <Text numberOfLines={1} style={{ width: 240 }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: "grey" }}>
                        {item.totalSale ? item.totalSale : 0}+ Sold
                      </Text>
                    </View>
                  </View>
                </TouchableNativeFeedback>
              ))}
            <TouchablePlatformSpecific
              onPress={() =>
                navigation.navigate("AllFeatured", { featuredCollections })
              }
              background={TouchableNativeFeedback.Ripple("#888", false)}
              useForeground={true}
            >
              <View
                pointerEvents="box-only"
                style={[
                  styles.centerElement,
                  { height: 170, width: 150, backgroundColor: "#dddddd" },
                ]}
              >
                <Entypo
                  name="arrow-with-circle-right"
                  size={40}
                  color="#000000"
                />
                <Text style={{ fontSize: 16 }}>View All</Text>
              </View>
            </TouchablePlatformSpecific>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default FeaturedCollection;
