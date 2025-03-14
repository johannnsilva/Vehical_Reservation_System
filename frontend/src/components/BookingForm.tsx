/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { BookingDTO } from '../types';
import MapComponent from './MapComponent';
import useMap from '../hooks/useMap';
import useBookings from '../hooks/useBookings'; // Correct import
import useVehicles from '../hooks/useVehicle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faCalendarPlus, faMapMarkerAlt, faLocationArrow, faCar } from '@fortawesome/free-solid-svg-icons';

interface BookingFormProps {
    onBookingCreated: () => void;
    onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingCreated, onClose }) => {
    const [bookingData, setBookingData] = useState<BookingDTO>({
        pickupAddress: '',
        destinationAddress: '',
        pickupTime: new Date().toISOString(),
        vehicleId: 0,
        driverId: 0,
        distance: 0
    });
    const [error, setError] = useState<any>(null);
    const { distance, calculateDistance, pickupLocation, destinationLocation, setPickupLocation, setDestinationLocation } = useMap();
    const { createBooking } = useBookings('customer'); // Use useBookings with role
    const googleMapsApiKey = 'AIzaSyAoawehOlPhviHJxHRin7Fu3iTX9mTjwZU';
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const { vehicles, loading, error: vehicleError, getVehiclesByStatus } = useVehicles();
    const [dateError, setDateError] = useState<string>('');

    // useEffect to fetch vehicles only once when component mounts
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                await getVehiclesByStatus('In Service');
            } catch (err) {
                console.error('Error fetching vehicles:', err);
            }
        };
        fetchVehicles();
    }, []); // Empty dependency array

    const getMinDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
    };

    const handlePlaceChanged = (pickup: google.maps.places.PlaceResult, destination: google.maps.places.PlaceResult) => {
        setPickupLocation(pickup);
        setDestinationLocation(destination);
        // Update booking data immediately when places are selected
        setBookingData(prevData => ({
            ...prevData,
            pickupAddress: pickup.formatted_address || '',
            destinationAddress: destination.formatted_address || ''
        }));
        calculateDistance(pickup, destination);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.name === 'pickupTime') {
            const selectedDate = new Date(e.target.value);
            const now = new Date();

            if (selectedDate < now) {
                setDateError('Please select a future date and time');
                return;
            } else {
                setDateError('');
            }
        }

        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value,
        });
    };

    const handleVehicleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedVehicle = vehicles.find(
            vehicle => vehicle.vehicleId === Number(e.target.value)
        );

        setBookingData(prev => ({
            ...prev,
            vehicleId: Number(e.target.value),
            driverId: selectedVehicle?.currentDriverId || 0
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (dateError) {
            return;
        }
        if (!pickupLocation || !destinationLocation) {
            alert('Please select pickup and destination locations on the map.');
            return;
        }
        if (distance === null) {
            alert('Could not calculate distance. Please try again.');
            return;
        }

        const updatedBookingData = {
            ...bookingData,
            distance: distance
        };

        try {
            await createBooking(updatedBookingData);
            onBookingCreated();
            onClose();
        } catch (err: any) {
            setError(err);
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose} />

            <div className="relative bg-white rounded-lg shadow-xl w-[32rem] m-4">
                <div className="p-6">
                    <button
                        onClick={() => setIsMapModalOpen(true)}
                        className="w-full mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Select Locations
                    </button>

                    <MapComponent
                        onPlaceChanged={handlePlaceChanged}
                        apiKey={googleMapsApiKey}
                        isOpen={isMapModalOpen}
                        onClose={() => setIsMapModalOpen(false)}
                    />

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="relative">
                            <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
                                <FontAwesomeIcon icon={faCalendarPlus} className="mr-2 text-indigo-600" />
                                Pickup Time
                            </label>
                            <input 
                                type="datetime-local" 
                                name="pickupTime" 
                                id="pickupTime" 
                                className={`mt-1 block w-full rounded-lg border-2 ${
                                    dateError ? 'border-red-500' : 'border-gray-300'
                                } shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition duration-150 ease-in-out`} 
                                onChange={handleChange} 
                                min={getMinDateTime()}
                                required 
                            />
                            {dateError && (
                                <p className="text-red-500 text-sm mt-1">
                                    {dateError}
                                </p>
                            )}
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className="relative">
                                <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-indigo-600" />
                                    Pickup Address
                                </label>
                                <input 
                                    type="text" 
                                    name="pickupAddress" 
                                    id="pickupAddress" 
                                    className="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 px-4 py-2 bg-gray-50" 
                                    value={bookingData.pickupAddress} 
                                    readOnly 
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="destinationAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                    <FontAwesomeIcon icon={faLocationArrow} className="mr-2 text-indigo-600" />
                                    Destination Address
                                </label>
                                <input 
                                    type="text" 
                                    name="destinationAddress" 
                                    id="destinationAddress" 
                                    className="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 px-4 py-2 bg-gray-50" 
                                    value={bookingData.destinationAddress} 
                                    readOnly 
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700">
                                <FontAwesomeIcon icon={faLocationArrow} className="mr-2 text-indigo-600" />
                                Distance: {distance !== null ? `${distance.toFixed(2)} KM` : 'Calculating...'}
                            </p>
                        </div>

                        <div className="relative">
                            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-2">
                                <FontAwesomeIcon icon={faCar} className="mr-2 text-indigo-600" />
                                Select Vehicle
                            </label>
                            <select
                                id="vehicleId"
                                name="vehicleId"
                                className="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition duration-150 ease-in-out"
                                value={bookingData.vehicleId || ''}
                                onChange={handleVehicleSelection}
                                required
                                disabled={loading}
                            >
                                <option value="">
                                    {loading ? 'Loading vehicles...' : 'Select a vehicle'}
                                </option>
                                {vehicles && vehicles.length > 0 ? (
                                    vehicles.map((vehicle) => (
                                        <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                            {vehicle.make} {vehicle.model} - {vehicle.registrationNumber}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>
                                        {vehicleError ? 'Error loading vehicles' : 'No vehicles available'}
                                    </option>
                                )}
                            </select>
                            {vehicleError && (
                                <p className="text-red-500 text-xs mt-2">{vehicleError.message}</p>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                <p className="text-red-700 text-sm">{error.message}</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 pt-4">
                            <button 
                                type="button" 
                                className="inline-flex items-center px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                                onClick={onClose}
                            >
                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Create Booking
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
