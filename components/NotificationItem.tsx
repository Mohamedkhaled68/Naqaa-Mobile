import { Notification } from "@/types/notification";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface NotificationItemProps {
    notification: Notification;
    onPress?: (notification: Notification) => void;
    onMarkAsRead?: (notificationId: string) => void;
    onDelete?: (notificationId: string) => void;
    showActions?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onPress,
    onMarkAsRead,
    onDelete,
    showActions = true,
}) => {
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
        const date = new Date(dateString);
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
    };

    return (
        <TouchableOpacity
            onPress={() => onPress?.(notification)}
            className={`p-4 mb-3 rounded-xl border ${
                notification.isRead
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
                            notification.type
                        )}20`,
                    }}
                >
                    <Ionicons
                        name={
                            getNotificationIcon(
                                notification.type
                            ) as keyof typeof Ionicons.glyphMap
                        }
                        size={20}
                        color={getNotificationColor(notification.type)}
                    />
                </View>

                <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text
                            className={`text-sm font-semibold flex-1 ${
                                notification.isRead
                                    ? "text-gray-800"
                                    : "text-gray-900"
                            }`}
                        >
                            {notification.title}
                        </Text>
                        <View className="flex-row items-center ml-2">
                            {!notification.isRead && (
                                <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                            )}
                            {showActions && onDelete && (
                                <TouchableOpacity
                                    onPress={() => onDelete(notification._id)}
                                    className="p-1"
                                >
                                    <Ionicons
                                        name="close"
                                        size={16}
                                        color="#9ca3af"
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <Text
                        className={`text-sm mb-2 ${
                            notification.isRead
                                ? "text-gray-600"
                                : "text-gray-700"
                        }`}
                    >
                        {notification.message}
                    </Text>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-xs text-gray-500">
                            From: {notification.sender?.name || "System"}
                        </Text>
                        <Text className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                        </Text>
                    </View>

                    {showActions && !notification.isRead && onMarkAsRead && (
                        <TouchableOpacity
                            onPress={() => onMarkAsRead(notification._id)}
                            className="mt-2 self-start"
                        >
                            <Text className="text-blue-600 text-xs font-medium">
                                Mark as read
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default NotificationItem;
