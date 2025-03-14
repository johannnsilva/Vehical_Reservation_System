/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './client';
import { BookingDTO, CreateBookingResponse, GetBookingByIdResponse, GetBookingByBookingNumberResponse, GetBookingsByCustomerIdResponse, GetBookingsByDriverIdResponse, UpdateBookingResponse, GetAllBookingsResponse, CancelBookingResponse,AcceptBookingResponse } from '../types/booking';

export const createBooking = async (bookingDTO: BookingDTO): Promise<CreateBookingResponse> => {
    try {
        const response = await api.post('/bookings', bookingDTO);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error creating booking';
    }
};

export const getBookingById = async (id: number): Promise<GetBookingByIdResponse> => {
    try {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching booking by ID';
    }
};

export const getBookingByBookingNumber = async (bookingNumber: string): Promise<GetBookingByBookingNumberResponse> => {
    try {
        const response = await api.get(`/bookings/number/${bookingNumber}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching booking by booking number';
    }
};

export const getBookingsByCustomerId = async (customerId: number): Promise<GetBookingsByCustomerIdResponse> => {
    try {
        const response = await api.get(`/bookings/customer/${customerId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching bookings by customer ID';
    }
};

export const getBookingsByDriverId = async (driverId: number): Promise<GetBookingsByDriverIdResponse> => {
    try {
        const response = await api.get(`/bookings/driver/${driverId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching bookings by driver ID';
    }
};

export const updateBooking = async (id: number, bookingDTO: BookingDTO): Promise<UpdateBookingResponse> => {
    try {
        const response = await api.put(`/bookings/${id}`, bookingDTO);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error updating booking';
    }
};

export const cancelBooking = async (id: number): Promise<CancelBookingResponse> => {
    try {
        const response = await api.put(`/bookings/${id}/cancel`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error cancelling booking';
    }
};

export const acceptBooking = async (id: number, discountAmount: number): Promise<AcceptBookingResponse> => {
    try {
        const response = await api.put(`/bookings/${id}/accept`, null, {
            params: { discountAmount }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error accepting booking';
    }
};

export const deleteBooking = async (id: number): Promise<void> => {
    try {
        await api.delete(`/bookings/${id}`);
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error deleting booking';
    }
};

export const getAllBookings = async (): Promise<GetAllBookingsResponse> => {
    try {
        const response = await api.get('/bookings');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching all bookings';
    }
};

export const changeBookingStatus = async (id: number, newStatus: string): Promise<any> => {
    try {
        const response = await api.put(`/bookings/${id}/status`, null, { params: { newStatus } });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error changing booking status';
    }
};
