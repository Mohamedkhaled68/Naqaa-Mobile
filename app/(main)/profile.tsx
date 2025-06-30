import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
    const { user, signOut } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await signOut();
                    router.replace("/(auth)/login");
                },
            },
        ]);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-background-light">
                <View className="flex-1 px-6 py-8">
                    <Text className="text-3xl font-bold text-text-primary mb-8">
                        Profile
                    </Text>

                    <View className="bg-background-card rounded-lg p-6 mb-6 shadow-sm">
                        <Text className="text-lg font-semibold text-text-primary mb-4">
                            User Information
                        </Text>

                        <View className="space-y-3">
                            {user?.name && (
                                <View>
                                    <Text className="text-text-secondary text-sm">
                                        Name
                                    </Text>
                                    <Text className="text-text-primary text-lg font-medium">
                                        {user.name}
                                    </Text>
                                </View>
                            )}

                            <View>
                                <Text className="text-text-secondary text-sm">
                                    Email
                                </Text>
                                <Text className="text-text-primary text-lg font-medium">
                                    {user?.email}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-text-secondary text-sm">
                                    User ID
                                </Text>
                                <Text className="text-text-primary text-lg font-medium">
                                    {user?.id}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-1 justify-end mb-32">
                        <TouchableOpacity
                            className="bg-error rounded-lg p-4"
                            onPress={handleLogout}
                        >
                            <Text className="text-white text-center font-semibold text-lg">
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Profile;
