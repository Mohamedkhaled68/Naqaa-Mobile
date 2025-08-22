# Landscape Orientation Support - Usage Guide

This guide explains how to use the new landscape orientation features in your Naqaa Cars Management app.

## Overview

Your app now supports both portrait and landscape orientations with responsive design patterns that automatically adapt the UI based on device orientation.

## Key Features Added

### 1. Orientation Detection Hook

```typescript
import { useOrientation } from "@/hooks/useOrientation";

const { isLandscape, isPortrait, width, height } = useOrientation();
```

### 2. Responsive Layout Components

```typescript
import { ResponsiveLayout, ResponsiveContainer, ResponsiveGrid } from '@/components/ResponsiveLayout';

// Auto-adjusting container
<ResponsiveContainer>
  {children}
</ResponsiveContainer>

// Different layouts for each orientation
<ResponsiveLayout
  portraitClassName="px-4"
  landscapeClassName="px-8 flex-row"
>
  {children}
</ResponsiveLayout>

// Responsive grid (1 column in portrait, 2 in landscape)
<ResponsiveGrid portraitColumns={1} landscapeColumns={2}>
  {gridItems}
</ResponsiveGrid>
```

### 3. Orientation-Aware Screen Wrapper

```typescript
import { OrientationAwareScreen } from "@/components/OrientationAwareScreen";

<OrientationAwareScreen enableScroll={true} refreshControl={refreshControl}>
    {screenContent}
</OrientationAwareScreen>;
```

### 4. Two-Column Layout Helper

```typescript
import { LandscapeTwoColumn } from "@/components/OrientationAwareScreen";

<LandscapeTwoColumn
    leftColumn={<QuickActionsCard />}
    rightColumn={<VehicleStatusCard />}
/>;
```

## What Changed

### 1. App Configuration

-   `app.json`: Changed orientation from "portrait" to "default" to allow both orientations
-   Added `expo-screen-orientation` dependency

### 2. Navigation

-   **Portrait**: Bottom tab bar (horizontal)
-   **Landscape**: Right-side tab bar (vertical, icon-only)

### 3. Home Screen Layout

-   **Portrait**: Single column layout (original design)
-   **Landscape**: Two-column layout for better space utilization

### 4. Quick Actions Component

-   **Portrait**: Horizontal scrollable cards
-   **Landscape**: 2x2 grid layout

## Best Practices

### 1. Use Orientation Hook

Always use the `useOrientation` hook instead of manually calculating screen dimensions:

```typescript
// ✅ Good
const { isLandscape } = useOrientation();

// ❌ Avoid
const { width, height } = Dimensions.get("window");
const isLandscape = width > height;
```

### 2. Conditional Rendering

Use conditional rendering for different orientation layouts:

```typescript
{
    isLandscape ? <TwoColumnLayout /> : <SingleColumnLayout />;
}
```

### 3. Responsive Spacing

Use the `OrientationSpacer` component for consistent spacing:

```typescript
<OrientationSpacer portraitHeight={32} landscapeHeight={16} />
```

### 4. Test Both Orientations

Always test your screens in both orientations to ensure proper layout and functionality.

## Implementation Examples

### Simple Screen with Orientation Support

```typescript
import { OrientationAwareScreen } from "@/components/OrientationAwareScreen";
import { useOrientation } from "@/hooks/useOrientation";

const MyScreen = () => {
    const { isLandscape } = useOrientation();

    return (
        <OrientationAwareScreen>
            <Text
                className={`text-2xl ${
                    isLandscape ? "text-center" : "text-left"
                }`}
            >
                Welcome
            </Text>
            {/* Your content */}
        </OrientationAwareScreen>
    );
};
```

### Form Layout

```typescript
const FormScreen = () => {
    const { isLandscape } = useOrientation();

    return (
        <OrientationAwareScreen enableScroll={true}>
            <View className={isLandscape ? "max-w-2xl mx-auto" : ""}>
                {/* Form fields */}
            </View>
        </OrientationAwareScreen>
    );
};
```

## Migration Guide

To make your existing screens orientation-aware:

1. **Import the orientation hook**:

    ```typescript
    import { useOrientation } from "@/hooks/useOrientation";
    ```

2. **Wrap your screen content**:

    ```typescript
    // Before
    <SafeAreaView>
      <ScrollView>
        {content}
      </ScrollView>
    </SafeAreaView>

    // After
    <OrientationAwareScreen>
      {content}
    </OrientationAwareScreen>
    ```

3. **Add conditional layouts where needed**:

    ```typescript
    const { isLandscape } = useOrientation();

    return (
        <View className={isLandscape ? "flex-row gap-6" : "flex-col"}>
            {content}
        </View>
    );
    ```

## Performance Considerations

-   The orientation hook uses native orientation events and is optimized for performance
-   Layout changes are handled efficiently by React Native's layout system
-   Consider using `useMemo` for expensive calculations that depend on orientation

## Troubleshooting

### Tab Bar Issues

If the tab bar appears incorrectly, ensure you're using the updated `CustomTabBar` component.

### Layout Problems

Check that you're using responsive components and not hardcoded dimensions.

### Status Bar

The status bar automatically adjusts for both orientations. If issues occur, check the StatusBar configuration in `_layout.tsx`.

This implementation provides a solid foundation for handling landscape orientation throughout your app while maintaining the existing portrait experience.
