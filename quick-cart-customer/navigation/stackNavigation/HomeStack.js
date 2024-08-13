import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTab from "../tabBar/BottomTab";
import { LoginScreen, RegisterScreen } from "../../src/screens/auth/index.js";
import { ForgotPassword, VerifyOtp } from "../../src/screens/user/index";

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
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
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
