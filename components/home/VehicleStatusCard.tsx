import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const VehicleStatusCard: React.FC = () => {
    const statusItems = [
        {
            id: 1,
            title: "Fuel Level",
            value: "85%",
            icon: "gas-station",
            color: "#4facfe",
            bgColor: "rgba(79, 172, 254, 0.1)",
        },
        {
            id: 2,
            title: "Engine Health",
            value: "Good",
            icon: "engine",
            color: "#43e97b",
            bgColor: "rgba(67, 233, 123, 0.1)",
        },
        {
            id: 3,
            title: "Last Service",
            value: "2 days ago",
            icon: "wrench",
            color: "#f093fb",
            bgColor: "rgba(240, 147, 251, 0.1)",
        },
        {
            id: 4,
            title: "Next Service",
            value: "In 28 days",
            icon: "calendar-check",
            color: "#667eea",
            bgColor: "rgba(102, 126, 234, 0.1)",
        },
    ];

    return (
        <View className="px-6 mb-6">
            <View
                className="bg-white rounded-2xl p-6"
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
                <View className="flex-row items-center mb-4">
                    <View
                        className="w-6 h-6 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: "rgba(67, 233, 123, 0.2)" }}
                    >
                        <MaterialCommunityIcons
                            name="car-info"
                            size={14}
                            color="#43e97b"
                        />
                    </View>
                    <Text className="text-gray-800 font-bold text-lg">
                        Vehicle Status
                    </Text>
                </View>

                <View className="flex-row flex-wrap justify-between">
                    {statusItems.map((item) => (
                        <View
                            key={item.id}
                            className="w-[48%] p-4 rounded-xl mb-3"
                            style={{ backgroundColor: item.bgColor }}
                        >
                            <View className="flex-row items-center mb-2">
                                <MaterialCommunityIcons
                                    name={item.icon as any}
                                    size={18}
                                    color={item.color}
                                />
                                <Text
                                    className="text-xs font-medium ml-2"
                                    style={{ color: item.color }}
                                >
                                    {item.title}
                                </Text>
                            </View>
                            <Text
                                className="font-bold text-base"
                                style={{ color: item.color }}
                            >
                                {item.value}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default VehicleStatusCard;
