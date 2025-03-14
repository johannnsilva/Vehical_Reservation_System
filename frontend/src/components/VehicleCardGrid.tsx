import React from 'react';
import VehicleCard from './VehicleCard';
import { VehicleDTO } from '../types';

interface VehicleCardGridProps {
    vehicles: VehicleDTO[];
    onEdit: (vehicle: VehicleDTO) => void;
    onDelete: (id: number) => void;
}

const VehicleCardGrid: React.FC<VehicleCardGridProps> = ({ vehicles, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vehicles.map(vehicle => (
                <VehicleCard key={vehicle.vehicleId} vehicle={vehicle} onEdit={() => onEdit(vehicle)} onDelete={() => onDelete(vehicle.vehicleId || 0)} />
            ))}
        </div>
    );
};

export default VehicleCardGrid;
