import useHideNavigationBar from "@/hooks/useHideNavigationBar";
import { NetworkProvider } from "@/providers/NetworkProvider";
import { QueryProvider } from "@/providers/query-provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "./globals.css";

export default function RootLayout() {
    useHideNavigationBar();

    return (
        <>
            <QueryProvider>
                <NetworkProvider>
                    <StatusBar style="dark" hidden={false} translucent={true} />
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
                </NetworkProvider>
            </QueryProvider>
        </>
    );
}
