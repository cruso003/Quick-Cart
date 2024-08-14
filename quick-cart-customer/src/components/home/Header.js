import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

const Header = ({ navigation, cartLength, handleMessageOpen }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        elevation: 10,
        backgroundColor: colors.danger
      }}
    >
      <View
        style={{
          flexGrow: 1,
          height: 50,
          justifyContent: "center",
          paddingLeft: 10,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Search")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#ffffff",
              height: 35,
              borderWidth: 1,
              borderColor: "#cccccc",
              borderRadius: 4,
            }}
          >
            <MaterialCommunityIcons
              name="store-search"
              size={20}
              color="#000000"
              style={{
                marginHorizontal: 10,
              }}
            />
            <Text
              style={{
                backgroundColor: "#fff",
                color: "#ccc",
              }}
            >
              Search
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <TouchableOpacity
        style={[styles.centerElement, { width: 50, height: 50 }]}
        onPress={() => navigation.navigate("Cart")}
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
                cartLength > 0 ? colors.secondary : "transparent",
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
        onPress={handleMessageOpen}
      >
        <Ionicons name="chatbubbles" size={28} color="#fff" />
        <View
          style={[
            styles.centerElement,
            {
              width: 18,
              height: 18,
              position: "absolute",
              right: 5,
              top: 5,
              backgroundColor: "red",
              borderWidth: 1,
              borderColor: "#fff",
              borderRadius: 9,
            },
          ]}
        >
          <Text style={{ fontSize: 9, color: "#ffffff" }}>8</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  centerElement: { justifyContent: "center", alignItems: "center" },
});
