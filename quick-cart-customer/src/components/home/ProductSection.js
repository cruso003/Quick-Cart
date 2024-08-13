import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProductSection = ({ title, component: Component }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Component />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default ProductSection;
