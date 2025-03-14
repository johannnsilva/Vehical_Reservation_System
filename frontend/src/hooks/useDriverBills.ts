/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import { billingApi, bookingApi } from '../api';
import { Bill } from '../types';
import { User } from '../types/user';

const useDriverBills = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBillsForDriver = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const driverId = getCurrentDriverId();

            if (driverId === null) {
                setError('Driver ID is null. Please login again.');
                setLoading(false);
                return;
            }

            const bookingsResponse = await bookingApi.getBookingsByDriverId(driverId);
            if(bookingsResponse && Array.isArray(bookingsResponse)){
                // Filter bookings with "ACCEPTED" status
                const acceptedBookings = bookingsResponse.filter(booking => booking.status === 'ACCEPTED');

                // Extract booking IDs from accepted bookings
                const bookingIds = acceptedBookings.map(booking => booking.bookingId).filter(id => id !== undefined) as number[];

                if (bookingIds.length === 0) {
                    // No accepted bookings, so no bills to fetch
                    setBills([]);
                    setLoading(false);
                    return;
                }

                // Fetch bills for each booking ID
                const billPromises = bookingIds.map(bookingId => billingApi.getBillByBookingId(bookingId));
                const billsResponses = await Promise.all(billPromises);
                
                // Filter out any undefined or null responses
                const validBills = billsResponses.filter(bill => bill !== null && bill !== undefined);
                setBills(validBills);
            } else {
                setError('Failed to fetch driver bookings data.');
            }

        } catch (err: any) {
            setError(err.message || 'Could not fetch billing history for driver');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBillsForDriver();
    }, [fetchBillsForDriver]);

    return {
        bills,
        loading,
        error
    };
};


const getCurrentDriverId = (): number | null => {
    // Retrieve user object from local storage
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const user: User = JSON.parse(userString);
            // Check if user and driverId exist
            if (user && user.driverId !== null) {
                return user.driverId;
            } else {
                console.warn('Driver ID not found in user object in local storage.');
                return null;
            }
        } catch (error) {
            console.error('Error parsing user object from local storage:', error);
            return null;
        }
    } else {
        console.warn('User object not found in local storage.');
        return null;
    }
};

export default useDriverBills;