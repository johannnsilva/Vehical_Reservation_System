/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import { vehicleApi } from '../api';
import { 
    VehicleDTO, 
    CreateVehicleResponse, 
    UpdateVehicleResponse, 
    Vehicle,
    User
} from '../types';

const useVehicles = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [userLoaded, setUserLoaded] = useState(false); // Add a new state variable

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser) as User);
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                localStorage.removeItem('user');
            }
        }
        setUserLoaded(true); // Set userLoaded to true after attempting to load the user
    }, []);

    const fetchVehicles = useCallback(async () => {
        if (!userLoaded) { // Prevent fetching if user is not loaded yet
            return;
        }
        setLoading(true);
        setError(null);
        try {
            let response: any;
            if (user?.role === 'ADMIN') {
                response = await vehicleApi.getAllVehicles();
            } else {
                response = await vehicleApi.getVehiclesByCurrentDriver();
            }
            setVehicles(response);
            setLoading(false);
        } catch (err: any) {
            setError(err);
            setLoading(false);
        }
    }, [user, userLoaded]);

    useEffect(() => {
        if (userLoaded) {
            fetchVehicles();
        }
    }, [fetchVehicles, userLoaded]);

    const createVehicle = async (vehicleData: VehicleDTO): Promise<CreateVehicleResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response: CreateVehicleResponse = await vehicleApi.createVehicle(vehicleData);
            setLoading(false);
            return response;
        } catch (err: any) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const updateVehicle = async (id: number, vehicleData: VehicleDTO): Promise<UpdateVehicleResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response: UpdateVehicleResponse = await vehicleApi.updateVehicle(id, vehicleData);
            setLoading(false);
            return response;
        } catch (err: any) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const deleteVehicle = async (id: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await vehicleApi.deleteVehicle(id);
            setLoading(false);
        } catch (err: any) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const getVehiclesByStatus = useCallback(async (status: string) => {
        setLoading(true);
        try {
            const response = await vehicleApi.getVehiclesByStatus(status);
            setVehicles(Array.isArray(response) ? response : []);
            setLoading(false);
        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    }, []);

    return {
        vehicles,
        loading,
        error,
        fetchVehicles,
        createVehicle,
        updateVehicle,
        deleteVehicle,
        getVehiclesByStatus,
    };
};

export default useVehicles;
