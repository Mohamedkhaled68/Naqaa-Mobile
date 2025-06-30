import useCreateDriver from "@/hooks/auth/useCreateDriver";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Register = () => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [nationalId, setNationalId] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const createDriverMutation = useCreateDriver();
    const router = useRouter();

    const handleRegister = async () => {
        if (
            !name.trim() ||
            !phoneNumber.trim() ||
            !nationalId.trim() ||
            !licenseNumber.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }

        try {
            const driverData = {
                name: name.trim(),
                phoneNumber: phoneNumber.trim(),
                nationalId: nationalId.trim(),
                licenseNumber: licenseNumber.trim(),
                password,
                address: address.trim() || undefined,
            };

            await createDriverMutation.mutateAsync(driverData);
            Alert.alert("Success", "Driver account created successfully!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/(auth)/login"),
                },
            ]);
        } catch (error: any) {
            console.log(error);
            
            Alert.alert(
                "Registration Failed",
                error.response?.data?.message || "Failed to create account"
            );
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-background-light">
                <ScrollView className="flex-1">
                    <View className="flex-1 justify-center items-center px-6 py-8">
                        <View className="w-full max-w-sm">
                            <Text className="text-3xl font-bold text-center text-text-primary mb-8">
                                Driver Registration
                            </Text>
                            <Text className="text-center text-text-secondary mb-8">
                                Sign up as a driver to get started
                            </Text>

                            <View className="space-y-4">
                                <View>
                                    <Text className="text-text-primary mb-2 font-medium">
                                        Full Name
                                    </Text>
                                    <TextInput
                                        className="bg-input border border-border rounded-lg p-4 text-text-primary"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                        editable={
                                            !createDriverMutation.isPending
                                        }
                                    />
                                </View>

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
                                        editable={
                                            !createDriverMutation.isPending
                                        }
                                    />
                                </View>

                                <View>
                                    <Text className="text-text-primary mb-2 font-medium">
                                        National ID
                                    </Text>
                                    <TextInput
                                        className="bg-input border border-border rounded-lg p-4 text-text-primary"
                                        placeholder="Enter your national ID"
                                        value={nationalId}
                                        onChangeText={setNationalId}
                                        editable={
                                            !createDriverMutation.isPending
                                        }
                                    />
                                </View>

                                <View>
                                    <Text className="text-text-primary mb-2 font-medium">
                                        License Number
                                    </Text>
                                    <TextInput
                                        className="bg-input border border-border rounded-lg p-4 text-text-primary"
                                        placeholder="Enter your license number"
                                        value={licenseNumber}
                                        onChangeText={setLicenseNumber}
                                        editable={
                                            !createDriverMutation.isPending
                                        }
                                    />
                                </View>

                                <View>
                                    <Text className="text-text-primary mb-2 font-medium">
                                        Address (Optional)
                                    </Text>
                                    <TextInput
                                        className="bg-input border border-border rounded-lg p-4 text-text-primary"
                                        placeholder="Enter your address"
                                        value={address}
                                        onChangeText={setAddress}
                                        multiline
                                        numberOfLines={2}
                                        editable={
                                            !createDriverMutation.isPending
                                        }
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
                                        editable={
                                            !createDriverMutation.isPending
                                        }
                                    />
                                </View>

                                <View>
                                    <Text className="text-text-primary mb-2 font-medium">
                                        Confirm Password
                                    </Text>
                                    <TextInput
                                        className="bg-input border border-border rounded-lg p-4 text-text-primary"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        editable={
                                            !createDriverMutation.isPending
                                        }
                                    />
                                </View>

                                <TouchableOpacity
                                    className={`bg-primary rounded-lg p-4 mt-6 ${
                                        createDriverMutation.isPending
                                            ? "opacity-50"
                                            : ""
                                    }`}
                                    onPress={handleRegister}
                                    disabled={createDriverMutation.isPending}
                                >
                                    {createDriverMutation.isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white text-center font-semibold text-lg">
                                            Register as Driver
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <View className="flex-row justify-center mt-6">
                                    <Text className="text-text-secondary">
                                        Already have an account?{" "}
                                    </Text>
                                    <Link href="/(auth)/login" asChild>
                                        <TouchableOpacity>
                                            <Text className="text-primary font-semibold">
                                                Sign In
                                            </Text>
                                        </TouchableOpacity>
                                    </Link>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Register;
