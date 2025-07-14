import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface NetworkErrorStateProps {
    onRetry?: () => void;
    message?: string;
    showRetryButton?: boolean;
}

const NetworkErrorState: React.FC<NetworkErrorStateProps> = ({
    onRetry,
    message = "No internet connection",
    showRetryButton = true,
}) => {
    return (
        <View className="flex-1 justify-center items-center px-6">
            <View className="items-center">
                <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="wifi-outline" size={40} color="#ef4444" />
                </View>

                <Text className="text-gray-800 text-lg font-semibold mb-2 text-center">
                    Connection Error
                </Text>

                <Text className="text-gray-600 text-center mb-6">
                    {message}. Please check your internet connection and try
                    again.
                </Text>

                {showRetryButton && onRetry && (
                    <TouchableOpacity
                        onPress={onRetry}
                        className="bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
                    >
                        <Ionicons name="refresh" size={20} color="white" />
                        <Text className="text-white font-medium ml-2">
                            Try Again
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default NetworkErrorState;
