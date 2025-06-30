import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface MaintenanceCategory {
    _id: string;
    name: string;
}

interface MaintenanceCategoriesProps {
    categories: MaintenanceCategory[] | undefined;
    isLoading?: boolean;
}

const MaintenanceCategories: React.FC<MaintenanceCategoriesProps> = ({
    categories,
    isLoading = false,
}) => {
    const router = useRouter();

    // Limit categories to 12 for home page
    const limitedCategories = categories?.slice(0, 12);
    const hasMoreCategories = categories && categories.length > 12;
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

    const renderMaintenanceItem = ({ item }: { item: MaintenanceCategory }) => (
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
                        className="w-10 h-10 rounded-full items-center justify-center mb-2"
                        style={{ backgroundColor: "rgba(102, 126, 234, 0.1)" }}
                    >
                        <MaterialCommunityIcons
                            name={getMaintenanceIcon(item.name) as any}
                            size={20}
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

    return (
        <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <View
                        className="w-6 h-6 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: "rgba(240, 147, 251, 0.2)" }}
                    >
                        <MaterialCommunityIcons
                            name="car-wrench"
                            size={14}
                            color="#f093fb"
                        />
                    </View>
                    <Text className="text-gray-800 font-bold text-lg">
                        Maintenance Categories
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push("/categories" as any)}
                >
                    <Text className="font-medium" style={{ color: "#667eea" }}>
                        View All
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View className="flex-row flex-wrap justify-between">
                    {[1, 2, 3, 4].map((item) => (
                        <View
                            key={item}
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
                                    className="w-10 h-10 rounded-full mb-2"
                                    style={{ backgroundColor: "#F3F4F6" }}
                                />
                                <View
                                    className="h-4 rounded"
                                    style={{
                                        width: "80%",
                                        backgroundColor: "#F3F4F6",
                                    }}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            ) : limitedCategories && limitedCategories.length > 0 ? (
                <FlatList
                    data={limitedCategories}
                    renderItem={renderMaintenanceItem}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    scrollEnabled={false}
                />
            ) : (
                <View
                    className="bg-white rounded-xl p-8 items-center"
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
                        name="car-wrench"
                        size={48}
                        color="#9CA3AF"
                    />
                    <Text className="text-text-muted text-center mt-4 mb-2">
                        No maintenance categories available
                    </Text>
                    <Text className="text-text-muted text-sm text-center">
                        Check back later for updates
                    </Text>
                </View>
            )}
        </View>
    );
};

export default MaintenanceCategories;
