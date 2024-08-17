import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import colors from "../../theme/colors";

function Header({ title, cartLength, onBack, onCart, onShare, onMore }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.centerElement, { width: 50, height: 50 }]}
        onPress={onBack}
      >
        <MaterialIcons name="arrow-back" size={25} color={colors.white}/>
      </TouchableOpacity>
      <View style={{ flexGrow: 1, flexShrink: 1, alignSelf: "center" }}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 20, color: colors.white, fontWeight: "bold" }}
        >
          {title}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.centerElement, { width: 50, height: 50 }]}
        onPress={onShare}
      >
        <Feather name="share" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.centerElement, { width: 50, height: 50 }]}
        onPress={onCart}
      >
        <MaterialIcons name="shopping-cart-checkout" size={28} color="#fff" />
        <View
          style={[
            styles.centerElement,
            {
              width: 18,
              height: 18,
              position: "absolute",
              right: 5,
              top: 5,
              backgroundColor:
                cartLength > 0 ? colors.primary : "transparent",
              borderRadius: 9,
            },
          ]}
        >
          {cartLength > 0 && (
            <Text style={{ fontSize: 10, color: "white" }}>{cartLength}</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.centerElement, { width: 50, height: 50 }]}
        onPress={onMore}
      >
        <Feather name="more-vertical" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: colors.danger,
  },
  centerElement: { justifyContent: "center", alignItems: "center" },
});

export default Header;