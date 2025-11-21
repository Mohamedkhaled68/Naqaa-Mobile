import FilterModal from "@/components/maintenance/FilterModal";
import useGetLastMaintenance from "@/hooks/receiver/useGetLastMaintenance";
import { MaintenanceHistoryRecord } from "@/types/maintenance-history";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const MaintenanceHistory = () => {
    const router = useRouter();

    // Filter states
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [driverNameFilter, setDriverNameFilter] = useState("");
    const [plateNumberFilter, setPlateNumberFilter] = useState("");
    const [subCategoryFilter, setSubCategoryFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    // Applied filters (what's actually being used in the query)
    const [appliedFilters, setAppliedFilters] = useState({
        driverName: "",
        plateNumber: "",
        subCategoryName: "",
        date: "",
    });

    const {
        data: maintenanceHistory,
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useGetLastMaintenance(appliedFilters);

    console.log("maintenance history : ", maintenanceHistory);

    const formatDate = (dateString: string) => {
        if (!dateString) return "Date unknown";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const applyFilters = useCallback(() => {
        setAppliedFilters({
            driverName: driverNameFilter.trim(),
            plateNumber: plateNumberFilter.trim(),
            subCategoryName: subCategoryFilter.trim(),
            date: dateFilter.trim(),
        });
        setFilterModalVisible(false);
    }, [driverNameFilter, plateNumberFilter, subCategoryFilter, dateFilter]);

    const clearFilters = useCallback(() => {
        setDriverNameFilter("");
        setPlateNumberFilter("");
        setSubCategoryFilter("");
        setDateFilter("");
        setAppliedFilters({
            driverName: "",
            plateNumber: "",
            subCategoryName: "",
            date: "",
        });
        setFilterModalVisible(false);
    }, []);

    const hasActiveFilters = useMemo(
        () =>
            appliedFilters.driverName ||
            appliedFilters.plateNumber ||
            appliedFilters.subCategoryName ||
            appliedFilters.date,
        [appliedFilters]
    );

    const getActiveFilterCount = useCallback(() => {
        let count = 0;
        if (appliedFilters.driverName) count++;
        if (appliedFilters.plateNumber) count++;
        if (appliedFilters.subCategoryName) count++;
        if (appliedFilters.date) count++;
        return count;
    }, [appliedFilters]);

    const renderMaintenanceItem = useCallback(
        ({ item }: { item: MaintenanceHistoryRecord }) => {
            const statusColor = "#059669";
            const statusIcon = "checkmark-done-outline";
            const statusText = "Completed";

            return (
                <TouchableOpacity
                    className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
                    onPress={() => {
                        if (item._id) {
                            router.push(
                                `/(receiver)/request-details/${item._id}`
                            );
                        }
                    }}
                >
                    {/* Header with status */}
                    <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center">
                            <View
                                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                                style={{ backgroundColor: statusColor + "20" }}
                            >
                                <Ionicons
                                    name={statusIcon}
                                    size={16}
                                    color={statusColor}
                                />
                            </View>
                            <Text className="font-semibold text-gray-800">
                                {item.description || "Maintenance Request"}
                            </Text>
                        </View>
                        <View
                            className="px-2 py-1 rounded-full"
                            style={{ backgroundColor: statusColor + "20" }}
                        >
                            <Text
                                className="text-xs font-medium"
                                style={{ color: statusColor }}
                            >
                                {statusText}
                            </Text>
                        </View>
                    </View>

                    {/* Vehicle and Details */}
                    <View className="space-y-2 mb-3">
                        {item.car && (
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="car-outline"
                                    size={16}
                                    color="#6b7280"
                                />
                                <Text className="text-sm text-gray-600 ml-2">
                                    Vehicle: {item.car.brand} {item.car.model} (
                                    {item.car.plateNumber})
                                </Text>
                            </View>
                        )}
                        {item.driver && (
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="person-outline"
                                    size={16}
                                    color="#6b7280"
                                />
                                <Text className="text-sm text-gray-600 ml-2">
                                    Driver: {item.driver.name}
                                </Text>
                            </View>
                        )}
                        <View className="flex-row items-center">
                            <Ionicons
                                name="cash-outline"
                                size={16}
                                color="#6b7280"
                            />
                            <Text className="text-sm text-gray-600 ml-2">
                                Cost: ${item.cost || 0}
                                {item.mechanicCost > 0 &&
                                    ` + ${item.mechanicCost} (mechanic)`}
                            </Text>
                        </View>
                    </View>

                    {/* Footer with date and additional info */}
                    <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                        <View className="flex-row items-center">
                            <Ionicons
                                name="time-outline"
                                size={14}
                                color="#6b7280"
                            />
                            <Text className="text-xs text-gray-500 ml-1">
                                {formatDate(item.date)} 
                            </Text>
                        </View>

                        {item._id && (
                            <View className="flex-row items-center">
                                <Text className="text-xs text-gray-400 mr-2">
                                    View Details
                                </Text>
                                <Ionicons
                                    name="chevron-forward"
                                    size={14}
                                    color="#6b7280"
                                />
                            </View>
                        )}
                    </View>

                    {/* Additional indicators */}
                    {item.customFieldData &&
                        item.customFieldData.length > 0 && (
                            <View className="mt-2 flex-row items-center">
                                <Ionicons
                                    name="information-circle-outline"
                                    size={14}
                                    color="#6b7280"
                                />
                                <Text className="text-xs text-gray-600 ml-1">
                                    {item.customFieldData.length} custom field
                                    {item.customFieldData.length > 1 ? "s" : ""}
                                </Text>
                            </View>
                        )}
                </TouchableOpacity>
            );
        },
        [router]
    );

    const EmptyState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
            <Text className="text-lg font-medium text-gray-500 mt-4">
                {hasActiveFilters
                    ? "No Matching Records"
                    : "No Maintenance History"}
            </Text>
            <Text className="text-sm text-gray-400 text-center mt-2 px-8">
                {hasActiveFilters
                    ? "Try adjusting your filters to see more results"
                    : "Completed and past maintenance requests will appear here"}
            </Text>
            {hasActiveFilters && (
                <TouchableOpacity
                    className="bg-purple-600 px-6 py-3 rounded-lg mt-4"
                    onPress={clearFilters}
                >
                    <Text className="text-white font-medium">
                        Clear Filters
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const LoadingState = () => (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text className="text-gray-500 mt-4">
                Loading maintenance history...
            </Text>
        </View>
    );

    const ErrorState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
            <Text className="text-lg font-medium text-gray-800 mt-4">
                Error Loading History
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2 px-8">
                {error?.message || "Failed to load maintenance history"}
            </Text>
            <TouchableOpacity
                className="bg-purple-600 px-6 py-3 rounded-lg mt-4"
                onPress={() => refetch()}
            >
                <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white px-6 py-4 border-b border-gray-200">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="mr-4"
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={24}
                                    color="#374151"
                                />
                            </TouchableOpacity>
                            <Text className="text-xl font-bold text-gray-800">
                                Maintenance History
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-5">
                            <TouchableOpacity
                                onPress={() => setFilterModalVisible(true)}
                                className="relative"
                            >
                                <Ionicons
                                    name={
                                        hasActiveFilters
                                            ? "filter"
                                            : "filter-outline"
                                    }
                                    size={24}
                                    color={
                                        hasActiveFilters ? "#8b5cf6" : "#6b7280"
                                    }
                                />
                                {hasActiveFilters && (
                                    <View className="absolute -top-1 -right-1 bg-purple-600 rounded-full w-4 h-4 items-center justify-center">
                                        <Text className="text-white text-xs font-bold">
                                            {getActiveFilterCount()}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => refetch()}>
                                <Ionicons
                                    name="refresh"
                                    size={24}
                                    color="#8b5cf6"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <View className="mt-3 flex-row flex-wrap">
                            {appliedFilters.driverName && (
                                <View className="bg-purple-100 px-3 py-1 rounded-full flex-row items-center mr-2 mb-2">
                                    <Ionicons
                                        name="person"
                                        size={12}
                                        color="#8b5cf6"
                                    />
                                    <Text className="text-xs text-purple-700 ml-1 mr-1">
                                        {appliedFilters.driverName}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setDriverNameFilter("");
                                            setAppliedFilters((prev) => ({
                                                ...prev,
                                                driverName: "",
                                            }));
                                        }}
                                    >
                                        <Ionicons
                                            name="close"
                                            size={12}
                                            color="#8b5cf6"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            {appliedFilters.plateNumber && (
                                <View className="bg-purple-100 px-3 py-1 rounded-full flex-row items-center mr-2 mb-2">
                                    <Ionicons
                                        name="car"
                                        size={12}
                                        color="#8b5cf6"
                                    />
                                    <Text className="text-xs text-purple-700 ml-1 mr-1">
                                        {appliedFilters.plateNumber}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setPlateNumberFilter("");
                                            setAppliedFilters((prev) => ({
                                                ...prev,
                                                plateNumber: "",
                                            }));
                                        }}
                                    >
                                        <Ionicons
                                            name="close"
                                            size={12}
                                            color="#8b5cf6"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            {appliedFilters.subCategoryName && (
                                <View className="bg-purple-100 px-3 py-1 rounded-full flex-row items-center mr-2 mb-2">
                                    <Ionicons
                                        name="list"
                                        size={12}
                                        color="#8b5cf6"
                                    />
                                    <Text className="text-xs text-purple-700 ml-1 mr-1">
                                        {appliedFilters.subCategoryName}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSubCategoryFilter("");
                                            setAppliedFilters((prev) => ({
                                                ...prev,
                                                subCategoryName: "",
                                            }));
                                        }}
                                    >
                                        <Ionicons
                                            name="close"
                                            size={12}
                                            color="#8b5cf6"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            {appliedFilters.date && (
                                <View className="bg-purple-100 px-3 py-1 rounded-full flex-row items-center mr-2 mb-2">
                                    <Ionicons
                                        name="calendar"
                                        size={12}
                                        color="#8b5cf6"
                                    />
                                    <Text className="text-xs text-purple-700 ml-1 mr-1">
                                        Date: {appliedFilters.date}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setDateFilter("");
                                            setAppliedFilters((prev) => ({
                                                ...prev,
                                                date: "",
                                            }));
                                        }}
                                    >
                                        <Ionicons
                                            name="close"
                                            size={12}
                                            color="#8b5cf6"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}

                    {maintenanceHistory && (
                        <Text className="text-sm text-gray-600 mt-2">
                            {maintenanceHistory.length}{" "}
                            {maintenanceHistory.length === 1
                                ? "record"
                                : "records"}{" "}
                            found
                        </Text>
                    )}
                </View>

                {/* Content */}
                <View className="flex-1 px-6 py-4">
                    {isLoading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState />
                    ) : (
                        <FlatList
                            data={maintenanceHistory || []}
                            renderItem={renderMaintenanceItem}
                            keyExtractor={(item, index) =>
                                item._id || index.toString()
                            }
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefetching}
                                    onRefresh={refetch}
                                    colors={["#8b5cf6"]}
                                />
                            }
                            ListEmptyComponent={EmptyState}
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingBottom: 20,
                            }}
                        />
                    )}
                </View>

                {/* Filter Modal */}
                <FilterModal
                    visible={filterModalVisible}
                    onClose={() => setFilterModalVisible(false)}
                    driverNameFilter={driverNameFilter}
                    plateNumberFilter={plateNumberFilter}
                    subCategoryFilter={subCategoryFilter}
                    dateFilter={dateFilter}
                    onDriverNameChange={setDriverNameFilter}
                    onPlateNumberChange={setPlateNumberFilter}
                    onSubCategoryChange={setSubCategoryFilter}
                    onDateChange={setDateFilter}
                    onApplyFilters={applyFilters}
                    onClearFilters={clearFilters}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default MaintenanceHistory;
