import React from 'react';
import BookingList from '../../components/BookingList';
import useBookings from '../../hooks/useBookings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const DriverBookingPage: React.FC = () => {
    const { bookings, loading, error, fetchBookings, cancelBooking, updateBooking, acceptBooking } = useBookings('DRIVER');

    const handleCancelBooking = async (id: number) => {
        try {
            await cancelBooking(id);
            alert('Booking cancelled successfully');
        } catch (err) {
            console.error('Failed to cancel booking', err);
            alert('Failed to cancel booking');
        }
    };


    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await updateBooking(id, { status, bookingId: id });
            fetchBookings();
            alert(`Booking status updated to ${status}`);
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update booking status');
        }
    };

    const handleAcceptBooking = async (id: number) => {
        try {
            await acceptBooking(id, 0); // 0 for no discount
            fetchBookings();
            alert('Booking accepted successfully');
        } catch (err) {
            console.error('Failed to accept booking', err);
            alert('Failed to accept booking');
        }
    };

    if (loading) {
        return <div>Loading bookings...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 rounded-md">
                    Driver Bookings
                    <FontAwesomeIcon icon={faCalendarCheck} className="ml-2" />
                </h1>
            </div>
            <BookingList 
                bookings={bookings} 
                role="DRIVER" 
                onCancel={handleCancelBooking} 
                onUpdateStatus={handleUpdateStatus}
                onAccept={handleAcceptBooking} 
                payBill={async () => {}}
            />
        </div>
    );
};

export default DriverBookingPage;