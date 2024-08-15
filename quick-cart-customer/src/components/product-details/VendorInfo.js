import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../screens/products/styles';

const VendorInfo = ({ store }) => {
  if (!store) return null;

  return (
    <View style={styles.vendorContainer}>
      <View style={styles.vendorLabel}>
        <Text style={styles.vendorText}>
          Sold By: <Text style={styles.vendorName}>{store}</Text>
        </Text>
      </View>
    </View>
  );
};


export default VendorInfo;