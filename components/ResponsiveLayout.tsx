import { useOrientation } from "@/hooks/useOrientation";
import React from "react";
import { View, ViewStyle } from "react-native";

interface ResponsiveLayoutProps {
    children: React.ReactNode;
    portraitStyle?: ViewStyle;
    landscapeStyle?: ViewStyle;
    className?: string;
    portraitClassName?: string;
    landscapeClassName?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
    children,
    portraitStyle,
    landscapeStyle,
    className = "",
    portraitClassName = "",
    landscapeClassName = "",
}) => {
    const { isLandscape } = useOrientation();

    const currentStyle = isLandscape ? landscapeStyle : portraitStyle;
    const currentClassName = `${className} ${
        isLandscape ? landscapeClassName : portraitClassName
    }`.trim();

    return (
        <View style={currentStyle} className={currentClassName}>
            {children}
        </View>
    );
};

// Specialized components for common layout patterns
export const ResponsiveContainer: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = "" }) => {
    const { isLandscape } = useOrientation();

    return (
        <ResponsiveLayout
            className={className}
            portraitClassName="px-4"
            landscapeClassName="px-8 flex-row"
        >
            {isLandscape ? (
                <View className="flex-1 max-w-screen-xl mx-auto">
                    {children}
                </View>
            ) : (
                children
            )}
        </ResponsiveLayout>
    );
};

export const ResponsiveGrid: React.FC<{
    children: React.ReactNode;
    portraitColumns?: number;
    landscapeColumns?: number;
    className?: string;
}> = ({
    children,
    portraitColumns = 1,
    landscapeColumns = 2,
    className = "",
}) => {
    const { isLandscape } = useOrientation();
    const columns = isLandscape ? landscapeColumns : portraitColumns;

    return (
        <View className={`flex-row flex-wrap ${className}`} style={{ gap: 12 }}>
            {React.Children.map(children, (child, index) => (
                <View
                    key={index}
                    style={{
                        width: `${
                            100 / columns - (12 * (columns - 1)) / columns
                        }%`,
                    }}
                >
                    {child}
                </View>
            ))}
        </View>
    );
};
