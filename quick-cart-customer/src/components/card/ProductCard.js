import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import colors from "../../../theme/colors";
import defaultImage from "../../../assets/defaultCategory.png";
import ProductsApi from "../../../api/product/product";
import { useFocusEffect } from "@react-navigation/native";

function ProductCard({ item, navigateToProductDetails }) {
  const [vendorShopName, setVendorShopName] = useState("Quick-Store");

  const imageSource = item?.images && item?.images[0] ? { uri: item.images[0] } : defaultImage;

  const regularPrice = item.price ? `$${item.price}` : null;
  const discountPrice = item.discountPrice ? `$${item.discountPrice}` : null;

  const priceComponent = discountPrice ? (
    <View style={styles.pricesContainer}>
      <View style={styles.pricesDirection}>
        <Text style={styles.regularPrice}>{regularPrice}</Text>
        <Text style={styles.salePrice}>{discountPrice}</Text>
      </View>
      {item.price && item.discountPrice && (
        <Text style={styles.discount}>
          {(((item.price - item.discountPrice) / item.price) * 100).toFixed(0) + "% OFF"}
        </Text>
      )}
    </View>
  ) : (
    <Text style={styles.productPrice}>{regularPrice}</Text>
  );

  const fetchStoreName = async () => {
    try {
      if (item.storeId) {
        const storeData = (await ProductsApi.getStoreById(item.storeId)).data;   
        setVendorShopName(storeData.businessName || "Quick-Store");
      }
    } catch (error) {
      console.error("Failed to fetch store name:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStoreName();
    }, [item.storeId])
  );

  return (
    <View style={styles.productContainer}>
      <View style={styles.productCard}>
        <TouchableOpacity onPress={() => navigateToProductDetails(item)}>
          <View>
            <Image style={styles.productImage} source={imageSource} />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={{ alignSelf: "flex-start", marginLeft: 10 }}>
              <Text style={{ fontSize: 11, color: "#000", fontWeight: "bold" }}>
                Sold By:{" "}
                <Text style={{ fontSize: 11, color: colors.black, fontWeight: "bold" }}>
                  {vendorShopName}
                </Text>
              </Text>
            </View>
            {priceComponent}
            <AirbnbRating
              defaultRating={item.rating || 0}
              size={15}
              showRating={false}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    marginVertical: 5,
  },
  productCard: {
    width: 160,
    height: 250,
    borderRadius: 16,
    backgroundColor: "white",
    marginLeft: 15,
  },
  productImage: {
    width: "100%",
    height: 130,
    resizeMode: "cover",
    borderRadius: 16,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    height: 35,
    color: colors.black,
    padding: 6,
  },
  pricesContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  pricesDirection: {
    flexDirection: "row",
  },
  productPrice: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  regularPrice: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "line-through",
  },
  salePrice: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "bold",
  },
  discount: {
    fontSize: 13,
    color: "#f00",
    marginLeft: 15,
    fontWeight: "bold",
  },
});

export default ProductCard;
