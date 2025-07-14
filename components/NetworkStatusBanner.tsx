import useNetworkStatus from "@/hooks/useNetworkStatus";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

const NetworkStatusBanner: React.FC = () => {
    const { isConnected, checkConnection } = useNetworkStatus();
    const [fadeAnim] = React.useState(new Animated.Value(isConnected ? 0 : 1));

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isConnected ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isConnected, fadeAnim]);

    const handleRetry = async () => {
        const connected = await checkConnection();
        if (!connected) {
            // Show alert if still no connection
            // The alert will be shown by the useNetworkStatus hook
        }
    };

    if (isConnected) {
        return null;
    }

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [
                    {
                        translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, 0],
                        }),
                    },
                ],
            }}
            className="absolute top-0 left-0 right-0 z-50 bg-red-500 px-4 py-3"
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <Ionicons name="wifi-outline" size={20} color="white" />
                    <Text className="text-white font-medium ml-2 flex-1">
                        No internet connection
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handleRetry}
                    className="bg-white/20 px-3 py-1 rounded-md"
                >
                    <Text className="text-white text-sm font-medium">
                        Retry
                    </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

export default NetworkStatusBanner;
