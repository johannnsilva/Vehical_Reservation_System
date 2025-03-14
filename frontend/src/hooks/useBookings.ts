/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import { bookingApi } from '../api';
import { BookingDTO, User } from '../types';
import { AcceptBookingResponse } from '../types/booking'; // Add this import

interface UseBookingsReturn {
    bookings: BookingDTO[];
    loading: boolean;
    error: any;
    fetchBookings: () => void;
    createBooking: (bookingData: BookingDTO) => Promise<any>;
    updateBooking: (id: number, bookingData: BookingDTO) => Promise<any>;
    deleteBooking: (id: number) => Promise<void>;
    cancelBooking: (id: number) => Promise<void>;
    acceptBooking: (id: number, discountPercentage: number) => Promise<AcceptBookingResponse>; // Update this line
    changeBookingStatus: (id: number, newStatus: string) => Promise<any>;
}

const useBookings = (role: string): UseBookingsReturn => {
    const [bookings, setBookings] = useState<BookingDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    // Move the fetch logic outside of useCallback
    const fetchBookingsData = async () => {
        setLoading(true);
        setError(null);
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                throw new Error('User not found in localStorage');
            }

            const user = JSON.parse(storedUser) as User;
            let response;

            if (role === 'CUSTOMER') {
                if (!user.customerId) {
                    throw new Error('Customer ID not found');
                }
                response = await bookingApi.getBookingsByCustomerId(user.customerId);
            } else if (role === 'DRIVER') {
                if (!user.driverId) {
                    throw new Error('Driver ID not found');
                }
                response = await bookingApi.getBookingsByDriverId(user.driverId);
            } else {
                response = await bookingApi.getAllBookings();
            }
            
            setBookings(response);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    // Use useEffect for initial fetch
    useEffect(() => {
        fetchBookingsData();
    }, [role]); // Only depend on role

    // Keep fetchBookings as a method to manually trigger refreshes
    const fetchBookings = useCallback(() => {
        fetchBookingsData();
    }, []);

    const createBooking = async (bookingData: BookingDTO) => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookingApi.createBooking(bookingData);
            setLoading(false);
            return response;
        } catch (err: any) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const updateBooking = async (id: number, bookingData: BookingDTO) => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookingApi.updateBooking(id, bookingData);
            setLoading(false);
            return response;
        } catch (err: any) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const deleteBooking = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await bookingApi.deleteBooking(id);
            setBookings(bookings.filter(booking => booking.bookingId !== id));
            setLoading(false);
        } catch (err: any) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const cancelBooking = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await bookingApi.cancelBooking(id);
            
            // Set different status based on role
            const newStatus = role === 'ADMIN' 
                ? 'ADMIN_CANCELLED'
                : role === 'DRIVER'
                    ? 'DRIVER_CANCELLED'
                    : 'CUSTOMER_CANCELLED';

            setBookings(bookings.map(booking =>
                booking.bookingId === id ? { ...booking, status: newStatus } : booking
            ));
            setLoading(false);
        } catch (err: any) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const acceptBooking = async (id: number, discountPercentage: number) => {
        if (discountPercentage < 0 || discountPercentage > 100) {
            throw new Error('Discount percentage must be between 0 and 100');
        }
        
        setLoading(true);
        setError(null);
        try {
            const response = await bookingApi.acceptBooking(id, discountPercentage);
            setBookings(bookings.map(booking =>
                booking.bookingId === id ? { ...booking, status: 'ACCEPTED' } : booking
            ));
            setLoading(false);
            return response;
        } catch (err: any) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const changeBookingStatus = async (id: number, newStatus: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookingApi.changeBookingStatus(id, newStatus);
            setBookings(bookings.map(booking =>
                booking.bookingId === id ? { ...booking, status: newStatus } : booking
            ));
            setLoading(false);
            return response;
        } catch (err: any) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    return {
        bookings,
        loading,
        error,
        fetchBookings,
        createBooking,
        updateBooking,
        deleteBooking,
        cancelBooking,
        acceptBooking,
        changeBookingStatus,
    };
};

export default useBookings;