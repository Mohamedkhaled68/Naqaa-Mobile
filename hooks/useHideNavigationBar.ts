import { SystemUIManager } from "@/lib/SystemUIManager";
import { useEffect } from "react";

export const useHideNavigationBar = () => {
    useEffect(() => {
        // Setup immersive mode on app start
        SystemUIManager.setupImmersiveMode();

        // Cleanup function - optionally restore navigation bar
        return () => {
            // Uncomment if you want to restore navigation bar on unmount
            // SystemUIManager.showNavigationBar();
        };
    }, []);
};

export default useHideNavigationBar;
