import NetworkUtils from "@/lib/NetworkUtils";
import { useNetwork } from "@/providers/NetworkProvider";
import { useCallback } from "react";
import { Alert } from "react-native";

/**
 * Hook that provides convenient network checking functionality
 * with built-in user feedback and error handling
 */
export const useNetworkCheck = () => {
    const { isConnected, checkConnection, showNoConnectionAlert } =
        useNetwork();

    /**
     * Execute a function with automatic network checking
     * Shows appropriate user feedback if no connection
     */
    const executeWithNetworkCheck = useCallback(
        async <T>(
            fn: () => Promise<T>,
            options?: {
                showAlert?: boolean;
                customMessage?: string;
                onNetworkError?: () => void;
            }
        ): Promise<T | null> => {
            const {
                showAlert = true,
                customMessage,
                onNetworkError,
            } = options || {};

            try {
                // Check connection before executing
                if (!isConnected) {
                    if (showAlert) {
                        if (customMessage) {
                            NetworkUtils.showNoConnectionAlert(
                                undefined,
                                customMessage
                            );
                        } else {
                            showNoConnectionAlert();
                        }
                    }
                    onNetworkError?.();
                    return null;
                }

                return await fn();
            } catch (error: any) {
                // Check if error is network-related
                if (NetworkUtils.isNetworkError(error)) {
                    if (showAlert) {
                        Alert.alert(
                            "Connection Error",
                            customMessage ||
                                "Unable to connect to the server. Please check your internet connection and try again.",
                            [
                                {
                                    text: "Retry",
                                    onPress: () =>
                                        executeWithNetworkCheck(fn, options),
                                },
                                { text: "Cancel", style: "cancel" },
                            ]
                        );
                    }
                    onNetworkError?.();
                    return null;
                }

                // Re-throw non-network errors
                throw error;
            }
        },
        [isConnected, showNoConnectionAlert]
    );

    /**
     * Check if user can perform network-dependent actions
     * Returns true if connected, shows alert and returns false if not
     */
    const canPerformNetworkAction = useCallback(
        (customMessage?: string): boolean => {
            if (!isConnected) {
                if (customMessage) {
                    NetworkUtils.showNoConnectionAlert(
                        undefined,
                        customMessage
                    );
                } else {
                    showNoConnectionAlert();
                }
                return false;
            }
            return true;
        },
        [isConnected, showNoConnectionAlert]
    );

    /**
     * Get network status with detailed information
     */
    const getNetworkStatus = useCallback(async () => {
        return await NetworkUtils.getNetworkDetails();
    }, []);

    /**
     * Wait for network connection to be restored
     */
    const waitForConnection = useCallback(async (timeout?: number) => {
        return await NetworkUtils.waitForConnection(timeout);
    }, []);

    return {
        isConnected,
        executeWithNetworkCheck,
        canPerformNetworkAction,
        getNetworkStatus,
        waitForConnection,
        checkConnection,
        showNoConnectionAlert,
        isNetworkError: NetworkUtils.isNetworkError,
    };
};

export default useNetworkCheck;
