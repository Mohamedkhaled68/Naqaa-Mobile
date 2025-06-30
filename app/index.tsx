import { useAuthStore } from "@/stores/auth-store";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    const { user, isInitialized, initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, []);

    // Show loading screen while initializing
    if (!isInitialized) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1">
                    <View className="flex-1 justify-center items-center bg-gray-50">
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text className="text-gray-600 mt-4 text-lg">
                            Loading...
                        </Text>
                        <Text className="text-gray-400 mt-2 text-sm">
                            Initializing app...
                        </Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    } else {
        return <Redirect href="/(main)/home" />;
    }
}
