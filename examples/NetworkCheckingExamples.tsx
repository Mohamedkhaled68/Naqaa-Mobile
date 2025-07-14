/**
 * Network Connectivity System Usage Examples
 *
 * This file demonstrates all the different ways to implement network checking
 * in your React Native Expo app.
 */

import NetworkAwareWrapper from "@/components/NetworkAwareWrapper";
import withNetworkCheck from "@/components/withNetworkCheck";
import useNetworkAwareApi from "@/hooks/useNetworkAwareApi";
import useNetworkCheck from "@/hooks/useNetworkCheck";
import NetworkUtils from "@/lib/NetworkUtils";
import { useNetwork } from "@/providers/NetworkProvider";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

// ============================================================================
// 1. BASIC NETWORK CHECKING WITH HOOKS
// ============================================================================

const BasicNetworkExample: React.FC = () => {
    const { isConnected } = useNetwork();

    return (
        <View>
            <Text>
                Network Status: {isConnected ? "Connected" : "Disconnected"}
            </Text>
        </View>
    );
};

// ============================================================================
// 2. ADVANCED NETWORK CHECKING WITH CUSTOM HOOK
// ============================================================================

const AdvancedNetworkExample: React.FC = () => {
    const {
        isConnected,
        executeWithNetworkCheck,
        canPerformNetworkAction,
        waitForConnection,
    } = useNetworkCheck();

    const handleApiCall = async () => {
        const result = await executeWithNetworkCheck(
            async () => {
                // Your API call here
                const response = await fetch("https://api.example.com/data");
                return response.json();
            },
            {
                customMessage:
                    "Unable to fetch data. Please check your connection.",
                onNetworkError: () => {
                    console.log("Network error occurred");
                },
            }
        );

        if (result) {
            console.log("Data fetched successfully:", result);
        }
    };

    const handleUpload = () => {
        if (canPerformNetworkAction("Upload requires internet connection")) {
            // Proceed with upload
            console.log("Starting upload...");
        }
    };

    const waitForConnectionExample = async () => {
        try {
            Alert.alert("Info", "Waiting for connection...");
            await waitForConnection(10000); // Wait max 10 seconds
            Alert.alert("Success", "Connection restored!");
        } catch (error) {
            Alert.alert("Error", "Connection timeout");
        }
    };

    return (
        <View style={{ padding: 16 }}>
            <Text>Status: {isConnected ? "Online" : "Offline"}</Text>

            <TouchableOpacity onPress={handleApiCall} style={{ marginTop: 10 }}>
                <Text>Fetch Data with Network Check</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleUpload} style={{ marginTop: 10 }}>
                <Text>Upload with Network Check</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={waitForConnectionExample}
                style={{ marginTop: 10 }}
            >
                <Text>Wait for Connection</Text>
            </TouchableOpacity>
        </View>
    );
};

// ============================================================================
// 3. NETWORK-AWARE API HOOK
// ============================================================================

const NetworkAwareApiExample: React.FC = () => {
    const { executeWithNetworkCheck, isNetworkError } = useNetworkAwareApi();

    const fetchUserData = async () => {
        try {
            const userData = await executeWithNetworkCheck(async () => {
                const response = await fetch("/api/user/profile");
                if (!response.ok) throw new Error("Failed to fetch");
                return response.json();
            });

            console.log("User data:", userData);
        } catch (error) {
            if (isNetworkError(error)) {
                console.log("Network error handled automatically");
            } else {
                Alert.alert("Error", "Failed to fetch user data");
            }
        }
    };

    return (
        <TouchableOpacity onPress={fetchUserData}>
            <Text>Fetch User Data</Text>
        </TouchableOpacity>
    );
};

// ============================================================================
// 4. NETWORK UTILS CLASS METHODS
// ============================================================================

const NetworkUtilsExample: React.FC = () => {
    const checkConnectionManually = async () => {
        const isConnected = await NetworkUtils.checkConnection();
        Alert.alert(
            "Connection Status",
            isConnected ? "Connected" : "Disconnected"
        );
    };

    const checkInternetAccess = async () => {
        const hasInternet = await NetworkUtils.checkInternetAccess();
        Alert.alert(
            "Internet Access",
            hasInternet ? "Available" : "Not Available"
        );
    };

    const getDetailedNetworkInfo = async () => {
        const details = await NetworkUtils.getNetworkDetails();
        Alert.alert("Network Details", JSON.stringify(details, null, 2));
    };

    const executeIfConnected = async () => {
        try {
            await NetworkUtils.executeIfConnected(async () => {
                Alert.alert("Success", "Function executed successfully!");
            });
        } catch (error) {
            console.log("No connection, function not executed");
        }
    };

    return (
        <View style={{ padding: 16 }}>
            <TouchableOpacity
                onPress={checkConnectionManually}
                style={{ marginTop: 10 }}
            >
                <Text>Check Connection Manually</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={checkInternetAccess}
                style={{ marginTop: 10 }}
            >
                <Text>Check Internet Access</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={getDetailedNetworkInfo}
                style={{ marginTop: 10 }}
            >
                <Text>Get Network Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={executeIfConnected}
                style={{ marginTop: 10 }}
            >
                <Text>Execute If Connected</Text>
            </TouchableOpacity>
        </View>
    );
};

// ============================================================================
// 5. NETWORK AWARE WRAPPER COMPONENT
// ============================================================================

const NetworkAwareWrapperExample: React.FC = () => {
    return (
        <NetworkAwareWrapper
            errorMessage="This feature requires internet access"
            onRetry={() => console.log("Retry pressed")}
        >
            <View style={{ padding: 20 }}>
                <Text>
                    This content is only shown when connected to internet!
                </Text>
                <Text>It automatically shows error state when offline.</Text>
            </View>
        </NetworkAwareWrapper>
    );
};

// ============================================================================
// 6. HIGHER-ORDER COMPONENT (HOC)
// ============================================================================

const MyNetworkDependentComponent: React.FC = () => {
    return (
        <View style={{ padding: 20 }}>
            <Text>This component needs internet!</Text>
            <Text>HOC automatically handles network checking.</Text>
        </View>
    );
};

// Wrap component with network checking
const NetworkAwareHOCExample = withNetworkCheck(MyNetworkDependentComponent, {
    errorMessage: "Internet connection required for this feature",
    requiresNetwork: true,
});

// ============================================================================
// 7. ERROR HANDLING IN REACT QUERY HOOKS
// ============================================================================

const ReactQueryNetworkExample: React.FC = () => {
    // Example of how to handle network errors in your existing hooks
    const { isConnected } = useNetwork();

    // This would be in your actual hook file
    const handleQueryError = (error: any) => {
        if (NetworkUtils.isNetworkError(error) && !isConnected) {
            // Show network-specific error UI
            return "network_error";
        }
        return "general_error";
    };

    return (
        <View>
            <Text>
                Check your existing hooks for network error handling patterns
            </Text>
        </View>
    );
};

// ============================================================================
// MAIN DEMO COMPONENT
// ============================================================================

const NetworkCheckingDemo: React.FC = () => {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
            >
                Network Checking Examples
            </Text>

            <BasicNetworkExample />
            <AdvancedNetworkExample />
            <NetworkAwareApiExample />
            <NetworkUtilsExample />
            <NetworkAwareWrapperExample />
            <NetworkAwareHOCExample />
            <ReactQueryNetworkExample />
        </View>
    );
};

export default NetworkCheckingDemo;
