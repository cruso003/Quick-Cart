import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../screens/products/styles';

const ProductActions = ({
  inStock,
  isInCart,
  addProductToCart,
  handleSendMessage,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.store}>
        <TouchableOpacity
          style={styles.storeButton}
          onPress={() => {}}
        >
          <FontAwesome5 name="store" size={35} color="#000" />
          <Text style={styles.storeText}>Visit Store</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={[
            styles.button,
            !inStock && styles.buttonDisabled,
            isInCart && { backgroundColor: "#ccc" },
          ]}
          disabled={!inStock || isInCart}
          onPress={inStock && !isInCart ? addProductToCart : undefined}
        >
          <Text style={styles.buttonText}>
            {isInCart
              ? "Already In Cart"
              : inStock
              ? "Add to Cart"
              : "Out of stock"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messageButton}>
        <TouchableOpacity
          style={styles.messageButtonContent}
          onPress={handleSendMessage}
        >
          <Ionicons name="chatbubbles" size={35} color="black" />
          <Text style={styles.messageText}>Message Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



export default ProductActions;
