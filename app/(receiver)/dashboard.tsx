import DeleteAccountModal from "@/components/DeleteAccountModal";
import withNetworkErrorHandling from "@/components/withNetworkErrorHandling";
import useGetAcceptedRequests from "@/hooks/receiver/useGetAcceptedRequests";
import useGetLastMaintenance from "@/hooks/receiver/useGetLastMaintenance";
import useGetPendingRequests from "@/hooks/receiver/useGetPendingRequests";
import { useAuthStore } from "@/stores/auth-store";
import { MaintenanceHistoryRecord } from "@/types/maintenance-history";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ReceiverDashboard = () => {
    const { user, signOut } = useAuthStore();
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const {
        data: pendingRequests,
        refetch: refetchPending,
        isRefetching: isRefetchingPending,
    } = useGetPendingRequests();
    const {
        data: acceptedRequests,
        refetch: refetchAccepted,
        isRefetching: isRefetchingAccepted,
    } = useGetAcceptedRequests();
    const {
        data: maintenanceHistory,
        refetch: refetchHistory,
        isRefetching: isRefetchingHistory,
    } = useGetLastMaintenance();

    const handleRefresh = () => {
        refetchPending();
        refetchAccepted();
        refetchHistory();
    };

    const isRefreshing =
        isRefetchingPending || isRefetchingAccepted || isRefetchingHistory;

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
            count: pendingRequests?.length?.toString() || "0",
            icon: "time-outline" as keyof typeof Ionicons.glyphMap,
            color: "#f59e0b",
            bgColor: "#fef3c7",
            onPress: () => router.push("/(receiver)/requests"),
        },
        {
            title: "Accepted Requests",
            count: acceptedRequests?.length?.toString() || "0",
            icon: "checkmark-circle-outline" as keyof typeof Ionicons.glyphMap,
            color: "#10b981",
            bgColor: "#d1fae5",
            onPress: () => router.push("/(receiver)/accepted-requests"),
        },
        {
            title: "Maintenance History",
            count: maintenanceHistory?.length?.toString() || "0",
            icon: "document-text-outline" as keyof typeof Ionicons.glyphMap,
            color: "#8b5cf6",
            bgColor: "#e9d5ff",
            onPress: () => {
                router.push("/(receiver)/maintenance-history");
            },
        },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={["#3b82f6"]}
                            tintColor="#3b82f6"
                        />
                    }
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
                        <View className="space-y-3 flex flex-col gap-3">
                            <TouchableOpacity
                                onPress={() =>
                                    router.push("/(receiver)/requests")
                                }
                                className="p-4 bg-white rounded-xl border border-gray-200 flex-row items-center"
                            >
                                <View className="w-12 h-12 bg-amber-100 rounded-lg items-center justify-center mr-4">
                                    <Ionicons
                                        name="time-outline"
                                        size={24}
                                        color="#f59e0b"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">
                                        Pending Requests
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        Review and approve maintenance requests
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    router.push("/(receiver)/accepted-requests")
                                }
                                className="p-4 bg-white rounded-xl border border-gray-200 flex-row items-center"
                            >
                                <View className="w-12 h-12 bg-green-100 rounded-lg items-center justify-center mr-4">
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={24}
                                        color="#10b981"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">
                                        Accepted Requests
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        View approved and completed maintenance
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Recent Maintenance History */}
                        <View className="mt-6">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">
                                Recent Maintenance History
                            </Text>
                            {maintenanceHistory &&
                            maintenanceHistory.length > 0 ? (
                                <View className="space-y-3">
                                    {maintenanceHistory
                                        .slice(0, 3)
                                        .map(
                                            (
                                                item: MaintenanceHistoryRecord,
                                                index: number
                                            ) => (
                                                <View
                                                    key={index}
                                                    className="p-4 bg-white rounded-xl border border-gray-200"
                                                >
                                                    <View className="flex-row items-center justify-between mb-2">
                                                        <Text className="font-medium text-gray-800">
                                                            {item.description ||
                                                                "Maintenance Request"}
                                                        </Text>
                                                        <Text className="text-xs text-gray-500">
                                                            {item.date
                                                                ? new Date(
                                                                      item.date
                                                                  ).toLocaleDateString()
                                                                : "Date unknown"}
                                                        </Text>
                                                    </View>
                                                    <Text className="text-sm text-gray-600 mb-2">
                                                        Vehicle:{" "}
                                                        {item.car
                                                            ? `${item.car.brand} ${item.car.model} (${item.car.plateNumber})`
                                                            : "N/A"}
                                                    </Text>
                                                    <Text className="text-sm text-gray-600 mb-2">
                                                        Cost: ${item.cost || 0}{" "}
                                                        {item.mechanicCost
                                                            ? `+ $${item.mechanicCost} (mechanic)`
                                                            : ""}
                                                    </Text>
                                                    <View className="flex-row items-center justify-between">
                                                        <View
                                                            className="px-2 py-1 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    "#e5e7eb",
                                                            }}
                                                        >
                                                            <Text
                                                                className="text-xs font-medium"
                                                                style={{
                                                                    color: "#374151",
                                                                }}
                                                            >
                                                                Completed
                                                            </Text>
                                                        </View>
                                                        {item.driver && (
                                                            <Text className="text-xs text-gray-500">
                                                                Driver:{" "}
                                                                {
                                                                    item.driver
                                                                        .name
                                                                }
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            )
                                        )}
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push(
                                                "/(receiver)/maintenance-history"
                                            )
                                        }
                                        className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex-row items-center justify-center"
                                    >
                                        <Ionicons
                                            name="document-text-outline"
                                            size={20}
                                            color="#8b5cf6"
                                        />
                                        <Text className="text-purple-600 font-medium ml-2">
                                            View All History
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="p-6 bg-white rounded-xl border border-gray-200 items-center">
                                    <Ionicons
                                        name="document-outline"
                                        size={32}
                                        color="#d1d5db"
                                    />
                                    <Text className="text-gray-500 text-center mt-2">
                                        No maintenance history available
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Profile Actions Section */}
                        <View className="mt-6 space-y-3">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">
                                Account Settings
                            </Text>

                            <TouchableOpacity
                                onPress={handleLogout}
                                className="p-4 bg-white rounded-xl border border-gray-200 flex-row items-center"
                            >
                                <View className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mr-4">
                                    <Ionicons
                                        name="log-out-outline"
                                        size={24}
                                        color="#6b7280"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">
                                        Logout
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        Sign out of your account
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(true)}
                                className="p-4 bg-white rounded-xl border border-red-200 flex-row items-center mt-4"
                            >
                                <View className="w-12 h-12 bg-red-100 rounded-lg items-center justify-center mr-4">
                                    <Ionicons
                                        name="trash-outline"
                                        size={24}
                                        color="#dc2626"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-red-800 font-semibold">
                                        Delete Account
                                    </Text>
                                    <Text className="text-red-600 text-sm">
                                        Permanently remove your account
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#dc2626"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bottom spacing */}
                    <View className="h-8" />
                </ScrollView>

                <DeleteAccountModal
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default withNetworkErrorHandling(ReceiverDashboard, {
    errorMessage: "Dashboard requires internet connection to load data",
    showFullScreenError: true,
    autoRetry: true,
});
