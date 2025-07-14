import useReceiverRegister from "@/hooks/auth/useReceiverRegister";
import { ReceiverRegistrationData } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
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

const RegisterReceiver = () => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { mutateAsync: createReceiver } = useReceiverRegister();

    const handleRegister = async () => {
        if (
            !name.trim() ||
            !phoneNumber.trim() ||
            !email.trim() ||
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

        setIsLoading(true);
        try {
            const receiverData: ReceiverRegistrationData = {
                name: name.trim(),
                phoneNumber: phoneNumber.trim(),
                email: email.trim(),
                password,
            };

            await createReceiver(receiverData);

            Alert.alert("Success", "Receiver account created successfully!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/(auth)/role-selection"),
                },
            ]);
        } catch (error: any) {
            console.log(error);

            Alert.alert(
                "Registration Failed",
                error.response?.data?.message || "Failed to create account"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                <ScrollView className="flex-1">
                    <View className="flex-1 justify-center items-center px-6 py-8">
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
                            <Text className="text-3xl font-bold text-center text-gray-800 mb-3">
                                Receiver Registration
                            </Text>
                            <Text className="text-center text-gray-600 mb-8">
                                Create your receiver account
                            </Text>

                            <View className="space-y-4 flex flex-col gap-4">
                                <View>
                                    <Text className="text-gray-700 mb-2 font-medium">
                                        Full Name
                                    </Text>
                                    <TextInput
                                        className="bg-white border border-gray-300 rounded-xl p-4 text-gray-800"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                        editable={!isLoading}
                                    />
                                </View>

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
                                        editable={!isLoading}
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-700 mb-2 font-medium">
                                        Email
                                    </Text>
                                    <TextInput
                                        className="bg-white border border-gray-300 rounded-xl p-4 text-gray-800"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={!isLoading}
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
                                        editable={!isLoading}
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-700 mb-2 font-medium">
                                        Confirm Password
                                    </Text>
                                    <TextInput
                                        className="bg-white border border-gray-300 rounded-xl p-4 text-gray-800"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        editable={!isLoading}
                                    />
                                </View>

                                <TouchableOpacity
                                    className={`bg-green-600 rounded-xl p-4 mt-6 ${
                                        isLoading ? "opacity-50" : ""
                                    }`}
                                    onPress={handleRegister}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white text-center font-semibold text-lg">
                                            Register as Receiver
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <View className="flex-row justify-center mt-6">
                                    <Text className="text-gray-600">
                                        Already have an account?{" "}
                                    </Text>
                                    <Link href="/(auth)/role-selection" asChild>
                                        <TouchableOpacity>
                                            <Text className="text-blue-600 font-semibold">
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

export default RegisterReceiver;
