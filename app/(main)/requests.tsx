import useGetDriverMaintenanceRequests from "@/hooks/maintenance/useGetDriverMaintenanceRequests";
import { MaintenanceRequest } from "@/types/maintenance-request";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const TABS = [
    { key: "open", label: "Pending" },
    { key: "underReview", label: "Under Review" },
    { key: "accepted", label: "Accepted" },
    { key: "completed", label: "Completed" },
    { key: "rejected", label: "Rejected" },
];

const DriverRequests = () => {
    const router = useRouter();
    const {
        data: requests,
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useGetDriverMaintenanceRequests();
    const [activeTab, setActiveTab] = useState("pending");

    console.log("Requests : ", requests);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "#3b82f6";
            case "underReview":
                return "#f59e0b";
            case "accepted":
                return "#10b981";
            case "rejected":
                return "#ef4444";
            case "completed":
                return "#059669";
            default:
                return "#6b7280";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "open":
                return "hourglass-outline";
            case "underReview":
                return "eye-outline";
            case "accepted":
                return "checkmark-circle-outline";
            case "rejected":
                return "close-circle-outline";
            case "completed":
                return "checkmark-done-outline";
            default:
                return "document-outline";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "open":
                return "Pending";
            case "underReview":
                return "Under Review";
            case "accepted":
                return "Accepted";
            case "rejected":
                return "Rejected";
            case "completed":
                return "Completed";
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderRequestItem = ({ item }: { item: MaintenanceRequest }) => {
        return (
            <TouchableOpacity
                className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
                onPress={() => {
                    router.push(`/(main)/request-details/${item._id}` as any);
                }}
            >
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-800 mb-1">
                            Request #{item._id.slice(-6).toUpperCase()}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            {item.car?.brand} {item.car?.model} (
                            {item.car?.plateNumber})
                        </Text>
                    </View>
                    <View
                        className="px-3 py-1 rounded-full flex-row items-center"
                        style={{
                            backgroundColor: `${getStatusColor(item.status)}20`,
                        }}
                    >
                        <Ionicons
                            name={getStatusIcon(item.status) as any}
                            size={12}
                            color={getStatusColor(item.status)}
                            style={{ marginRight: 4 }}
                        />
                        <Text
                            className="text-xs font-medium"
                            style={{ color: getStatusColor(item.status) }}
                        >
                            {getStatusText(item.status)}
                        </Text>
                    </View>
                </View>

                <Text className="text-gray-700 text-sm mb-3" numberOfLines={2}>
                    {item.description}
                </Text>

                {item.subCategories && item.subCategories.length > 0 && (
                    <View className="flex-row flex-wrap mb-3">
                        {item.subCategories
                            .slice(0, 2)
                            .map((subCategory, index) => (
                                <View
                                    key={subCategory._id}
                                    className="bg-blue-50 px-2 py-1 rounded-md mr-2 mb-1"
                                >
                                    <Text className="text-xs text-blue-600">
                                        {subCategory.name}
                                    </Text>
                                </View>
                            ))}
                        {item.subCategories.length > 2 && (
                            <Text className="text-xs text-gray-400 self-center">
                                +{item.subCategories.length - 2} more
                            </Text>
                        )}
                    </View>
                )}

                <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                    </Text>
                    <View className="flex-row items-center">
                        {item.cost && (
                            <Text className="text-sm font-semibold text-green-600 mr-3">
                                ${item.cost}
                            </Text>
                        )}
                        {item.receiver && (
                            <Text className="text-xs text-gray-500">
                                {item.receiver.name}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Show rejection message if request was rejected */}
                {item.status === "rejected" && item.rejectionMessage && (
                    <View className="mt-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                        <Text className="text-xs font-medium text-red-700 mb-1">
                            Rejection Reason:
                        </Text>
                        <Text className="text-xs text-red-600">
                            {item.rejectionMessage}
                        </Text>
                    </View>
                )}

                {/* Show progress indicator for in_progress status */}
                {item.status === "in_progress" && (
                    <View className="mt-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <Text className="text-xs font-medium text-purple-700">
                            Your request is being processed by the maintenance
                            team
                        </Text>
                    </View>
                )}

                {/* Show under review indicator */}
                {item.status === "underReview" && (
                    <View className="mt-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <Text className="text-xs font-medium text-yellow-700">
                            Your request is currently under review by the
                            maintenance team
                        </Text>
                    </View>
                )}

                {/* Show completion message for completed status */}
                {item.status === "completed" && (
                    <View className="mt-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <Text className="text-xs font-medium text-green-700">
                            Maintenance completed successfully
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const EmptyState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="document-outline" size={64} color="#d1d5db" />
            <Text className="text-lg font-medium text-gray-500 mt-4">
                No Maintenance Requests
            </Text>
            <Text className="text-sm text-gray-400 text-center mt-2 px-8">
                You haven't submitted any maintenance requests yet
            </Text>
            <TouchableOpacity
                className="bg-blue-600 px-6 py-3 rounded-lg mt-4"
                onPress={() => router.push("/subcategory-selection")}
            >
                <Text className="text-white font-medium">Create Request</Text>
            </TouchableOpacity>
        </View>
    );

    const LoadingState = () => (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-500 mt-4">Loading your requests...</Text>
        </View>
    );

    const ErrorState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
            <Text className="text-lg font-medium text-gray-800 mt-4">
                Error Loading Requests
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2 px-8">
                {error?.message || "Failed to load your maintenance requests"}
            </Text>
            <TouchableOpacity
                className="bg-blue-600 px-6 py-3 rounded-lg mt-4"
                onPress={() => refetch()}
            >
                <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    // const getRequestsByStatus = () => {
    //     if (!requests) return { active: [], completed: [] };

    //     const active = requests.filter((req: MaintenanceRequest) =>
    //         ["completed", "pending", "accepted"].includes(req.status)
    //     );
    //     const completed = requests.filter((req: MaintenanceRequest) =>
    //         ["completed", "rejected"].includes(req.status)
    //     );

    //     return { active, completed };
    // };

    // const { active, completed } = getRequestsByStatus();

    // Filter requests by tab
    const filteredRequests = (requests || []).filter(
        (req: MaintenanceRequest) => req.status === activeTab
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white px-6 py-4 border-b border-gray-200">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-xl font-bold text-gray-800">
                                My Requests
                            </Text>
                            <Text className="text-sm text-gray-500">
                                Track your maintenance requests
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <TouchableOpacity onPress={() => refetch()}>
                                <Ionicons
                                    name="refresh"
                                    size={24}
                                    color="#3b82f6"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Tabs Navigation Bar */}
                <View className="bg-white shadow-sm mb-2">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="py-3"
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            alignItems: "center",
                        }}
                        style={{ maxHeight: 60 }}
                    >
                        {TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                onPress={() => setActiveTab(tab.key)}
                                className={`px-3 py-2 rounded-full mr-3 ${
                                    activeTab === tab.key
                                        ? "bg-blue-600"
                                        : "bg-gray-200"
                                }`}
                            >
                                <Text
                                    className={`font-normal text-[13px] ${
                                        activeTab === tab.key
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 py-4">
                    {isLoading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState />
                    ) : filteredRequests.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <FlatList
                            data={filteredRequests}
                            keyExtractor={(item) => item._id}
                            renderItem={renderRequestItem}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefetching}
                                    onRefresh={refetch}
                                    colors={["#3b82f6"]}
                                />
                            }
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingBottom: 20,
                            }}
                        />
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default DriverRequests;
