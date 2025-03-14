/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './client';
import { VehicleDTO, CreateVehicleResponse, GetAllVehiclesResponse, GetVehicleByIdResponse, GetVehicleByRegistrationNumberResponse, GetVehiclesByCurrentDriverResponse, GetVehiclesByStatusResponse, UpdateVehicleResponse } from '../types/vehicle';

export const createVehicle = async (vehicleDTO: VehicleDTO, vehiclePicture?: File | null): Promise<CreateVehicleResponse> => {
    try {
        const formData = new FormData();
        for (const key in vehicleDTO) {
            if (Object.prototype.hasOwnProperty.call(vehicleDTO, key)) {
                formData.append(key, (vehicleDTO as any)[key]);
            }
        }
        if (vehiclePicture) {
            formData.append('vehiclePicture', vehiclePicture);
        }
        const response = await api.post('/vehicles', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error creating vehicle';
    }
};

export const getVehicleById = async (id: number): Promise<GetVehicleByIdResponse> => {
    try {
        const response = await api.get(`/vehicles/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching vehicle by ID';
    }
};

export const getVehicleByRegistrationNumber = async (registrationNumber: string): Promise<GetVehicleByRegistrationNumberResponse> => {
    try {
        const response = await api.get(`/vehicles/registration/${registrationNumber}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching vehicle by registration number';
    }
};

export const updateVehicle = async (id: number, vehicleDTO: VehicleDTO, vehiclePicture?: File | null): Promise<UpdateVehicleResponse> => {
    try {
        const formData = new FormData();
        for (const key in vehicleDTO) {
            if (Object.prototype.hasOwnProperty.call(vehicleDTO, key)) {
                formData.append(key, (vehicleDTO as any)[key]);
            }
        }
         if (vehiclePicture) {
            formData.append('vehiclePicture', vehiclePicture);
        }
        const response = await api.put(`/vehicles/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error updating vehicle';
    }
};

export const deleteVehicle = async (id: number): Promise<void> => {
    try {
        await api.delete(`/vehicles/${id}`);
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error deleting vehicle';
    }
};

export const getAllVehicles = async (): Promise<GetAllVehiclesResponse> => {
    try {
        const response = await api.get('/vehicles');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching all vehicles';
    }
};

export const getVehiclesByCurrentDriver = async (): Promise<GetVehiclesByCurrentDriverResponse> => {
    try {
        const response = await api.get('/vehicles/driver');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching vehicles for current driver';
    }
};

export const getVehiclesByStatus = async (status: string): Promise<GetVehiclesByStatusResponse> => {
    try {
        const response = await api.get(`/vehicles/status/${status}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching vehicles by status';
    }
};
