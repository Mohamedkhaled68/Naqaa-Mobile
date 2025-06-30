import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const RecentActivityCard: React.FC = () => {
    const router = useRouter();

    const recentActivities = [
        {
            id: 1,
            title: "Oil Change Completed",
            description: "Regular maintenance - Engine oil replaced",
            time: "2 hours ago",
            icon: "oil",
            color: "#4facfe",
            type: "maintenance",
        },
        {
            id: 2,
            title: "OCR Scan Performed",
            description: "Vehicle meter reading captured",
            time: "1 day ago",
            icon: "camera-outline",
            color: "#43e97b",
            type: "scan",
        },
        {
            id: 3,
            title: "Brake Inspection",
            description: "Scheduled brake system check",
            time: "3 days ago",
            icon: "car-brake-alert",
            color: "#f093fb",
            type: "inspection",
        },
    ];

    const handleViewAll = () => {
        // Navigate to activity history or notifications
        router.push("/notifications");
    };

    return (
        <View className="px-6 mb-6">
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
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <View
                            className="w-6 h-6 rounded-full items-center justify-center mr-3"
                            style={{
                                backgroundColor: "rgba(102, 126, 234, 0.2)",
                            }}
                        >
                            <MaterialCommunityIcons
                                name="history"
                                size={14}
                                color="#667eea"
                            />
                        </View>
                        <Text className="text-gray-800 font-bold text-lg">
                            Recent Activity
                        </Text>
                    </View>
                    <TouchableOpacity onPress={handleViewAll}>
                        <Text
                            className="font-medium"
                            style={{ color: "#667eea" }}
                        >
                            View All
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="space-y-3">
                    {recentActivities.map((activity, index) => (
                        <View key={activity.id}>
                            <View className="flex-row items-start">
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                    style={{
                                        backgroundColor: `${activity.color}15`,
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name={activity.icon as any}
                                        size={18}
                                        color={activity.color}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold text-sm mb-1">
                                        {activity.title}
                                    </Text>
                                    <Text className="text-gray-500 text-xs mb-1">
                                        {activity.description}
                                    </Text>
                                    <Text className="text-gray-400 text-xs">
                                        {activity.time}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={16}
                                    color="#9CA3AF"
                                />
                            </View>
                            {index < recentActivities.length - 1 && (
                                <View
                                    className="my-3 mx-10"
                                    style={{
                                        height: 1,
                                        backgroundColor: "#F3F4F6",
                                    }}
                                />
                            )}
                        </View>
                    ))}
                </View>

                {recentActivities.length === 0 && (
                    <View className="items-center py-8">
                        <MaterialCommunityIcons
                            name="history"
                            size={48}
                            color="#9CA3AF"
                        />
                        <Text className="text-text-muted text-center mt-4 mb-2">
                            No recent activity
                        </Text>
                        <Text className="text-text-muted text-sm text-center">
                            Your vehicle activities will appear here
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default RecentActivityCard;
