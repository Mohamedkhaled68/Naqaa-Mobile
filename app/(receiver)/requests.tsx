import withNetworkErrorHandling from "@/components/withNetworkErrorHandling";
import useGetPendingRequests from "@/hooks/receiver/useGetPendingRequests";
import { MaintenanceRequest } from "@/types/maintenance-request";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const PendingRequests = () => {
    const router = useRouter();
    const {
        data: requests,
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useGetPendingRequests();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "#3b82f6";
            case "accepted":
                return "#10b981";
            case "underReview":
                return "#f59e0b";
            case "completed":
                return "#059669";
            case "rejected":
                return "#ef4444";
            default:
                return "#6b7280";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return "hourglass-outline";
            case "accepted":
                return "checkmark-circle-outline";
            case "underReview":
                return "eye-outline";
            case "completed":
                return "checkmark-done-outline";
            case "rejected":
                return "close-circle-outline";
            default:
                return "document-outline";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return "Pending";
            case "accepted":
                return "Accepted";
            case "underReview":
                return "Under Review";
            case "completed":
                return "Completed";
            case "rejected":
                return "Rejected";
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
                className="bg-white rounded-lg p-3 mb-3 shadow-sm border border-gray-100"
                onPress={() => {
                    router.push({
                        pathname: "/(receiver)/request-details/[id]",
                        params: { id: item._id },
                    });
                }}
            >
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-800 mb-1">
                            {item.driver.name}
                        </Text>
                        <Text className="text-xs text-gray-600">
                            {item.car.brand} {item.car.model} (
                            {item.car.plateNumber})
                        </Text>
                    </View>
                    <View
                        className="px-2 py-1 rounded-full flex-row items-center"
                        style={{
                            backgroundColor: `${getStatusColor(item.status)}20`,
                        }}
                    >
                        <Ionicons
                            name={getStatusIcon(item.status) as any}
                            size={10}
                            color={getStatusColor(item.status)}
                            style={{ marginRight: 3 }}
                        />
                        <Text
                            className="text-xs font-medium"
                            style={{ color: getStatusColor(item.status) }}
                        >
                            {getStatusText(item.status)}
                        </Text>
                    </View>
                </View>

                <Text className="text-gray-700 text-sm mb-2" numberOfLines={1}>
                    {item.description}
                </Text>

                <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                    </Text>
                    {item.cost && (
                        <Text className="text-sm font-semibold text-green-600">
                            ${item.cost}
                        </Text>
                    )}
                </View>

                {item.subCategories && item.subCategories.length > 0 && (
                    <View className="flex-row flex-wrap mt-2">
                        {item.subCategories
                            .slice(0, 2)
                            .map((subCategory, index) => (
                                <View
                                    key={subCategory._id}
                                    className="bg-blue-50 px-2 py-1 rounded-md mr-1 mb-1"
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
            </TouchableOpacity>
        );
    };

    const EmptyState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="document-outline" size={64} color="#d1d5db" />
            <Text className="text-lg font-medium text-gray-500 mt-4">
                No Pending Requests
            </Text>
            <Text className="text-sm text-gray-400 text-center mt-2 px-8">
                All maintenance requests have been reviewed
            </Text>
        </View>
    );

    const LoadingState = () => (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-500 mt-4">Loading requests...</Text>
        </View>
    );

    const ErrorState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
            <Text className="text-lg font-medium text-gray-800 mt-4">
                Error Loading Requests
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2 px-8">
                {error?.message || "Failed to load pending requests"}
            </Text>
            <TouchableOpacity
                className="bg-blue-600 px-6 py-3 rounded-lg mt-4"
                onPress={() => refetch()}
            >
                <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white px-6 py-4 border-b border-gray-200">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="mr-4"
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={24}
                                    color="#374151"
                                />
                            </TouchableOpacity>
                            <Text className="text-xl font-bold text-gray-800">
                                Pending Requests
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => refetch()}>
                            <Ionicons
                                name="refresh"
                                size={24}
                                color="#3b82f6"
                            />
                        </TouchableOpacity>
                    </View>
                    {requests && (
                        <Text className="text-sm text-gray-500 mt-1">
                            {requests.length}{" "}
                            {requests.length === 1 ? "request" : "requests"}
                        </Text>
                    )}
                </View>

                {/* Content */}
                <View className="flex-1 px-6 py-4">
                    {isLoading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState />
                    ) : (
                        <FlatList
                            data={requests || []}
                            renderItem={renderRequestItem}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefetching}
                                    onRefresh={refetch}
                                    colors={["#3b82f6"]}
                                />
                            }
                            ListEmptyComponent={EmptyState}
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

export default withNetworkErrorHandling(PendingRequests, {
    errorMessage: "Pending requests require internet connection to load",
    showFullScreenError: true,
    autoRetry: true,
});
