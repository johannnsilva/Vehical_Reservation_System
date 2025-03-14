/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { authApi, driverApi } from '../api';
import { User, DriverDTO } from '../types';

const useDriverProfile = (user: User | null) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

     const fetchProfile = useCallback(async () => {
          if (!user || !user.id || !user.driverId) {
              setError('Invalid user data');
              setLoading(false);
              return;
          }

        setLoading(true);
        setError(null);
        try {
            const userResponse = await authApi.getUserById(user.id);
            const driverResponse = await driverApi.getDriverById(user.driverId);
            setProfile({ user: userResponse, driver: driverResponse });
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = async (data: any, profilePicture: File | null) => {
        setLoading(true);
        setError(null);
        try {
            const driverData: DriverDTO = {
                ...profile.driver,
                ...data.driver,
                name: data.driver.name,
            };
            await driverApi.updateDriver(profile.driver.driverId, driverData, profilePicture);
             // After successful update, fetch the updated profile to ensure data consistency
            const updatedDriverResponse = await driverApi.getDriverById(profile.driver.driverId);
            const updatedUserResponse = await authApi.getUserById(user!.id);

            setProfile({ user: updatedUserResponse, driver: updatedDriverResponse });
            localStorage.setItem('user', JSON.stringify({...profile.user, username: data.driver.name }));
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

export default useDriverProfile;
