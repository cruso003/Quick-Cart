import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import colors from '../../../theme/colors';

const PriceRating = ({ priceComponent, rating }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.productPrice}>{priceComponent}</Text>
      <View style={styles.airbnbRatingContainer}>
        <Text style={styles.vendorLabel}>Overall Rating:</Text>
        <AirbnbRating
          defaultRating={rating || 0}
          size={15}
          showRating={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productPrice: {
    color: "#d7263c",
    fontSize: 18,
    fontWeight: "bold",
  },
  airbnbRatingContainer: {
    marginBottom: 20,
  },
  vendorLabel: {
    fontSize: 16,
    color: colors.dark,
    marginRight: 5,
  },
});

export default PriceRating;