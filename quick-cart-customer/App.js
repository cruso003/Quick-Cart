import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from "./navigation/stackNavigation/HomeStack";
import { DeliveryAddressProvider } from "./context/DeliveryAddress";
import { AuthProvider } from "./context/auth";

export default function App() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setInitializing(false);
  }, []);

  if (initializing) return null;

  return (
    <AuthProvider>
    <NavigationContainer>
      <DeliveryAddressProvider>
      <HomeStack />
      </DeliveryAddressProvider>
    </NavigationContainer>
    </AuthProvider>
  );
}
