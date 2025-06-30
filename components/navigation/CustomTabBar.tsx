import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

    const getTabIcon = (routeName: string, focused: boolean, color: string) => {
        const size = focused ? 28 : 24;

        switch (routeName) {
            case "home":
                return <AntDesign name="home" size={size} color={color} />;
            case "notifications":
                return (
                    <Ionicons
                        name={
                            focused ? "notifications" : "notifications-outline"
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
                return <AntDesign name="home" size={size} color={color} />;
        }
    };

    const getTabLabel = (routeName: string) => {
        switch (routeName) {
            case "home":
                return "Home";
            case "notifications":
                return "Alerts";
            case "profile":
                return "Profile";
            case "settings":
                return "Settings";
            default:
                return routeName;
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
                paddingHorizontal: 20,
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
            {state.routes.map((route: any, index: number) => {
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
                            paddingHorizontal: 16,
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
                                transform: [{ scale: isFocused ? 1.1 : 1 }],
                                marginBottom: 2,
                            }}
                        >
                            {getTabIcon(route.name, isFocused, color)}
                        </View>
                        <Text
                            style={{
                                color,
                                fontSize: isFocused ? 12 : 11,
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
                                    width: 4,
                                    height: 4,
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
