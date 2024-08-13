import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileSection = ({ user }) => {
  
  const icon = "person-circle";

  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <Ionicons name={icon} size={40} color="#fff" />
      <View>
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold", marginBottom: 5 }}>
          Welcome {user ? user.name : ""}
        </Text>
      </View>
    </View>
  );
};

export default ProfileSection;
