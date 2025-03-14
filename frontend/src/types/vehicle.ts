export interface Vehicle {
    vehicleId: number;
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    type: string;
    status: string;
    currentDriverId: number | null;
    vehiclePicturePath: string | null;
}

export interface VehicleDTO {
    vehicleId?: number;
    registrationNumber?: string;
    make?: string;
    model?: string;
    year?: number;
    type?: string;
    status?: string;
    currentDriverId?: number | null;
    vehiclePicturePath?: string | null;
    vehiclePicture?: File | null;
}

export interface CreateVehicleResponse {
    message: string;
    vehicle: Vehicle;
}

export interface GetAllVehiclesResponse {
    vehicles: Vehicle[];
}

export interface GetVehicleByIdResponse {
    vehicle: Vehicle;
}

export interface GetVehicleByRegistrationNumberResponse {
    vehicle: Vehicle;
}

export interface GetVehiclesByCurrentDriverResponse {
    vehicles: Vehicle[];
}

export interface GetVehiclesByStatusResponse {
    vehicles?: Vehicle[];
}

// Add a new type for direct array response
export type GetVehiclesByStatusArrayResponse = Vehicle[];

export interface UpdateVehicleResponse {
    message: string;
    vehicle: Vehicle;
}