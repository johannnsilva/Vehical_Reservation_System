import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import BookingList from '../../components/BookingList';
import useBookings from '../../hooks/useBookings';

const AdminBookingPage: React.FC = () => {
    const { bookings, loading, error, fetchBookings, deleteBooking, changeBookingStatus } = useBookings('admin');

    const handleDeleteBooking = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await deleteBooking(id);
                alert('Booking deleted successfully');
            } catch (err) {
                console.error('Failed to delete booking', err);
                alert('Failed to delete booking');
            }
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await changeBookingStatus(id, status);
            fetchBookings();
            alert(`Booking status updated to ${status}`);
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update booking status');
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
                    Booking Management
                    <FontAwesomeIcon icon={faCalendarCheck} className="ml-2" />
                </h1>
            </div>
            <BookingList bookings={bookings} role="ADMIN" onDelete={handleDeleteBooking} onUpdateStatus={handleUpdateStatus} onCancel={()=>{}} payBill={async () => {}}/>
        </div>
    );
};

export default AdminBookingPage;