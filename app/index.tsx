import { Redirect } from "expo-router";

export default function Index() {
    // Always redirect to role selection as the starting page
    return <Redirect href="/(auth)/role-selection" />;
}
