import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../../screens/products/styles';

const ProductDetailsHeader = ({ store, isInWishlist, addProductToWishlist }) => (
  <View style={styles.detailsContainer}>
    <View style={{
      flexDirection: "row",
      alignItems: "start",
      justifyContent: "space-between",
      marginBottom: 5,
    }}>
      <View style={styles.vendorContainer}>
        {store && (
          <View style={styles.vendorLabel}>
            <Text style={{ fontSize: 14, color: "#999" }}>
              Sold By:{" "}
              <Text style={styles.vendorName}>{store}</Text>
            </Text>
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={addProductToWishlist}
        >
          <AntDesign
            name={isInWishlist ? "heart" : "hearto"}
            size={24}
            color={isInWishlist ? "red" : "black"}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: "#000" }}>
          {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </Text>
      </View>
    </View>
  </View>
);

export default ProductDetailsHeader;
