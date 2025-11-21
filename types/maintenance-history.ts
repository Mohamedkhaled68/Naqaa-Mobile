// Type definition for maintenance history from receiver API
// Based on actual API response structure

import { CustomField } from "./category";

type Car = {
    _id: string;
    brand: string;
    model: string;
    plateNumber: string;
};

type Driver = {
    name: string;
    phoneNumber: string;
    nationalId: string;
    password: string;
    licenseNumber: string;
    address?: string;
};

type CustomFieldData = {
    fieldName: string;
    fieldValue: string;
    subcategoryId: string;
};

type SubCategory = {
    _id: string;
    name: string;
    description: string;
    category: string;
    customFields: CustomField[];
    createdAt: string;
    updatedAt: string;
};

export type MaintenanceHistoryRecord = {
    _id: string;
    car: Car | null; // Can be null based on API response
    cost: number;
    customFieldData: CustomFieldData[]; // Array of custom fields
    date: string; // ISO date string
    createdAt: string; // ISO date string
    description: string;
    driver: Driver | null; // Can be null based on API response
    mechanicCost: number;
    subCategories: SubCategory[]; // Array of subcategory objects
};

export type MaintenanceHistoryResponse = {
    maintenanceRecords: MaintenanceHistoryRecord[];
};
