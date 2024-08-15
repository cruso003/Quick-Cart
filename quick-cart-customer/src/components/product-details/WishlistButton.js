import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const WishlistButton = ({ isInWishlist, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <AntDesign
        name={isInWishlist ? "heart" : "hearto"}
        size={24}
        color={isInWishlist ? "red" : "black"}
      />
      <Text style={styles.text}>
        {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
});

export default WishlistButton;