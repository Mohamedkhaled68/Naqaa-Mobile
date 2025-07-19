import useGetMultipleSubCategoryDetails from "@/hooks/categories/useGetMultipleSubCategoryDetails";
import useSubmitMaintenanceForm from "@/hooks/maintenance/useSubmitMaintenanceForm";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

const UnifiedMaintenanceFormPage = () => {
    const { subcategoryIds } = useLocalSearchParams();
    const router = useRouter();
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [cost, setCost] = useState<string>("");
    const [mechanicCost, setMechanicCost] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    // Submit form mutation
    const submitFormMutation = useSubmitMaintenanceForm();

    // Parse subcategory IDs
    const subcategoryIdArray =
        typeof subcategoryIds === "string" ? subcategoryIds.split(",") : [];

    // Fetch all subcategory details
    const {
        data: subCategories = [],
        isLoading,
        error,
    } = useGetMultipleSubCategoryDetails(subcategoryIdArray);

    // Initialize form data when subcategories are loaded
    useEffect(() => {
        if (subCategories.length > 0) {
            const initialFormData: { [key: string]: string } = {};
            subCategories.forEach((subCategory) => {
                subCategory.customFields.forEach((field: CustomField) => {
                    initialFormData[`${field._id}_${subCategory._id}`] = "";
                });
            });
            setFormData(initialFormData);
        }
    }, [subCategories]);

    const handleInputChange = (fieldId: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const validateForm = (): boolean => {
        // Validate required fixed fields
        if (!cost.trim()) {
            Alert.alert(
                "Required Field Missing",
                "Please enter the total cost."
            );
            return false;
        }

        if (!mechanicCost.trim()) {
            Alert.alert(
                "Required Field Missing",
                "Please enter the mechanic cost."
            );
            return false;
        }

        if (!description.trim()) {
            Alert.alert(
                "Required Field Missing",
                "Please enter a description for this maintenance request."
            );
            return false;
        }

        // Validate cost fields are numbers
        if (isNaN(Number(cost)) || Number(cost) <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid total cost.");
            return false;
        }

        if (isNaN(Number(mechanicCost)) || Number(mechanicCost) <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid mechanic cost.");
            return false;
        }

        // Validate custom fields
        for (const subCategory of subCategories) {
            const requiredFields = subCategory.customFields.filter(
                (field: CustomField) => field.isRequired
            );

            for (const field of requiredFields) {
                const fieldKey = `${field._id}_${subCategory._id}`;
                if (!formData[fieldKey]?.trim()) {
                    Alert.alert(
                        "Required Field Missing",
                        `Please fill in the "${field.fieldName}" field for ${subCategory.name}.`
                    );
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            // Transform formData into customFieldData format
            const customFieldData: any[] = [];

            subCategories.forEach((subCategory) => {
                subCategory.customFields.forEach((field: CustomField) => {
                    const fieldKey = `${field._id}_${subCategory._id}`;
                    const value = formData[fieldKey];

                    if (value && value.trim() !== "") {
                        customFieldData.push({
                            fieldName: field.fieldName,
                            fieldValue: value.trim(),
                            subcategoryId: subCategory._id,
                        });
                    }
                });
            });

            const submissionData = {
                subCategories: subcategoryIdArray,
                customFieldData,
                description: description.trim(),
                cost: Number(cost),
                mechanicCost: Number(mechanicCost),
            };

            console.log("Submitting unified form:", submissionData);

            await submitFormMutation.mutateAsync(submissionData);

            Alert.alert("Success", "Maintenance form submitted successfully!", [
                {
                    text: "OK",
                    onPress: () => router.push("/(main)/requests"),
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

    if (error || subCategories.length === 0) {
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
                                    Maintenance Request
                                </Text>
                                <Text className="text-gray-500 text-sm mt-1">
                                    {subCategories.length} service(s) • Fill
                                    required fields
                                </Text>
                            </View>
                        </View>

                        <View className="bg-blue-50 rounded-lg p-3">
                            <Text className="text-blue-700 font-medium text-sm mb-2">
                                Selected Services:
                            </Text>
                            <View className="flex-row flex-wrap">
                                {subCategories.map((subCategory) => (
                                    <View
                                        key={subCategory._id}
                                        className="bg-blue-200 rounded-md px-2 py-1 mr-2 mb-1"
                                    >
                                        <Text className="text-blue-800 text-xs">
                                            {subCategory.name}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <ScrollView
                        className="flex-1 px-6 pt-6"
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Dynamic Custom Fields for each subcategory */}
                        {subCategories.map((subCategory, categoryIndex) => (
                            <View key={subCategory._id} className="mb-8">
                                <View className="bg-white rounded-lg p-4 mb-4">
                                    <Text className="text-lg font-bold text-gray-800 mb-2">
                                        {subCategory.name}
                                    </Text>
                                    {subCategory.description && (
                                        <Text className="text-gray-600 text-sm">
                                            {subCategory.description}
                                        </Text>
                                    )}
                                </View>

                                {subCategory.customFields.map(
                                    (field: CustomField) => {
                                        const fieldKey = `${field._id}_${subCategory._id}`;
                                        return (
                                            <View
                                                key={fieldKey}
                                                className="mb-6"
                                            >
                                                <View className="flex-row items-center mb-2">
                                                    <MaterialCommunityIcons
                                                        name={
                                                            getFieldIcon(
                                                                field.fieldName
                                                            ) as any
                                                        }
                                                        size={18}
                                                        color="#667eea"
                                                        style={{
                                                            marginRight: 8,
                                                        }}
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
                                                            !formData[
                                                                fieldKey
                                                            ]?.trim()
                                                                ? "#FCA5A5"
                                                                : "#E5E7EB",
                                                    }}
                                                    placeholder={`Enter ${field.fieldName.toLowerCase()}...`}
                                                    value={
                                                        formData[fieldKey] || ""
                                                    }
                                                    onChangeText={(value) =>
                                                        handleInputChange(
                                                            fieldKey,
                                                            value
                                                        )
                                                    }
                                                    multiline={
                                                        field.fieldName
                                                            .toLowerCase()
                                                            .includes("note") ||
                                                        field.fieldName
                                                            .toLowerCase()
                                                            .includes(
                                                                "description"
                                                            )
                                                    }
                                                    numberOfLines={
                                                        field.fieldName
                                                            .toLowerCase()
                                                            .includes("note") ||
                                                        field.fieldName
                                                            .toLowerCase()
                                                            .includes(
                                                                "description"
                                                            )
                                                            ? 3
                                                            : 1
                                                    }
                                                    editable={
                                                        !submitFormMutation.isPending
                                                    }
                                                    placeholderTextColor="#9CA3AF"
                                                />
                                            </View>
                                        );
                                    }
                                )}
                            </View>
                        ))}

                        {/* Fixed Required Fields */}
                        <View className="border-t border-gray-200 pt-6 mt-6">
                            <Text className="text-gray-800 font-bold text-lg mb-4">
                                Maintenance Information
                            </Text>

                            {/* Description Field */}
                            <View className="mb-6">
                                <View className="flex-row items-center mb-2">
                                    <MaterialCommunityIcons
                                        name="note-text"
                                        size={18}
                                        color="#667eea"
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text className="text-gray-800 font-semibold text-base flex-1">
                                        Description
                                        <Text className="text-red-500"> *</Text>
                                    </Text>
                                </View>
                                <Text className="text-gray-500 text-sm mb-3 ml-6">
                                    Describe the maintenance work needed or
                                    performed
                                </Text>
                                <TextInput
                                    className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 2,
                                        elevation: 1,
                                        borderColor: !description.trim()
                                            ? "#FCA5A5"
                                            : "#E5E7EB",
                                        minHeight: 100,
                                    }}
                                    placeholder="Enter detailed description of the maintenance work..."
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    editable={!submitFormMutation.isPending}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <Text className="text-gray-800 font-bold text-lg mb-4 mt-6">
                                Cost Information
                            </Text>

                            {/* Total Cost Field */}
                            <View className="mb-6">
                                <View className="flex-row items-center mb-2">
                                    <MaterialCommunityIcons
                                        name="currency-usd"
                                        size={18}
                                        color="#667eea"
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text className="text-gray-800 font-semibold text-base flex-1">
                                        Total Cost
                                        <Text className="text-red-500"> *</Text>
                                    </Text>
                                </View>
                                <Text className="text-gray-500 text-sm mb-3 ml-6">
                                    Enter the total cost for all maintenance
                                    services
                                </Text>
                                <TextInput
                                    className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 2,
                                        elevation: 1,
                                        borderColor: !cost.trim()
                                            ? "#FCA5A5"
                                            : "#E5E7EB",
                                    }}
                                    placeholder="Enter total cost..."
                                    value={cost}
                                    onChangeText={setCost}
                                    keyboardType="numeric"
                                    editable={!submitFormMutation.isPending}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            {/* Mechanic Cost Field */}
                            <View className="mb-6">
                                <View className="flex-row items-center mb-2">
                                    <MaterialCommunityIcons
                                        name="account-wrench"
                                        size={18}
                                        color="#667eea"
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text className="text-gray-800 font-semibold text-base flex-1">
                                        Mechanic Cost
                                        <Text className="text-red-500"> *</Text>
                                    </Text>
                                </View>
                                <Text className="text-gray-500 text-sm mb-3 ml-6">
                                    Enter the cost for mechanic labor
                                </Text>
                                <TextInput
                                    className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 2,
                                        elevation: 1,
                                        borderColor: !mechanicCost.trim()
                                            ? "#FCA5A5"
                                            : "#E5E7EB",
                                    }}
                                    placeholder="Enter mechanic cost..."
                                    value={mechanicCost}
                                    onChangeText={setMechanicCost}
                                    keyboardType="numeric"
                                    editable={!submitFormMutation.isPending}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

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
                                    Submit Maintenance Request
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default UnifiedMaintenanceFormPage;
