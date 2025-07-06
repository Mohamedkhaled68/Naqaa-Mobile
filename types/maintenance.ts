import { Car } from "./car";
import { CustomFieldData, SubCategory } from "./category";
import { Driver } from "./driver";

export type MaintenanceRecord = {
    _id: string;
    car: Car;
    driver: Driver;
    subCategories: SubCategory[];
    description: string;
    cost: number;
    mechanicCost: number;
    customFieldData: CustomFieldData[];
    date: string;
    createdAt: string;
    updatedAt: string;
};
