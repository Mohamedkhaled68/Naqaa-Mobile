import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export type OrientationType = "portrait" | "landscape";

export interface OrientationInfo {
    orientation: OrientationType;
    isPortrait: boolean;
    isLandscape: boolean;
    width: number;
    height: number;
}

export const useOrientation = (): OrientationInfo => {
    const [orientation, setOrientation] = useState<OrientationType>("portrait");
    const [dimensions, setDimensions] = useState(() => {
        const { width, height } = Dimensions.get("window");
        return { width, height };
    });

    useEffect(() => {
        // Function to determine orientation from dimensions
        const getOrientationFromDimensions = (
            width: number,
            height: number
        ): OrientationType => {
            return width > height ? "landscape" : "portrait";
        };

        // Initial setup
        const { width, height } = Dimensions.get("window");
        setDimensions({ width, height });
        setOrientation(getOrientationFromDimensions(width, height));

        // Listen for orientation changes
        const subscription = ScreenOrientation.addOrientationChangeListener(
            (event) => {
                const { orientationInfo } = event;
                const newOrientation =
                    orientationInfo.orientation ===
                        ScreenOrientation.Orientation.PORTRAIT_UP ||
                    orientationInfo.orientation ===
                        ScreenOrientation.Orientation.PORTRAIT_DOWN
                        ? "portrait"
                        : "landscape";
                setOrientation(newOrientation);
            }
        );

        // Listen for dimension changes (backup method)
        const dimensionSubscription = Dimensions.addEventListener(
            "change",
            ({ window }) => {
                setDimensions({ width: window.width, height: window.height });
                setOrientation(
                    getOrientationFromDimensions(window.width, window.height)
                );
            }
        );

        return () => {
            subscription?.remove();
            dimensionSubscription?.remove();
        };
    }, []);

    return {
        orientation,
        isPortrait: orientation === "portrait",
        isLandscape: orientation === "landscape",
        width: dimensions.width,
        height: dimensions.height,
    };
};

// Utility functions for responsive design
export const useResponsiveLayout = () => {
    const orientationInfo = useOrientation();

    return {
        ...orientationInfo,
        // Helper functions for responsive design
        getColumns: (portraitCols: number, landscapeCols: number) =>
            orientationInfo.isLandscape ? landscapeCols : portraitCols,

        getPadding: (portraitPadding: number, landscapePadding: number) =>
            orientationInfo.isLandscape ? landscapePadding : portraitPadding,

        getFlexDirection: () =>
            orientationInfo.isLandscape
                ? ("row" as const)
                : ("column" as const),
    };
};
