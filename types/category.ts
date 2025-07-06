export type CustomField = {
    _id: string;
    fieldName: string;
    description: string;
    isRequired: boolean;
};

export type CustomFieldData = {
    fieldName: string;
    fieldValue: string;
    subcategoryId: string;
};

export type SubCategory = {
    _id: string;
    name: string;
    description: string;
    category: string;
    customFields: CustomField[];
    createdAt: string;
    updatedAt: string;
};
