import { useNetwork } from "@/providers/NetworkProvider";
import React, { ComponentType } from "react";
import { View } from "react-native";
import NetworkErrorState from "./NetworkErrorState";

interface WithAuthNetworkCheckOptions {
    /**
     * Custom error message for auth flows
     */
    errorMessage?: string;

    /**
     * Whether to show full screen error or allow partial functionality
     * @default true
     */
    blockOnOffline?: boolean;
}

/**
 * Higher-order component specifically for authentication flows
 * Provides network checking with auth-specific error messages
 */
export function withAuthNetworkCheck<P extends object>(
    WrappedComponent: ComponentType<P>,
    options?: WithAuthNetworkCheckOptions
) {
    const {
        errorMessage = "Authentication requires an internet connection. Please check your connection and try again.",
        blockOnOffline = true,
    } = options || {};

    const AuthNetworkAwareComponent: React.FC<P> = (props) => {
        const { isConnected } = useNetwork();

        // If offline and we should block, show error state
        if (!isConnected && blockOnOffline) {
            return (
                <View className="flex-1">
                    <NetworkErrorState
                        message={errorMessage}
                        showRetryButton={true}
                        autoRetry={true}
                    />
                </View>
            );
        }

        return <WrappedComponent {...props} />;
    };

    // Set display name for debugging
    AuthNetworkAwareComponent.displayName = `withAuthNetworkCheck(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return AuthNetworkAwareComponent;
}

export default withAuthNetworkCheck;
