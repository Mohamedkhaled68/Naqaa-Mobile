import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="role-selection" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="register-role" />
            <Stack.Screen name="register-receiver" />
        </Stack>
    );
}
