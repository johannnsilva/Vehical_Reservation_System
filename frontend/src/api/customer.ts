import api from './client';
import { CustomerDTO, CreateCustomerResponse, GetCustomerByIdResponse, GetCustomerByNicResponse, UpdateCustomerResponse, GetAllCustomersResponse } from '../types/customer';


export const createCustomer = async (customerDTO: CustomerDTO, profilePicture: File | null): Promise<CreateCustomerResponse> => {
    try {
        const formData = new FormData();
        for (const key in customerDTO) {
            if (customerDTO.hasOwnProperty(key)) {
                formData.append(key, (customerDTO as any)[key]);
            }
        }
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }
        const response = await api.post('/customers', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; 
    } catch (error: any) {
        console.error("Error creating customer:", error);
        throw error.response?.data || error.message || 'Error creating customer';
    }
};

export const getCustomerById = async (id: number): Promise<GetCustomerByIdResponse> => {
    try {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching customer by ID:", error);
        throw error.response?.data || error.message || 'Error fetching customer by ID';
    }
};

export const getCustomerByNic = async (nic: string): Promise<GetCustomerByNicResponse> => {
    try {
        const response = await api.get(`/customers/nic/${nic}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching customer by NIC:", error);
        throw error.response?.data || error.message || 'Error fetching customer by NIC';
    }
};

export const updateCustomer = async (id: number, customerDTO: CustomerDTO, profilePicture: File | null): Promise<UpdateCustomerResponse> => {
    try {
        
        const formData = new FormData();
        for (const key in customerDTO) {
            if (customerDTO.hasOwnProperty(key)) {
                formData.append(key, (customerDTO as any)[key]);
            }
        }
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }
        const response = await api.put(`/customers/${id}`, formData,{ headers: { 'Content-Type': 'multipart/form-data' }});
        return response.data;
    } catch (error: any) {
        console.error("Error updating customer:", error);
        throw error.response?.data || error.message || 'Error updating customer';
    }
};

export const deleteCustomer = async (id: number): Promise<void> => {
    try {
        await api.delete(`/customers/${id}`);
    } catch (error: any) {
        console.error("Error deleting customer:", error);
        throw error.response?.data || error.message || 'Error deleting customer';
    }
};

export const getAllCustomers = async (): Promise<GetAllCustomersResponse> => {
        try {
        const response = await api.get('/customers');
        return response.data;
    } catch (error: any) {
        console.error("Error fetching all customers:", error);
        throw error.response?.data || error.message || 'Error fetching all customers';
    }
};
