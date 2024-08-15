import { Alert } from 'react-native';

export const maskUserName = (userName) => {
    if (userName.length < 3) return userName;
    const firstChar = userName.charAt(0);
    const lastChar = userName.charAt(userName.length - 1);
    return `${firstChar}***${lastChar}`;
};

export const addProductToCart = async ({
    user,
    product,
    selectedVariations,
    shipmentOption,
    deliveryFee,
    selectedPickupStation,
    selectedAddress,
    navigation,
    addToCart,
    setIsInCart
}) => {
    const userId = user && user.user ? user.user.id : null;

    // Check if the delivery method is chosen
    if (!shipmentOption) {
        Alert.alert("Please choose a delivery method.");
        return;
    }

    // Check if variations are chosen
    const allVariationsChosen = product.variations.every(
        (variation) => selectedVariations[variation.name] !== undefined
    );

    if (!allVariationsChosen) {
        Alert.alert("Please choose all variations.");
        return;
    }

    const productId = product.id;

    // Create the cart item
    const cartItem = {
        user: userId ? userId : null,
        product: productId,
        salePrice: product.discountPrice
            ? product.discountPrice
            : product.price,
        selectedVariations,
        shipmentOption,
        deliveryFee,
        selectedPickupStation,
        selectedAddress,
    };

    Alert.alert(
        "Product added to cart, do you want to proceed to the cart?",
        "",
        [
            {
                text: "No, keep shopping",
                onPress: () => navigation.goBack(),
                style: "cancel",
            },
            {
                text: "Yes",
                onPress: async () => {
                    navigation.navigate("Cart");
                },
            },
        ],
        { cancelable: false }
    );

    addToCart(cartItem);
    setIsInCart(true);
};

export const addProductToWishlist = ({
    isInWishlist,
    product,
    addToWishlist,
    setIsInWishlist,
    navigation
}) => {
    if (!isInWishlist) {
        addToWishlist(product);
        setIsInWishlist(true);
        Alert.alert(
            "Product added to Wishlist, do you want to switch to your wishlist?",
            "",
            [
                {
                    text: "No, keep shopping",
                    onPress: () => navigation.goBack(),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => {
                        navigation.navigate("Wishlist");
                    },
                },
            ],
            { cancelable: false }
        );
    }
};

