import DeleteAccountModal from "@/components/DeleteAccountModal";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
    const { user, signOut } = useAuthStore();
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

    const settingsOptions = [
        {
            id: "profile",
            title: "Profile Information",
            description: "View and edit your profile details",
            icon: "person-outline" as keyof typeof Ionicons.glyphMap,
            color: "#3b82f6",
            bgColor: "#eff6ff",
            onPress: () => {
                // Navigate to profile or show coming soon
                Alert.alert(
                    "Coming Soon",
                    "Profile editing will be available soon!"
                );
            },
        },
        {
            id: "notifications",
            title: "Notifications",
            description: "Manage your notification preferences",
            icon: "notifications-outline" as keyof typeof Ionicons.glyphMap,
            color: "#f59e0b",
            bgColor: "#fef3c7",
            onPress: () => {
                Alert.alert(
                    "Coming Soon",
                    "Notification settings will be available soon!"
                );
            },
        },
        {
            id: "privacy",
            title: "Privacy & Security",
            description: "Control your privacy settings",
            icon: "shield-outline" as keyof typeof Ionicons.glyphMap,
            color: "#10b981",
            bgColor: "#ecfdf5",
            onPress: () => {
                Alert.alert(
                    "Coming Soon",
                    "Privacy settings will be available soon!"
                );
            },
        },
    ];

    const accountActions = [
        {
            id: "logout",
            title: "Logout",
            description: "Sign out of your account",
            icon: "log-out-outline" as keyof typeof Ionicons.glyphMap,
            color: "#6b7280",
            bgColor: "#f3f4f6",
            textColor: "#374151",
            onPress: handleLogout,
        },
        {
            id: "delete",
            title: "Delete Account",
            description: "Permanently remove your account",
            icon: "trash-outline" as keyof typeof Ionicons.glyphMap,
            color: "#dc2626",
            bgColor: "#fef2f2",
            textColor: "#dc2626",
            onPress: () => setShowDeleteModal(true),
        },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                <ScrollView>
                    <View className="flex-1 px-6 py-8">
                        <Text className="text-3xl font-bold text-gray-800 mb-8">
                            Settings
                        </Text>

                        {/* User Info Card */}
                        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">
                                Account Information
                            </Text>
                            <View className="space-y-3">
                                <View>
                                    <Text className="text-gray-600 text-sm">
                                        Name
                                    </Text>
                                    <Text className="text-gray-800 text-lg font-medium">
                                        {user?.name}
                                    </Text>
                                </View>
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

                        {/* Settings Options */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">
                                Preferences
                            </Text>
                            <View className="flex flex-col gap-4">
                                {settingsOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={option.onPress}
                                        className="p-4 bg-white rounded-lg border border-gray-200 flex-row items-center"
                                        style={{
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 1,
                                            },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 2,
                                        }}
                                    >
                                        <View
                                            className="w-12 h-12 rounded-lg items-center justify-center mr-4"
                                            style={{
                                                backgroundColor: option.bgColor,
                                            }}
                                        >
                                            <Ionicons
                                                name={option.icon}
                                                size={24}
                                                color={option.color}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-800 font-semibold">
                                                {option.title}
                                            </Text>
                                            <Text className="text-gray-600 text-sm">
                                                {option.description}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Account Actions */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">
                                Account Actions
                            </Text>
                            <View className="flex flex-col gap-4">
                                {accountActions.map((action) => (
                                    <TouchableOpacity
                                        key={action.id}
                                        onPress={action.onPress}
                                        className="p-4 bg-white rounded-lg border border-gray-200 flex-row items-center"
                                        style={{
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 1,
                                            },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 2,
                                        }}
                                    >
                                        <View
                                            className="w-12 h-12 rounded-lg items-center justify-center mr-4"
                                            style={{
                                                backgroundColor: action.bgColor,
                                            }}
                                        >
                                            <Ionicons
                                                name={action.icon}
                                                size={24}
                                                color={action.color}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text
                                                className="font-semibold"
                                                style={{
                                                    color: action.textColor,
                                                }}
                                            >
                                                {action.title}
                                            </Text>
                                            <Text className="text-gray-600 text-sm">
                                                {action.description}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={20}
                                            color={action.color}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Bottom spacing for floating tab bar */}
                        <View className="h-32" />
                    </View>
                </ScrollView>

                <DeleteAccountModal
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Settings;
