import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity,
    View, StatusBar, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";
import colors from "../../../theme/colors";

const CartPage = ({ navigation }) => {
    const { user } = useAuth();
    const { cart, allItemsChecked, selectHandler, selectHandlerAll, deleteHandler,
        quantityHandler, subtotalPrice, loading } = useCart();

    const handleCheckout = () => {
        if (user) {
            const checkedItems = cart.filter((item) => item.checked);

            if (checkedItems.length > 0) {
                navigation.navigate("Checkout", {
                    cartItems: checkedItems,
                    subtotal: subtotalPrice(checkedItems),
                });
            } else {
                console.log("No items are checked. Cannot proceed to checkout.");
            }
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
            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: colors.danger,
                    marginBottom: 10,
                }}
            >
                <TouchableOpacity
                    style={[styles.centerElement, { width: 50, height: 50 }]}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={25} color={colors.white} />
                </TouchableOpacity>
                <View style={[styles.centerElement, { height: 50 }]}>
                    <Text style={{ fontSize: 18, color: colors.white }}>Cart</Text>
                </View>
            </View>

            {loading ? (
                <View style={[styles.centerElement, { height: 10 }]}>
                    <ActivityIndicator size="large" color="#ef5739" />
                </View>
            ) : (
                <ScrollView>
                    {cart && cart.length > 0 ? (
                        cart.map((item, i) => {

                            return (
                                <View
                                    key={i}
                                    style={{
                                        flexDirection: "row",
                                        backgroundColor: "#fff",
                                        marginBottom: 2,
                                        height: 120,
                                    }}
                                >
                                    <View style={[styles.centerElement, { width: 60 }]}>
                                        <TouchableOpacity
                                            style={[styles.centerElement, { width: 32, height: 32 }]}
                                            onPress={() => selectHandler(i, item.checked)}
                                        >
                                            <Ionicons
                                                name={
                                                    item.checked
                                                        ? "checkmark-circle"
                                                        : "checkmark-circle-outline"
                                                }
                                                size={25}
                                                color={item.checked ? "#0faf9a" : "#aaaaaa"}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            flexGrow: 1,
                                            flexShrink: 1,
                                            alignSelf: "center",
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                navigation.navigate("ProductDetails", {
                                                    productDetails: item,
                                                });
                                            }}
                                            style={{ paddingRight: 10 }}
                                        >
                                            <Image
                                                source={{ uri: item.product?.images?.[0] || 'default_image_url' }}
                                                style={[
                                                    styles.centerElement,
                                                    { height: 60, width: 60, backgroundColor: "#eeeeee" },
                                                ]}
                                            />
                                        </TouchableOpacity>
                                        <View
                                            style={{
                                                flexGrow: 1,
                                                flexShrink: 1,
                                                alignSelf: "center",
                                            }}
                                        >
                                            <Text numberOfLines={1} style={{ fontSize: 15 }}>
                                                {item.product?.name || 'Product Name'}
                                            </Text>
                                            {item.selectedVariations && (
                                                <Text style={{ color: "#333333", marginBottom: 10 }}>
                                                    Variation:{" "}
                                                    {Object.entries(item.selectedVariations)
                                                        .map(([variation, value]) => `${variation}: ${value}`)
                                                        .join(", ")}
                                                </Text>
                                            )}
                                            <Text
                                                numberOfLines={1}
                                                style={{ color: "#333333", marginBottom: 10 }}
                                            >
                                                $
                                                {item.discountPrice
                                                    ? item.quantity * item.discountPrice
                                                    : item.quantity * item.amount}
                                            </Text>
                                            <View style={{ flexDirection: "row" }}>
                                                <TouchableOpacity
                                                    onPress={() => quantityHandler("less", i)}
                                                    style={{ borderWidth: 1, borderColor: "#cccccc" }}
                                                >
                                                    <MaterialIcons
                                                        name="remove"
                                                        size={22}
                                                        color="#cccccc"
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        borderTopWidth: 1,
                                                        borderBottomWidth: 1,
                                                        borderColor: "#cccccc",
                                                        paddingHorizontal: 7,
                                                        paddingTop: 3,
                                                        color: "#bbbbbb",
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {item.quantity}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => quantityHandler("more", i)}
                                                    style={{ borderWidth: 1, borderColor: "#cccccc" }}
                                                >
                                                    <MaterialIcons name="add" size={22} color="#cccccc" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[styles.centerElement, { width: 60 }]}>
                                        <TouchableOpacity
                                            style={[styles.centerElement, { width: 32, height: 32 }]}
                                            onPress={() => deleteHandler(i)}
                                        >
                                            <Ionicons name="trash" size={25} color="#ee4d2d" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View style={[styles.centerElement, { marginTop: 20 }]}>
                            <Text>Your cart is empty.</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            {!loading && (
                <View
                    style={{
                        backgroundColor: "#fff",
                        borderTopWidth: 2,
                        borderColor: "#f6f6f6",
                        paddingVertical: 5,
                    }}
                >
                    <View style={{ flexDirection: "row" }}>
                        <View style={[styles.centerElement, { width: 60 }]}>
                            <View style={[styles.centerElement, { width: 32, height: 32 }]}>
                                <MaterialCommunityIcons
                                    name="ticket"
                                    size={25}
                                    color="#f0ac12"
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                flexGrow: 1,
                                flexShrink: 1,
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text>Voucher</Text>
                            <View style={{ paddingRight: 20 }}>
                                <TextInput
                                    style={{
                                        paddingHorizontal: 10,
                                        backgroundColor: "#f0f0f0",
                                        height: 25,
                                        borderRadius: 4,
                                    }}
                                    placeholder="Enter voucher code"
                                    value={""}
                                    onChangeText={(searchKeyword) => { }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={[styles.centerElement, { width: 60 }]}>
                            <TouchableOpacity
                                style={[styles.centerElement, { width: 32, height: 32 }]}
                                onPress={() => selectHandlerAll(allItemsChecked)}
                            >
                                <Ionicons
                                    name={
                                        allItemsChecked
                                            ? "checkmark-circle"
                                            : "checkmark-circle-outline"
                                    }
                                    size={25}
                                    color={allItemsChecked ? "#0faf9a" : "#aaaaaa"}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                flexGrow: 1,
                                flexShrink: 1,
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text>Select All</Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    paddingRight: 20,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: "#8f8f8f" }}>SubTotal: </Text>
                                <Text>${subtotalPrice().toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            height: 32,
                            paddingRight: 20,
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                styles.centerElement,
                                {
                                    backgroundColor: colors.primary,
                                    width: 125,
                                    height: 35,
                                    borderRadius: 5,
                                },
                            ]}
                            onPress={handleCheckout}
                        >
                            <Text style={{ color: "#ffffff" }}>
                                {user ? "Checkout" : "Login to Checkout"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    centerElement: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export default CartPage;
