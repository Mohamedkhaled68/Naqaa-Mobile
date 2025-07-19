import { Stack } from "expo-router";

export default function RequestDetailsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="[id]"
                options={{
                    title: "Request Details",
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
