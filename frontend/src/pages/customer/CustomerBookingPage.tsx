import React, { useState, useCallback } from 'react';
import BookingList from '../../components/BookingList';
import BookingForm from '../../components/BookingForm';
import useBookings from '../../hooks/useBookings';
import { billingApi } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faPlus } from '@fortawesome/free-solid-svg-icons';

const CustomerBookingPage: React.FC = () => {
    const { bookings, loading, error, fetchBookings, cancelBooking } = useBookings('CUSTOMER');
    const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

    const handleBookingCreated = useCallback(() => {
        setIsBookingFormOpen(false);
        fetchBookings();
    }, [fetchBookings]);

    const handleCancelBooking = async (id: number) => {
        try {
            await cancelBooking(id);
            alert('Booking cancelled successfully');
            fetchBookings();
        } catch (err) {
            console.error('Failed to cancel booking', err);
            alert('Failed to cancel booking');
        }
    };

    if (loading) return <div>Loading bookings...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 rounded-md">
                    Customer Bookings
                    <FontAwesomeIcon icon={faCalendarCheck} className="ml-2" />
                </h1>
            </div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsBookingFormOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:shadow-outline transform hover:scale-105"
                >
                    Create Booking
                    <FontAwesomeIcon icon={faPlus} className="ml-2" />
                </button>
            </div>
            <BookingList 
                bookings={bookings} 
                role="customer" 
                onCancel={handleCancelBooking} 
                payBill={async (id: number) => {
                    await billingApi.payBill(id);
                    fetchBookings();
                }}
            />
            {isBookingFormOpen && (
                <BookingForm 
                    onClose={() => setIsBookingFormOpen(false)} 
                    onBookingCreated={handleBookingCreated} 
                />
            )}
        </div>
    );
};

export default CustomerBookingPage;