/**
 * Enhanced Network Connectivity System - Complete App Coverage
 *
 * This file demonstrates the comprehensive network handling system that works
 * for ALL user roles (driver, receiver) across the entire NAQAA app.
 */

import GlobalNetworkHandler from "@/components/GlobalNetworkHandler";
import withAuthNetworkCheck from "@/components/withAuthNetworkCheck";
import { useRoleAwareNetwork } from "@/hooks/useRoleAwareNetwork";
import { useNetwork } from "@/providers/NetworkProvider";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

// ============================================================================
// 1. ROLE-AWARE NETWORK CHECKING
// ============================================================================

const RoleAwareNetworkExample: React.FC = () => {
    const {
        isConnected,
        isDriver,
        isReceiver,
        executeWithRoleAwareNetworkCheck,
        canPerformRoleAction,
        getRoleNetworkStatus,
    } = useRoleAwareNetwork();

    const handleSubmitMaintenanceRequest = async () => {
        // This will show driver-specific error messages
        const result = await executeWithRoleAwareNetworkCheck(
            async () => {
                // Your API call for submitting maintenance request
                console.log("Submitting maintenance request...");
                return { success: true };
            },
            {
                customMessage: "Unable to submit maintenance request",
                criticalAction: true,
            }
        );

        if (result) {
            Alert.alert("Success", "Maintenance request submitted!");
        }
    };

    const handleProcessRequest = async () => {
        // This will show receiver-specific error messages
        const result = await executeWithRoleAwareNetworkCheck(
            async () => {
                // Your API call for processing request
                console.log("Processing request...");
                return { success: true };
            },
            {
                customMessage: "Unable to process request at this time",
                criticalAction: true,
            }
        );

        if (result) {
            Alert.alert("Success", "Request processed successfully!");
        }
    };

    const handleOfflineAction = () => {
        if (!canPerformRoleAction("sync data")) {
            return; // Will show role-specific error
        }
        // Proceed with action
    };

    const showNetworkStatus = () => {
        const status = getRoleNetworkStatus();
        Alert.alert("Network Status", JSON.stringify(status, null, 2));
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Role-Aware Network Features</Text>
            <Text>Connected: {isConnected ? "Yes" : "No"}</Text>
            <Text>
                Role:{" "}
                {isDriver ? "Driver" : isReceiver ? "Receiver" : "Unknown"}
            </Text>

            {isDriver && (
                <TouchableOpacity
                    onPress={handleSubmitMaintenanceRequest}
                    style={{
                        marginTop: 10,
                        padding: 10,
                        backgroundColor: "#007AFF",
                    }}
                >
                    <Text style={{ color: "white" }}>
                        Submit Maintenance Request (Driver)
                    </Text>
                </TouchableOpacity>
            )}

            {isReceiver && (
                <TouchableOpacity
                    onPress={handleProcessRequest}
                    style={{
                        marginTop: 10,
                        padding: 10,
                        backgroundColor: "#34C759",
                    }}
                >
                    <Text style={{ color: "white" }}>
                        Process Request (Receiver)
                    </Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                onPress={handleOfflineAction}
                style={{
                    marginTop: 10,
                    padding: 10,
                    backgroundColor: "#FF9500",
                }}
            >
                <Text style={{ color: "white" }}>Test Offline Action</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={showNetworkStatus}
                style={{
                    marginTop: 10,
                    padding: 10,
                    backgroundColor: "#8E8E93",
                }}
            >
                <Text style={{ color: "white" }}>Show Network Status</Text>
            </TouchableOpacity>
        </View>
    );
};

// ============================================================================
// 2. AUTH FLOWS WITH NETWORK CHECK
// ============================================================================

const LoginComponent: React.FC = () => {
    return (
        <View style={{ padding: 20 }}>
            <Text>Login Form</Text>
            <Text>This component is wrapped with auth network check</Text>
        </View>
    );
};

// Wrap login with auth-specific network handling
const NetworkAwareLogin = withAuthNetworkCheck(LoginComponent, {
    errorMessage:
        "Login requires internet connection to authenticate with NAQAA servers.",
    blockOnOffline: true,
});

// ============================================================================
// 3. GLOBAL NETWORK HANDLER USAGE
// ============================================================================

const AppWithGlobalNetworkHandling: React.FC = () => {
    return (
        <GlobalNetworkHandler
            showFullScreenError={true}
            roleAwareErrors={true}
            autoRetry={true}
            autoRetryInterval={5000}
            onRetry={() => console.log("Global retry triggered")}
        >
            {/* Your entire app content goes here */}
            <Text>App content with global network handling</Text>
        </GlobalNetworkHandler>
    );
};

// ============================================================================
// 4. PAGE-LEVEL NETWORK HANDLING
// ============================================================================

const DriverHomePage: React.FC = () => {
    const { isConnected } = useNetwork();
    const { executeWithRoleAwareNetworkCheck } = useRoleAwareNetwork();

    const handleRefresh = async () => {
        await executeWithRoleAwareNetworkCheck(
            async () => {
                // Refresh page data
                console.log("Refreshing driver dashboard...");
            },
            {
                customMessage: "Unable to refresh dashboard data",
                criticalAction: false,
            }
        );
    };

    return (
        <View>
            <Text>Driver Dashboard</Text>
            {!isConnected && (
                <View style={{ padding: 10, backgroundColor: "#FFF3CD" }}>
                    <Text style={{ color: "#856404" }}>
                        You're offline. Some features may not be available.
                    </Text>
                </View>
            )}
            <TouchableOpacity onPress={handleRefresh}>
                <Text>Refresh Data</Text>
            </TouchableOpacity>
        </View>
    );
};

const ReceiverDashboard: React.FC = () => {
    const { isConnected } = useNetwork();
    const { executeWithRoleAwareNetworkCheck } = useRoleAwareNetwork();

    const handleProcessBatch = async () => {
        await executeWithRoleAwareNetworkCheck(
            async () => {
                // Process batch of requests
                console.log("Processing batch requests...");
            },
            {
                customMessage: "Unable to process requests in batch mode",
                criticalAction: true,
            }
        );
    };

    return (
        <View>
            <Text>Receiver Dashboard</Text>
            {!isConnected && (
                <View style={{ padding: 10, backgroundColor: "#F8D7DA" }}>
                    <Text style={{ color: "#721C24" }}>
                        Connection required to process new requests.
                    </Text>
                </View>
            )}
            <TouchableOpacity onPress={handleProcessBatch}>
                <Text>Process Batch</Text>
            </TouchableOpacity>
        </View>
    );
};

// ============================================================================
// 5. API INTEGRATION EXAMPLES
// ============================================================================

const ApiIntegrationExample: React.FC = () => {
    const { executeWithRoleAwareNetworkCheck } = useRoleAwareNetwork();

    const fetchUserData = async () => {
        const userData = await executeWithRoleAwareNetworkCheck(
            async () => {
                const response = await fetch("/api/user/profile");
                if (!response.ok) throw new Error("Failed to fetch user data");
                return response.json();
            },
            {
                customMessage: "Unable to load user profile",
                criticalAction: false,
            }
        );

        if (userData) {
            console.log("User data loaded:", userData);
        }
    };

    const submitForm = async () => {
        const result = await executeWithRoleAwareNetworkCheck(
            async () => {
                const response = await fetch("/api/submit", {
                    method: "POST",
                    body: JSON.stringify({ data: "example" }),
                });
                return response.json();
            },
            {
                customMessage: "Unable to submit form data",
                criticalAction: true,
            }
        );

        if (result) {
            Alert.alert("Success", "Form submitted successfully!");
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={fetchUserData}>
                <Text>Fetch User Data (Non-Critical)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={submitForm}>
                <Text>Submit Form (Critical)</Text>
            </TouchableOpacity>
        </View>
    );
};

// ============================================================================
// EXPORT EXAMPLES
// ============================================================================

export {
    ApiIntegrationExample,
    AppWithGlobalNetworkHandling,
    DriverHomePage,
    NetworkAwareLogin,
    ReceiverDashboard,
    RoleAwareNetworkExample,
};

/**
 * USAGE SUMMARY:
 *
 * 1. GLOBAL SETUP (Already done in _layout.tsx):
 *    - GlobalNetworkHandler wraps the entire app
 *    - Provides role-aware error messages and auto-retry
 *    - Shows appropriate alerts when going offline/online
 *
 * 2. IN COMPONENTS:
 *    - Use useRoleAwareNetwork() hook for role-specific network actions
 *    - Use executeWithRoleAwareNetworkCheck() for API calls
 *    - Use canPerformRoleAction() to check before actions
 *
 * 3. FOR AUTH FLOWS:
 *    - Wrap auth components with withAuthNetworkCheck()
 *    - Provides auth-specific error messages
 *
 * 4. FEATURES:
 *    - Automatic role detection (driver vs receiver)
 *    - Role-specific error messages
 *    - Auto-retry functionality
 *    - Connection restoration alerts
 *    - App state change detection
 *    - Critical vs non-critical action handling
 */
