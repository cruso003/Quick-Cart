import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from "./navigation/stackNavigation/HomeStack";

export default function App() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setInitializing(false);
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}
