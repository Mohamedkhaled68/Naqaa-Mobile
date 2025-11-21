import MaintenanceCategories from "@/components/home/MaintenanceCategories";
import NoCarAssignedCard from "@/components/home/NoCarAssignedCard";
import QuickActionsCard from "@/components/home/QuickActionsCard";
import RecentActivityCard from "@/components/home/RecentActivityCard";
import VehicleStatusCard from "@/components/home/VehicleStatusCard";
import WelcomeHeader from "@/components/home/WelcomeHeader";
import { ResponsiveContainer } from "@/components/ResponsiveLayout";
import withNetworkErrorHandling from "@/components/withNetworkErrorHandling";
import useGetCurrentDriver from "@/hooks/auth/useGetCurrentDriver";
import useGetCategories from "@/hooks/categories/useGetCategories";
import { useOrientation } from "@/hooks/useOrientation";
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
    const { isLandscape } = useOrientation();

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
                    <ResponsiveContainer>
                        {/* Welcome Header with modern gradient-style background */}
                        <WelcomeHeader
                            userName={
                                user?.name && typeof user.name === "string"
                                    ? user.name
                                    : undefined
                            }
                        />
                        <View className="h-10" />

                        {isLandscape ? (
                            /* Landscape Layout - Two Column */
                            <View className="flex-row gap-6">
                                <View className="flex-1">
                                    {/* Quick Actions */}
                                    <QuickActionsCard />

                                    {/* Conditional rendering based on car assignment */}
                                    {hasCarAssigned ? (
                                        /* Vehicle Status Overview */
                                        <VehicleStatusCard />
                                    ) : (
                                        /* No Car Assigned Message */
                                        <NoCarAssignedCard />
                                    )}
                                </View>

                                <View className="flex-1">
                                    {hasCarAssigned && (
                                        /* Maintenance Categories */
                                        <MaintenanceCategories
                                            categories={categories}
                                            isLoading={isLoading}
                                        />
                                    )}

                                    {/* Recent Activity */}
                                    <RecentActivityCard />
                                </View>
                            </View>
                        ) : (
                            /* Portrait Layout - Single Column */
                            <>
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
                            </>
                        )}

                        {/* Bottom Spacing for floating tab navigation */}
                        <View className="h-32" />
                    </ResponsiveContainer>
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
