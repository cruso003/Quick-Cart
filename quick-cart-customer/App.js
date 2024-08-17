import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import HomeStack from "./navigation/stackNavigation/HomeStack";
import { DeliveryAddressProvider } from "./context/DeliveryAddress";
import { AuthProvider } from "./context/auth";
import { CartProvider } from "./context/cart";
import { WishlistProvider } from "./context/wishlist";
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const STRIPE_KEY = "pk_test_51KDsVdHjllFf5pa1Ir48dU2N3rquvHyMJyL6dT86biDxww7ko7WW9k9FGPHng97PnqSW3PQ83hoIaiisOBIN5ODp001LF3F78E";

  useEffect(() => {
    setInitializing(false);
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <AuthProvider>
      <StripeProvider publishableKey={STRIPE_KEY}>
      <CartProvider>
        <WishlistProvider>
          <DeliveryAddressProvider>
            <HomeStack />
          </DeliveryAddressProvider>
          </WishlistProvider>
          </CartProvider>
          </StripeProvider>
      </AuthProvider>    
    </NavigationContainer>
  );
}
