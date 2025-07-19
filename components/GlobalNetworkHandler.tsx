import { useNetwork } from "@/providers/NetworkProvider";
import { useAuthStore } from "@/stores/auth-store";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Alert, AppState, AppStateStatus, View } from "react-native";
import NetworkErrorState from "./NetworkErrorState";

interface GlobalNetworkHandlerProps extends PropsWithChildren {
    /**
     * Whether to show full-screen network error when offline
     * @default true
     * NOTE: In strict mode, this is always true - app is completely blocked when offline
     */
    showFullScreenError?: boolean;

    /**
     * Custom retry callback
     */
    onRetry?: () => void;

    /**
     * Custom error message
     */
    errorMessage?: string;

    /**
     * Role-specific error handling
     * @default true
     */
    roleAwareErrors?: boolean;

    /**
     * Auto-retry connection attempts
     * @default true
     */
    autoRetry?: boolean;

    /**
     * Auto-retry interval in milliseconds
     * @default 5000
     */
    autoRetryInterval?: number;
}

/**
 * Global network handler that provides comprehensive network error handling across the entire app
 * Supports both driver and receiver roles with role-specific error messages and behaviors
 * STRICT MODE: Blocks ALL user interactions when offline
 */
const GlobalNetworkHandler: React.FC<GlobalNetworkHandlerProps> = ({
    children,
    showFullScreenError = true,
    onRetry,
    errorMessage,
    roleAwareErrors = true,
    autoRetry = true,
    autoRetryInterval = 5000,
}) => {
    const { isConnected, checkConnection } = useNetwork();
    const { user, isDriver, isReceiver } = useAuthStore();
    const [hasError, setHasError] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    // Role-specific error messages
    const getRoleSpecificMessage = (): string => {
        if (!roleAwareErrors || errorMessage) {
            return errorMessage || "No internet connection available";
        }

        if (isDriver()) {
            return "Internet connection is required to use NAQAA maintenance services. Please check your connection and try again.";
        } else if (isReceiver()) {
            return "Internet connection is required to access the management system. Please check your connection and try again.";
        } else {
            return "Internet connection is required to use NAQAA services. Please check your connection and try again.";
        }
    };

    // Initial network check when component mounts
    useEffect(() => {
        const initializeNetworkCheck = async () => {
            const connected = await checkConnection();
            setIsInitializing(false);

            if (!connected) {
                setWasOffline(true);
                setHasError(true);
            }
        };

        initializeNetworkCheck();
    }, [checkConnection]);

    // Handle network state changes
    useEffect(() => {
        if (!isConnected) {
            setWasOffline(true);
            setHasError(true);
            setRetryCount(0);
        } else if (isConnected && wasOffline) {
            setWasOffline(false);
            setHasError(false);
            setRetryCount(0);
            setIsRetrying(false);

            // Show reconnection confirmation only briefly
            if (user && roleAwareErrors) {
                Alert.alert(
                    "Connection Restored",
                    "You're back online! You can now continue using the app.",
                    [{ text: "Continue" }],
                    { cancelable: true }
                );
            }
        }
    }, [isConnected, wasOffline, user, roleAwareErrors, isDriver, isReceiver]);

    // Auto-retry logic
    useEffect(() => {
        if (!autoRetry || isConnected || (!hasError && !isInitializing)) return;

        const interval = setInterval(async () => {
            setIsRetrying(true);
            const connected = await checkConnection();
            setIsRetrying(false);

            if (connected) {
                setHasError(false);
                setWasOffline(false);
                setRetryCount(0);
                setIsInitializing(false);
            } else {
                setRetryCount((prev) => prev + 1);
            }
        }, autoRetryInterval);

        return () => clearInterval(interval);
    }, [
        autoRetry,
        autoRetryInterval,
        checkConnection,
        isConnected,
        hasError,
        isInitializing,
    ]);

    // Handle app state changes (foreground/background)
    useEffect(() => {
        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
            if (nextAppState === "active") {
                // App came to foreground, check connection
                const connected = await checkConnection();
                if (!connected && !hasError) {
                    setHasError(true);
                    setWasOffline(true);
                }
            }
        };

        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange
        );
        return () => subscription?.remove();
    }, [checkConnection, hasError]);

    const handleRetry = async () => {
        setIsRetrying(true);

        try {
            const connected = await checkConnection();

            if (connected) {
                setHasError(false);
                setWasOffline(false);
                setRetryCount(0);
                setIsInitializing(false);
                onRetry?.();
            } else {
                // Still no connection, increment retry count
                setRetryCount((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error during retry:", error);
        } finally {
            setIsRetrying(false);
        }
    };

    // Enhanced error message with role context and retry info
    const getEnhancedErrorMessage = (): string => {
        const baseMessage = getRoleSpecificMessage();

        if (retryCount > 0) {
            return `${baseMessage}\n\nRetry attempt: ${retryCount}`;
        }

        return baseMessage;
    };

    // STRICT OFFLINE MODE: Always show full screen error when offline or initializing
    // Block ALL user interactions until connection is confirmed
    if (!isConnected || isInitializing) {
        return (
            <View className="flex-1 bg-red-50">
                <NetworkErrorState
                    onRetry={handleRetry}
                    message={
                        isInitializing
                            ? "Checking internet connection..."
                            : getEnhancedErrorMessage()
                    }
                    showRetryButton={!isInitializing}
                    autoRetry={autoRetry && !isInitializing}
                    autoRetryInterval={autoRetryInterval}
                    isInitializing={isInitializing}
                />
            </View>
        );
    }

    return <>{children}</>;
};

export default GlobalNetworkHandler;
