import React from "react";
import { View, Text } from "react-native";

const IconBadge = ({ IconComponent, name, size, color, badgeCount, badgeColor }) => {
  return (
    <View>
      <IconComponent name={name} size={size} color={color} />
      {badgeCount > 0 && (
        <View
          style={{
            width: 18,
            height: 18,
            position: "absolute",
            right: -5,
            top: 0,
            backgroundColor: badgeColor || "red",
            borderWidth: 1,
            borderColor: "#fff",
            borderRadius: 9,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 10, color: "white" }}>{badgeCount}</Text>
        </View>
      )}
    </View>
  );
};

export default IconBadge;
