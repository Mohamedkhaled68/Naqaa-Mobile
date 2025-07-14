import { useNetwork } from "@/providers/NetworkProvider";
import { Alert } from "react-native";

/**
 * Custom hook that provides network-aware API call functionality
 * Automatically checks network connection before making API calls
 */
export const useNetworkAwareApi = () => {
    const { isConnected, showNoConnectionAlert } = useNetwork();

    /**
     * Wrapper function that checks network connection before executing API calls
     * @param apiCall - The API call function to execute
     * @param showAlert - Whether to show an alert if no connection (default: true)
     * @returns Promise that resolves to the API call result or rejects if no connection
     */
    const executeWithNetworkCheck = async <T>(
        apiCall: () => Promise<T>,
        showAlert: boolean = true
    ): Promise<T> => {
        if (!isConnected) {
            if (showAlert) {
                showNoConnectionAlert();
            }
            throw new Error("No internet connection");
        }

        try {
            return await apiCall();
        } catch (error: any) {
            // Check if the error is network-related
            if (
                error?.name === "NetworkError" ||
                error?.message?.includes("network") ||
                error?.message?.includes("internet") ||
                error?.code === "NETWORK_ERROR" ||
                !error?.response
            ) {
                if (showAlert) {
                    Alert.alert(
                        "Network Error",
                        "Unable to connect to the server. Please check your internet connection and try again.",
                        [
                            {
                                text: "Retry",
                                onPress: () =>
                                    executeWithNetworkCheck(apiCall, showAlert),
                            },
                            { text: "Cancel", style: "cancel" },
                        ]
                    );
                }
                throw new Error("Network connection failed");
            }
            throw error;
        }
    };

    /**
     * Check if the current error is network-related
     * @param error - The error to check
     * @returns boolean indicating if it's a network error
     */
    const isNetworkError = (error: any): boolean => {
        return (
            !isConnected ||
            error?.name === "NetworkError" ||
            error?.message?.includes("network") ||
            error?.message?.includes("internet") ||
            error?.code === "NETWORK_ERROR" ||
            !error?.response
        );
    };

    return {
        isConnected,
        executeWithNetworkCheck,
        isNetworkError,
        showNoConnectionAlert,
    };
};

export default useNetworkAwareApi;
