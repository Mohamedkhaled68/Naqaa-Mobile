import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export interface NetworkState {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    type: string | null;
}

export const useNetworkStatus = () => {
    const [networkState, setNetworkState] = useState<NetworkState>({
        isConnected: true,
        isInternetReachable: null,
        type: null,
    });

    const [hasShownOfflineAlert, setHasShownOfflineAlert] = useState(false);

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener((state) => {
            const newNetworkState = {
                isConnected: state.isConnected ?? false,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
            };

            setNetworkState(newNetworkState);

            // Show alert when going offline (only once per offline session)
            if (!newNetworkState.isConnected && !hasShownOfflineAlert) {
                showNoConnectionAlert();
                setHasShownOfflineAlert(true);
            }

            // Reset alert flag when back online
            if (newNetworkState.isConnected && hasShownOfflineAlert) {
                setHasShownOfflineAlert(false);
            }
        });

        // Get initial network state
        NetInfo.fetch().then((state) => {
            setNetworkState({
                isConnected: state.isConnected ?? false,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
            });
        });

        return () => {
            unsubscribe();
        };
    }, [hasShownOfflineAlert]);

    const showNoConnectionAlert = () => {
        Alert.alert(
            "No Internet Connection",
            "Please check your internet connection and try again.",
            [
                {
                    text: "Retry",
                    onPress: () => {
                        // Force check network status
                        NetInfo.fetch().then((state) => {
                            if (!state.isConnected) {
                                // Still no connection, show alert again after a short delay
                                setTimeout(() => {
                                    setHasShownOfflineAlert(false);
                                }, 1000);
                            }
                        });
                    },
                },
                {
                    text: "OK",
                    style: "cancel",
                },
            ],
            { cancelable: false }
        );
    };

    const checkConnection = async (): Promise<boolean> => {
        try {
            const state = await NetInfo.fetch();
            return state.isConnected ?? false;
        } catch (error) {
            console.error("Error checking network connection:", error);
            return false;
        }
    };

    return {
        ...networkState,
        checkConnection,
        showNoConnectionAlert,
    };
};

export default useNetworkStatus;
