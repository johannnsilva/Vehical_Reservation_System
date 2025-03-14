export interface Driver {
    driverId: number;
    name: string;
    licenseNumber: string;
    phoneNumber: string;
    status: string;
    userId: number;
    profilePicturePath: string;
}

export interface DriverDTO {
    driverId?: number;
    name?: string;
    licenseNumber?: string;
    phoneNumber?: string;
    status?: string;
    userId?: number;
    profilePicturePath?: string;  // Add this line
}

// Update response interfaces to extend Driver instead of DriverDTO
export interface CreateDriverResponse extends Driver {}
export interface GetDriverByIdResponse extends Driver {}
export interface GetDriverByLicenseNumberResponse extends Driver {}
export interface UpdateDriverResponse extends Driver {}
export interface GetAllDriversResponse extends Array<Driver> {}
export interface GetDriversByStatusResponse extends Array<Driver> {}
