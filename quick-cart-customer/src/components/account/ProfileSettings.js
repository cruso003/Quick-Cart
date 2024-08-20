import React from "react";
import { View, StyleSheet, Alert, Platform } from "react-native";
import { useAuth } from "../../../context/auth";
import Header from "../checkout/Header";
import ListItem from "../ListItem";
import { MaterialIcons } from "@expo/vector-icons";


const ProfileSettings = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleSelectAddress = () => {
    // Handle logic for selecting delivery address
    console.log("Selecting delivery address");
  };

  const handleChangePassword = () => {
    // Handle logic for changing password
    console.log("Changing password");
  };

  const handleRateApp = () => {
    // Handle logic for rating the app
    console.log("Rating the app");
  };

  const handleSignOut = () => {
    // Handle logic for signing out
    logout();
  };

  return (
    <View style={styles.container}>
      <Header title="Profile Settings" onBackPress={() => navigation.goBack()} />
      {user ? (
        <View style={styles.listContainer}>
          <ListItem
            iconName="location-on"
            iconComponent={MaterialIcons}
            label="Select Delivery Address"
            onPress={handleSelectAddress}
          />
          <ListItem
            iconName="lock"
            iconComponent={MaterialIcons}
            label="Change Password"
            onPress={handleChangePassword}
          />
          <ListItem
            iconName="star"
            iconComponent={MaterialIcons}
            label="Rate the App"
            onPress={handleRateApp}
          />
          <ListItem
            iconName="logout"
            iconComponent={MaterialIcons}
            label="Sign Out"
            onPress={handleSignOut}
          />
        </View>
      ) : (
        Alert.alert(
          "You have to log in to access account settings?",
          "",
          [
            {
              text: "Register",
              onPress: () => {
                navigation.navigate("Register");
              },
            },
            {
              text: "Login",
              onPress: () => {
                navigation.navigate("Login");
              },
            },
          ],
          { cancelable: false }
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40
  },
  listContainer: {
    marginTop: 20,
    flex: 1,
    width: "100%",
  },
});

export default ProfileSettings;
