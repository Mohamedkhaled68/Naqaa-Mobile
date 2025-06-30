import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 items-center justify-center px-6">
                    <Text className="text-3xl font-bold text-gray-800 mb-4">
                        Notifications
                    </Text>
                    <Text className="text-gray-500 text-center">
                        No new notifications
                    </Text>

                    {/* Bottom spacing for floating tab bar */}
                    <View className="absolute bottom-0 h-32 w-full" />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Notifications;
