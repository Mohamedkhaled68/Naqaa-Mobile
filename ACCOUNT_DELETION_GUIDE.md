# Account Deletion Implementation

This document describes the account deletion functionality implemented for both driver and receiver roles in the NAQAA app.

## Implementation Overview

### 1. Backend Integration

-   **Endpoint**: `/auth/delete-account` (DELETE request)
-   **Authentication**: Uses Bearer token from stored auth token
-   **Response**: Returns success/error message

### 2. Frontend Components

#### Hook: `useDeleteAccount`

-   **Location**: `hooks/auth/useDeleteAccount.ts`
-   **Purpose**: Handles API call to delete account
-   **Features**:
    -   Uses React Query for state management
    -   Proper error handling
    -   Returns mutation state for loading indicators

#### Component: `DeleteAccountModal`

-   **Location**: `components/DeleteAccountModal.tsx`
-   **Purpose**: Provides secure account deletion interface
-   **Features**:
    -   Confirmation dialog with warning messages
    -   Requires typing "DELETE" to confirm
    -   Password verification
    -   Role-specific data loss warnings
    -   Loading states and error handling

#### Store: Updated `auth-store`

-   **Location**: `stores/auth-store.ts`
-   **Purpose**: Added `deleteAccount` method for cleanup
-   **Features**:
    -   Clears secure storage
    -   Resets auth state
    -   Navigates to role selection

### 3. User Interface Integration

#### For Drivers:

-   **Profile Page**: `app/(main)/profile.tsx` - Added delete account button
-   **Settings Page**: `app/(main)/settings.tsx` - Comprehensive settings with account actions

#### For Receivers:

-   **Dashboard**: `app/(receiver)/dashboard.tsx` - Added account settings section with delete option

### 4. Security Features

-   **Double Confirmation**: Users must type "DELETE" and enter password
-   **Clear Warnings**: Shows exactly what data will be lost
-   **Role-Specific Messages**: Different warnings for drivers vs receivers
-   **Password Verification**: Ensures user identity before deletion
-   **Graceful Error Handling**: Proper error messages and fallbacks

### 5. User Experience

-   **Visual Warnings**: Red colors and warning icons
-   **Clear Instructions**: Step-by-step deletion process
-   **Loading States**: Shows progress during deletion
-   **Cancellation**: Easy to cancel at any step
-   **Confirmation**: Success message after deletion

## App Store Compliance

This implementation meets Apple App Store requirements for account deletion:

1. ✅ **Easy to Find**: Delete account option is clearly visible in settings/profile
2. ✅ **Clear Process**: Multi-step confirmation prevents accidental deletion
3. ✅ **Proper Warnings**: Users understand what will be deleted
4. ✅ **Immediate Action**: Account is deleted immediately, not just deactivated
5. ✅ **Data Cleanup**: All user data is properly removed from the device

## Usage

### For Drivers:

1. Go to Profile tab → Delete Account button
2. Or go to Settings tab → Account Actions → Delete Account

### For Receivers:

1. Go to Dashboard → Account Settings → Delete Account

### Deletion Process:

1. User sees warning modal with data loss information
2. User types "DELETE" in confirmation field
3. User enters current password
4. User confirms deletion
5. Account is deleted from server
6. Local data is cleared
7. User is redirected to role selection page

## Error Handling

-   Network errors: Graceful fallback with retry options
-   Server errors: Clear error messages to user
-   Authentication errors: Proper token cleanup
-   Storage errors: State cleanup even if storage fails

## Future Enhancements

-   Email confirmation before deletion
-   Delayed deletion with recovery period
-   Data export before deletion
-   Deletion reason collection for analytics
