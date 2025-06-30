import useGetSubCategoryDetails from "@/hooks/categories/useGetSubCategoryDetails";
import useSubmitMaintenanceForm from "@/hooks/maintenance/useSubmitMaintenanceForm";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface CustomField {
    _id: string;
    fieldName: string;
    description: string;
    isRequired: boolean;
}

interface SubCategory {
    _id: string;
    name: string;
    description: string;
    type: string;
    customFields: CustomField[];
}

const MaintenanceFormPage = () => {
    const { id } = useLocalSearchParams(); // subcategory id
    const router = useRouter();
    const [formData, setFormData] = useState<{ [key: string]: string }>({});

    // Fetch subcategory details with custom fields
    const {
        data: subCategory,
        isLoading,
        error,
    } = useGetSubCategoryDetails(id as string);

    // Submit form mutation
    const submitFormMutation = useSubmitMaintenanceForm();

    // Initialize form data when subcategory data is loaded
    React.useEffect(() => {
        if (subCategory?.customFields) {
            const initialFormData: { [key: string]: string } = {};
            subCategory.customFields.forEach((field: any) => {
                initialFormData[field._id] = "";
            });
            setFormData(initialFormData);
        }
    }, [subCategory]);

    const handleInputChange = (fieldId: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const validateForm = (): boolean => {
        if (!subCategory?.customFields) return false;

        const requiredFields = subCategory.customFields.filter(
            (field: any) => field.isRequired
        );

        for (const field of requiredFields) {
            if (!formData[field._id]?.trim()) {
                Alert.alert(
                    "Required Field Missing",
                    `Please fill in the "${field.fieldName}" field.`
                );
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await submitFormMutation.mutateAsync({
                subCategoryId: id as string,
                formData: formData,
            });

            Alert.alert("Success", "Maintenance form submitted successfully!", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            console.error("Error submitting form:", error);
            Alert.alert("Error", "Failed to submit form. Please try again.");
        }
    };

    const getFieldIcon = (fieldName: string) => {
        const name = fieldName.toLowerCase();
        if (name.includes("mileage") || name.includes("reading"))
            return "speedometer";
        if (name.includes("oil")) return "oil";
        if (name.includes("filter")) return "filter-variant";
        if (name.includes("note")) return "note-text";
        if (name.includes("date")) return "calendar";
        if (name.includes("cost") || name.includes("price"))
            return "currency-usd";
        return "form-textbox";
    };

    if (isLoading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-gray-50">
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text className="text-gray-600 mt-4">
                            Loading form...
                        </Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (error) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-gray-50">
                    <View className="flex-1 justify-center items-center">
                        <MaterialCommunityIcons
                            name="alert-circle-outline"
                            size={64}
                            color="#EF4444"
                        />
                        <Text className="text-red-600 text-center mt-4 mb-2">
                            Error loading form
                        </Text>
                        <Text className="text-gray-500 text-center mb-4">
                            Failed to load subcategory details
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-gray-500 rounded-lg px-6 py-3"
                        >
                            <Text className="text-white font-semibold">
                                Go Back
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (!subCategory) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-gray-50">
                    <View className="flex-1 justify-center items-center">
                        <MaterialCommunityIcons
                            name="alert-circle-outline"
                            size={64}
                            color="#EF4444"
                        />
                        <Text className="text-red-600 text-center mt-4 mb-2">
                            Form not found
                        </Text>
                        <Text className="text-gray-500 text-center mb-4">
                            Unable to load the maintenance form
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-gray-500 rounded-lg px-6 py-3"
                        >
                            <Text className="text-white font-semibold">
                                Go Back
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    {/* Header */}
                    <View className="px-6 pt-4 pb-2 bg-white border-b border-gray-200">
                        <View className="flex-row items-center mb-4">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="mr-4 p-2 rounded-full"
                                style={{
                                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                                }}
                                disabled={submitFormMutation.isPending}
                            >
                                <MaterialCommunityIcons
                                    name="arrow-left"
                                    size={20}
                                    color="#667eea"
                                />
                            </TouchableOpacity>
                            <View className="flex-1">
                                <Text className="text-gray-800 text-xl font-bold">
                                    {subCategory.name}
                                </Text>
                                <Text className="text-gray-500 text-sm mt-1">
                                    {subCategory.type} • Fill required fields
                                </Text>
                            </View>
                        </View>

                        {subCategory.description && (
                            <View
                                className="bg-blue-50 rounded-lg p-3 mb-2"
                                style={{
                                    borderLeftWidth: 4,
                                    borderLeftColor: "#667eea",
                                }}
                            >
                                <Text className="text-gray-700 text-sm">
                                    {subCategory.description}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Form Fields */}
                    <ScrollView
                        className="flex-1 px-6 pt-6"
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {subCategory.customFields.map(
                            (field: any, index: number) => (
                                <View key={field._id} className="mb-6">
                                    <View className="flex-row items-center mb-2">
                                        <MaterialCommunityIcons
                                            name={
                                                getFieldIcon(
                                                    field.fieldName
                                                ) as any
                                            }
                                            size={18}
                                            color="#667eea"
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text className="text-gray-800 font-semibold text-base flex-1">
                                            {field.fieldName}
                                            {field.isRequired && (
                                                <Text className="text-red-500">
                                                    {" "}
                                                    *
                                                </Text>
                                            )}
                                        </Text>
                                    </View>

                                    {field.description && (
                                        <Text className="text-gray-500 text-sm mb-3 ml-6">
                                            {field.description}
                                        </Text>
                                    )}

                                    <TextInput
                                        className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                                        style={{
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 1,
                                            },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 2,
                                            elevation: 1,
                                            borderColor:
                                                field.isRequired &&
                                                !formData[field._id]?.trim()
                                                    ? "#FCA5A5"
                                                    : "#E5E7EB",
                                        }}
                                        placeholder={`Enter ${field.fieldName.toLowerCase()}...`}
                                        value={formData[field._id] || ""}
                                        onChangeText={(value) =>
                                            handleInputChange(field._id, value)
                                        }
                                        multiline={
                                            field.fieldName
                                                .toLowerCase()
                                                .includes("note") ||
                                            field.fieldName
                                                .toLowerCase()
                                                .includes("description")
                                        }
                                        numberOfLines={
                                            field.fieldName
                                                .toLowerCase()
                                                .includes("note") ||
                                            field.fieldName
                                                .toLowerCase()
                                                .includes("description")
                                                ? 3
                                                : 1
                                        }
                                        editable={!submitFormMutation.isPending}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            )
                        )}

                        {/* Bottom Spacing */}
                        <View className="h-32" />
                    </ScrollView>

                    {/* Submit Button */}
                    <View className="px-6 py-4 bg-white border-t border-gray-200">
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={submitFormMutation.isPending}
                            className="rounded-xl p-4 items-center"
                            style={{
                                backgroundColor: submitFormMutation.isPending
                                    ? "#9CA3AF"
                                    : "#667eea",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            {submitFormMutation.isPending ? (
                                <View className="flex-row items-center">
                                    <ActivityIndicator
                                        size="small"
                                        color="white"
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text className="text-white font-semibold text-lg">
                                        Submitting...
                                    </Text>
                                </View>
                            ) : (
                                <Text className="text-white font-semibold text-lg">
                                    Submit Form
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default MaintenanceFormPage;
