import useUploadCarMeterImage from "@/hooks/ocr/useUploadCarMeterImage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UploadImage = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { mutateAsync, isPending } = useUploadCarMeterImage();

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Required",
                "Camera access is needed to capture the meter reading.",
                [{ text: "OK" }]
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
        }
    };

    const openGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
        }
    };

    const retakePhoto = () => {
        setImageUri(null);
        setIsUploading(false);
    };

    useEffect(() => {
        if (imageUri) {
            const uploadImage = async () => {
                try {
                    setIsUploading(true);
                    const { uri } = await FileSystem.getInfoAsync(imageUri);
                    console.log(uri);
                    const imageFile = {
                        uri: imageUri,
                        name: "car-meter.jpg",
                        type: "image/jpeg",
                    };
                    await mutateAsync(imageFile);
                    Alert.alert(
                        "Success!",
                        "Meter reading uploaded successfully.",
                        [{ text: "OK", onPress: () => setImageUri(null) }]
                    );
                } catch (error) {
                    console.error("Error uploading image:", error);
                    Alert.alert(
                        "Upload Failed",
                        "Failed to upload the image. Please try again.",
                        [
                            {
                                text: "Retry",
                                onPress: () => setIsUploading(false),
                            },
                        ]
                    );
                } finally {
                    setIsUploading(false);
                }
            };

            uploadImage();
        }
    }, [imageUri]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-row items-center mb-4"
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mr-4 p-2 rounded-full"
                            style={{
                                backgroundColor: "rgba(102, 126, 234, 0.1)",
                            }}
                        >
                            <MaterialCommunityIcons
                                name="arrow-left"
                                size={20}
                                color="#667eea"
                            />
                        </TouchableOpacity>
                        <Text className="text-gray-800 font-bold text-xl flex-1">
                            Upload Meter Reading
                        </Text>
                    </TouchableOpacity>

                    <Text className="text-gray-600 leading-relaxed">
                        Take a clear photo of your vehicle's odometer/meter
                        reading for accurate tracking.
                    </Text>
                </View>

                {/* Instructions Card */}
                <View className="mx-6 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <View className="flex-row items-center mb-3">
                        <MaterialCommunityIcons
                            name="information"
                            size={20}
                            color="#3b82f6"
                        />
                        <Text className="text-blue-800 font-semibold ml-2">
                            Photo Guidelines
                        </Text>
                    </View>
                    <View className="space-y-2">
                        <Text className="text-blue-700 text-sm">
                            • Ensure good lighting conditions
                        </Text>
                        <Text className="text-blue-700 text-sm">
                            • Keep the camera steady and focused
                        </Text>
                        <Text className="text-blue-700 text-sm">
                            • Make sure all digits are clearly visible
                        </Text>
                        <Text className="text-blue-700 text-sm">
                            • Avoid glare or reflections on the display
                        </Text>
                    </View>
                </View>

                {/* Image Preview Area */}
                <View className="flex-1 px-6">
                    <View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                        {imageUri ? (
                            <View className="items-center">
                                <View className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-4">
                                    <Image
                                        source={{ uri: imageUri }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>

                                {isUploading || isPending ? (
                                    <View className="items-center py-4">
                                        <ActivityIndicator
                                            size="large"
                                            color="#667eea"
                                        />
                                        <Text className="text-gray-600 mt-2">
                                            Uploading image...
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={retakePhoto}
                                        className="flex-row items-center justify-center bg-gray-100 px-6 py-3 rounded-xl"
                                    >
                                        <MaterialCommunityIcons
                                            name="camera"
                                            size={20}
                                            color="#6b7280"
                                        />
                                        <Text className="text-gray-700 font-medium ml-2">
                                            Retake Photo
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : (
                            <View className="items-center py-12">
                                <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                                    <MaterialCommunityIcons
                                        name="camera-outline"
                                        size={40}
                                        color="#9ca3af"
                                    />
                                </View>
                                <Text className="text-gray-800 font-semibold text-lg mb-2">
                                    No Photo Selected
                                </Text>
                                <Text className="text-gray-500 text-center">
                                    Choose how you'd like to capture the meter
                                    reading
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Action Buttons */}
                    {!imageUri && (
                        <View className="space-y-3 mb-6">
                            {/* Camera Button */}
                            <TouchableOpacity
                                onPress={openCamera}
                                className="bg-blue-600 rounded-xl p-4 flex-row items-center justify-center shadow-sm mb-6"
                                disabled={isUploading || isPending}
                            >
                                <MaterialCommunityIcons
                                    name="camera"
                                    size={24}
                                    color="white"
                                />
                                <Text className="text-white font-semibold text-lg ml-3">
                                    Take Photo
                                </Text>
                            </TouchableOpacity>

                            {/* Gallery Button */}
                            <TouchableOpacity
                                onPress={openGallery}
                                className="bg-white border-2 border-blue-600 rounded-xl p-4 flex-row items-center justify-center"
                                disabled={isUploading || isPending}
                            >
                                <MaterialCommunityIcons
                                    name="image-multiple"
                                    size={24}
                                    color="#2563eb"
                                />
                                <Text className="text-blue-600 font-semibold text-lg ml-3">
                                    Choose from Gallery
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Bottom spacing */}
                <View className="h-8" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadImage;
