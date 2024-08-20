import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { styles } from '../../screens/checkout/styles';

const CartItem = ({ item }) => (
    <View style={styles.map}>
      <View style={styles.mapInner}>
        <TouchableOpacity style={{ paddingRight: 10 }}>
          <Image
            source={{ uri: item.product.images[0] }}
            style={[styles.centerElement, styles.productImage]}
          />
        </TouchableOpacity>
        <View style={styles.productName}>
          <Text numberOfLines={1} style={{ fontSize: 15 }}>
            {item.product.name}
          </Text>
          {item.selectedVariations && (
            <Text style={{ color: "#8f8f8f", marginBottom: 10 }}>
              Variation:{" "}
              {Object.entries(item.selectedVariations)
                .map(([variation, value]) => `${variation}: ${value}`)
                .join(", ")}
            </Text>
          )}
        </View>
      </View>
      <View style={[styles.centerElement, { width: 60 }]}>
        <Text style={{ color: "#333333" }}>Qty. {item.quantity}</Text>
      </View>
      <View style={[styles.centerElement, { width: 60 }]}>
        <Text style={{ color: "#333333" }}>
          ${item.discountPrice ? item.quantity * item.discountPrice : item.quantity * item.amount}
        </Text>
      </View>
    </View>
  );
  

export default CartItem