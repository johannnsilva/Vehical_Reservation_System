import { useState } from 'react';

const useMap = () => {
    const [distance, setDistance] = useState<number | null>(null);
    const [pickupLocation, setPickupLocation] = useState<any>(null);
    const [destinationLocation, setDestinationLocation] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const calculateDistance = async (pickupPlace: any, destinationPlace: any) => {
        return new Promise((resolve, reject) => {
        if (!pickupPlace || !destinationPlace) {
            setError('Please select both pickup and destination locations.');
            reject('Locations not provided');
            return;
        }

        const distanceService = new window.google.maps.DistanceMatrixService();
        distanceService.getDistanceMatrix({
            origins: [pickupPlace.geometry.location],
            destinations: [destinationPlace.geometry.location],
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC,
        }, (response: any, status: any) => {
            if (status === 'OK') {
                if (response && response.rows[0].elements[0]) {
                    const distanceMeters = response.rows[0].elements[0].distance.value;
                    const distanceKm = distanceMeters / 1000;
                    setDistance(distanceKm);
                    setPickupLocation(pickupPlace);
                    setDestinationLocation(destinationPlace);
                    setError(null);
                    resolve(distanceKm)
                } else {
                    setError('Distance calculation failed.');
                    setDistance(null);
                    setPickupLocation(null);
                    setDestinationLocation(null);
                    reject('Distance calculation failed');
                }
            } else {
                setError('Error calculating distance using Google Maps.');
                setDistance(null);
                setPickupLocation(null);
                setDestinationLocation(null);
                reject('Google Maps error');
            }
        });
    })
    };

    return {
        distance,
        pickupLocation,
        destinationLocation,
        setPickupLocation,
        setDestinationLocation,
        error,
        calculateDistance,
    };
};

export default useMap;