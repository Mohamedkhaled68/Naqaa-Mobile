export type NotificationType =
    | "maintenance_request"
    | "request_accepted"
    | "request_rejected"
    | "request_completed"
    | "system_update"
    | "general";

export type NotificationUser = {
    _id: string;
    name: string;
    phoneNumber: string;
    nationalId: string;
    licenseNumber: string;
    car: string;
    role: "driver" | "receiver";
};

export type Notification = {
    _id: string;
    recipient?: NotificationUser | null;
    sender?: NotificationUser | null;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    relatedRequest?:
        | string
        | {
              _id: string;
              description: string;
              status: string;
          };
    relatedMaintenance?: string;
    createdAt: string;
};

export type NotificationStats = {
    totalNotifications: number;
    unreadNotifications: number;
    readNotifications: number;
};

export type MarkNotificationAsReadResponse = {
    success: boolean;
    message: string;
    data?: Notification;
};

export type MarkAllNotificationsAsReadResponse = {
    success: boolean;
    message: string;
    data?: {
        modifiedCount: number;
    };
};

export type DeleteNotificationResponse = {
    success: boolean;
    message: string;
};
