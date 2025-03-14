import React from 'react';
import { VehicleDTO } from '../types';

interface VehicleCardProps {
    vehicle: VehicleDTO;
    onEdit: () => void;
    onDelete: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {vehicle.vehiclePicturePath && (
                <img className="w-full h-48 object-cover" src={`http://localhost:8080/${vehicle.vehiclePicturePath}`} alt={vehicle.model} />
            )}
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{vehicle.make} {vehicle.model}</h3>
                <p className="text-gray-700">Registration: {vehicle.registrationNumber}</p>
                <p className="text-gray-700">Type: {vehicle.type}</p>
                <p className="text-gray-700">Status: {vehicle.status}</p>
                <div className="mt-4 flex justify-between">
                    <button onClick={onEdit} className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-105">
                        Edit
                    </button>
                    <button onClick={onDelete} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-105">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;