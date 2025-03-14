/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import { billingApi } from '../api';
import { Bill } from '../types';
import useBookings from './useBookings';

const useCustomerBills = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { bookings, loading: bookingsLoading, error: bookingsError } = useBookings('CUSTOMER');
    const [payingBill, setPayingBill] = useState<boolean>(false);
    const [payBillError, setPayBillError] = useState<string | null>(null);

    const fetchBillsForCustomer = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (bookingsError) {
                setError('Failed to fetch customer bookings: ' + bookingsError);
                return;
            }

            if (bookingsLoading) {
                return; // Wait for bookings to load
            }

            if (!Array.isArray(bookings)) {
                setLoading(false);
                return;
            }

            // Filter bookings with "ACCEPTED" status
            const acceptedBookings = bookings.filter(booking => booking.status === 'ACCEPTED');

            // Extract booking IDs from accepted bookings
            const bookingIds = acceptedBookings.map(booking => booking.bookingId).filter(id => id !== undefined) as number[];

            if (bookingIds.length === 0) {
                // No accepted bookings, so no bills to fetch
                setBills([]);
                setLoading(false);
                return;
            }

            // Fetch bills for each booking ID
            const billPromises = bookingIds.map(bookingId => 
                billingApi.getBillByBookingId(bookingId).catch(err => null) // Ignore individual bill errors
            );
            const billsResponses = await Promise.all(billPromises);
            
            // Filter out any undefined or null responses
            const validBills = billsResponses.filter(bill => bill !== null && bill !== undefined);
            setBills(validBills);

        } catch (err: any) {
            setError(err.message || 'Could not fetch billing history for customer');
        } finally {
            setLoading(false);
        }
    }, [bookings, bookingsError, bookingsLoading]);

    const payBill = useCallback(async (billId: number) => {
        setPayingBill(true);
        setPayBillError(null);
    
        try {
          await billingApi.payBill(billId);
          // After successful payment, refresh the bills
          await fetchBillsForCustomer();
        } catch (err: any) {
          setPayBillError(err.message || 'Could not pay bill');
        } finally {
          setPayingBill(false);
        }
      }, [fetchBillsForCustomer]);

    useEffect(() => {
        fetchBillsForCustomer();
    }, [fetchBillsForCustomer]);

    return {
        bills,
        loading,
        error,
        payBill,
        payingBill,
        payBillError
    };
};

export default useCustomerBills;