import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { useNetwork } from "@/providers/NetworkProvider";

interface NetworkErrorStateProps {
    onRetry?: () => void;
    message?: string;
    showRetryButton?: boolean;
    autoRetry?: boolean;
    autoRetryInterval?: number;
    isInitializing?: boolean;
}

const NetworkErrorState: React.FC<NetworkErrorStateProps> = ({
    onRetry,
    message = "No internet connection",
    showRetryButton = true,
    autoRetry = true,
    autoRetryInterval = 5000,
    isInitializing = false,
}) => {
    const { checkConnection } = useNetwork();
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!autoRetry) return;

        const interval = setInterval(async () => {
            setIsRetrying(true);
            const isConnected = await checkConnection();
            setIsRetrying(false);

            if (isConnected && onRetry) {
                onRetry();
            } else {
                setRetryCount((prev) => prev + 1);
            }
        }, autoRetryInterval);

        return () => clearInterval(interval);
    }, [autoRetry, autoRetryInterval, checkConnection, onRetry]);

    const handleManualRetry = async () => {
        setIsRetrying(true);
        const isConnected = await checkConnection();
        setIsRetrying(false);

        if (isConnected && onRetry) {
            onRetry();
        }
    };

    return (
        <View className="flex-1 justify-center items-center px-6 bg-red-50">
            <View className="items-center max-w-sm">
                {/* Large warning icon */}
                <View className="w-32 h-32 bg-red-100 rounded-full items-center justify-center mb-8 border-4 border-red-200">
                    <Ionicons
                        name={isInitializing ? "cloud-outline" : "wifi-outline"}
                        size={64}
                        color="#dc2626"
                    />
                </View>

                {/* Main title - more prominent */}
                <Text className="text-red-800 text-2xl font-bold mb-4 text-center">
                    {isInitializing
                        ? "Connecting..."
                        : "No Internet Connection"}
                </Text>

                {/* Blocking message */}
                <Text className="text-red-700 text-center mb-3 leading-6 font-medium">
                    {message}
                </Text>

                {!isInitializing && (
                    <>
                        <Text className="text-red-600 text-sm text-center mb-2">
                            You cannot use the app without an internet
                            connection.
                        </Text>

                        <Text className="text-gray-600 text-sm text-center mb-8">
                            Please check your internet connection and try again.
                        </Text>
                    </>
                )}

                {isInitializing && (
                    <View className="items-center mb-8">
                        <View className="flex-row items-center bg-blue-50 px-4 py-3 rounded-lg">
                            <ActivityIndicator size="small" color="#2563eb" />
                            <Text className="text-blue-700 ml-2 text-sm font-medium">
                                Verifying connection...
                            </Text>
                        </View>
                    </View>
                )}

                {autoRetry && (
                    <View className="items-center mb-8">
                        {isRetrying ? (
                            <View className="flex-row items-center bg-blue-50 px-4 py-3 rounded-lg">
                                <ActivityIndicator
                                    size="small"
                                    color="#2563eb"
                                />
                                <Text className="text-blue-700 ml-2 text-sm font-medium">
                                    Checking connection...
                                </Text>
                            </View>
                        ) : (
                            <View className="bg-orange-50 px-4 py-3 rounded-lg">
                                <Text className="text-orange-700 text-sm font-medium text-center">
                                    Auto-retry in progress... (Attempt{" "}
                                    {retryCount + 1})
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {showRetryButton && (
                    <TouchableOpacity
                        onPress={handleManualRetry}
                        disabled={isRetrying}
                        className="bg-red-600 px-8 py-4 rounded-xl flex-row items-center shadow-md min-w-[200px]"
                        style={{
                            opacity: isRetrying ? 0.7 : 1,
                        }}
                    >
                        {isRetrying ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Ionicons name="refresh" size={22} color="white" />
                        )}
                        <Text className="text-white font-semibold ml-3 text-base text-center flex-1">
                            {isRetrying ? "Checking..." : "Try Again"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default NetworkErrorState;
