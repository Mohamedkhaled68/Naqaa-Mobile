import useDeleteNotificationById from "./useDeleteNotificationById";
import useGetMyNotifications from "./useGetMyNotifications";
import useGetNotificationsStats from "./useGetNotificationsStats";
import useMarkAllNotificationsAsRead from "./useMarkAllNotificationsAsRead";
import useMarkNotificationAsReadById from "./useMarkNotificationAsReadById";

/**
 * Combined hook that provides all notification functionality
 * This is a convenience hook that combines all notification hooks
 */
const useNotifications = () => {
    const notifications = useGetMyNotifications();
    const stats = useGetNotificationsStats();
    const markAsRead = useMarkNotificationAsReadById();
    const markAllAsRead = useMarkAllNotificationsAsRead();
    const deleteNotification = useDeleteNotificationById();

    const unreadCount = stats.data?.unreadNotifications || 0;
    const totalCount = stats.data?.totalNotifications || 0;

    const markAsReadAndRefresh = async (notificationId: string) => {
        try {
            await markAsRead.mutateAsync(notificationId);
            return true;
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            return false;
        }
    };

    const markAllAsReadAndRefresh = async () => {
        try {
            await markAllAsRead.mutateAsync();
            return true;
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
            return false;
        }
    };

    const deleteAndRefresh = async (notificationId: string) => {
        try {
            await deleteNotification.mutateAsync(notificationId);
            return true;
        } catch (error) {
            console.error("Failed to delete notification:", error);
            return false;
        }
    };

    return {
        // Data
        notifications: notifications.data || [],
        stats: stats.data,
        unreadCount,
        totalCount,

        // Loading states
        isLoading: notifications.isLoading || stats.isLoading,
        isRefreshing: notifications.isFetching || stats.isFetching,

        // Error states
        error: notifications.error || stats.error,

        // Actions
        refetch: () => {
            notifications.refetch();
            stats.refetch();
        },
        markAsRead: markAsReadAndRefresh,
        markAllAsRead: markAllAsReadAndRefresh,
        deleteNotification: deleteAndRefresh,

        // Action states
        isMarkingAsRead: markAsRead.isPending,
        isMarkingAllAsRead: markAllAsRead.isPending,
        isDeleting: deleteNotification.isPending,
    };
};

export default useNotifications;
