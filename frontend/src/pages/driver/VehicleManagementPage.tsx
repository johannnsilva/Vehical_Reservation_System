/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import VehicleForm from '../../components/VehicleForm';
import VehicleCardGrid from '../../components/VehicleCardGrid';
import { VehicleDTO, User } from '../../types';
import useVehicle from '../../hooks/useVehicle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';

const VehicleManagementPage: React.FC = () => {
    const { vehicles, loading, error, createVehicle, updateVehicle, deleteVehicle, fetchVehicles } = useVehicle();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleDTO | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

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
    }, []);

    const handleCreateClick = () => {
        setSelectedVehicle(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (vehicle: VehicleDTO) => {
        setSelectedVehicle(vehicle);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedVehicle(null);
    };

    const handleVehicleCreate = async (vehicleData: VehicleDTO | undefined) => {
        try {
            if(vehicleData && user?.driverId ){
              vehicleData.currentDriverId = user.driverId;
              await createVehicle(vehicleData);
              fetchVehicles();
              setIsFormOpen(false);
            } else {
              console.error("Driver ID is missing or vehicle data is undefined");
              alert("Driver information is missing. Please ensure you are logged in as a driver.");
            }
           
        } catch (err: any) {
            console.error('Failed to create vehicle:', err);
            alert(`Failed to create vehicle: ${(err as any).message || 'Unknown error'}`);
        }
    };

    const handleVehicleUpdate = async (vehicleData: VehicleDTO| undefined, id?: number) => {
        try {
            if(vehicleData && id){
              await updateVehicle(id, vehicleData);
              fetchVehicles();
              setIsFormOpen(false);
              setSelectedVehicle(null);
            }
           
        } catch (err: any) {
            console.error('Failed to update vehicle:', err);
            alert(`Failed to update vehicle: ${(err as any).message || 'Unknown error'}`);
        }
    };

    const handleVehicleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await deleteVehicle(id);
                fetchVehicles();
            } catch (err) {
                console.error('Failed to delete vehicle:', err);
                alert(`Failed to delete vehicle: ${(err as any).message || 'Unknown error'}`);
            }
        }
    };

    if (loading) {
        return <div>Loading vehicles...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 rounded-md">
                    Vehicle Management
                    <FontAwesomeIcon icon={faCar} className="ml-2" />
                </h1>
            </div>
            <div className="mb-4 flex justify-end">

                <button onClick={handleCreateClick} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Add Vehicle
                </button>
            </div>

            {isFormOpen && (
                <VehicleForm
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onSubmit={selectedVehicle ? (vehicleData) => handleVehicleUpdate(vehicleData, selectedVehicle.vehicleId) : handleVehicleCreate}
                    initialVehicle={selectedVehicle}
                />
            )}

            <VehicleCardGrid vehicles={vehicles} onEdit={handleEditClick} onDelete={handleVehicleDelete} />
        </div>
    );
};

export default VehicleManagementPage;