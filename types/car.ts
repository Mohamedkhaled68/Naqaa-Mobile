import { Driver } from "./driver";

export type Car = {
    _id: string;
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    driver: Driver[];
    status: string;
    meterReading: number;
    lastMeterUpdate: string;
    maintenanceHistory: string[];
    createdAt: string;
    updatedAt: string;
};
