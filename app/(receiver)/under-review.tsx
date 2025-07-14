import useGetUnderReviewRequests from "@/hooks/receiver/useGetUnderReviewRequets";
import { MaintenanceRequest } from "@/types/maintenance-request";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const getStatusColor = (status: string) => {
    switch (status) {
        case "pending":
            return "#f59e0b";
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
            return "time-outline";
        case "accepted":
            return "checkmark-circle-outline";
        case "underReview":
            return "eye-outline";
        case "completed":
            return "checkmark-done-outline";
        case "rejected":
            return "close-circle-outline";
        default:
            return "help-circle-outline";
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
            return "Unknown";
    }
};

const UnderReviewRequests = () => {
    const router = useRouter();
    const { data: allRequests, isLoading, error } = useGetUnderReviewRequests();

    console.log("Under Review Requests Data", allRequests);

    // Filter only under review requests
    const underReviewRequests =
        allRequests?.filter(
            (request: MaintenanceRequest) => request.status === "underReview"
        ) || [];

    const renderRequestItem = ({ item }: { item: MaintenanceRequest }) => (
        <TouchableOpacity
            onPress={() =>
                router.push(`/(receiver)/request-details/${item._id}`)
            }
            className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            }}
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800 mb-1">
                        {item.subCategories && item.subCategories.length > 0
                            ? item.subCategories[0].name
                            : "No Category"}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                        {item.subCategories && item.subCategories.length > 1
                            ? `+${
                                  item.subCategories.length - 1
                              } more categories`
                            : item.subCategories &&
                              item.subCategories.length > 0
                            ? "Single category"
                            : "No categories"}
                    </Text>
                </View>
                <View
                    className="px-3 py-1 rounded-full flex-row items-center"
                    style={{
                        backgroundColor: `${getStatusColor(item.status)}20`,
                    }}
                >
                    <Ionicons
                        name={
                            getStatusIcon(
                                item.status
                            ) as keyof typeof Ionicons.glyphMap
                        }
                        size={14}
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
                {item.description || "No description provided"}
            </Text>

            {item.subCategories && item.subCategories.length > 0 && (
                <View className="flex-row flex-wrap mb-3">
                    {item.subCategories
                        .slice(0, 2)
                        .map((subCategory, index) => (
                            <View
                                key={subCategory._id}
                                className="bg-blue-50 px-2 py-1 rounded-md mr-1 mb-1"
                            >
                                <Text className="text-xs text-blue-700 font-medium">
                                    {subCategory.name}
                                </Text>
                            </View>
                        ))}
                    {item.subCategories.length > 2 && (
                        <View className="bg-gray-100 px-2 py-1 rounded-md">
                            <Text className="text-xs text-gray-600 font-medium">
                                +{item.subCategories.length - 2} more
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <Ionicons
                        name="person-outline"
                        size={16}
                        color="#6b7280"
                        style={{ marginRight: 4 }}
                    />
                    <Text className="text-gray-600 text-sm">
                        {item.driver?.name || "Unknown Driver"}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons
                        name="car-outline"
                        size={16}
                        color="#6b7280"
                        style={{ marginRight: 4 }}
                    />
                    <Text className="text-gray-600 text-sm">
                        {item.car?.plateNumber || "No plate"}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center mt-2">
                <Ionicons
                    name="calendar-outline"
                    size={16}
                    color="#6b7280"
                    style={{ marginRight: 4 }}
                />
                <Text className="text-gray-500 text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-gray-50">
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#f59e0b" />
                        <Text className="text-gray-600 mt-4">
                            Loading under review requests...
                        </Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (error) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-gray-50">
                    <View className="flex-1 justify-center items-center px-6">
                        <Ionicons
                            name="warning-outline"
                            size={64}
                            color="#ef4444"
                        />
                        <Text className="text-red-600 text-lg font-semibold mt-4 text-center">
                            Error Loading Requests
                        </Text>
                        <Text className="text-gray-600 text-center mt-2">
                            Failed to load under review requests. Please try
                            again.
                        </Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="px-6 py-4 bg-white border-b border-gray-200">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mr-4 p-2 rounded-lg bg-gray-100"
                        >
                            <Ionicons
                                name="arrow-back"
                                size={20}
                                color="#374151"
                            />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-gray-800">
                                Under Review Requests
                            </Text>
                            <Text className="text-gray-600 text-sm">
                                {underReviewRequests.length} request
                                {underReviewRequests.length !== 1 ? "s" : ""}
                            </Text>
                        </View>
                        <View
                            className="px-3 py-1 rounded-full flex-row items-center"
                            style={{ backgroundColor: "#fef3c7" }}
                        >
                            <Ionicons
                                name="eye-outline"
                                size={16}
                                color="#f59e0b"
                                style={{ marginRight: 4 }}
                            />
                            <Text className="text-amber-600 text-sm font-medium">
                                {underReviewRequests.length}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 py-4">
                    {underReviewRequests.length === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <Ionicons
                                name="eye-outline"
                                size={64}
                                color="#d1d5db"
                            />
                            <Text className="text-gray-500 text-lg font-semibold mt-4">
                                No Under Review Requests
                            </Text>
                            <Text className="text-gray-400 text-center mt-2 px-8">
                                All requests are either pending approval or have
                                been processed.
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={underReviewRequests}
                            renderItem={renderRequestItem}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default UnderReviewRequests;
