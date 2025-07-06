import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ReceiverDashboard = () => {
    const { user, signOut } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await signOut();
                    // signOut already handles navigation to role-selection
                },
            },
        ]);
    };

    const dashboardCards = [
        {
            title: "Pending Requests",
            count: "12",
            icon: "time-outline" as keyof typeof Ionicons.glyphMap,
            color: "#f59e0b",
            bgColor: "#fef3c7",
            // onPress: () => router.push("/(receiver)/requests"),
        },
        {
            title: "Approved Today",
            count: "8",
            icon: "checkmark-circle-outline" as keyof typeof Ionicons.glyphMap,
            color: "#10b981",
            bgColor: "#d1fae5",
            onPress: () => {},
        },
        {
            title: "Total Requests",
            count: "156",
            icon: "documents-outline" as keyof typeof Ionicons.glyphMap,
            color: "#3b82f6",
            bgColor: "#dbeafe",
            onPress: () => {},
        },
        {
            title: "High Priority",
            count: "3",
            icon: "warning-outline" as keyof typeof Ionicons.glyphMap,
            color: "#ef4444",
            bgColor: "#fee2e2",
            onPress: () => {},
        },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View className="px-6 pt-4 pb-6 bg-white">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-2xl font-bold text-gray-800">
                                    Welcome back!
                                </Text>
                                <Text className="text-gray-600 mt-1">
                                    {user?.name}
                                </Text>
                                <Text className="text-sm text-green-600 font-medium">
                                    Receiver Dashboard
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleLogout}
                                className="p-2 rounded-lg bg-gray-100"
                            >
                                <Ionicons
                                    name="log-out-outline"
                                    size={24}
                                    color="#6b7280"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Dashboard Cards */}
                    <View className="px-6 py-4">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">
                            Overview
                        </Text>
                        <View className="flex-row flex-wrap justify-between">
                            {dashboardCards.map((card, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={card.onPress}
                                    className="w-[48%] mb-4 p-4 bg-white rounded-xl border border-gray-200"
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 2,
                                        elevation: 2,
                                    }}
                                >
                                    <View className="flex-row items-center justify-between mb-3">
                                        <View
                                            className="w-10 h-10 rounded-lg items-center justify-center"
                                            style={{
                                                backgroundColor: card.bgColor,
                                            }}
                                        >
                                            <Ionicons
                                                name={card.icon}
                                                size={20}
                                                color={card.color}
                                            />
                                        </View>
                                        <Text
                                            className="text-2xl font-bold"
                                            style={{ color: card.color }}
                                        >
                                            {card.count}
                                        </Text>
                                    </View>
                                    <Text className="text-gray-700 font-medium text-sm">
                                        {card.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View className="px-6 py-4">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">
                            Quick Actions
                        </Text>
                        <View className="space-y-3">
                            <TouchableOpacity
                                // onPress={() => router.push("/(receiver)/requests")}
                                className="p-4 bg-white rounded-xl border border-gray-200 flex-row items-center"
                            >
                                <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-4">
                                    <Ionicons
                                        name="list-outline"
                                        size={24}
                                        color="#3b82f6"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">
                                        Review Requests
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        View and manage maintenance requests
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity className="p-4 bg-white rounded-xl border border-gray-200 flex-row items-center">
                                <View className="w-12 h-12 bg-green-100 rounded-lg items-center justify-center mr-4">
                                    <Ionicons
                                        name="bar-chart-outline"
                                        size={24}
                                        color="#10b981"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">
                                        Reports
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        View maintenance statistics and reports
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity className="p-4 bg-white rounded-xl border border-gray-200 flex-row items-center">
                                <View className="w-12 h-12 bg-purple-100 rounded-lg items-center justify-center mr-4">
                                    <Ionicons
                                        name="settings-outline"
                                        size={24}
                                        color="#8b5cf6"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">
                                        Settings
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        Manage account and preferences
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bottom spacing */}
                    <View className="h-8" />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ReceiverDashboard;
