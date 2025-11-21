import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    driverNameFilter: string;
    plateNumberFilter: string;
    subCategoryFilter: string;
    dateFilter: string;
    onDriverNameChange: (value: string) => void;
    onPlateNumberChange: (value: string) => void;
    onSubCategoryChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

const FilterModal = ({
    visible,
    onClose,
    driverNameFilter,
    plateNumberFilter,
    subCategoryFilter,
    dateFilter,
    onDriverNameChange,
    onPlateNumberChange,
    onSubCategoryChange,
    onDateChange,
    onApplyFilters,
    onClearFilters,
}: FilterModalProps) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
                    {/* Modal Header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-xl font-bold text-gray-800">
                            Filter Records
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Filter Inputs */}
                    <View className="space-y-4 mb-6">
                        {/* Driver Name Filter */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Driver Name
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color="#6b7280"
                                />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-800"
                                    placeholder="Enter driver name"
                                    value={driverNameFilter}
                                    onChangeText={onDriverNameChange}
                                    placeholderTextColor="#9ca3af"
                                />
                                {driverNameFilter.length > 0 && (
                                    <TouchableOpacity
                                        onPress={() => onDriverNameChange("")}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Plate Number Filter */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Plate Number
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                <Ionicons
                                    name="car-outline"
                                    size={20}
                                    color="#6b7280"
                                />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-800"
                                    placeholder="Enter plate number"
                                    value={plateNumberFilter}
                                    onChangeText={onPlateNumberChange}
                                    autoCapitalize="characters"
                                    placeholderTextColor="#9ca3af"
                                />
                                {plateNumberFilter.length > 0 && (
                                    <TouchableOpacity
                                        onPress={() => onPlateNumberChange("")}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Sub Category Filter */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Maintenance Type
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                <Ionicons
                                    name="list-outline"
                                    size={20}
                                    color="#6b7280"
                                />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-800"
                                    placeholder="Enter maintenance type"
                                    value={subCategoryFilter}
                                    onChangeText={onSubCategoryChange}
                                    placeholderTextColor="#9ca3af"
                                />
                                {subCategoryFilter.length > 0 && (
                                    <TouchableOpacity
                                        onPress={() => onSubCategoryChange("")}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Date Filter */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Date
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color="#6b7280"
                                />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-800"
                                    placeholder="MM-DD-YYYY"
                                    value={dateFilter}
                                    onChangeText={onDateChange}
                                    placeholderTextColor="#9ca3af"
                                />
                                {dateFilter.length > 0 && (
                                    <TouchableOpacity
                                        onPress={() => onDateChange("")}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row space-x-3">
                        <TouchableOpacity
                            className="flex-1 bg-gray-100 py-4 rounded-lg"
                            onPress={onClearFilters}
                        >
                            <Text className="text-center font-semibold text-gray-700">
                                Clear All
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 bg-purple-600 py-4 rounded-lg"
                            onPress={onApplyFilters}
                        >
                            <Text className="text-center font-semibold text-white">
                                Apply Filters
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FilterModal;
