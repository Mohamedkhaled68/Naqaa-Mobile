import NetworkErrorState from "@/components/NetworkErrorState";
import useDeleteNotificationById from "@/hooks/notifications/useDeleteNotificationById";
import useGetMyNotifications from "@/hooks/notifications/useGetMyNotifications";
import useGetNotificationsStats from "@/hooks/notifications/useGetNotificationsStats";
import useMarkAllNotificationsAsRead from "@/hooks/notifications/useMarkAllNotificationsAsRead";
import useMarkNotificationAsReadById from "@/hooks/notifications/useMarkNotificationAsReadById";
import { useNetwork } from "@/providers/NetworkProvider";
import { Notification } from "@/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
    const router = useRouter();
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const { isConnected } = useNetwork();

    const {
        data: notifications,
        isLoading,
        error,
        refetch,
    } = useGetMyNotifications();

    const { data: stats } = useGetNotificationsStats();

    console.log("notidddddd", notifications);

    const markAllAsReadMutation = useMarkAllNotificationsAsRead();
    const markAsReadMutation = useMarkNotificationAsReadById();
    const deleteNotificationMutation = useDeleteNotificationById();

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "maintenance_request":
                return "construct-outline";
            case "request_accepted":
                return "checkmark-circle-outline";
            case "request_rejected":
                return "close-circle-outline";
            case "request_completed":
                return "checkmark-done-outline";
            case "system_update":
                return "refresh-outline";
            default:
                return "notifications-outline";
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case "maintenance_request":
                return "#f59e0b";
            case "request_accepted":
                return "#10b981";
            case "request_rejected":
                return "#ef4444";
            case "request_completed":
                return "#059669";
            case "system_update":
                return "#3b82f6";
            default:
                return "#6b7280";
        }
    };

    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return "Unknown date";

            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";

            const now = new Date();
            const diff = now.getTime() - date.getTime();
            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (minutes < 1) return "Just now";
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
            return date.toLocaleDateString();
        } catch (error) {
            return "Unknown date";
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markAsReadMutation.mutateAsync(notificationId);
        } catch (error) {
            Alert.alert("Error", "Failed to mark notification as read");
        }
    };

    const handleDeleteNotification = (notificationId: string) => {
        Alert.alert(
            "Delete Notification",
            "Are you sure you want to delete this notification?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteNotificationMutation.mutateAsync(
                                notificationId
                            );
                        } catch (error) {
                            Alert.alert(
                                "Error",
                                "Failed to delete notification"
                            );
                        }
                    },
                },
            ]
        );
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsReadMutation.mutateAsync();
        } catch (error) {
            Alert.alert("Error", "Failed to mark all notifications as read");
        }
    };

    const handleNotificationPress = (notification: Notification) => {
        // Mark as read if not already read
        if (!notification.isRead) {
            handleMarkAsRead(notification._id);
        }

        // Navigate to related content if available
        if (notification.relatedRequest) {
            try {
                // Handle both string and object formats for relatedRequest
                const requestId =
                    typeof notification.relatedRequest === "string"
                        ? notification.relatedRequest
                        : notification.relatedRequest._id;

                // Navigate to the request details page
                router.push(`/(main)/request-details/${requestId}` as any);
            } catch (error) {
                console.error("Navigation error:", error);
                Alert.alert("Error", "Unable to open request details");
            }
        }
    };

    const filteredNotifications =
        notifications?.filter((notification) => {
            if (!notification || !notification._id) return false; // Filter out invalid notifications
            if (filter === "unread") {
                return !notification.isRead;
            }
            return true;
        }) || [];

    const renderNotificationItem = ({ item }: { item: Notification }) => {
        // Safety check for invalid notification data
        if (!item || !item._id) {
            return null;
        }

        return (
            <TouchableOpacity
                onPress={() => handleNotificationPress(item)}
                className={`mx-4 mb-3 p-4 rounded-xl border ${
                    item.isRead
                        ? "bg-white border-gray-200"
                        : "bg-blue-50 border-blue-200"
                }`}
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                }}
            >
                <View className="flex-row">
                    <View
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{
                            backgroundColor: `${getNotificationColor(
                                item.type
                            )}20`,
                        }}
                    >
                        <Ionicons
                            name={
                                getNotificationIcon(
                                    item.type
                                ) as keyof typeof Ionicons.glyphMap
                            }
                            size={20}
                            color={getNotificationColor(item.type)}
                        />
                    </View>

                    <View className="flex-1">
                        <View className="flex-row justify-between items-start mb-1">
                            <Text
                                className={`text-sm font-semibold ${
                                    item.isRead
                                        ? "text-gray-800"
                                        : "text-gray-900"
                                }`}
                            >
                                {item.title || "Notification"}
                            </Text>
                            <View className="flex-row items-center">
                                {!item.isRead && (
                                    <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                                )}
                                <TouchableOpacity
                                    onPress={() =>
                                        handleDeleteNotification(item._id)
                                    }
                                    className="p-1"
                                >
                                    <Ionicons
                                        name="close"
                                        size={16}
                                        color="#9ca3af"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text
                            className={`text-sm mb-2 ${
                                item.isRead ? "text-gray-600" : "text-gray-700"
                            }`}
                        >
                            {item.message || "No message"}
                        </Text>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-xs text-gray-500">
                                From: {item.sender?.name || "System"}
                            </Text>
                            <Text className="text-xs text-gray-500">
                                {formatDate(item.createdAt)}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-gray-50">
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text className="text-gray-600 mt-4">
                            Loading notifications...
                        </Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (error) {
        // Check if it's a network error
        const isNetworkError =
            error?.name === "NetworkError" ||
            error?.message?.includes("network") ||
            error?.message?.includes("internet") ||
            !isConnected;

        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-gray-50">
                    {isNetworkError ? (
                        <NetworkErrorState
                            onRetry={() => refetch()}
                            message="Unable to load notifications"
                        />
                    ) : (
                        <View className="flex-1 justify-center items-center px-6">
                            <Ionicons
                                name="warning-outline"
                                size={64}
                                color="#ef4444"
                            />
                            <Text className="text-red-600 text-lg font-semibold mt-4 text-center">
                                Error Loading Notifications
                            </Text>
                            <Text className="text-gray-600 text-center mt-2">
                                Failed to load notifications. Please try again.
                            </Text>
                            <TouchableOpacity
                                onPress={() => refetch()}
                                className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-white font-medium">
                                    Retry
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="px-4 py-4 bg-white border-b border-gray-200">
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="text-2xl font-bold text-gray-800">
                                Notifications
                            </Text>
                            <Text className="text-gray-600 text-sm">
                                {stats?.totalNotifications || 0} total •{" "}
                                {stats?.unreadNotifications || 0} unread
                            </Text>
                        </View>

                        {(stats?.unreadNotifications || 0) > 0 && (
                            <TouchableOpacity
                                onPress={handleMarkAllAsRead}
                                disabled={markAllAsReadMutation.isPending}
                                className="bg-blue-500 px-4 py-2 rounded-lg"
                            >
                                <Text className="text-white text-sm font-medium">
                                    Mark All Read
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Filter Tabs */}
                    <View className="flex-row bg-gray-100 rounded-lg p-1">
                        <TouchableOpacity
                            onPress={() => setFilter("all")}
                            className={`flex-1 py-2 px-4 rounded-md ${
                                filter === "all" ? "bg-white" : ""
                            }`}
                        >
                            <Text
                                className={`text-center font-medium ${
                                    filter === "all"
                                        ? "text-gray-800"
                                        : "text-gray-600"
                                }`}
                            >
                                All ({notifications?.length || 0})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setFilter("unread")}
                            className={`flex-1 py-2 px-4 rounded-md ${
                                filter === "unread" ? "bg-white" : ""
                            }`}
                        >
                            <Text
                                className={`text-center font-medium ${
                                    filter === "unread"
                                        ? "text-gray-800"
                                        : "text-gray-600"
                                }`}
                            >
                                Unread ({stats?.unreadNotifications || 0})
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                {filteredNotifications.length === 0 ? (
                    <View className="flex-1 justify-center items-center px-6">
                        <Ionicons
                            name={
                                filter === "unread"
                                    ? "checkmark-done-outline"
                                    : "notifications-outline"
                            }
                            size={64}
                            color="#d1d5db"
                        />
                        <Text className="text-gray-500 text-lg font-semibold mt-4">
                            {filter === "unread"
                                ? "All caught up!"
                                : "No notifications"}
                        </Text>
                        <Text className="text-gray-400 text-center mt-2">
                            {filter === "unread"
                                ? "You have no unread notifications."
                                : "You don't have any notifications yet."}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredNotifications}
                        renderItem={renderNotificationItem}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingTop: 16,
                            paddingBottom: 100,
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={refetch}
                                colors={["#3b82f6"]}
                            />
                        }
                    />
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Notifications;
