import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import HomeStack from "./navigation/stackNavigation/HomeStack";
import { DeliveryAddressProvider } from "./context/DeliveryAddress";
import { AuthProvider } from "./context/auth";
import { CartProvider } from "./context/cart";
import { WishlistProvider } from "./context/wishlist";

export default function App() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setInitializing(false);
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <DeliveryAddressProvider>
            <HomeStack />
          </DeliveryAddressProvider>
          </WishlistProvider>
          </CartProvider>
      </AuthProvider>    
    </NavigationContainer>
  );
}
