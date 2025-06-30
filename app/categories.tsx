import useGetCategories from "@/hooks/categories/useGetCategories";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface MaintenanceCategory {
    _id: string;
    name: string;
}

const CategoriesPage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const { data: categories, isLoading, error, refetch } = useGetCategories();

    // Filter categories based on search query
    const filteredCategories = categories?.filter(
        (category: MaintenanceCategory) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const renderCategoryItem = ({ item }: { item: MaintenanceCategory }) => (
        <Link href={`/maintenance/${item._id}`} asChild>
            <TouchableOpacity
                className="bg-white rounded-xl p-4 mx-1 mb-3 flex-1"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: "#F3F4F6",
                }}
            >
                <View className="items-center">
                    <View
                        className="w-12 h-12 rounded-full items-center justify-center mb-3"
                        style={{ backgroundColor: "rgba(102, 126, 234, 0.1)" }}
                    >
                        <MaterialCommunityIcons
                            name={getMaintenanceIcon(item.name) as any}
                            size={24}
                            color="#667eea"
                        />
                    </View>
                    <Text className="text-gray-800 font-medium text-sm text-center">
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );

    const handleRefresh = () => {
        refetch();
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="px-6 pt-4 pb-2">
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
                        <Text className="text-gray-800 font-bold text-xl flex-1">
                            All Categories
                        </Text>
                        <Text className="text-gray-500 text-sm">
                            {filteredCategories?.length || 0} found
                        </Text>
                    </View>

                    {/* Search Bar */}
                    <View
                        className="bg-white rounded-xl p-4 mb-4 flex-row items-center"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2,
                            borderWidth: 1,
                            borderColor: "#F3F4F6",
                        }}
                    >
                        <MaterialCommunityIcons
                            name="magnify"
                            size={20}
                            color="#9CA3AF"
                            style={{ marginRight: 12 }}
                        />
                        <TextInput
                            className="flex-1 text-gray-800 text-base"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9CA3AF"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery("")}
                                className="ml-2 p-1"
                            >
                                <MaterialCommunityIcons
                                    name="close-circle"
                                    size={20}
                                    color="#9CA3AF"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Categories List */}
                <View className="flex-1 px-6">
                    {isLoading ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator size="large" color="#667eea" />
                            <Text className="text-gray-600 mt-4">
                                Loading categories...
                            </Text>
                        </View>
                    ) : error ? (
                        <View className="flex-1 justify-center items-center">
                            <MaterialCommunityIcons
                                name="alert-circle-outline"
                                size={64}
                                color="#EF4444"
                            />
                            <Text className="text-red-600 text-center mt-4 mb-2">
                                Error loading categories
                            </Text>
                            <Text className="text-gray-500 text-center mb-4">
                                Please try again later
                            </Text>
                            <TouchableOpacity
                                onPress={handleRefresh}
                                className="bg-red-500 rounded-lg px-6 py-3"
                            >
                                <Text className="text-white font-semibold">
                                    Retry
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : filteredCategories && filteredCategories.length > 0 ? (
                        <FlatList
                            data={filteredCategories}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item._id}
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent: "space-between",
                            }}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isLoading}
                                    onRefresh={handleRefresh}
                                    colors={["#667eea"]}
                                    tintColor="#667eea"
                                />
                            }
                        />
                    ) : (
                        <View className="flex-1 justify-center items-center">
                            <MaterialCommunityIcons
                                name={searchQuery ? "magnify" : "car-wrench"}
                                size={64}
                                color="#9CA3AF"
                            />
                            <Text className="text-gray-500 text-center mt-4 mb-2">
                                {searchQuery
                                    ? `No categories found for "${searchQuery}"`
                                    : "No categories available"}
                            </Text>
                            <Text className="text-gray-400 text-sm text-center">
                                {searchQuery
                                    ? "Try adjusting your search terms"
                                    : "Check back later for updates"}
                            </Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default CategoriesPage;
