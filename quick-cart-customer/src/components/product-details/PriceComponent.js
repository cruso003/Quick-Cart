import React from "react";
import { View, Text } from "react-native";
import styles from "../../screens/products/styles";

const PriceComponent = ({ regularPrice, discountPrice }) => {
  if (discountPrice) {
    return (
      <View style={styles.pricesContainer}>
        <View style={styles.pricesDirection}>
          <Text style={styles.regularPrice}>{regularPrice}</Text>
          <Text style={styles.salePrice}>{discountPrice}</Text>
        </View>
        {regularPrice && discountPrice && (
          <Text style={styles.discount}>
            {(((regularPrice - discountPrice) / regularPrice) * 100).toFixed(0) +
              "% OFF"}
          </Text>
        )}
      </View>
    );
  }
  return <Text style={styles.productPrice}>{regularPrice}</Text>;
};

export default PriceComponent;
