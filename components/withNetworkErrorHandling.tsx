import React, { ComponentType } from "react";
import { View } from "react-native";

import { useNetwork } from "@/providers/NetworkProvider";
import NetworkErrorState from "./NetworkErrorState";

interface WithNetworkErrorHandlingOptions {
    /**
     * Custom error message to display when offline
     */
    errorMessage?: string;

    /**
     * Whether to show full screen error when offline
     * @default true
     */
    showFullScreenError?: boolean;

    /**
     * Whether to auto retry connection checks
     * @default true
     */
    autoRetry?: boolean;

    /**
     * Auto retry interval in milliseconds
     * @default 5000
     */
    autoRetryInterval?: number;

    /**
     * Custom retry callback
     */
    onRetry?: () => void;
}

/**
 * Higher-order component that adds network error handling to any screen
 * Automatically shows network error state when offline
 *
 * @example
 * const NetworkAwareScreen = withNetworkErrorHandling(MyScreen, {
 *   errorMessage: "This screen requires internet access",
 *   showFullScreenError: true
 * });
 */
export function withNetworkErrorHandling<P extends object>(
    WrappedComponent: ComponentType<P>,
    options?: WithNetworkErrorHandlingOptions
) {
    const {
        errorMessage = "This feature requires an internet connection",
        showFullScreenError = true,
        autoRetry = true,
        autoRetryInterval = 5000,
        onRetry,
    } = options || {};

    const NetworkErrorHandledComponent: React.FC<P> = (props) => {
        const { isConnected } = useNetwork();

        // If connected, show the normal component
        if (isConnected) {
            return <WrappedComponent {...props} />;
        }

        // If not connected and we want to show full screen error
        if (showFullScreenError) {
            return (
                <View className="flex-1">
                    <NetworkErrorState
                        message={errorMessage}
                        onRetry={onRetry}
                        autoRetry={autoRetry}
                        autoRetryInterval={autoRetryInterval}
                    />
                </View>
            );
        }

        // Otherwise, still show the component (it should handle its own network states)
        return <WrappedComponent {...props} />;
    };

    // Set display name for debugging
    NetworkErrorHandledComponent.displayName = `withNetworkErrorHandling(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return NetworkErrorHandledComponent;
}

export default withNetworkErrorHandling;
