/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { authApi, customerApi } from '../api';
import { User, CustomerDTO } from '../types';

const useCustomerProfile = (user: User ) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    

    useEffect(() => {
        if (!user || !user.id || !user.customerId) {
            setError('Invalid user data');
            setLoading(false);
            return;
        }
    
        setLoading(true);
        setError(null);
        customerApi.getCustomerById(user.customerId)
            .then(async customerResponse => {
                try {
                    const userResponse = await authApi.getUserById(user.id);
                    setProfile({ user: userResponse, customer: customerResponse });
                } catch (err) {
                    setError(err);
                }
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user]);

    const updateProfile = async (data: any, profilePicture: File | null) => {
        setLoading(true);
        setError(null);
        try {
            const customerData: CustomerDTO = {
                ...profile.customer,
                ...data.customer,
                name: data.customer.name,
            };
            
            await customerApi.updateCustomer(profile.customer.customerId, customerData, profilePicture);
            
            // After successful update, fetch the updated profile to ensure data consistency
            const updatedCustomerResponse = await customerApi.getCustomerById(profile.customer.customerId);
            const updatedUserResponse = await authApi.getUserById(user!.id);

            setProfile({ user: updatedUserResponse, customer: updatedCustomerResponse });
            localStorage.setItem('user', JSON.stringify({...updatedUserResponse, username: data.customer.name }));
            setLoading(false);
            return true;
        } catch (err: any) {
            setError(err);
            setLoading(false);
            return false;
        }
    };

    return {
        profile,
        loading,
        error,
        updateProfile
    };
};

export default useCustomerProfile;
