import { UserRole } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const RoleSelection = () => {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const router = useRouter();

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        if (selectedRole) {
            router.push({
                pathname: "/(auth)/login",
                params: { role: selectedRole },
            });
        }
    };

    const roles = [
        {
            id: "driver" as UserRole,
            title: "Driver",
            description: "Submit maintenance requests and track vehicle status",
            icon: "car-outline" as keyof typeof Ionicons.glyphMap,
            color: "#3b82f6",
            bgColor: "#eff6ff",
        },
        {
            id: "receiver" as UserRole,
            title: "Receiver",
            description: "Review and approve maintenance requests",
            icon: "clipboard-outline" as keyof typeof Ionicons.glyphMap,
            color: "#059669",
            bgColor: "#ecfdf5",
        },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 px-6 py-8">
                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-3xl font-bold text-gray-800 text-center mb-3">
                            Welcome to NAQAA
                        </Text>
                        <Text className="text-gray-600 text-center leading-relaxed">
                            Please select your role to continue
                        </Text>
                    </View>

                    {/* Role Cards */}
                    <View className="flex-1 space-y-4">
                        {roles.map((role) => (
                            <TouchableOpacity
                                key={role.id}
                                onPress={() => handleRoleSelect(role.id)}
                                className={`p-6 rounded-2xl border-2 ${
                                    selectedRole === role.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 bg-white"
                                }`}
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                            >
                                <View className="flex-row items-center">
                                    {/* Icon */}
                                    <View
                                        className="w-16 h-16 rounded-full items-center justify-center mr-4"
                                        style={{
                                            backgroundColor: role.bgColor,
                                        }}
                                    >
                                        <Ionicons
                                            name={role.icon}
                                            size={32}
                                            color={role.color}
                                        />
                                    </View>

                                    {/* Content */}
                                    <View className="flex-1">
                                        <Text className="text-xl font-semibold text-gray-800 mb-1">
                                            {role.title}
                                        </Text>
                                        <Text className="text-gray-600 leading-relaxed">
                                            {role.description}
                                        </Text>
                                    </View>

                                    {/* Selection Indicator */}
                                    {selectedRole === role.id && (
                                        <View className="ml-2">
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={24}
                                                color="#3b82f6"
                                            />
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity
                        onPress={handleContinue}
                        disabled={!selectedRole}
                        className={`mt-8 p-4 rounded-xl ${
                            selectedRole ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    >
                        <Text
                            className={`text-center font-semibold text-lg ${
                                selectedRole ? "text-white" : "text-gray-500"
                            }`}
                        >
                            Continue as{" "}
                            {selectedRole
                                ? roles.find((r) => r.id === selectedRole)
                                      ?.title
                                : "Selected Role"}
                        </Text>
                    </TouchableOpacity>

                    {/* Registration Link */}
                    <View className="mt-6">
                        <Text className="text-center text-gray-600">
                            Need an account?{" "}
                            <Text
                                className="text-blue-600 font-medium"
                                onPress={() =>
                                    router.push("/(auth)/register-role")
                                }
                            >
                                Sign up here
                            </Text>
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default RoleSelection;
