import api from './client';
import { DriverDTO, CreateDriverResponse, GetDriverByIdResponse, GetDriverByLicenseNumberResponse, UpdateDriverResponse, GetAllDriversResponse, GetDriversByStatusResponse } from '../types/driver';

export const createDriver = async (driverDTO: DriverDTO, profilePicture: File | null): Promise<CreateDriverResponse> => {
    try {
        const formData = new FormData();
        for (const key in driverDTO) {
            if (driverDTO.hasOwnProperty(key)) {
                formData.append(key, (driverDTO as any)[key]);
            }
        }
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }
        const response = await api.post('/drivers', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error creating driver:", error);
        throw error.response?.data || error.message || 'Error creating driver';
    }
};

export const getDriverById = async (id: number): Promise<GetDriverByIdResponse> => {
    try {
        const response = await api.get(`/drivers/${id}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching driver by ID:", error);
        throw error.response?.data || error.message || 'Error fetching driver by ID';
    }
};

export const getDriverByLicenseNumber = async (licenseNumber: string): Promise<GetDriverByLicenseNumberResponse> => {
    try {
        const response = await api.get(`/drivers/license/${licenseNumber}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching driver by license number:", error);
        throw error.response?.data || error.message || 'Error fetching driver by license number';
    }
};

export const updateDriver = async (id: number, driverDTO: DriverDTO, profilePicture: File | null): Promise<UpdateDriverResponse> => {
    try {
        const formData = new FormData();
        for (const key in driverDTO) {
            if (driverDTO.hasOwnProperty(key)) {
                formData.append(key, (driverDTO as any)[key]);
            }
        }
         if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }
        const response = await api.put(`/drivers/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error updating driver:", error);
        throw error.response?.data || error.message || 'Error updating driver';
    }
};

export const deleteDriver = async (id: number): Promise<void> => {
    try {
        await api.delete(`/drivers/${id}`);
    } catch (error: any) {
        console.error("Error deleting driver:", error);
        throw error.response?.data || error.message || 'Error deleting driver';
    }
};

export const getAllDrivers = async (): Promise<GetAllDriversResponse> => {
    try {
        const response = await api.get('/drivers');
        return response.data;
    } catch (error: any) {
        console.error("Error fetching all drivers:", error);
        throw error.response?.data || error.message || 'Error fetching all drivers';
    }
};

export const getDriversByStatus = async (status: string): Promise<GetDriversByStatusResponse> => {
    try {
        const response = await api.get(`/drivers/status/${status}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching drivers by status:", error);
        throw error.response?.data || error.message || 'Error fetching drivers by status';
    }
};
