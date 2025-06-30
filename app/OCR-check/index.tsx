import useUploadCarMeterImage from "@/hooks/ocr/useUploadCarMeterImage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

const UploadImage = () => {
    const [imageUri, setImageUri] = useState<any | null>(null);
    const { mutateAsync } = useUploadCarMeterImage();

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Camera access is required.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;

            setImageUri(uri); // Store image URI
        }
    };

    useEffect(() => {
        if (imageUri) {
            const uploadImage = async () => {
                try {
                    const { uri } = await FileSystem.getInfoAsync(imageUri);
                    console.log(uri);
                    const imageFile = {
                        uri: imageUri,
                        name: "car-meter.jpg",
                        type: "image/jpeg",
                    };
                    await mutateAsync(imageFile);
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            };

            uploadImage();
        }
    }, [imageUri]);

    return (
        <View className="flex-1 items-center justify-center bg-background-dark">
            <View className="w-[70%] h-1/2 border border-background-light rounded-lg shadow-lg items-center justify-center">
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                    />
                ) : (
                    <Text className="text-text-onDark">No image selected</Text>
                )}
            </View>

            <View className="w-[70%] rounded-lg shadow-lg mt-5 flex-row justify-center items-center">
                <TouchableOpacity
                    onPress={openCamera}
                    className="border border-background-light w-[80px] h-[80px] rounded-full bg-background-dark items-center justify-center"
                >
                    <View className="bg-background-light w-[60px] h-[60px] rounded-full" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default UploadImage;
