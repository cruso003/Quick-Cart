import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Other imports...
import BottomTab from "../tabBar/BottomTab";
import { LoginScreen } from "../../src/screens/auth/index.js";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      {/* HomeStack */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="HomeScreen"
          component={BottomTab}
        />
      </Stack.Group>

      {/* CategoryStack */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Categories"
          component={BottomTab}
        />
      </Stack.Group>

      {/* AccountStack */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="AccountScreen"
          component={BottomTab}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Group>

      {/* NotificationStack */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="NotificationsScreen"
          component={BottomTab}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
