import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

/**
 * Network utility functions for checking connectivity and handling network errors
 */
export class NetworkUtils {
    /**
     * Check current network connection status
     * @returns Promise<boolean> - true if connected, false otherwise
     */
    static async checkConnection(): Promise<boolean> {
        try {
            const state = await NetInfo.fetch();
            return state.isConnected ?? false;
        } catch (error) {
            console.error("Error checking network connection:", error);
            return false;
        }
    }

    /**
     * Check if device has internet access (not just connected to wifi/cellular)
     * @returns Promise<boolean> - true if internet is reachable, false otherwise
     */
    static async checkInternetAccess(): Promise<boolean> {
        try {
            const state = await NetInfo.fetch();
            return state.isInternetReachable ?? false;
        } catch (error) {
            console.error("Error checking internet access:", error);
            return false;
        }
    }

    /**
     * Get detailed network information
     * @returns Promise with network details
     */
    static async getNetworkDetails() {
        try {
            const state = await NetInfo.fetch();
            return {
                isConnected: state.isConnected ?? false,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
                details: state.details,
            };
        } catch (error) {
            console.error("Error getting network details:", error);
            return {
                isConnected: false,
                isInternetReachable: false,
                type: null,
                details: null,
            };
        }
    }

    /**
     * Show a standardized no connection alert
     * @param onRetry - Optional callback to execute when user taps retry
     * @param customMessage - Optional custom message
     */
    static showNoConnectionAlert(
        onRetry?: () => void,
        customMessage?: string
    ): void {
        Alert.alert(
            "No Internet Connection",
            customMessage ||
                "Please check your internet connection and try again.",
            [
                ...(onRetry
                    ? [
                          {
                              text: "Retry",
                              onPress: () => {
                                  NetworkUtils.checkConnection().then(
                                      (isConnected) => {
                                          if (isConnected) {
                                              onRetry();
                                          } else {
                                              // Still no connection, show alert again
                                              setTimeout(() => {
                                                  NetworkUtils.showNoConnectionAlert(
                                                      onRetry,
                                                      customMessage
                                                  );
                                              }, 1000);
                                          }
                                      }
                                  );
                              },
                          },
                      ]
                    : []),
                {
                    text: "OK",
                    style: "cancel",
                },
            ],
            { cancelable: false }
        );
    }

    /**
     * Check if an error is network-related
     * @param error - The error to check
     * @returns boolean indicating if it's a network error
     */
    static isNetworkError(error: any): boolean {
        return (
            error?.name === "NetworkError" ||
            error?.message?.includes("network") ||
            error?.message?.includes("internet") ||
            error?.message?.includes("connection") ||
            error?.code === "NETWORK_ERROR" ||
            error?.code === "ENOTFOUND" ||
            error?.code === "ECONNREFUSED" ||
            error?.code === "ETIMEDOUT" ||
            !error?.response
        );
    }

    /**
     * Execute a function only if network is available
     * @param fn - Function to execute
     * @param showAlert - Whether to show alert if no connection
     * @returns Promise that resolves to function result or rejects if no connection
     */
    static async executeIfConnected<T>(
        fn: () => Promise<T>,
        showAlert: boolean = true
    ): Promise<T> {
        const isConnected = await NetworkUtils.checkConnection();

        if (!isConnected) {
            if (showAlert) {
                NetworkUtils.showNoConnectionAlert();
            }
            throw new Error("No internet connection");
        }

        return fn();
    }

    /**
     * Wait for network connection to be restored
     * @param timeout - Maximum time to wait in milliseconds (default: 30 seconds)
     * @returns Promise that resolves when connection is restored or rejects on timeout
     */
    static async waitForConnection(timeout: number = 30000): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkConnection = async () => {
                const isConnected = await NetworkUtils.checkConnection();

                if (isConnected) {
                    resolve(true);
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    reject(new Error("Connection timeout"));
                    return;
                }

                // Check again in 1 second
                setTimeout(checkConnection, 1000);
            };

            checkConnection();
        });
    }
}

export default NetworkUtils;
