import React from "react";
import { StyleSheet, Platform, Text, View, ScrollView, SafeAreaView, StatusBar, TouchableNativeFeedback } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons, AntDesign, Feather, FontAwesome5, FontAwesome, Ionicons } from "@expo/vector-icons";
import TouchablePlatformSpecific from "../../components/TouchablePlatformSpecific";
import IconBadge from "../../components/IconBadge";
import NavigationButton from "../../components/NavigationButton";
import ProfileSection from "../../components/ProfileSection";
import colors from "../../../theme/colors";

function Account() {
  const navigation = useNavigation();

  const handleLoginOrLogout = () => {
    navigation.navigate("Login");
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
        marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
      }}
    >
      {/*Header Section*/}

      <View style={{height:60, backgroundColor: colors.danger}} >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

          {/*Render Profile Section*/}
         <ProfileSection />

          <View style={{ flexDirection: "row" }}>
            <TouchablePlatformSpecific
              onPress={() => navigation.navigate("Cart")}
              style={[styles.centerElement, { width: 50, height: 50 }]}
            >
              <MaterialIcons name="shopping-cart-checkout" size={28} color="#fff" />
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
                badgeColor="red"
              />
            </TouchablePlatformSpecific>
          </View>
        </View>     
      </View>

      <ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff" }}>
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

        <View style={{ flexDirection: "row", justifyContent: "space-around", backgroundColor: "#fff", height: 100, borderColor: "#f6f6f6", borderWidth: 1 }}>
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
        <View style={{ backgroundColor: "#f6f6f6", paddingHorizontal: 16 }}>
          {/*User Wallet */}
          <TouchablePlatformSpecific
            //onPress={() => navigation.navigate("Profile")}
            background={TouchableNativeFeedback.Ripple("#ccc", false)}
            useForeground={true}
          >
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderColor: "#f6f6f6",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="payment" size={22} color={colors.primaryColor} />
              <Text style={[styles.boldText, { marginLeft: 16 }]}>My Wallet</Text>
            </View>
          </TouchablePlatformSpecific>

          {/*User Wishlist */}
          <TouchablePlatformSpecific
            //onPress={() => navigation.navigate("Wishlist")}
            background={TouchableNativeFeedback.Ripple("#ccc", false)}
            useForeground={true}
          >
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderColor: "#f6f6f6",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="favorite-border" size={22} color={colors.primaryColor} />
              <Text style={[styles.boldText, { marginLeft: 16 }]}>Wishlist</Text>
            </View>
          </TouchablePlatformSpecific>
          {/* Help */}
          <TouchablePlatformSpecific
            //onPress={() => navigation.navigate("AddressBook")}
            background={TouchableNativeFeedback.Ripple("#ccc", false)}
            useForeground={true}
          >
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderColor: "#f6f6f6",
                alignItems: "center",
              }}
            >
              <AntDesign name="questioncircleo" size={22} color={colors.primaryColor} />
              <Text style={[styles.boldText, { marginLeft: 16 }]}>Help</Text>
            </View>
          </TouchablePlatformSpecific>
          <TouchablePlatformSpecific
            //onPress={() => navigation.navigate("Settings")}
            background={TouchableNativeFeedback.Ripple("#ccc", false)}
            useForeground={true}
          >
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderColor: "#f6f6f6",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="settings" size={22} color={colors.primaryColor} />
              <Text style={[styles.boldText, { marginLeft: 16 }]}>Account Settings</Text>
            </View>
          </TouchablePlatformSpecific>
          <TouchablePlatformSpecific
            onPress={handleLoginOrLogout}
            background={TouchableNativeFeedback.Ripple("#ccc", false)}
            useForeground={true}
          >
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderColor: "#f6f6f6",
                alignItems: "center",
              }}
            >
              <AntDesign name="login" size={22} color={colors.primaryColor} />
              <Text style={[styles.boldText, { marginLeft: 16 }]}>Login</Text>
            </View>
          </TouchablePlatformSpecific>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontSize: 15,
    color: "#282828",
  },
  centerElement: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Account;
