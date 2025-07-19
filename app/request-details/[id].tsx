import { useAuthStore } from "@/stores/auth-store";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function RequestDetailsPage() {
    const { id } = useLocalSearchParams();
    const { isDriver, isReceiver } = useAuthStore();

    // Redirect to the appropriate role-specific page
    if (isDriver()) {
        return <Redirect href={`/(main)/request-details/${id}`} />;
    } else if (isReceiver()) {
        return <Redirect href={`/(receiver)/request-details/${id}`} />;
    }

    // If no role is determined, redirect to auth
    return <Redirect href="/(auth)/role-selection" />;
}
