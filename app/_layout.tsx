import GlobalNetworkHandler from "@/components/GlobalNetworkHandler";
import useHideNavigationBar from "@/hooks/useHideNavigationBar";
import { useOrientation } from "@/hooks/useOrientation";
import { NetworkProvider } from "@/providers/NetworkProvider";
import { QueryProvider } from "@/providers/query-provider";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import "./globals.css";

export default function RootLayout() {
    useHideNavigationBar();
    const { isLandscape } = useOrientation();

    // Allow all orientations but provide optimized layouts
    useEffect(() => {
        ScreenOrientation.unlockAsync();
    }, []);

    return (
        <>
            <QueryProvider>
                <NetworkProvider>
                    <GlobalNetworkHandler
                        showFullScreenError={true}
                        roleAwareErrors={true}
                        autoRetry={true}
                        autoRetryInterval={5000}
                    >
                        <StatusBar
                            style="dark"
                            hidden={false}
                            translucent={true}
                        />
                        <Stack
                            screenOptions={{
                                headerShown: false,
                            }}
                        >
                            <Stack.Screen name="index" />
                            <Stack.Screen name="(auth)" />
                            <Stack.Screen name="(main)" />
                            <Stack.Screen name="(receiver)" />
                            <Stack.Screen name="OCR-check" />
                        </Stack>
                    </GlobalNetworkHandler>
                </NetworkProvider>
            </QueryProvider>
        </>
    );
}
