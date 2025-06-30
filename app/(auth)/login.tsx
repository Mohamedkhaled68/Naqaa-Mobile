import useLogin from "@/hooks/auth/useLogin";
import { useAuthStore } from "@/stores/auth-store";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
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

    const handleLogin = async () => {
        if (!phoneNumber.trim() || !password.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            const result = await loginMutation.mutateAsync({
                phoneNumber: phoneNumber.trim(),
                password,
            });

            // Store token and user data
            await SecureStore.setItemAsync("auth_token", result.token);
            await SecureStore.setItemAsync(
                "auth_user",
                JSON.stringify(result.driver)
            );

            setToken(result.token);
            setUser(result.driver);

            router.replace("/(main)/home");
        } catch (error: any) {
            Alert.alert(
                "Login Failed",
                error.response?.data?.message || "Invalid credentials"
            );
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-background-light">
                <View className="flex-1 justify-center items-center px-6">
                    <View className="w-full max-w-sm">
                        <Text className="text-3xl font-bold text-center text-text-primary mb-8">
                            Welcome Back
                        </Text>
                        <Text className="text-center text-text-secondary mb-8">
                            Sign in to your account
                        </Text>

                        <View className="space-y-4">
                            <View>
                                <Text className="text-text-primary mb-2 font-medium">
                                    Phone Number
                                </Text>
                                <TextInput
                                    className="bg-input border border-border rounded-lg p-4 text-text-primary"
                                    placeholder="Enter your phone number"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loginMutation.isPending}
                                />
                            </View>

                            <View>
                                <Text className="text-text-primary mb-2 font-medium">
                                    Password
                                </Text>
                                <TextInput
                                    className="bg-input border border-border rounded-lg p-4 text-text-primary"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    editable={!loginMutation.isPending}
                                />
                            </View>

                            <TouchableOpacity
                                className={`bg-primary rounded-lg p-4 mt-6 ${
                                    loginMutation.isPending ? "opacity-50" : ""
                                }`}
                                onPress={handleLogin}
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white text-center font-semibold text-lg">
                                        Sign In
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <View className="flex-row justify-center mt-6">
                                <Text className="text-text-secondary">
                                    Don't have an account?{" "}
                                </Text>
                                <Link href="/(auth)/register" asChild>
                                    <TouchableOpacity>
                                        <Text className="text-primary font-semibold">
                                            Sign Up
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
