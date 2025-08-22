import { useOrientation } from "@/hooks/useOrientation";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const QuickActionsCard: React.FC = () => {
    const router = useRouter();
    const { isLandscape, width } = useOrientation();
    const screenWidth = width;

    const quickActions = [
        {
            id: 1,
            title: "OCR Check",
            description: "Scan vehicle details",
            icon: "scan" as const,
            color: "#667eea",
            route: "/OCR-check",
        },
        {
            id: 2,
            title: "Notifications",
            description: "Check updates",
            icon: "notifications-outline" as const,
            color: "#f093fb",
            route: "/notifications",
        },
        {
            id: 3,
            title: "Profile",
            description: "View your profile",
            icon: "person-outline" as const,
            color: "#4facfe",
            route: "/profile",
        },
        {
            id: 4,
            title: "Settings",
            description: "App preferences",
            icon: "settings-outline" as const,
            color: "#43e97b",
            route: "/settings",
        },
    ];

    const renderQuickAction = ({
        item,
    }: {
        item: (typeof quickActions)[0];
    }) => {
        // Calculate dynamic width based on orientation
        const itemWidth = isLandscape
            ? screenWidth * 0.18 // Smaller items in landscape
            : screenWidth * 0.42; // Original size in portrait

        return (
            <TouchableOpacity
                className="bg-white rounded-2xl p-4 mx-2"
                style={{
                    width: itemWidth,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.08,
                    shadowRadius: 6,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: "#F8F9FA",
                }}
                onPress={() => router.push(item.route as any)}
            >
                <View className="items-center">
                    <View
                        className="w-14 h-14 rounded-2xl items-center justify-center mb-3"
                        style={{ backgroundColor: `${item.color}15` }}
                    >
                        <Ionicons
                            name={item.icon}
                            size={26}
                            color={item.color}
                        />
                    </View>
                    <Text className="text-gray-800 font-bold text-sm mb-1">
                        {item.title}
                    </Text>
                    <Text className="text-gray-500 text-xs text-center leading-4">
                        {item.description}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className={`mb-8 ${isLandscape ? "px-2" : "px-6 -mt-6"}`}>
            <View
                className="bg-white rounded-2xl p-6"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: "#F3F4F6",
                }}
            >
                <View className="flex-row items-center mb-4">
                    <View
                        className="w-6 h-6 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: "rgba(102, 126, 234, 0.2)" }}
                    >
                        <AntDesign name="rocket1" size={14} color="#667eea" />
                    </View>
                    <Text className="text-gray-800 font-bold text-lg">
                        Quick Actions
                    </Text>
                </View>

                {isLandscape ? (
                    /* Landscape: 2x2 Grid */
                    <View className="flex-row flex-wrap justify-between">
                        {quickActions.map((item, index) => (
                            <View
                                key={item.id}
                                style={{ width: "48%", marginBottom: 12 }}
                            >
                                {renderQuickAction({ item })}
                            </View>
                        ))}
                    </View>
                ) : (
                    /* Portrait: Horizontal Scroll */
                    <FlatList
                        data={quickActions}
                        renderItem={renderQuickAction}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 4 }}
                    />
                )}
            </View>
        </View>
    );
};

export default QuickActionsCard;
