import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableNativeFeedback,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  FontAwesome5,
  FontAwesome,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import TouchablePlatformSpecific from "../../components/TouchablePlatformSpecific";
import IconBadge from "../../components/IconBadge";
import NavigationButton from "../../components/NavigationButton";
import ProfileSection from "../../components/ProfileSection";
import colors from "../../../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "../../components/ListItem";
import { useCart } from "../../../context/cart";

function Account() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const { cart } = useCart();
  const [cartLength, setCartLength] = useState(0);

  const getData = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [getData])
  );

  useEffect(() => {
    if (cart) {
      setCartLength(cart.length);
    }
  }, [cart]);

  const handleLoginOrLogout = async () => {
    if (user) {
      // Log out the user
      await AsyncStorage.removeItem("userData");

      {/* Update the state to reflect that the user has logged out*/}
      setUser(null);
      navigation.navigate("Login");
    } else {
      // Navigate to login screen
      navigation.navigate("Login");
    }
  };

  const handleMessageOpen = () => {
    if (user) {
      navigation.navigate("Messages");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f6f6f6",
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40
      }}
    >
      {/*Header Section*/}

      <View style={{ height: 60, backgroundColor: colors.danger }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/*Render Profile Section*/}
          <ProfileSection user={user} />

          <View style={{ flexDirection: "row" }}>
            <TouchablePlatformSpecific
              onPress={() => navigation.navigate("Cart")}
              style={[styles.centerElement, { width: 50, height: 50 }]}
            >
              <IconBadge
               IconComponent={MaterialIcons}
               name="shopping-cart-checkout"
                size={28}
                color="#fff"
                badgeCount={cartLength}
                badgeColor={colors.primary}
              />
            </TouchablePlatformSpecific>
            <TouchablePlatformSpecific
              onPress={handleMessageOpen}
              style={[styles.centerElement, { width: 50, height: 50 }]}
            >
              <IconBadge
                IconComponent={Ionicons}
                name="chatbubbles"
                size={28}
                color="#fff"
                badgeCount={8}
                badgeColor={colors.primary}
              />
            </TouchablePlatformSpecific>
          </View>
        </View>
      </View>

      <ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", alignItems: 'center' }}>
          <View style={[styles.centerElement, { height: 40, flexDirection: "row", paddingHorizontal: 15 }]}>
            <FontAwesome5 name="clipboard-list" size={20} color="#1b59ab" />
            <Text style={{ fontSize: 15, color: "#282828", marginLeft: 10 }}>My Purchases</Text>
          </View>
          <NavigationButton
            title="View Purchase History"
            onPress={() => {}}
            iconName="arrowright"
            iconColor="#717171"
            textStyle={{ color: "#717171" }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: "#fff",
            height: 100,
            borderColor: "#f6f6f6",
            borderWidth: 1,
            alignItems: 'center'
          }}
        >
          {/*Items pending Payment */}
          <TouchablePlatformSpecific
            //onPress={() => (cartLength > 0 ? navigation.navigate("Cart") : {})}
            background={TouchableNativeFeedback.Ripple("#888", true)}
            useForeground={true}
          >
            <View pointerEvents="box-only" style={[styles.centerElement, {}]}>
              <IconBadge
                IconComponent={MaterialIcons}
                name="payment"
                size={35}
                color="#7f7f7f"
                badgeCount={1}
              />
              <Text style={{ fontSize: 12, color: "#7f7f7f", marginTop: 8 }}>To Pay</Text>
            </View>
          </TouchablePlatformSpecific>
          {/*Items pending Delivery */}
          <TouchablePlatformSpecific
            // onPress={() => user ? navigation.navigate("Pending", user._id) : {}}
            background={TouchableNativeFeedback.Ripple("#888", true)}
            useForeground={true}
          >
            <View pointerEvents="box-only" style={[styles.centerElement, {}]}>
              <IconBadge
                IconComponent={MaterialIcons}
                name="local-shipping"
                size={35}
                color="#7f7f7f"
                badgeCount={5}
              />
              <Text style={{ fontSize: 12, color: "#7f7f7f", marginTop: 8 }}>To Ship</Text>
            </View>
          </TouchablePlatformSpecific>
          {/*Items Shipped */}
          <TouchablePlatformSpecific
            //onPress={() => user ? navigation.navigate("Shipped", user._id) : {}}
            background={TouchableNativeFeedback.Ripple("#888", true)}
            useForeground={true}
          >
            <View pointerEvents="box-only" style={[styles.centerElement, {}]}>
              <IconBadge
                IconComponent={AntDesign}
                name="inbox"
                size={35}
                color="#7f7f7f"
                badgeCount={0}
              />
              <Text style={{ fontSize: 12, color: "#7f7f7f", marginTop: 8 }}>To Receive</Text>
            </View>
          </TouchablePlatformSpecific>
          {/*Items pending Review */}
          <TouchablePlatformSpecific
            //onPress={() => user ? navigation.navigate("Transactions", user._id) : {}}
            background={TouchableNativeFeedback.Ripple("#888", true)}
            useForeground={true}
          >
            <View pointerEvents="box-only" style={[styles.centerElement, {}]}>
              <IconBadge
                IconComponent={MaterialCommunityIcons}
                name="file-document-outline"
                size={35}
                color="#7f7f7f"
                badgeCount={0}
              />
              <Text style={{ fontSize: 12, color: "#7f7f7f", marginTop: 8 }}>To Review</Text>
            </View>
          </TouchablePlatformSpecific>
          {/*Items completed */}
          <TouchablePlatformSpecific
            //onPress={() => user ? navigation.navigate("Transactions", user._id) : {}}
            background={TouchableNativeFeedback.Ripple("#888", true)}
            useForeground={true}
          >
            <View pointerEvents="box-only" style={[styles.centerElement, {}]}>
              <IconBadge
                IconComponent={Feather}
                name="shopping-bag"
                size={35}
                color="#7f7f7f"
                badgeCount={0}
              />
              <Text style={{ fontSize: 12, color: "#7f7f7f", marginTop: 8 }}>Completed</Text>
            </View>
          </TouchablePlatformSpecific>
        </View>

        {/* List Sections */}
        <View style={{ backgroundColor: "#f6f6f6", paddingHorizontal: 16 }}>
         {/* Using ListItem Component */}
          <ListItem
            iconName="payment"
            iconComponent={MaterialIcons}
            label="My Wallet"
            onPress={() => navigation.navigate("Wallet")}
          />
          <ListItem
            iconName="favorite-border"
            iconComponent={MaterialIcons}
            label="My Wishlist"
            onPress={() => navigation.navigate("Wishlist")}
          />
          <ListItem
            iconName="gear"
            iconComponent={FontAwesome}
            label="Profile Settings"
            onPress={() => navigation.navigate("ProfileSettings")}
          />
          <ListItem
            iconName="help-with-circle"
            iconComponent={Entypo}
            label="Help Center"
            onPress={() => navigation.navigate("Help")}
          />
          <ListItem
            iconName={user ? "logout" : "login"}
            iconComponent={AntDesign}
            label={user ? "Logout" : "Login"}
            onPress={handleLoginOrLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerElement: { justifyContent: "center", alignItems: "center" },
  boldText: {
    fontSize: 16,
    color: "#282828",
  },
});

export default Account;
