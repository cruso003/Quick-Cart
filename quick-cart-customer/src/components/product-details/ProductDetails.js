import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomRadioButton from '../CustomRadioButton';

const ProductDetails = ({
  product,
  selectedVariations,
  handleVariationSelect
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product Details</Text>
      <View style={styles.detailRow}>
        <Text style={styles.label}>In Stock:</Text>
        <Text style={styles.value}>{product.stock}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Brand:</Text>
        <Text style={styles.value}>{product.brand ? product.brand : "N/A"}</Text>
      </View>
      {product.variations && product.variations.length > 0 && (
        <View style={styles.variationsContainer}>
          {product.variations.map((variation, index) => (
            <View key={index} style={styles.variationGroup}>
              <Text style={styles.variationName}>{variation.name}:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.optionsRow}>
                  {variation.options.map((option, optionIndex) => (
                    <View key={optionIndex} style={styles.optionContainer}>
                      <CustomRadioButton
                        value={option}
                        selectedValue={selectedVariations[variation.name]}
                        onPress={(value) => handleVariationSelect(variation.name, value)}
                        label={option}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ))}
        </View>
      )}
      <Text style={styles.description}>
        {product.description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  header: {
    fontWeight: "bold",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#f4f4f4",
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#f4f4f4",
  },
  label: {
    width: "50%",
    color: "#939393",
  },
  value: {
    width: "50%",
  },
  variationsContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#f4f4f4",
  },
  variationGroup: {
    marginBottom: 10,
  },
  variationName: {
    fontWeight: "bold",
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  description: {
    paddingVertical: 10,
    color: "#939393",
  },
});

export default ProductDetails;
