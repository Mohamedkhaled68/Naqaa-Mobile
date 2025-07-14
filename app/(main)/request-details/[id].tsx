import useGetMaintenanceRequestById from "@/hooks/maintenance/useGetMaintenanceRequestById";
import useUploadMaintenanceReceipt from "@/hooks/maintenance/useUploadMaintenanceReceipt";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const RequestDetailsPage = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const {
        data: request,
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useGetMaintenanceRequestById(id as string);

    const uploadReceipt = useUploadMaintenanceReceipt();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
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
            case "pending":
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
            case "pending":
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

    const pickImage = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["image/*"],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0]);
                console.log("Image selected:", result.assets[0].name);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image");
        }
    };

    const takePhoto = async () => {
        try {
            // Check if camera is available
            const isAvailable = await ImagePicker.getCameraPermissionsAsync();

            // Request camera permissions
            const { status } =
                await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission required",
                    "Camera permission is needed to take photos."
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setSelectedImage({
                    uri: asset.uri,
                    name: `photo_${Date.now()}.jpg`,
                    mimeType: "image/jpeg",
                    size: asset.fileSize || 0,
                });
                console.log("Photo taken successfully");
            }
        } catch (error) {
            console.error("Error taking photo:", error);
            // Fallback to gallery if camera fails
            Alert.alert(
                "Camera Error",
                "Unable to access camera. Would you like to select from gallery instead?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Open Gallery",
                        onPress: pickFromGallery,
                    },
                ]
            );
        }
    };

    const pickFromGallery = async () => {
        try {
            // Request media library permissions
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission required",
                    "Photo library permission is needed to select images."
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setSelectedImage({
                    uri: asset.uri,
                    name: asset.fileName || `image_${Date.now()}.jpg`,
                    mimeType: "image/jpeg",
                    size: asset.fileSize || 0,
                });
                console.log("Image selected from gallery");
            }
        } catch (error) {
            console.error("Error picking from gallery:", error);
            Alert.alert("Error", "Failed to select image");
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/pdf", "image/*"],
                copyToCacheDirectory: true,
                multiple: false,
            });

            console.log("Document picker result:", result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedFile = result.assets[0];
                setSelectedImage(selectedFile);
                console.log(
                    "Document selected:",
                    selectedFile.name,
                    selectedFile.mimeType
                );
            }
        } catch (error) {
            console.error("Error picking document:", error);
            Alert.alert(
                "Error",
                "Failed to select document. Please try again."
            );
        }
    };

    const showFilePickerOptions = () => {
        Alert.alert(
            "Add Receipt",
            "Choose how you want to add your receipt:",
            [
                {
                    text: "📷 Take Photo",
                    onPress: takePhoto,
                    style: "default",
                },
                {
                    text: "🖼️ Choose from Gallery",
                    onPress: pickFromGallery,
                    style: "default",
                },
                {
                    text: "📄 Select PDF/Document",
                    onPress: pickDocument,
                    style: "default",
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    const uploadReceiptFile = async () => {
        if (!selectedImage || !request) {
            Alert.alert("Error", "Please select a file first");
            return;
        }

        try {
            console.log("Uploading receipt for request:", request._id);
            console.log("File details:", selectedImage);

            // Determine the appropriate file type
            let fileType = selectedImage.mimeType || "application/octet-stream";
            let fileName = selectedImage.name || "receipt";

            // Handle different file types
            if (fileName.toLowerCase().endsWith(".pdf")) {
                fileType = "application/pdf";
            } else if (fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
                fileType = selectedImage.mimeType || "image/jpeg";
            }

            await uploadReceipt.mutateAsync({
                requestId: request._id,
                receiptFile: {
                    uri: selectedImage.uri,
                    type: fileType,
                    name: fileName,
                },
            });

            console.log("Receipt uploaded successfully");
            Alert.alert("Success", "Receipt uploaded successfully!", [
                {
                    text: "OK",
                    onPress: () => {
                        setSelectedImage(null);
                        refetch();
                    },
                },
            ]);
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "Failed to upload receipt. Please try again.");
        }
    };

    const LoadingState = () => (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-500 mt-4">
                Loading request details...
            </Text>
        </View>
    );

    const ErrorState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
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
                <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    useEffect(() => {
        if (request) {
            console.log(
                "Request loaded:",
                request._id,
                "Status:",
                request.status
            );
        }
    }, [request]);

    if (isLoading) return <LoadingState />;
    if (error || !request) return <ErrorState />;

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white px-6 py-4 border-b border-gray-200">
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-row items-center"
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#374151"
                            />
                            <Text className="text-lg font-semibold text-gray-800 ml-3">
                                Request Details
                            </Text>
                        </TouchableOpacity>
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

                <ScrollView
                    className="flex-1"
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={refetch}
                            colors={["#3b82f6"]}
                        />
                    }
                >
                    <View className="p-6">
                        {/* Request Header Card */}
                        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="flex-1">
                                    <Text className="text-xl font-bold text-gray-800 mb-2">
                                        Request #
                                        {request._id.slice(-6).toUpperCase()}
                                    </Text>
                                    <Text className="text-lg text-gray-600">
                                        {request.car?.brand}{" "}
                                        {request.car?.model}
                                    </Text>
                                    <Text className="text-sm text-gray-500">
                                        Plate: {request.car?.plateNumber}
                                    </Text>
                                </View>
                                <View
                                    className="px-4 py-2 rounded-full flex-row items-center"
                                    style={{
                                        backgroundColor: `${getStatusColor(
                                            request.status
                                        )}20`,
                                    }}
                                >
                                    <Ionicons
                                        name={
                                            getStatusIcon(request.status) as any
                                        }
                                        size={16}
                                        color={getStatusColor(request.status)}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text
                                        className="text-sm font-medium"
                                        style={{
                                            color: getStatusColor(
                                                request.status
                                            ),
                                        }}
                                    >
                                        {getStatusText(request.status)}
                                    </Text>
                                </View>
                            </View>

                            <View className="border-t border-gray-100 pt-4">
                                <Text className="text-sm text-gray-500 mb-1">
                                    Created
                                </Text>
                                <Text className="text-base text-gray-800">
                                    {formatDate(request.createdAt)}
                                </Text>
                            </View>
                        </View>

                        {/* Description Card */}
                        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-3">
                                Description
                            </Text>
                            <Text className="text-gray-700 leading-6">
                                {request.description}
                            </Text>
                        </View>

                        {/* Subcategories Card */}
                        {request.subCategories &&
                            request.subCategories.length > 0 && (
                                <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                                    <Text className="text-lg font-semibold text-gray-800 mb-3">
                                        Service Categories
                                    </Text>
                                    <View className="flex-row flex-wrap">
                                        {request.subCategories.map(
                                            (
                                                subCategory: any,
                                                index: number
                                            ) => (
                                                <View
                                                    key={subCategory._id}
                                                    className="bg-blue-50 px-3 py-2 rounded-lg mr-2 mb-2"
                                                >
                                                    <Text className="text-blue-600 font-medium">
                                                        {subCategory.name}
                                                    </Text>
                                                </View>
                                            )
                                        )}
                                    </View>
                                </View>
                            )}

                        {/* Cost Information */}
                        {request.cost && (
                            <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                                <Text className="text-lg font-semibold text-gray-800 mb-3">
                                    Cost Information
                                </Text>
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-600">
                                        Total Cost
                                    </Text>
                                    <Text className="text-xl font-bold text-green-600">
                                        ${request.cost}
                                    </Text>
                                </View>
                                {request.mechanicCost && (
                                    <View className="flex-row justify-between items-center mt-2">
                                        <Text className="text-gray-600">
                                            Mechanic Cost
                                        </Text>
                                        <Text className="text-lg font-semibold text-gray-800">
                                            ${request.mechanicCost}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Receiver Information */}
                        {request.receiver && (
                            <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                                <Text className="text-lg font-semibold text-gray-800 mb-3">
                                    Assigned Receiver
                                </Text>
                                <Text className="text-gray-800 font-medium">
                                    {request.receiver.name}
                                </Text>
                                <Text className="text-gray-600">
                                    {request.receiver.email}
                                </Text>
                            </View>
                        )}

                        {/* Rejection Message */}
                        {request.status === "rejected" &&
                            request.rejectionMessage && (
                                <View className="bg-red-50 rounded-lg p-6 mb-4 border-l-4 border-red-400">
                                    <Text className="text-lg font-semibold text-red-700 mb-2">
                                        Rejection Reason
                                    </Text>
                                    <Text className="text-red-600">
                                        {request.rejectionMessage}
                                    </Text>
                                </View>
                            )}

                        {/* Under Review Message */}
                        {request.status === "underReview" && (
                            <View className="bg-yellow-50 rounded-lg p-6 mb-4 border-l-4 border-yellow-400">
                                <Text className="text-lg font-semibold text-yellow-700 mb-2">
                                    Under Review
                                </Text>
                                <Text className="text-yellow-600">
                                    Your maintenance request is currently being
                                    reviewed by our team. We'll update you once
                                    the review is complete.
                                </Text>
                            </View>
                        )}

                        {/* Pending Message */}
                        {request.status === "pending" && (
                            <View className="bg-blue-50 rounded-lg p-6 mb-4 border-l-4 border-blue-400">
                                <Text className="text-lg font-semibold text-blue-700 mb-2">
                                    Request Submitted
                                </Text>
                                <Text className="text-blue-600">
                                    Your maintenance request has been submitted
                                    and is waiting to be assigned to a receiver.
                                </Text>
                            </View>
                        )}

                        {/* Completed Message */}
                        {request.status === "completed" && (
                            <View className="bg-green-50 rounded-lg p-6 mb-4 border-l-4 border-green-400">
                                <Text className="text-lg font-semibold text-green-700 mb-2">
                                    Maintenance Completed
                                </Text>
                                <Text className="text-green-600">
                                    Your maintenance request has been completed
                                    successfully. Thank you for using our
                                    service!
                                </Text>
                            </View>
                        )}

                        {/* Upload Receipt Section for Accepted Requests */}
                        {request.status === "accepted" && (
                            <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">
                                    Upload Receipt
                                </Text>

                                {selectedImage ? (
                                    <View className="mb-4">
                                        <Text className="text-sm text-gray-600 mb-2">
                                            Selected File:
                                        </Text>
                                        <View className="bg-gray-50 p-3 rounded-lg">
                                            <View className="flex-row items-center">
                                                <Ionicons
                                                    name={
                                                        selectedImage.mimeType?.includes(
                                                            "pdf"
                                                        )
                                                            ? "document-outline"
                                                            : "image-outline"
                                                    }
                                                    size={20}
                                                    color="#6b7280"
                                                    style={{ marginRight: 8 }}
                                                />
                                                <View className="flex-1">
                                                    <Text className="text-gray-800 font-medium">
                                                        {selectedImage.name}
                                                    </Text>
                                                    <Text className="text-gray-500 text-sm">
                                                        {selectedImage.size
                                                            ? `${(
                                                                  selectedImage.size /
                                                                  1024 /
                                                                  1024
                                                              ).toFixed(2)} MB`
                                                            : "Size unknown"}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setSelectedImage(null)
                                                    }
                                                    className="p-2"
                                                >
                                                    <Ionicons
                                                        name="close-circle"
                                                        size={20}
                                                        color="#ef4444"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ) : null}

                                <View className="space-y-3">
                                    {!selectedImage ? (
                                        <TouchableOpacity
                                            className="bg-blue-600 py-4 px-4 rounded-lg flex-row items-center justify-center"
                                            onPress={showFilePickerOptions}
                                        >
                                            <Ionicons
                                                name="add-circle-outline"
                                                size={20}
                                                color="white"
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text className="text-white font-medium text-base">
                                                Add Receipt
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View className="flex-row gap-3">
                                            <TouchableOpacity
                                                className="flex-1 bg-gray-500 py-3 px-4 rounded-lg flex-row items-center justify-center"
                                                onPress={showFilePickerOptions}
                                            >
                                                <Ionicons
                                                    name="swap-horizontal-outline"
                                                    size={20}
                                                    color="white"
                                                    style={{ marginRight: 8 }}
                                                />
                                                <Text className="text-white font-medium">
                                                    Change
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                className="flex-1 bg-green-600 py-3 px-4 rounded-lg flex-row items-center justify-center"
                                                onPress={uploadReceiptFile}
                                                disabled={
                                                    uploadReceipt.isPending
                                                }
                                            >
                                                {uploadReceipt.isPending ? (
                                                    <ActivityIndicator
                                                        size="small"
                                                        color="white"
                                                    />
                                                ) : (
                                                    <>
                                                        <Ionicons
                                                            name="cloud-upload-outline"
                                                            size={20}
                                                            color="white"
                                                            style={{
                                                                marginRight: 8,
                                                            }}
                                                        />
                                                        <Text className="text-white font-medium">
                                                            Upload
                                                        </Text>
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                <View className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <Text className="text-xs text-blue-700 text-center font-medium">
                                        📷 Take Photo • 🖼️ Choose from Gallery •
                                        📄 Select PDF Document
                                    </Text>
                                    <Text className="text-xs text-blue-600 text-center mt-1">
                                        Upload a photo or PDF of your
                                        maintenance receipt for record keeping
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View className="h-32" />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default RequestDetailsPage;
