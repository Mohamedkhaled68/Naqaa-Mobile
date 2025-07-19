// app/(main)/_layout.tsx
import CustomTabBar from "@/components/navigation/CustomTabBar";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function MainAppLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Tabs
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Home",
                    }}
                />
                <Tabs.Screen
                    name="requests"
                    options={{
                        title: "Requests",
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Settings",
                    }}
                />
            </Tabs>
        </View>
    );
}
