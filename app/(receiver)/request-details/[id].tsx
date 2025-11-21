import useAcceptMaintenanceRequest from "@/hooks/maintenance/useAcceptMaintenanceRequest";
import useGetMaintenanceRequestById from "@/hooks/maintenance/useGetMaintenanceRequestById";
import useRejectMaintenanceRequest from "@/hooks/maintenance/useRejectMaintenanceRequest";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const RequestDetails = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectionInput, setShowRejectionInput] = useState(false);

    // Fetch request details using the hook
    const {
        data: request,
        isLoading: isRequestLoading,
        error,
        refetch,
    } = useGetMaintenanceRequestById(id as string);

    console.log("data 222 : ", id);
    console.log("data 222 : ", request);

    // Accept and reject mutations
    const acceptMutation = useAcceptMaintenanceRequest();
    const rejectMutation = useRejectMaintenanceRequest();

    // Check if any operation is loading
    const isLoading = acceptMutation.isPending || rejectMutation.isPending;

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleAccept = async () => {
        Alert.alert(
            "Accept Request",
            "Are you sure you want to accept this maintenance request?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Accept",
                    style: "default",
                    onPress: async () => {
                        try {
                            await acceptMutation.mutateAsync(id as string);
                            Alert.alert(
                                "Success",
                                "Request accepted successfully!",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => router.back(),
                                    },
                                ]
                            );
                        } catch (error) {
                            console.error("Error accepting request:", error);
                            Alert.alert(
                                "Error",
                                "Failed to accept request. Please try again."
                            );
                        }
                    },
                },
            ]
        );
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            Alert.alert(
                "Rejection Reason Required",
                "Please provide a reason for rejecting this request."
            );
            return;
        }

        try {
            await rejectMutation.mutateAsync({
                requestId: id as string,
                rejectionMessage: rejectionReason.trim(),
            });
            Alert.alert("Success", "Request rejected successfully!", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            console.error("Error rejecting request:", error);
            Alert.alert("Error", "Failed to reject request. Please try again.");
        } finally {
            setShowRejectionInput(false);
            setRejectionReason("");
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white px-6 py-4 border-b border-gray-200">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mr-4"
                            disabled={isLoading}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#374151"
                            />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-gray-800">
                                Request Details
                            </Text>
                            <Text className="text-sm text-gray-500">
                                Review and take action
                            </Text>
                        </View>
                        {!isRequestLoading && (
                            <TouchableOpacity onPress={() => refetch()}>
                                <Ionicons
                                    name="refresh"
                                    size={24}
                                    color="#3b82f6"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Loading State */}
                {isRequestLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text className="text-gray-500 mt-4">
                            Loading request details...
                        </Text>
                    </View>
                ) : error ? (
                    /* Error State */
                    <View className="flex-1 justify-center items-center py-20">
                        <Ionicons
                            name="alert-circle-outline"
                            size={64}
                            color="#ef4444"
                        />
                        <Text className="text-lg font-medium text-gray-800 mt-4">
                            Error Loading Request
                        </Text>
                        <Text className="text-sm text-gray-500 text-center mt-2 px-8">
                            {error?.message || "Failed to load request details"}
                        </Text>
                        <TouchableOpacity
                            className="bg-blue-600 px-6 py-3 rounded-lg mt-4"
                            onPress={() => refetch()}
                        >
                            <Text className="text-white font-medium">
                                Try Again
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : !request ? (
                    /* Not Found State */
                    <View className="flex-1 justify-center items-center py-20">
                        <Ionicons
                            name="document-outline"
                            size={64}
                            color="#d1d5db"
                        />
                        <Text className="text-lg font-medium text-gray-500 mt-4">
                            Request Not Found
                        </Text>
                        <Text className="text-sm text-gray-400 text-center mt-2 px-8">
                            The requested maintenance record could not be found
                        </Text>
                        <TouchableOpacity
                            className="bg-gray-500 px-6 py-3 rounded-lg mt-4"
                            onPress={() => router.back()}
                        >
                            <Text className="text-white font-medium">
                                Go Back
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Content */
                    <>
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Status Badge */}
                            <View className="px-6 pt-6">
                                <View
                                    className="self-start px-4 py-2 rounded-full flex-row items-center mb-6"
                                    style={{
                                        backgroundColor: `${getStatusColor(
                                            request.status
                                        )}20`,
                                    }}
                                >
                                    <Text
                                        className="text-sm font-semibold capitalize"
                                        style={{
                                            color: getStatusColor(
                                                request.status
                                            ),
                                        }}
                                    >
                                        {request.status}
                                    </Text>
                                </View>
                            </View>

                            {/* Driver & Car Information */}
                            <View className="bg-white mx-6 rounded-xl p-4 mb-4 shadow-sm">
                                <Text className="text-lg font-bold text-gray-800 mb-3">
                                    Vehicle & Driver Information
                                </Text>

                                <View className="flex-row items-center mb-3">
                                    <Ionicons
                                        name="person"
                                        size={16}
                                        color="#6b7280"
                                    />
                                    <Text className="text-gray-600 ml-2 font-medium">
                                        Driver:
                                    </Text>
                                    <Text className="text-gray-800 ml-2">
                                        {request.driver.name}
                                    </Text>
                                </View>

                                <View className="flex-row items-center mb-3">
                                    <Ionicons
                                        name="call"
                                        size={16}
                                        color="#6b7280"
                                    />
                                    <Text className="text-gray-600 ml-2 font-medium">
                                        Phone:
                                    </Text>
                                    <Text className="text-gray-800 ml-2">
                                        {request.driver.phoneNumber}
                                    </Text>
                                </View>

                                <View className="flex-row items-center mb-3">
                                    <Ionicons
                                        name="car"
                                        size={16}
                                        color="#6b7280"
                                    />
                                    <Text className="text-gray-600 ml-2 font-medium">
                                        Vehicle:
                                    </Text>
                                    <Text className="text-gray-800 ml-2">
                                        {request.car.brand} {request.car.model}{" "}
                                        ({request.car.plateNumber})
                                    </Text>
                                </View>

                                <View className="flex-row items-center">
                                    <Ionicons
                                        name="speedometer"
                                        size={16}
                                        color="#6b7280"
                                    />
                                    <Text className="text-gray-600 ml-2 font-medium">
                                        Mileage:
                                    </Text>
                                    <Text className="text-gray-800 ml-2">
                                        {/* {request.car.meterReading.toLocaleString()}{" "} */}
                                        km
                                    </Text>
                                </View>
                            </View>

                            {/* Request Details */}
                            <View className="bg-white mx-6 rounded-xl p-4 mb-4 shadow-sm">
                                <Text className="text-lg font-bold text-gray-800 mb-3">
                                    Maintenance Details
                                </Text>

                                <View className="mb-3">
                                    <Text className="text-gray-600 font-medium mb-1">
                                        Description:
                                    </Text>
                                    <Text className="text-gray-800">
                                        {request.description}
                                    </Text>
                                </View>

                                <View className="mb-3">
                                    <Text className="text-gray-600 font-medium mb-2">
                                        Categories:
                                    </Text>
                                    <View className="flex-row flex-wrap">
                                        {request.subCategories.map(
                                            (subCategory: any) => (
                                                <View
                                                    key={subCategory._id}
                                                    className="bg-blue-50 px-3 py-1 rounded-md mr-2 mb-2"
                                                >
                                                    <Text className="text-sm text-blue-600">
                                                        {subCategory.name}
                                                    </Text>
                                                </View>
                                            )
                                        )}
                                    </View>
                                </View>

                                <View className="mb-3">
                                    <Text className="text-gray-600 font-medium mb-1">
                                        Created:
                                    </Text>
                                    <Text className="text-gray-800">
                                        {formatDate(request.createdAt)}
                                    </Text>
                                </View>
                            </View>

                            {/* Custom Fields */}
                            {request.customFieldData &&
                                request.customFieldData.length > 0 && (
                                    <View className="bg-white mx-6 rounded-xl p-4 mb-4 shadow-sm">
                                        <Text className="text-lg font-bold text-gray-800 mb-3">
                                            Additional Information
                                        </Text>
                                        {request.customFieldData.map(
                                            (field: any, index: number) => (
                                                <View
                                                    key={index}
                                                    className="mb-2"
                                                >
                                                    <Text className="text-gray-600 font-medium">
                                                        {field.fieldName}:
                                                    </Text>
                                                    <Text className="text-gray-800">
                                                        {field.fieldValue}
                                                    </Text>
                                                </View>
                                            )
                                        )}
                                    </View>
                                )}

                            {/* Cost Information */}
                            <View className="bg-white mx-6 rounded-xl p-4 mb-4 shadow-sm">
                                <Text className="text-lg font-bold text-gray-800 mb-3">
                                    Cost Information
                                </Text>

                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-gray-600 font-medium">
                                        Cost:
                                    </Text>
                                    <Text className="text-lg font-bold text-green-600">
                                        ${request.cost}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between items-center mb-5">
                                    <Text className="text-gray-600 font-medium">
                                        Mechanic Cost:
                                    </Text>
                                    <Text className="text-lg font-bold text-blue-600">
                                        ${request.mechanicCost}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-600 font-medium">
                                        Total Cost:
                                    </Text>
                                    <Text className="text-lg font-bold text-blue-900">
                                        ${request.mechanicCost + request.cost}
                                    </Text>
                                </View>
                            </View>

                            {/* Rejection Input */}
                            {showRejectionInput && (
                                <View className="bg-white mx-6 rounded-xl p-4 mb-4 shadow-sm">
                                    <Text className="text-lg font-bold text-gray-800 mb-3">
                                        Rejection Reason
                                    </Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                                        placeholder="Please provide a reason for rejection..."
                                        value={rejectionReason}
                                        onChangeText={setRejectionReason}
                                        multiline={true}
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                        editable={!isLoading}
                                    />
                                </View>
                            )}

                            <View className="h-20" />
                        </ScrollView>

                        {/* Action Buttons */}
                        {request.status === "open" && (
                            <View className="bg-white px-6 py-4 border-t border-gray-200">
                                {showRejectionInput ? (
                                    <View className="flex-row space-x-8 gap-5">
                                        <TouchableOpacity
                                            className="flex-1 bg-gray-500 rounded-xl p-4 items-center"
                                            onPress={() => {
                                                setShowRejectionInput(false);
                                                setRejectionReason("");
                                            }}
                                            disabled={isLoading}
                                        >
                                            <Text className="text-white font-semibold">
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="flex-1 bg-red-600 rounded-xl p-4 items-center"
                                            onPress={handleReject}
                                            disabled={
                                                isLoading ||
                                                !rejectionReason.trim()
                                            }
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator
                                                    color="white"
                                                    size="small"
                                                />
                                            ) : (
                                                <Text className="text-white font-semibold">
                                                    Confirm Reject
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View className="flex-row space-x-8 gap-5">
                                        <TouchableOpacity
                                            className="flex-1 bg-red-600 rounded-xl p-4 items-center"
                                            onPress={() =>
                                                setShowRejectionInput(true)
                                            }
                                            disabled={isLoading}
                                        >
                                            <Text className="text-white font-semibold">
                                                Reject
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="flex-1 bg-green-600 rounded-xl p-4 items-center"
                                            onPress={handleAccept}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator
                                                    color="white"
                                                    size="small"
                                                />
                                            ) : (
                                                <Text className="text-white font-semibold">
                                                    Accept
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}
                    </>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default RequestDetails;
