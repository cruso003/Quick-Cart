import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../screens/products/styles';

const ProductInfo = ({ name, condition }) => (
  <View style={{ paddingHorizontal: 15, paddingVertical: 10, marginBottom: 10, backgroundColor: "#fff" }}>
    <Text style={{ fontSize: 16, marginBottom: 15 }}>{name}</Text>
    <View style={styles.vendorLabel}>
      <Text style={{ fontSize: 14, color: "#999" }}>
        Condition: <Text style={styles.vendorName}>{condition}</Text>
      </Text>
    </View>
  </View>
);

export default ProductInfo;
