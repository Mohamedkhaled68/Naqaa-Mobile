import { Driver, Receiver } from "./auth";
import { Car } from "./car";
import { CustomFieldData, SubCategory } from "./category";

export type MaintenanceRequestStatus =
    | "open"
    | "pending"
    | "underReview"
    | "accepted"
    | "rejected"
    | "in_progress"
    | "completed";

export type MaintenanceRequest = {
    _id: string;
    car: Car;
    driver: Driver;
    receiver: Receiver;
    subCategories: SubCategory[];
    description: string;
    estimatedCost?: number;
    actualCost?: number;
    cost?: number;
    mechanicCost?: number;
    customFieldData: CustomFieldData[];
    status: MaintenanceRequestStatus;
    requestDate?: string;
    approvedDate?: string;
    completedDate?: string;
    receiverNotes?: string;
    rejectionMessage?: string;
    receiptImage?: string;
    receiverId?: string;
    priority?: "low" | "medium" | "high" | "urgent";
    createdAt: string;
    updatedAt?: string;
};

export type MaintenanceRequestReview = {
    requestId: string;
    status: "approved" | "rejected";
    notes?: string;
    estimatedCost?: number;
};

// For backward compatibility
export type MaintenanceRecord = MaintenanceRequest;
