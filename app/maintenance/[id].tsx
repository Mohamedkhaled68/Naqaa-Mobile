import useGetSubCategoriesForCate from "@/hooks/categories/useGetSubCategoriesForCate";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const maintenancePage = () => {
    const { id, subCategory } = useLocalSearchParams();
    const router = useRouter();

    const {
        data: subCategories,
        isLoading,
        error,
    } = useGetSubCategoriesForCate(id);

    // Find the specific subcategory if subCategory param is provided
    const selectedSubCategory = subCategory
        ? subCategories?.find((sub: any) => sub._id === subCategory)
        : null;

    const getSubCategoryIcon = (subCategoryType: string) => {
        const type = subCategoryType?.toLowerCase() || "";
        if (type.includes("inspection")) return "magnify";
        if (type.includes("replacement")) return "autorenew";
        if (type.includes("repair")) return "wrench";
        if (type.includes("maintenance")) return "car-wrench";
        if (type.includes("cleaning")) return "spray-bottle";
        return "cog";
    };

    const renderSubCategory = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="bg-white rounded-xl p-4 mb-3"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
                borderWidth: 1,
                borderColor: item._id === subCategory ? "#667eea" : "#F3F4F6",
            }}
            onPress={() => router.push(`/maintenance/form/${item._id}` as any)}
        >
            <View className="flex-row items-start">
                <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{
                        backgroundColor:
                            item._id === subCategory
                                ? "rgba(102, 126, 234, 0.2)"
                                : "rgba(102, 126, 234, 0.1)",
                    }}
                >
                    <MaterialCommunityIcons
                        name={getSubCategoryIcon(item.type) as any}
                        size={20}
                        color="#667eea"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-gray-800 font-semibold text-base mb-1">
                        {item.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                        Type: {item.type}
                    </Text>
                    {item.description && (
                        <Text className="text-gray-400 text-xs mt-1">
                            {item.description}
                        </Text>
                    )}
                </View>
                {item._id === subCategory && (
                    <View className="ml-2">
                        <MaterialCommunityIcons
                            name="check-circle"
                            size={20}
                            color="#667eea"
                        />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-gray-50">
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text className="text-gray-600 mt-4">
                            Loading subcategories...
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
                        <Text className="text-red-600 text-center">
                            Error loading subcategories
                        </Text>
                        <Text className="text-gray-500 text-center mt-2">
                            Please try again later
                        </Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 p-6">
                    {/* Header with Back Button */}
                    <View className="flex-row items-center mb-6">
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
                        <Text className="text-gray-800 text-xl font-bold flex-1">
                            Maintenance Category
                        </Text>
                    </View>

                    {selectedSubCategory && (
                        <View className="mb-6">
                            <Text className="text-gray-600 font-semibold mb-3">
                                Selected Subcategory:
                            </Text>
                            {renderSubCategory({ item: selectedSubCategory })}
                        </View>
                    )}

                    {subCategories && subCategories.length > 0 ? (
                        <View>
                            <Text className="text-gray-600 font-semibold mb-4">
                                {selectedSubCategory
                                    ? "All Subcategories"
                                    : "Subcategories"}{" "}
                                ({subCategories.length})
                            </Text>
                            <FlatList
                                data={subCategories}
                                renderItem={renderSubCategory}
                                keyExtractor={(item) => item._id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        </View>
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <MaterialCommunityIcons
                                name="car-wrench"
                                size={64}
                                color="#9CA3AF"
                            />
                            <Text className="text-gray-500 text-center mt-4 mb-2">
                                No subcategories available
                            </Text>
                            <Text className="text-gray-400 text-sm text-center">
                                Check back later for updates
                            </Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default maintenancePage;
