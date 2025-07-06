import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const NoCarAssignedCard = () => {
    return (
        <View className="mx-4 my-3 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <View className="items-center">
                {/* Icon */}
                <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="car-outline" size={32} color="#f97316" />
                </View>

                {/* Title */}
                <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">
                    No Vehicle Assigned
                </Text>

                {/* Description */}
                <Text className="text-gray-600 text-center leading-relaxed">
                    You haven't been assigned to a vehicle yet. Please contact
                    your supervisor or administrator to get assigned to a
                    vehicle.
                </Text>

                {/* Additional Info */}
                <View className="mt-4 p-3 bg-blue-50 rounded-lg w-full">
                    <Text className="text-blue-700 text-sm text-center font-medium">
                        💡 Once assigned, you'll be able to access maintenance
                        categories and vehicle status
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default NoCarAssignedCard;
