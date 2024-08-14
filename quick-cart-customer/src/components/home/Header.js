import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

const Header = ({ title, cartLength, navigation }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={25} color="#000" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Feather name="share" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Cart")}>
        <MaterialIcons name="shopping-cart-checkout" size={28} color="#fff" />
        {cartLength > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.badgeText}>{cartLength}</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Feather name="more-vertical" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: "grey",
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  cartBadge: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: "red",
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    color: "white",
  },
});

export default Header;
