import { useState, useCallback, useEffect } from 'react';
import { billingApi } from '../api';
import { Bill } from '../types';

const useAdminBills = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBillsForAdmin = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const billsResponse = await billingApi.getAllBills();
            if (billsResponse && Array.isArray(billsResponse)) {
                setBills(billsResponse);
            } else {
                setError('Failed to fetch bills data.');
            }
        } catch (err: any) {
            setError(err.message || 'Could not fetch billing history for admin');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBillsForAdmin();
    }, [fetchBillsForAdmin]);

    return {
        bills,
        loading,
        error
    };
};

export default useAdminBills;