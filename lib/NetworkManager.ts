import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

export class NetworkManager {
    static async checkConnectivity(): Promise<boolean> {
        try {
            const state = await NetInfo.fetch();
            return state.isConnected ?? false;
        } catch (error) {
            console.error("Error checking network connectivity:", error);
            return false;
        }
    }

    static async withNetworkCheck<T>(
        apiCall: () => Promise<T>,
        showAlert: boolean = true
    ): Promise<T | null> {
        const isConnected = await this.checkConnectivity();

        if (!isConnected) {
            if (showAlert) {
                this.showNoConnectionAlert();
            }
            throw new Error("No internet connection");
        }

        try {
            return await apiCall();
        } catch (error: any) {
            // Check if error is network related
            if (this.isNetworkError(error)) {
                if (showAlert) {
                    this.showNoConnectionAlert();
                }
            }
            throw error;
        }
    }

    static isNetworkError(error: any): boolean {
        return (
            error?.code === "NETWORK_ERROR" ||
            error?.message?.includes("Network Error") ||
            error?.message?.includes("network") ||
            error?.response?.status === 0 ||
            !error?.response
        );
    }

    static showNoConnectionAlert(): void {
        Alert.alert(
            "Connection Error",
            "Please check your internet connection and try again.",
            [
                {
                    text: "Retry",
                    onPress: () => {
                        // User can manually retry the operation
                    },
                },
                {
                    text: "OK",
                    style: "cancel",
                },
            ]
        );
    }

    static showRetryAlert(onRetry: () => void): void {
        Alert.alert(
            "Connection Error",
            "Unable to connect to the server. Would you like to try again?",
            [
                {
                    text: "Retry",
                    onPress: onRetry,
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    }
}

export default NetworkManager;
