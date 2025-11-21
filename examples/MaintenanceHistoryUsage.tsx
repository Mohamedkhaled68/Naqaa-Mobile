// Example usage of useGetLastMaintenance hook
// You can use this as a reference for implementing in other components

import useGetLastMaintenance from "@/hooks/receiver/useGetLastMaintenance";
import { Text, TouchableOpacity, View } from "react-native";

const ExampleMaintenanceComponent = () => {
    const {
        data: maintenanceHistory,
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useGetLastMaintenance();

    console.log("Maintenance History Data:", maintenanceHistory);

    // Handle loading state
    if (isLoading) {
        return <Text>Loading maintenance history...</Text>;
    }

    // Handle error state
    if (error) {
        return (
            <View>
                <Text>Error: {error.message}</Text>
                <TouchableOpacity onPress={() => refetch()}>
                    <Text>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Handle success state
    return (
        <View>
            <Text>Maintenance Records: {maintenanceHistory?.length || 0}</Text>
            {maintenanceHistory?.map((item: any, index: number) => (
                <View key={index}>
                    <Text>{item.description}</Text>
                    <Text>Cost: ${item.cost}</Text>
                    <Text>Vehicle: {item.car}</Text>
                    <Text>{item.date}</Text>
                </View>
            ))}
        </View>
    );
};

// Usage patterns:

// 1. In Dashboard - Show recent history (example - would need maintenanceHistory in scope)
// const recent = maintenanceHistory?.slice(0, 3);

// Filter by cost range (example)
// const expensiveMaintenance = maintenanceHistory?.filter((item) => item.cost > 100);

// Group by date (example - would need maintenanceHistory in scope)
// const groupedByMonth = maintenanceHistory?.reduce((acc, item) => {
//     const month = new Date(item.date).getMonth();
//     if (!acc[month]) acc[month] = [];
//     acc[month].push(item);
//     return acc;
// }, {});

// Search functionality (example - would need maintenanceHistory and searchTerm in scope)
// const searchResults = maintenanceHistory?.filter((item) =>
//     item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.car?.toLowerCase().includes(searchTerm.toLowerCase())
// );

export default ExampleMaintenanceComponent;
