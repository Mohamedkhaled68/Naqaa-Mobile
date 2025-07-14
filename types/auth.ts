// User roles
export type UserRole = "driver" | "receiver";

// Base user type
export type BaseUser = {
    _id: string;
    name: string;
    phoneNumber: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
};

// Driver-specific fields
export type Driver = BaseUser & {
    role: "driver";
    nationalId: string;
    licenseNumber: string;
    address?: string;
};

// Receiver-specific fields
export type Receiver = BaseUser & {
    role: "receiver";
    email: string;
    permissions: string[];
};

// Union type for all users
export type User = Driver | Receiver;

// Authentication response
export type AuthResponse = {
    token: string;
    user: User;
};

// Login credentials
export type LoginCredentials = {
    phoneNumber: string;
    password: string;
    role: UserRole;
};

// Registration data for driver
export type DriverRegistrationData = {
    name: string;
    phoneNumber: string;
    nationalId: string;
    licenseNumber: string;
    password: string;
    address?: string;
};

// Registration data for receiver
export type ReceiverRegistrationData = {
    name: string;
    phoneNumber: string;
    email: string;
    password: string;
};
