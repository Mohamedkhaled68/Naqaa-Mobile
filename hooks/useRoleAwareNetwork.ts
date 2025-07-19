import NetworkUtils from "@/lib/NetworkUtils";
import { useNetwork } from "@/providers/NetworkProvider";
import { useAuthStore } from "@/stores/auth-store";
import { useCallback } from "react";
import { Alert } from "react-native";

/**
 * Hook that provides role-aware network checking functionality
 * Includes role-specific error messages and behaviors
 */
export const useRoleAwareNetwork = () => {
    const { isConnected, checkConnection, showNoConnectionAlert } =
        useNetwork();
    const { user, isDriver, isReceiver } = useAuthStore();

    /**
     * Get role-specific error message
     */
    const getRoleSpecificMessage = useCallback(
        (customMessage?: string): string => {
            if (customMessage) return customMessage;

            if (isDriver()) {
                return "This feature requires internet connection to sync with the maintenance system.";
            } else if (isReceiver()) {
                return "This feature requires internet connection to access the management system.";
            } else {
                return "This feature requires an internet connection.";
            }
        },
        [isDriver, isReceiver]
    );

    /**
     * Execute a function with role-aware network checking
     */
    const executeWithRoleAwareNetworkCheck = useCallback(
        async <T>(
            fn: () => Promise<T>,
            options?: {
                showAlert?: boolean;
                customMessage?: string;
                onNetworkError?: () => void;
                criticalAction?: boolean; // For actions that absolutely require network
            }
        ): Promise<T | null> => {
            const {
                showAlert = true,
                customMessage,
                onNetworkError,
                criticalAction = true,
            } = options || {};

            try {
                // Check connection before executing
                if (!isConnected) {
                    if (showAlert) {
                        const roleMessage =
                            getRoleSpecificMessage(customMessage);

                        if (criticalAction) {
                            Alert.alert("Connection Required", roleMessage, [
                                {
                                    text: "Retry",
                                    onPress: async () => {
                                        const connected =
                                            await checkConnection();
                                        if (connected) {
                                            return executeWithRoleAwareNetworkCheck(
                                                fn,
                                                options
                                            );
                                        }
                                    },
                                },
                                { text: "Cancel", style: "cancel" },
                            ]);
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
                        const roleMessage =
                            getRoleSpecificMessage(customMessage);
                        Alert.alert(
                            "Connection Error",
                            `${roleMessage}\n\nError: ${error.message}`,
                            [
                                {
                                    text: "Retry",
                                    onPress: () =>
                                        executeWithRoleAwareNetworkCheck(
                                            fn,
                                            options
                                        ),
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
        [
            isConnected,
            showNoConnectionAlert,
            getRoleSpecificMessage,
            checkConnection,
        ]
    );

    /**
     * Check if user can perform role-specific network action
     */
    const canPerformRoleAction = useCallback(
        (actionName: string, customMessage?: string): boolean => {
            if (!isConnected) {
                const roleMessage = customMessage || getRoleSpecificMessage();
                const actionMessage = isDriver()
                    ? `Cannot ${actionName} while offline. This action requires access to the maintenance system.`
                    : `Cannot ${actionName} while offline. This action requires access to the management system.`;

                Alert.alert(
                    "Action Unavailable",
                    `${actionMessage}\n\n${roleMessage}`,
                    [{ text: "OK" }]
                );
                return false;
            }
            return true;
        },
        [isConnected, getRoleSpecificMessage, isDriver]
    );

    /**
     * Get role-specific network status information
     */
    const getRoleNetworkStatus = useCallback(() => {
        const baseStatus = {
            isConnected,
            userRole: user?.role || "unknown",
            canSubmitRequests: isDriver() && isConnected,
            canProcessRequests: isReceiver() && isConnected,
        };

        if (isDriver()) {
            return {
                ...baseStatus,
                availableFeatures: {
                    viewRequests: true, // Can view cached data
                    submitRequests: isConnected,
                    trackVehicle: isConnected,
                    notifications: isConnected,
                },
                offlineCapabilities: [
                    "View previously loaded maintenance requests",
                    "Browse cached vehicle information",
                ],
            };
        } else if (isReceiver()) {
            return {
                ...baseStatus,
                availableFeatures: {
                    viewRequests: true, // Can view cached data
                    processRequests: isConnected,
                    generateReports: isConnected,
                    manageDrivers: isConnected,
                },
                offlineCapabilities: [
                    "View previously loaded requests",
                    "Browse cached data",
                ],
            };
        }

        return baseStatus;
    }, [isConnected, user, isDriver, isReceiver]);

    return {
        isConnected,
        user,
        isDriver: isDriver(),
        isReceiver: isReceiver(),
        executeWithRoleAwareNetworkCheck,
        canPerformRoleAction,
        getRoleSpecificMessage,
        getRoleNetworkStatus,
        checkConnection,
        showNoConnectionAlert,
    };
};

export default useRoleAwareNetwork;
