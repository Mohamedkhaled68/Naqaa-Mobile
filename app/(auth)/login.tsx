import useLogin from "@/hooks/auth/useLogin";
import { useAuthStore } from "@/stores/auth-store";
import { LoginCredentials, UserRole } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const { setToken, setUser } = useAuthStore();
    const loginMutation = useLogin();
    const router = useRouter();
    const params = useLocalSearchParams();

    // Get role from params, default to 'driver'
    const role = (params.role as UserRole) || "driver";

    const getRoleDetails = (userRole: UserRole) => {
        return userRole === "driver"
            ? {
                  title: "Driver Login",
                  subtitle: "Sign in to manage your vehicle maintenance",
                  icon: "car-outline" as keyof typeof Ionicons.glyphMap,
                  color: "#3b82f6",
                  redirectPath: "/(main)/home",
              }
            : {
                  title: "Receiver Login",
                  subtitle: "Sign in to review maintenance requests",
                  icon: "clipboard-outline" as keyof typeof Ionicons.glyphMap,
                  color: "#059669",
                  redirectPath: "/(receiver)/dashboard",
              };
    };

    const roleDetails = getRoleDetails(role);

    const handleLogin = async () => {
        if (!phoneNumber.trim() || !password.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            const credentials: LoginCredentials = {
                phoneNumber: phoneNumber.trim(),
                password,
                role,
            };

            const result = await loginMutation.mutateAsync(credentials);

            // Store token and user data using auth store
            await setToken(result.token);
            await setUser(result.user);

            // Redirect based on role
            router.replace(roleDetails.redirectPath as any);
        } catch (error: any) {
            console.log("Login error:", error);

            Alert.alert(
                "Login Failed",
                error.response?.data?.message || "Invalid credentials"
            );
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 justify-center items-center px-6">
                    {/* Back Button */}
                    <View className="w-full max-w-sm mb-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-row items-center"
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#374151"
                            />
                            <Text className="text-gray-700 font-medium ml-2">
                                Back
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="w-full max-w-sm">
                        {/* Role Icon */}
                        <View className="items-center mb-6">
                            <View
                                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                style={{
                                    backgroundColor:
                                        role === "driver"
                                            ? "#eff6ff"
                                            : "#ecfdf5",
                                }}
                            >
                                <Ionicons
                                    name={roleDetails.icon}
                                    size={40}
                                    color={roleDetails.color}
                                />
                            </View>
                        </View>

                        <Text className="text-3xl font-bold text-center text-gray-800 mb-3">
                            {roleDetails.title}
                        </Text>
                        <Text className="text-center text-gray-600 mb-8">
                            {roleDetails.subtitle}
                        </Text>

                        <View className="space-y-4 flex flex-col gap-4">
                            <View>
                                <Text className="text-gray-700 mb-2 font-medium">
                                    Phone Number
                                </Text>
                                <TextInput
                                    className="bg-white border border-gray-300 rounded-xl p-4 text-gray-800"
                                    placeholder="Enter your phone number"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loginMutation.isPending}
                                    placeholderClassName="text-gray-400"
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 mb-2 font-medium">
                                    Password
                                </Text>
                                <TextInput
                                    className="bg-white border border-gray-300 rounded-xl p-4 text-gray-800"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    editable={!loginMutation.isPending}
                                    placeholderClassName="text-gray-400"
                                />
                            </View>

                            <TouchableOpacity
                                className={`rounded-xl p-4 mt-6 ${
                                    loginMutation.isPending ? "opacity-50" : ""
                                }`}
                                style={{ backgroundColor: roleDetails.color }}
                                onPress={handleLogin}
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white text-center font-semibold text-lg">
                                        Sign In as{" "}
                                        {role === "driver"
                                            ? "Driver"
                                            : "Receiver"}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <View className="flex-row justify-center mt-6">
                                <Text className="text-gray-600">
                                    Don't have an account?{" "}
                                </Text>
                                <Link href="/(auth)/register-role" asChild>
                                    <TouchableOpacity>
                                        <Text className="text-blue-600 font-semibold">
                                            Sign Up
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>

                            <View className="flex-row justify-center mt-4">
                                <Text className="text-gray-600">
                                    Wrong role?{" "}
                                </Text>
                                <Link href="/(auth)/role-selection" asChild>
                                    <TouchableOpacity>
                                        <Text className="text-blue-600 font-semibold">
                                            Choose Role
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Login;
