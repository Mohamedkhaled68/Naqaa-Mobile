import React, { ComponentType } from "react";
import NetworkAwareWrapper from "./NetworkAwareWrapper";

interface WithNetworkCheckOptions {
    /**
     * Custom error message to display when offline
     */
    errorMessage?: string;

    /**
     * Whether to show retry button
     * @default true
     */
    showRetryButton?: boolean;

    /**
     * Whether this component requires network to function
     * @default true
     */
    requiresNetwork?: boolean;
}

/**
 * Higher-order component that adds network checking to any component
 * Automatically shows network error state when offline
 *
 * @example
 * const NetworkAwareComponent = withNetworkCheck(MyComponent, {
 *   errorMessage: "This feature needs internet access",
 *   requiresNetwork: true
 * });
 */
export function withNetworkCheck<P extends object>(
    WrappedComponent: ComponentType<P>,
    options?: WithNetworkCheckOptions
) {
    const {
        errorMessage = "This feature requires an internet connection",
        showRetryButton = true,
        requiresNetwork = true,
    } = options || {};

    const NetworkAwareComponent: React.FC<P> = (props) => {
        return (
            <NetworkAwareWrapper
                errorMessage={errorMessage}
                showRetryButton={showRetryButton}
                requiresNetwork={requiresNetwork}
            >
                <WrappedComponent {...props} />
            </NetworkAwareWrapper>
        );
    };

    // Set display name for debugging
    NetworkAwareComponent.displayName = `withNetworkCheck(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return NetworkAwareComponent;
}

export default withNetworkCheck;
