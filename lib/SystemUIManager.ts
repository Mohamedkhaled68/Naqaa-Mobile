import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export class SystemUIManager {
    static async setupImmersiveMode() {
        if (Platform.OS === "android") {
            try {
                // Hide navigation bar
                await NavigationBar.setVisibilityAsync("hidden");

                // Note: setBehaviorAsync and setBackgroundColorAsync are not supported with edge-to-edge enabled
                // The system will handle edge-to-edge behavior automatically

                console.log("✅ Immersive mode activated");
            } catch (error) {
                console.warn("⚠️ Failed to setup immersive mode:", error);
            }
        }
    }

    static async showNavigationBar() {
        if (Platform.OS === "android") {
            try {
                await NavigationBar.setVisibilityAsync("visible");
                console.log("✅ Navigation bar shown");
            } catch (error) {
                console.warn("⚠️ Failed to show navigation bar:", error);
            }
        }
    }

    static async hideNavigationBar() {
        if (Platform.OS === "android") {
            try {
                await NavigationBar.setVisibilityAsync("hidden");
                console.log("✅ Navigation bar hidden");
            } catch (error) {
                console.warn("⚠️ Failed to hide navigation bar:", error);
            }
        }
    }
}

export default SystemUIManager;
