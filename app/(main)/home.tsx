import MaintenanceCategories from "@/components/home/MaintenanceCategories";
import QuickActionsCard from "@/components/home/QuickActionsCard";
import RecentActivityCard from "@/components/home/RecentActivityCard";
import VehicleStatusCard from "@/components/home/VehicleStatusCard";
import WelcomeHeader from "@/components/home/WelcomeHeader";
import useGetCategories from "@/hooks/categories/useGetCategories";
import { useAuthStore } from "@/stores/auth-store";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const { data: categories, isLoading, error, refetch } = useGetCategories();
    const { user } = useAuthStore();

    const handleRefresh = () => {
        refetch();
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
                            refreshing={isLoading}
                            onRefresh={handleRefresh}
                            colors={["#667eea"]}
                            tintColor="#667eea"
                        />
                    }
                >
                    {/* Welcome Header with modern gradient-style background */}
                    <WelcomeHeader
                        userName={user?.name}
                        categoriesCount={categories?.length || 0}
                    />

                    {/* Quick Actions */}
                    <QuickActionsCard />

                    {/* Vehicle Status Overview */}
                    <VehicleStatusCard />

                    {/* Maintenance Categories */}
                    <MaintenanceCategories
                        categories={categories}
                        isLoading={isLoading}
                    />

                    {/* Recent Activity */}
                    <RecentActivityCard />

                    {/* Bottom Spacing for floating tab navigation */}
                    <View className="h-32" />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Home;
