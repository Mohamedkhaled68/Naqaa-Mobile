import { Redirect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useEffect, useState } from "react";

export default function Index() {
    // const [isLoading, setIsLoading] = useState(true);
    // // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // useEffect(() => {
    //     checkAuth();
    // }, []);

    // const checkAuth = async () => {
    //     try {
    //         // Check for stored token or user data
    //         const token = await SecureStore.getItemAsync("auth_token");

    //         if (token) {
    //             console.log("stored token: ", token);
    //         }else{
    //             console.log("no token found");
    //         }
    //     } catch (error) {
    //         console.error("Error checking authentication:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    // if (isLoading) {
    //     return null; // Or return a loading screen component
    // }
    // Always redirect to role selection as the starting page
    return <Redirect href="/(auth)/role-selection" />;
}
