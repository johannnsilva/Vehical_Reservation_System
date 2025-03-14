/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './client';
import { BillDTO, CreateBillResponse, GetBillByIdResponse, GetBillByBookingIdResponse, UpdateBillResponse, GetAllBillsResponse } from '../types/bill';

export const createBill = async (billDTO: BillDTO): Promise<CreateBillResponse> => {
    try {
        const response = await api.post('/billing/bills', billDTO);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error creating bill';
    }
};

export const getBillById = async (id: number): Promise<GetBillByIdResponse> => {
    try {
        const response = await api.get(`/billing/bills/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching bill by ID';
    }
};

export const getBillByBookingId = async (bookingId: number): Promise<GetBillByBookingIdResponse> => {
    try {
        const response = await api.get(`/billing/bills/booking/${bookingId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching bill by booking ID';
    }
};

export const updateBill = async (id: number, billDTO: BillDTO): Promise<UpdateBillResponse> => {
    try {
        const response = await api.put(`/billing/bills/${id}`, billDTO);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error updating bill';
    }
};

export const deleteBill = async (id: number): Promise<void> => {
    try {
        await api.delete(`/billing/bills/${id}`);
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error deleting bill';
    }
};

export const getAllBills = async (): Promise<GetAllBillsResponse> => {
    try {
        const response = await api.get('/billing/bills');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching all bills';
    }
};

export const payBill = async (id: number): Promise<UpdateBillResponse> => {
    try {
        const response = await api.put(`/billing/bills/pay/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error paying bill';
    }
};
