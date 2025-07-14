import { useNetwork } from "@/providers/NetworkProvider";
import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import NetworkErrorState from "./NetworkErrorState";

interface NetworkAwareWrapperProps extends PropsWithChildren {
    /**
     * Whether to show network error state when offline
     * @default true
     */
    showErrorWhenOffline?: boolean;

    /**
     * Custom error message to display
     */
    errorMessage?: string;

    /**
     * Custom retry callback
     */
    onRetry?: () => void;

    /**
     * Whether to show retry button
     * @default true
     */
    showRetryButton?: boolean;

    /**
     * Whether this component requires network to function
     * If false, will always render children regardless of network status
     * @default true
     */
    requiresNetwork?: boolean;
}

/**
 * Wrapper component that automatically handles network connectivity states
 * Shows appropriate error states when offline and children when online
 */
const NetworkAwareWrapper: React.FC<NetworkAwareWrapperProps> = ({
    children,
    showErrorWhenOffline = true,
    errorMessage = "This feature requires an internet connection",
    onRetry,
    showRetryButton = true,
    requiresNetwork = true,
}) => {
    const { isConnected } = useNetwork();

    // If network is not required, always show children
    if (!requiresNetwork) {
        return <>{children}</>;
    }

    // If connected or not showing error when offline, show children
    if (isConnected || !showErrorWhenOffline) {
        return <>{children}</>;
    }

    // Show network error state
    return (
        <View className="flex-1">
            <NetworkErrorState
                onRetry={onRetry}
                message={errorMessage}
                showRetryButton={showRetryButton}
            />
        </View>
    );
};

export default NetworkAwareWrapper;
