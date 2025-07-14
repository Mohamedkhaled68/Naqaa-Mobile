import useGetNotificationsStats from "@/hooks/notifications/useGetNotificationsStats";
import React from "react";
import { Text, View } from "react-native";

interface NotificationBadgeProps {
    showZero?: boolean;
    size?: "small" | "medium" | "large";
    color?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
    showZero = false,
    size = "medium",
    color = "#ef4444",
}) => {
    const { data: stats } = useGetNotificationsStats();
    const count = stats?.unreadNotifications || 0;

    if (count === 0 && !showZero) {
        return null;
    }

    const sizeStyles = {
        small: {
            container: { minWidth: 14, height: 14, borderRadius: 7 },
            text: { fontSize: 9 },
        },
        medium: {
            container: { minWidth: 16, height: 16, borderRadius: 8 },
            text: { fontSize: 10 },
        },
        large: {
            container: { minWidth: 20, height: 20, borderRadius: 10 },
            text: { fontSize: 12 },
        },
    };

    const currentSize = sizeStyles[size];

    return (
        <View
            style={{
                backgroundColor: color,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: count > 99 ? 4 : 2,
                ...currentSize.container,
            }}
        >
            <Text
                style={{
                    color: "white",
                    fontWeight: "bold",
                    ...currentSize.text,
                }}
            >
                {count > 99 ? "99+" : count}
            </Text>
        </View>
    );
};

export default NotificationBadge;
