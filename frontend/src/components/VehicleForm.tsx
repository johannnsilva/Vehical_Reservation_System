/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { VehicleDTO } from '../types';

interface VehicleFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (vehicleData: VehicleDTO | undefined, id?: number) => Promise<void>;
    initialVehicle?: VehicleDTO | null;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ isOpen, onClose, onSubmit, initialVehicle }) => {
    const [vehicleData, setVehicleData] = useState<VehicleDTO>({
        registrationNumber: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        type: '',
        status: 'Available',
        vehiclePicture: null,
        currentDriverId: null
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialVehicle) {
            setVehicleData(initialVehicle);
        } else {
            setVehicleData({
                registrationNumber: '',
                make: '',
                model: '',
                year: new Date().getFullYear(),
                type: '',
                status: 'Available',
                vehiclePicture: null,
                currentDriverId: null
            });
        }
        setFormErrors({});
    }, [initialVehicle, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVehicleData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVehicleData(prevState => ({
                ...prevState,
                vehiclePicture: e.target.files && e.target.files[0] ? e.target.files[0] : null,
            }));
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!vehicleData.registrationNumber) {
            errors.registrationNumber = 'Registration Number is required';
        }
        if (!vehicleData.make) {
            errors.make = 'Make is required';
        }
        if (!vehicleData.model) {
            errors.model = 'Model is required';
        }
        if (!vehicleData.type) {
            errors.type = 'Type is required';
        }
        if (!vehicleData.year) {
            errors.year = 'Year is required';
        } else if (isNaN(Number(vehicleData.year))) {
            errors.year = 'Year must be a number';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await onSubmit(vehicleData, initialVehicle?.vehicleId);
                onClose();
            } catch (error:any) {
                console.error('Form submission error:', error);
                alert(`Form submission failed: ${error.message || 'Unknown error'}`);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                {initialVehicle ? 'Edit Vehicle' : 'Create New Vehicle'}
                            </h3>
                            <div className="mt-2">
                                <div className="mb-4">
                                    <label htmlFor="registrationNumber" className="block text-gray-700 text-sm font-bold mb-2">Registration Number</label>
                                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="registrationNumber" name="registrationNumber" value={vehicleData.registrationNumber} onChange={handleChange} placeholder="Enter registration number" />
                                    {formErrors.registrationNumber && <p className="text-red-500 text-xs italic">{formErrors.registrationNumber}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="make" className="block text-gray-700 text-sm font-bold mb-2">Manufacturer</label>
                                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="make" name="make" value={vehicleData.make} onChange={handleChange} placeholder="Enter make" />
                                    {formErrors.make && <p className="text-red-500 text-xs italic">{formErrors.make}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="model" className="block text-gray-700 text-sm font-bold mb-2">Model</label>
                                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="model" name="model" value={vehicleData.model} onChange={handleChange} placeholder="Enter model" />
                                    {formErrors.model && <p className="text-red-500 text-xs italic">{formErrors.model}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="year" className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                                    <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="year" name="year" value={vehicleData.year} onChange={handleChange} placeholder="Enter year" />
                                    {formErrors.year && <p className="text-red-500 text-xs italic">{formErrors.year}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                                    <select id="type" name="type" value={vehicleData.type} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        <option value="">Select Type</option>
                                        <option value="Car">Car</option>
                                        <option value="Van">Van</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Truck">Truck</option>
                                    </select>
                                    {formErrors.type && <p className="text-red-500 text-xs italic">{formErrors.type}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                                    <select id="status" name="status" value={vehicleData.status} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        <option value="Available">Available</option>
                                        <option value="In Service">In Service</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Unavailable">Unavailable</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="vehiclePicture" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Picture</label>
                                    <input type="file" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="vehiclePicture" name="vehiclePicture" onChange={handleFileChange} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                {initialVehicle ? 'Update' : 'Create'}
                            </button>
                            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VehicleForm;
