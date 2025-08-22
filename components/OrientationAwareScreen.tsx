import { useOrientation } from "@/hooks/useOrientation";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResponsiveContainer } from "./ResponsiveLayout";

interface OrientationAwareScreenProps {
    children: React.ReactNode;
    enableScroll?: boolean;
    className?: string;
    contentContainerStyle?: any;
    refreshControl?: any;
    showsVerticalScrollIndicator?: boolean;
}

export const OrientationAwareScreen: React.FC<OrientationAwareScreenProps> = ({
    children,
    enableScroll = true,
    className = "flex-1 bg-gray-50",
    contentContainerStyle,
    refreshControl,
    showsVerticalScrollIndicator = false,
}) => {
    const { isLandscape } = useOrientation();

    const defaultContentStyle = {
        paddingBottom: isLandscape ? 20 : 100, // Account for tab bar
        flexGrow: 1,
        ...contentContainerStyle,
    };

    if (enableScroll) {
        return (
            <SafeAreaView className={className}>
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                    contentContainerStyle={defaultContentStyle}
                    refreshControl={refreshControl}
                >
                    <ResponsiveContainer>{children}</ResponsiveContainer>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className={className}>
            <ResponsiveContainer>{children}</ResponsiveContainer>
        </SafeAreaView>
    );
};

// Additional utility components for common patterns
export const LandscapeTwoColumn: React.FC<{
    leftColumn: React.ReactNode;
    rightColumn: React.ReactNode;
    className?: string;
}> = ({ leftColumn, rightColumn, className = "" }) => {
    const { isLandscape } = useOrientation();

    if (!isLandscape) {
        return (
            <View className={className}>
                {leftColumn}
                {rightColumn}
            </View>
        );
    }

    return (
        <View className={`flex-row gap-6 ${className}`}>
            <View className="flex-1">{leftColumn}</View>
            <View className="flex-1">{rightColumn}</View>
        </View>
    );
};

export const OrientationSpacer: React.FC<{
    portraitHeight?: number;
    landscapeHeight?: number;
}> = ({ portraitHeight = 32, landscapeHeight = 16 }) => {
    const { isLandscape } = useOrientation();
    const height = isLandscape ? landscapeHeight : portraitHeight;

    return <View style={{ height }} />;
};
