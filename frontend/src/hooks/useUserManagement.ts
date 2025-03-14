/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/user';
import { fetchAllUsers, updateUserStatus as apiUpdateUserStatus } from '../api/auth';
import { getCustomerById } from '../api/customer';
import { getDriverById } from '../api/driver';
import { Customer } from '../types/customer';
import { Driver } from '../types/driver';
import { GetCustomerByIdResponse, GetDriverByIdResponse } from '../types';

interface CustomerDataMap {
    [key: number]: Customer | null;
}

interface DriverDataMap {
    [key: number]: Driver | null;
}

const useUserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [customerData, setCustomerData] = useState<CustomerDataMap>({});
    const [driverData, setDriverData] = useState<DriverDataMap>({});

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedUsers = await fetchAllUsers();
            setUsers(fetchedUsers);
        } catch {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCustomerData = useCallback(async (users: User[]) => {
        const customerDataMap: CustomerDataMap = {};
        for (const user of users) {
            if (user.role === 'CUSTOMER' && user.customerId) {
                try {
                    const response: GetCustomerByIdResponse = await getCustomerById(user.customerId);
                    customerDataMap[user.id] = response || null; // Use the response directly
                } catch (error) {
                    console.error('Failed to fetch customer data:', error);
                    customerDataMap[user.id] = null; // Handle error case
                }
            }
        }
        setCustomerData(customerDataMap);
    }, []);

    const fetchDriverData = useCallback(async (users: User[]) => {
        const driverDataMap: DriverDataMap = {};
        for (const user of users) {
            if (user.role === 'DRIVER' && user.driverId) {
                try {
                    const response: GetDriverByIdResponse = await getDriverById(user.driverId);
                    driverDataMap[user.id] = response || null; // Use the response directly
                } catch (error) {
                    console.error('Failed to fetch driver data:', error);
                    driverDataMap[user.id] = null; // Handle error case
                }
            }
        }
        setDriverData(driverDataMap);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        fetchCustomerData(users);
        fetchDriverData(users);
    }, [users, fetchCustomerData, fetchDriverData]);

    const updateUserStatus = async (userId: number, newStatus: 'active' | 'blocked') => {
        try {
            await apiUpdateUserStatus({ userId, status: newStatus });
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, status: newStatus } : user
                )
            );
        } catch {
            setError('Failed to update user status');
        }
    };

    return { users, loading, error, fetchUsers, updateUserStatus, customerData, driverData };
};

export default useUserManagement;