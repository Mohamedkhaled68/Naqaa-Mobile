import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface WelcomeHeaderProps {
    userName?: string;
    categoriesCount: number;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
    userName,
    categoriesCount,
}) => {
    const router = useRouter();

    return (
        <View
            className="px-6 pt-8 rounded-b-3xl"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
                backgroundColor: "#667eea", // Modern gradient-like color
            }}
        >
            <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1">
                    <Text className="text-2xl font-bold text-white mb-2">
                        Welcome back! 👋
                    </Text>
                    <Text
                        className="text-lg text-white mb-1"
                        style={{ opacity: 0.9 }}
                    >
                        {userName || "Driver"}
                    </Text>
                    <Text
                        className="text-sm text-white"
                        style={{ opacity: 0.7 }}
                    >
                        Manage your vehicle efficiently
                    </Text>
                </View>
                <TouchableOpacity
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    onPress={() => router.push("/notifications")}
                >
                    <Ionicons
                        name="notifications-outline"
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            {/* <View
                className="rounded-2xl p-4"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
                <View className="flex-row justify-between">
                    <View className="items-center">
                        <Text
                            className="text-white text-xs mb-1"
                            style={{ opacity: 0.8 }}
                        >
                            Categories
                        </Text>
                        <Text className="text-white font-bold text-xl">
                            {categoriesCount}
                        </Text>
                    </View>
                    <View className="items-center">
                        <Text
                            className="text-white text-xs mb-1"
                            style={{ opacity: 0.8 }}
                        >
                            This Month
                        </Text>
                        <Text className="text-white font-bold text-xl">5</Text>
                    </View>
                    <View className="items-center">
                        <Text
                            className="text-white text-xs mb-1"
                            style={{ opacity: 0.8 }}
                        >
                            Completed
                        </Text>
                        <Text className="text-white font-bold text-xl">15</Text>
                    </View>
                </View>
            </View> */}
        </View>
    );
};

export default WelcomeHeader;
