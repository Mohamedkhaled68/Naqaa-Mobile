import { Stack } from "expo-router";

export default function ReceiverLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="requests" />
            <Stack.Screen name="review/[id]" />
        </Stack>
    );
}
