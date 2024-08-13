import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import colors from "../../../theme/colors";
import defaultImage from "../../../assets/defaultCategory.png";

function ProductCard({ item, navigateToProductDetails }) {
  let imageSource = defaultImage;
  if (item?.images && item?.images[0]) {
    imageSource = { uri: item.images[0] };
  }

  const regularPrice = item.price ? `$${item.price}` : null;
  const discountPrice = item.discount_price
    ? `$${item.discount_price}`
    : null;

  const priceComponent = discountPrice ? (
    <View style={styles.pricesContainer}>
      <View style={styles.pricesDirection}>
        <Text style={styles.regularPrice}>{regularPrice}</Text>
        <Text style={styles.salePrice}>{discountPrice}</Text>
      </View>
      {item.price && item.discount_price && (
        <Text style={styles.discount}>
          {(((item.price - item.discount_price) / item.price) * 100).toFixed(
            0
          ) + "% OFF"}
        </Text>
      )}
    </View>
  ) : (
    <Text style={styles.productPrice}>{regularPrice}</Text>
  );

  let vendorShopName = "Swift Store";
  if (item.store) {
    vendorShopName = item.store;
  }

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
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.black,
                    fontWeight: "bold",
                  }}
                >
                  {vendorShopName}
                </Text>
              </Text>
            </View>

            {priceComponent}
            <AirbnbRating
              defaultRating={item.rating}
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
    width: 175,
    height: 270,
    borderRadius: 16,
    backgroundColor: "white",
    marginLeft: 15,
  },
  productImage: {
    width: "100%",
    height: 150,
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
    fontSize: 22,
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
