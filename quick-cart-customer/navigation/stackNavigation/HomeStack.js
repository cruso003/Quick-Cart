import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "../tabBar/BottomTab";
import { LoginScreen, RegisterScreen } from "../../src/screens/auth/index.js";
import { ForgotPassword, VerifyOtp } from "../../src/screens/user/index";
import SingleCategory from "../../src/screens/categories/SingleCategory.js";
import BannerProducts from "../../src/screens/products/BannerProduct.js";
import ProductDetails from "../../src/screens/products/ProductDetails.js";

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
        <Stack.Screen name="BannerProduct" component={BannerProducts} />
        <Stack.Screen name="ProductDetails" component={ProductDetails}/>
      </Stack.Group>

      {/* CategoryStack */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Categories"
          component={BottomTab}
        />
        <Stack.Screen name="SingleCategory" component={SingleCategory}/>
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
