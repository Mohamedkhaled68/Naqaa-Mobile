import DeleteAccountModal from "@/components/DeleteAccountModal";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
    const { user, signOut } = useAuthStore();
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
                                <Text className="text-gray-600 text-sm">
                                    Phone Number
                                </Text>
                                <Text className="text-gray-800 text-lg font-medium">
                                    {user?.phoneNumber}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-gray-600 text-sm">
                                    Role
                                </Text>
                                <Text className="text-gray-800 text-lg font-medium capitalize">
                                    {user?.role}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <DeleteAccountModal
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Profile;
