import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete, Marker } from '@react-google-maps/api';

// Add this at the top of the file, after the imports
const libraries: ("places" | "geocoding")[] = ["places"];

interface MapComponentProps {
    onPlaceChanged: (pickup: google.maps.places.PlaceResult, destination: google.maps.places.PlaceResult) => void;
    apiKey: string;
    isOpen: boolean;
    onClose: () => void;
}

const containerStyle = {
    width: '100%',
    height: '400px'
};

const MapComponent: React.FC<MapComponentProps> = ({ onPlaceChanged, apiKey, isOpen, onClose }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: libraries
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [pickup, setPickup] = useState<google.maps.places.PlaceResult | null>(null);
    const [destination, setDestination] = useState<google.maps.places.PlaceResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [destinationAutocomplete, setDestinationAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    // Default center for the map
    const defaultCenter = { lat: 6.0329, lng: 80.2168 }; // Galle, Sri Lanka coordinates

    const getPosition = (place: google.maps.places.PlaceResult | null): google.maps.LatLngLiteral => {
        if (place?.geometry?.location) {
            return {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
        }
        return defaultCenter;
    };

    const onLoad = useCallback((gMap: google.maps.Map) => {
        setMap(gMap);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleMapClose = useCallback(() => {
        // Clear map instance and autocomplete states
        setMap(null);
        setPickupAutocomplete(null);
        setDestinationAutocomplete(null);
        // Clear location states
        setPickup(null);
        setDestination(null);
        setError(null);
        onClose();
    }, [onClose]);

    const handlePickupSelect = useCallback((place: google.maps.places.PlaceResult | undefined) => {
        if (place?.geometry?.location) {
            setPickup(place);
            if (map) {
                map.panTo(getPosition(place));
            }
        }
    }, [map]);

    const handleDestinationSelect = useCallback((place: google.maps.places.PlaceResult | undefined) => {
        if (place?.geometry?.location) {
            setDestination(place);
            if (map) {
                map.panTo(getPosition(place));
            }
        }
    }, [map]);

    const handleConfirm = useCallback(() => {
        if (!pickup || !destination) {
            setError("Please select both pickup and destination locations.");
            return;
        }

        if (!pickup.geometry || !destination.geometry) {
            setError("Selected locations do not have valid geometries.");
            return;
        }

        onPlaceChanged(pickup, destination);
        handleMapClose(); // Use handleMapClose instead of just closing
    }, [pickup, destination, onPlaceChanged, handleMapClose]);

    const onPickupLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setPickupAutocomplete(autocomplete);
    };

    const onDestinationLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setDestinationAutocomplete(autocomplete);
    };

    const handlePickupChanged = () => {
        if (pickupAutocomplete) {
            const place = pickupAutocomplete.getPlace();
            handlePickupSelect(place);
        }
    };

    const handleDestinationChanged = () => {
        if (destinationAutocomplete) {
            const place = destinationAutocomplete.getPlace();
            handleDestinationSelect(place);
        }
    };

    // Modify the createPlaceResult function to include geocoding
    const createPlaceResult = (latLng: google.maps.LatLng): Promise<google.maps.places.PlaceResult> => {
        return new Promise((resolve, reject) => {
            // Use the Geocoder service that's available through the places library
            const geocoder = new google.maps.Geocoder();
            
            geocoder.geocode({ location: latLng }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const place: google.maps.places.PlaceResult = {
                        address_components: results[0].address_components,
                        formatted_address: results[0].formatted_address,
                        geometry: {
                            location: latLng,
                            viewport: results[0].geometry.viewport,
                        },
                        place_id: results[0].place_id,
                        name: results[0].formatted_address,
                    };
                    resolve(place);
                } else {
                    reject(new Error('Geocoding failed'));
                }
            });
        });
    };

    // Modify the handleMapClick function to handle the Promise
    const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
        const clickedLatLng = event.latLng;
        if (clickedLatLng) {
            try {
                const placeResult = await createPlaceResult(clickedLatLng);
                if (!pickup) {
                    handlePickupSelect(placeResult);
                } else if (!destination) {
                    handleDestinationSelect(placeResult);
                }
            } catch (error) {
                console.error('Error getting address:', error);
                setError('Failed to get address for clicked location');
            }
        }
    }, [pickup, destination, handlePickupSelect, handleDestinationSelect]);

    if (!isOpen) return null;

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps...</div>;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleMapClose} />

            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full m-4">
                <div className="p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4" id="modal-title">
                        Select Pickup and Destination
                    </h3>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        zoom={12}
                        center={getPosition(pickup) || getPosition(destination) || defaultCenter}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        onClick={handleMapClick}
                    >
                        <Autocomplete
                            onLoad={onPickupLoad}
                            onPlaceChanged={handlePickupChanged}
                        >
                            <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                placeholder="Pickup location"
                                defaultValue={pickup?.formatted_address || ""}
                            />
                        </Autocomplete>
                        <Autocomplete
                            onLoad={onDestinationLoad}
                            onPlaceChanged={handleDestinationChanged}
                        >
                            <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Destination location"
                                defaultValue={destination?.formatted_address || ""}
                            />
                        </Autocomplete>
                        {pickup?.geometry?.location && (
                            <Marker 
                                position={getPosition(pickup)}
                                label="P"
                            />
                        )}
                        {destination?.geometry?.location && (
                            <Marker 
                                position={getPosition(destination)}
                                label="D"
                            />
                        )}
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </GoogleMap>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleMapClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;