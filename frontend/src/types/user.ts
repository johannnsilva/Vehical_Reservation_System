export interface User {
    id: number;
    username: string;
    role: string;
    customerId?: number | null;
    driverId?: number | null;
    status: "active" | "blocked";
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    id: number;
    username: string;
    role: string;
    customerId: number | null;
    driverId: number | null;
    status?: string; // Added status with optional type
}

export interface UserDTO {
    id?: number;
    username?: string;
    password?: string;
    role?: string;
    customerId?: number | null;
    driverId?: number | null;
    status?: string; // Added status with optional type
}

export type RegisterResponse = User;
export type GetUserByIdResponse = User;

export interface RefreshTokenResponse {
    accessToken: string;
}

export interface UpdatePasswordRequest {
    oldPassword?: string;
    newPassword?: string;
}

export interface UpdatePasswordResponse { 
    message?: string;
}

export interface UpdateUserStatusRequest {
    status: 'active' | 'inactive';
}
