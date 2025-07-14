import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import useGetNotificationsStats from "@/hooks/notifications/useGetNotificationsStats";
import { useAuthStore } from "@/stores/auth-store";

interface CustomTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
    state,
    descriptors,
    navigation,
}) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuthStore();
    const { data: notificationStats } = useGetNotificationsStats();

    const getTabIcon = (routeName: string, focused: boolean, color: string) => {
        const size = focused ? 28 : 24;

        switch (routeName) {
            case "home":
                return <AntDesign name="home" size={size} color={color} />;
            case "requests":
                return (
                    <Ionicons
                        name={
                            focused ? "document-text" : "document-text-outline"
                        }
                        size={size}
                        color={color}
                    />
                );

            case "profile":
                return <AntDesign name="user" size={size} color={color} />;
            case "settings":
                return <Feather name="settings" size={size} color={color} />;
            default:
                return null;
        }
    };

    const getTabLabel = (routeName: string) => {
        switch (routeName) {
            case "home":
                return "Home";
            case "requests":
                return "Requests";

            case "profile":
                return "Profile";
            case "settings":
                return "Settings";
            default:
                return null;
        }
    };

    return (
        <View
            style={{
                position: "absolute",
                bottom: Platform.OS === "ios" ? insets.bottom + 20 : 16,
                left: 20,
                right: 20,
                backgroundColor: "#ffffff",
                borderRadius: 28,
                paddingVertical: 16,
                paddingHorizontal: 10,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                shadowColor: "#667eea",
                shadowOffset: {
                    width: 0,
                    height: 12,
                },
                shadowOpacity: 0.2,
                shadowRadius: 25,
                elevation: 15,
                borderWidth: 1,
                borderColor: "rgba(102, 126, 234, 0.08)",
            }}
        >
            {state.routes
                .filter((route: any) =>
                    [
                        "home",
                        "requests",
                        "profile",
                        "settings",
                    ].includes(route.name)
                )
                .map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const color = isFocused ? "#667eea" : "#9CA3AF";

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={{
                                flex: 1,
                                alignItems: "center",
                                paddingVertical: 12,
                                paddingHorizontal: 13,
                                borderRadius: 20,
                                minHeight: 60,
                                justifyContent: "center",
                                backgroundColor: isFocused
                                    ? "rgba(102, 126, 234, 0.12)"
                                    : "transparent",
                            }}
                            activeOpacity={0.6}
                        >
                            <View
                                style={{
                                    transform: [{ scale: isFocused ? 1 : 0.9 }],
                                    marginBottom: 2,
                                    position: "relative",
                                }}
                            >
                                {getTabIcon(route.name, isFocused, color)}
                                
                            </View>
                            <Text
                                style={{
                                    color,
                                    fontSize: isFocused ? 11 : 10,
                                    fontWeight: isFocused ? "700" : "600",
                                    marginTop: 4,
                                    opacity: isFocused ? 1 : 0.8,
                                }}
                            >
                                {getTabLabel(route.name)}
                            </Text>

                            {/* Active indicator dot */}
                            {isFocused && (
                                <View
                                    style={{
                                        width: 3,
                                        height: 3,
                                        borderRadius: 2,
                                        backgroundColor: "#667eea",
                                        marginTop: 4,
                                    }}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
        </View>
    );
};

export default CustomTabBar;
