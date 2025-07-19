import MaintenanceCategories from "@/components/home/MaintenanceCategories";
import NoCarAssignedCard from "@/components/home/NoCarAssignedCard";
import QuickActionsCard from "@/components/home/QuickActionsCard";
import RecentActivityCard from "@/components/home/RecentActivityCard";
import VehicleStatusCard from "@/components/home/VehicleStatusCard";
import WelcomeHeader from "@/components/home/WelcomeHeader";
import withNetworkErrorHandling from "@/components/withNetworkErrorHandling";
import useGetCurrentDriver from "@/hooks/auth/useGetCurrentDriver";
import useGetCategories from "@/hooks/categories/useGetCategories";
import { useNetwork } from "@/providers/NetworkProvider";
import { useAuthStore } from "@/stores/auth-store";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const { data: categories, isLoading, error, refetch } = useGetCategories();
    const {
        data: currentDriver,
        isLoading: isDriverLoading,
        refetch: refetchDriver,
    } = useGetCurrentDriver();
    const { user } = useAuthStore();
    const { isConnected } = useNetwork();

    // Debug log to check user data structure
    console.log("Home - User data:", user);
    console.log("Home - User name:", user?.name, "Type:", typeof user?.name);

    // Check if driver has a car assigned (handle both null and undefined)
    const hasCarAssigned = currentDriver?.car != null;

    const handleRefresh = () => {
        refetch();
        refetchDriver();
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading || isDriverLoading}
                            onRefresh={handleRefresh}
                            colors={["#667eea"]}
                            tintColor="#667eea"
                        />
                    }
                >
                    {/* Welcome Header with modern gradient-style background */}
                    <WelcomeHeader
                        userName={
                            user?.name && typeof user.name === "string"
                                ? user.name
                                : undefined
                        }
                    />
                    <View className="h-10" />

                    {/* Quick Actions */}
                    <QuickActionsCard />

                    {/* Conditional rendering based on car assignment */}
                    {hasCarAssigned ? (
                        <>
                            {/* Vehicle Status Overview */}
                            <VehicleStatusCard />

                            {/* Maintenance Categories */}
                            <MaintenanceCategories
                                categories={categories}
                                isLoading={isLoading}
                            />
                        </>
                    ) : (
                        /* No Car Assigned Message */
                        <NoCarAssignedCard />
                    )}

                    {/* Recent Activity */}
                    <RecentActivityCard />

                    {/* Bottom Spacing for floating tab navigation */}
                    <View className="h-32" />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default withNetworkErrorHandling(Home, {
    errorMessage: "Home dashboard requires internet connection to load data",
    showFullScreenError: true,
    autoRetry: true,
    onRetry: undefined, // Let the component handle its own refresh logic
});
