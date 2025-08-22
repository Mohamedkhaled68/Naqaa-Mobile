import useDeleteAccount from "@/hooks/auth/useDeleteAccount";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface DeleteAccountModalProps {
    visible: boolean;
    onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    visible,
    onClose,
}) => {
    const [confirmText, setConfirmText] = useState("");
    const [password, setPassword] = useState("");
    const { user, deleteAccount } = useAuthStore();
    const deleteAccountMutation = useDeleteAccount();

    const isFormValid =
        confirmText.toLowerCase() === "delete" && password.trim().length > 0;

    const handleDeleteAccount = async () => {
        if (!isFormValid) {
            Alert.alert(
                "Error",
                "Please complete all required fields correctly"
            );
            return;
        }

        try {
            // Call the API to delete the account
            await deleteAccountMutation.mutateAsync();

            // Clear local storage and navigate
            await deleteAccount();

            Alert.alert(
                "Account Deleted",
                "Your account has been permanently deleted. We're sorry to see you go!",
                [{ text: "OK" }]
            );
        } catch (error: any) {
            console.error("Account deletion failed:", error);
            Alert.alert(
                "Deletion Failed",
                error?.response?.data?.message ||
                    "Unable to delete your account. Please try again or contact support."
            );
        }
    };

    const resetForm = () => {
        setConfirmText("");
        setPassword("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={handleClose}
        >
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-gray-50">
                    {/* Header */}
                    <View className="bg-white px-6 py-4 border-b border-gray-200">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-xl font-bold text-red-600">
                                Delete Account
                            </Text>
                            <TouchableOpacity
                                onPress={handleClose}
                                disabled={deleteAccountMutation.isPending}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#6b7280"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="px-6 py-8">
                            {/* Warning Section */}
                            <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <View className="flex-row items-center mb-3">
                                    <Ionicons
                                        name="warning"
                                        size={20}
                                        color="#dc2626"
                                    />
                                    <Text className="text-md font-semibold text-red-800 ml-2">
                                        Warning: This action cannot be undone
                                    </Text>
                                </View>
                                <Text className="text-red-700 leading-relaxed">
                                    Deleting your account will permanently
                                    remove:
                                </Text>
                                <View className="mt-3 space-y-1">
                                    <Text className="text-red-700">
                                        • Your profile information
                                    </Text>
                                    <Text className="text-red-700">
                                        • All your data and preferences
                                    </Text>
                                    {user?.role === "driver" && (
                                        <>
                                            <Text className="text-red-700">
                                                • Your maintenance requests
                                                history
                                            </Text>
                                            <Text className="text-red-700">
                                                • Vehicle assignments
                                            </Text>
                                        </>
                                    )}
                                    {user?.role === "receiver" && (
                                        <>
                                            <Text className="text-red-700">
                                                • Access to pending requests
                                            </Text>
                                            <Text className="text-red-700">
                                                • Processing history
                                            </Text>
                                        </>
                                    )}
                                </View>
                            </View>

                            {/* User Info */}
                            <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                                <Text className="text-sm text-gray-600 mb-2">
                                    Account to be deleted:
                                </Text>
                                <Text className="text-lg font-semibold text-gray-800">
                                    {user?.name}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    {user?.phoneNumber} •{" "}
                                    {user?.role
                                        ? user.role.charAt(0).toUpperCase() +
                                          user.role.slice(1)
                                        : "User"}
                                </Text>
                            </View>

                            {/* Confirmation Form */}
                            <View className="space-y-4 mb-8">
                                <View>
                                    <Text className="text-gray-700 font-medium mb-2">
                                        Type "DELETE" to confirm (case
                                        insensitive):
                                    </Text>
                                    <TextInput
                                        className="bg-white border border-gray-300 rounded-lg p-4 text-gray-800"
                                        placeholder="Type DELETE here"
                                        value={confirmText}
                                        onChangeText={setConfirmText}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={
                                            !deleteAccountMutation.isPending
                                        }
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-medium mb-2">
                                        Enter your password to confirm:
                                    </Text>
                                    <TextInput
                                        className="bg-white border border-gray-300 rounded-lg p-4 text-gray-800"
                                        placeholder="Your current password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        editable={
                                            !deleteAccountMutation.isPending
                                        }
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Fixed Action Buttons at Bottom */}
                    <View className="bg-white px-6 py-4 border-t border-gray-200">
                        <View className="space-y-3">
                            <TouchableOpacity
                                className={`bg-red-600 rounded-lg p-4 ${
                                    !isFormValid ||
                                    deleteAccountMutation.isPending
                                        ? "opacity-50"
                                        : ""
                                }`}
                                onPress={handleDeleteAccount}
                                disabled={
                                    !isFormValid ||
                                    deleteAccountMutation.isPending
                                }
                            >
                                {deleteAccountMutation.isPending ? (
                                    <View className="flex-row items-center justify-center">
                                        <ActivityIndicator
                                            color="white"
                                            size="small"
                                        />
                                        <Text className="text-white font-semibold text-lg ml-2">
                                            Deleting Account...
                                        </Text>
                                    </View>
                                ) : (
                                    <Text className="text-white text-center font-semibold text-lg">
                                        Delete My Account Permanently
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-gray-200 rounded-lg p-4 mt-3"
                                onPress={handleClose}
                                disabled={deleteAccountMutation.isPending}
                            >
                                <Text className="text-gray-700 text-center font-semibold text-lg">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
};

export default DeleteAccountModal;
