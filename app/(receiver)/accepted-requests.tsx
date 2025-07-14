import useGetAcceptedRequests from "@/hooks/receiver/useGetAcceptedRequests";
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

const AcceptedRequests = () => {
    const router = useRouter();
    const {
        data: requests,
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useGetAcceptedRequests();


    console.log("Accepted Requests Data:", requests);
    

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
            case "in_progress":
                return "#8b5cf6";
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
            case "in_progress":
                return "play-circle-outline";
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
            case "in_progress":
                return "In Progress";
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
                className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
                onPress={() => {
                    // TODO: Navigate to detailed view when implemented
                    console.log("View request details:", item._id);
                }}
            >
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-800 mb-1">
                            {item.driver.name}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            {item.car.brand} {item.car.model} (
                            {item.car.plateNumber})
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

                <Text className="text-gray-700 mb-3" numberOfLines={2}>
                    {item.description}
                </Text>

                {item.subCategories && item.subCategories.length > 0 && (
                    <View className="flex-row flex-wrap mb-3">
                        {item.subCategories.map((subCategory, index) => (
                            <View
                                key={subCategory._id}
                                className="bg-green-50 px-2 py-1 rounded-md mr-2 mb-1"
                            >
                                <Text className="text-xs text-green-600">
                                    {subCategory.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xs text-gray-500">
                        {item.approvedDate
                            ? `Approved: ${formatDate(item.approvedDate)}`
                            : `Created: ${formatDate(item.createdAt)}`}
                    </Text>
                    {(item.cost || item.actualCost) && (
                        <Text className="text-sm font-semibold text-green-600">
                            ${item.actualCost || item.cost}
                        </Text>
                    )}
                </View>

                {item.completedDate && (
                    <View className="bg-green-50 px-3 py-2 rounded-lg mb-2">
                        <Text className="text-xs text-green-700 font-medium">
                            Completed: {formatDate(item.completedDate)}
                        </Text>
                    </View>
                )}

                {item.receiverNotes && (
                    <View className="bg-blue-50 px-3 py-2 rounded-lg mb-2">
                        <Text className="text-xs text-blue-700 font-medium mb-1">
                            Receiver Notes:
                        </Text>
                        <Text className="text-xs text-blue-600">
                            {item.receiverNotes}
                        </Text>
                    </View>
                )}

                {item.customFieldData && item.customFieldData.length > 0 && (
                    <View className="mt-2 pt-2 border-t border-gray-100">
                        {item.customFieldData
                            .slice(0, 2)
                            .map((field, index) => (
                                <Text
                                    key={index}
                                    className="text-xs text-gray-600"
                                >
                                    {field.fieldName}: {field.fieldValue}
                                </Text>
                            ))}
                    </View>
                )}

                {item.receiptImage && (
                    <View className="mt-2 flex-row items-center">
                        <Ionicons
                            name="receipt-outline"
                            size={14}
                            color="#6b7280"
                        />
                        <Text className="text-xs text-gray-600 ml-1">
                            Receipt attached
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const EmptyState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <Ionicons
                name="checkmark-circle-outline"
                size={64}
                color="#d1d5db"
            />
            <Text className="text-lg font-medium text-gray-500 mt-4">
                No Accepted Requests
            </Text>
            <Text className="text-sm text-gray-400 text-center mt-2 px-8">
                Accepted maintenance requests will appear here
            </Text>
        </View>
    );

    const LoadingState = () => (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#10b981" />
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
                {error?.message || "Failed to load accepted requests"}
            </Text>
            <TouchableOpacity
                className="bg-green-600 px-6 py-3 rounded-lg mt-4"
                onPress={() => refetch()}
            >
                <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    // Group requests by status for better organization
    const groupedRequests = requests?.reduce(
        (acc: any, request: MaintenanceRequest) => {
            const status = request.status;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(request);
            return acc;
        },
        {}
    );

    const acceptedRequestsOnly =
        requests?.filter(
            (request: MaintenanceRequest) => request.status === "accepted"
        ) || [];

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
                                Accepted Requests
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => refetch()}>
                            <Ionicons
                                name="refresh"
                                size={24}
                                color="#10b981"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 py-4">
                    {isLoading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState />
                    ) : (
                        <FlatList
                            data={acceptedRequestsOnly || []}
                            renderItem={renderRequestItem}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefetching}
                                    onRefresh={refetch}
                                    colors={["#10b981"]}
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

export default AcceptedRequests;
