import React from 'react';
import { View, Text } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import styles from '../../screens/products/styles';

const ProductRating = ({ rating }) => (
  <View style={{ marginBottom: 10 }}>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={styles.productPrice}>Price: ${rating.price}</Text>
      <View style={styles.airbnbRatingContainer}>
        <Text style={styles.vendorLabel}>Overall Rating:</Text>
        <AirbnbRating
          defaultRating={rating.value}
          size={15}
          showRating={false}
        />
      </View>
    </View>
  </View>
);

export default ProductRating;
