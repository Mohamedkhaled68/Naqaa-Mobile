// Re-export all types from a central location
export * from "./auth";
export * from "./car";
export * from "./category";
export * from "./maintenance-request";
export * from "./notification";

// Re-export driver separately to avoid conflicts
export { Driver as LegacyDriver } from "./driver";

// API Response types
import { Driver } from "./auth";
import { MaintenanceRecord } from "./maintenance-request";

export type CurrentDriverResponse = {
    driver: Driver;
    car: string | null | undefined;
    maintenanceHistory: MaintenanceRecord[];
};
