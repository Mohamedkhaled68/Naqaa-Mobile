import useGetCategories from "@/hooks/categories/useGetCategories";
import useGetSubCategoriesForCate from "@/hooks/categories/useGetSubCategoriesForCate";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface Category {
    _id: string;
    name: string;
}

interface SubCategory {
    _id: string;
    name: string;
    description: string;
    type: string;
    category: string;
    customFields: any[];
}

const SubcategorySelectionPage = () => {
    const router = useRouter();
    const [selectedSubCategories, setSelectedSubCategories] = useState<
        SubCategory[]
    >([]);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set()
    );

    const { data: categories, isLoading: categoriesLoading } =
        useGetCategories();

    const getMaintenanceIcon = (categoryName: string) => {
        const name = categoryName?.toLowerCase();
        if (name?.includes("engine")) return "engine";
        if (name?.includes("brake")) return "car-brake-alert";
        if (name?.includes("oil")) return "oil";
        if (name?.includes("tire") || name?.includes("wheel")) return "tire";
        if (name?.includes("battery")) return "car-battery";
        if (name?.includes("transmission")) return "car-shift-pattern";
        return "car-wrench";
    };

    const getSubCategoryIcon = (subCategoryType: string) => {
        const type = subCategoryType?.toLowerCase() || "";
        if (type.includes("inspection")) return "magnify";
        if (type.includes("replacement")) return "autorenew";
        if (type.includes("repair")) return "wrench";
        if (type.includes("maintenance")) return "car-wrench";
        if (type.includes("cleaning")) return "spray-bottle";
        return "cog";
    };

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const toggleSubCategory = (subCategory: SubCategory) => {
        const isSelected = selectedSubCategories.some(
            (sc) => sc._id === subCategory._id
        );
        if (isSelected) {
            setSelectedSubCategories((prev) =>
                prev.filter((sc) => sc._id !== subCategory._id)
            );
        } else {
            setSelectedSubCategories((prev) => [...prev, subCategory]);
        }
    };

    const handleContinue = () => {
        if (selectedSubCategories.length === 0) {
            return;
        }

        // Navigate to unified form with selected subcategories
        const subcategoryIds = selectedSubCategories
            .map((sc) => sc._id)
            .join(",");
        router.push({
            pathname: "/maintenance/unified-form",
            params: { subcategoryIds },
        } as any);
    };

    // Component for rendering subcategories of a specific category
    const CategorySubCategories = ({ categoryId }: { categoryId: string }) => {
        const { data: subCategories, isLoading: subCategoriesLoading } =
            useGetSubCategoriesForCate(categoryId);

        if (subCategoriesLoading) {
            return (
                <View className="py-4">
                    <ActivityIndicator size="small" color="#667eea" />
                </View>
            );
        }

        if (!subCategories || subCategories.length === 0) {
            return (
                <Text className="text-gray-500 text-sm py-2">
                    No subcategories available
                </Text>
            );
        }

        return (
            <>
                {subCategories.map((subCategory: SubCategory) => {
                    const isSelected = selectedSubCategories.some(
                        (sc) => sc._id === subCategory._id
                    );
                    return (
                        <TouchableOpacity
                            key={subCategory._id}
                            className={`bg-white rounded-lg p-3 mb-2 border ${
                                isSelected
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200"
                            }`}
                            onPress={() => toggleSubCategory(subCategory)}
                        >
                            <View className="flex-row items-center">
                                <View
                                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                                    style={{
                                        backgroundColor: isSelected
                                            ? "rgba(102, 126, 234, 0.2)"
                                            : "rgba(102, 126, 234, 0.1)",
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name={
                                            getSubCategoryIcon(
                                                subCategory.type
                                            ) as any
                                        }
                                        size={16}
                                        color="#667eea"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-medium text-sm">
                                        {subCategory.name}
                                    </Text>
                                    <Text className="text-gray-500 text-xs">
                                        Type: {subCategory.type}
                                    </Text>
                                </View>
                                {isSelected && (
                                    <MaterialCommunityIcons
                                        name="check-circle"
                                        size={20}
                                        color="#667eea"
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </>
        );
    };

    const renderCategory = ({ item: category }: { item: Category }) => {
        const isExpanded = expandedCategories.has(category._id);

        return (
            <View className="mb-3">
                <TouchableOpacity
                    className="bg-white rounded-xl p-4 shadow-sm"
                    style={{
                        borderWidth: 1,
                        borderColor: isExpanded ? "#667eea" : "#F3F4F6",
                    }}
                    onPress={() => toggleCategory(category._id)}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View
                                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                                style={{
                                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name={
                                        getMaintenanceIcon(category.name) as any
                                    }
                                    size={24}
                                    color="#667eea"
                                />
                            </View>
                            <Text className="text-gray-800 font-semibold text-base">
                                {category.name}
                            </Text>
                        </View>
                        <MaterialCommunityIcons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="#9CA3AF"
                        />
                    </View>
                </TouchableOpacity>

                {isExpanded && (
                    <View className="mt-2 ml-4">
                        <CategorySubCategories categoryId={category._id} />
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="px-6 pt-4 pb-2 bg-white border-b border-gray-200">
                    <View className="flex-row items-center mb-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mr-4 p-2 rounded-full"
                            style={{
                                backgroundColor: "rgba(102, 126, 234, 0.1)",
                            }}
                        >
                            <MaterialCommunityIcons
                                name="arrow-left"
                                size={20}
                                color="#667eea"
                            />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-gray-800 text-xl font-bold">
                                Select Services
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1">
                                Choose multiple maintenance services
                            </Text>
                        </View>
                    </View>

                    {selectedSubCategories.length > 0 && (
                        <View className="bg-blue-50 rounded-lg p-3 mb-2">
                            <Text className="text-blue-700 font-medium text-sm">
                                {selectedSubCategories.length} service(s)
                                selected
                            </Text>
                            <View className="flex-row flex-wrap mt-2">
                                {selectedSubCategories.map((sc, index) => (
                                    <View
                                        key={sc._id}
                                        className="bg-blue-200 rounded-md px-2 py-1 mr-2 mb-1"
                                    >
                                        <Text className="text-blue-800 text-xs">
                                            {sc.name}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {/* Categories List */}
                <View className="flex-1 px-6 py-4">
                    {categoriesLoading ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator size="large" color="#667eea" />
                            <Text className="text-gray-600 mt-4">
                                Loading categories...
                            </Text>
                        </View>
                    ) : categories && categories.length > 0 ? (
                        <FlatList
                            data={categories}
                            renderItem={renderCategory}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        />
                    ) : (
                        <View className="flex-1 justify-center items-center">
                            <MaterialCommunityIcons
                                name="car-wrench"
                                size={64}
                                color="#9CA3AF"
                            />
                            <Text className="text-gray-500 text-center mt-4">
                                No categories available
                            </Text>
                        </View>
                    )}
                </View>

                {/* Continue Button */}
                {selectedSubCategories.length > 0 && (
                    <View className="px-6 py-4 bg-white border-t border-gray-200">
                        <TouchableOpacity
                            onPress={handleContinue}
                            className="bg-blue-600 rounded-xl p-4 items-center"
                        >
                            <Text className="text-white font-semibold text-lg">
                                Continue with {selectedSubCategories.length}{" "}
                                service(s)
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default SubcategorySelectionPage;
