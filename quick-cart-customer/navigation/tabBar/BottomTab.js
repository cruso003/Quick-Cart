import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    HomeScreen,
    AccountScreen,
    NotificationsScreen,
    CategoriesScreen,
} from "../../src/screens/tabs/index";
import colors from "../../theme/colors";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "white",
                tabBarStyle: { backgroundColor: colors.danger, },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={size}
                                color={focused ? "white" : color}
                            />
                        );
                    },
                }}
            />

            <Tab.Screen
                name="Categories"
                component={CategoriesScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <MaterialIcons
                                name="dashboard"
                                size={size}
                                color={focused ? "white" : color}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <Ionicons
                                name={focused ? "notifications" : "notifications-outline"}
                                size={size}
                                color={focused ? "white" : color}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Account"
                component={AccountScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <MaterialCommunityIcons
                                name={focused ? "account-circle" : "account-circle-outline"}
                                size={size}
                                color={focused ? "white" : color}
                            />
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
}
