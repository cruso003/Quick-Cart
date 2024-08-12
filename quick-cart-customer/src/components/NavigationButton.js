import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const NavigationButton = ({ title, onPress, iconName, iconColor, buttonStyle, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={[{ marginRight: 10 }, textStyle]}>{title}</Text>
        <AntDesign name={iconName} size={12} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

export default NavigationButton;
