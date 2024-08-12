import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "../tabBar/BottomTab";

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
