import React, { useState, useEffect, JSX } from 'react';
import { BookingDTO } from '../types';
import { getBillByBookingId } from '../api/billing';
import { GetBillByBookingIdResponse, BillDTO } from '../types/bill';
import PaymentPanel from './PaymentPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHistory,
    faMapMarkerAlt,
    faLocationArrow,
    faTimes,
    faMoneyBillWave,
    faCheck,
    faTrash,
    faUser,
    faCar,
    faUserTie,
} from '@fortawesome/free-solid-svg-icons';

interface BookingListProps {
    bookings: BookingDTO[];
    role: string;
    onCancel?: (id: number) => void;
    onDelete?: (id: number) => void;
    onUpdateStatus?: (id: number, status: string) => void;
    onAccept?: (id: number) => void;
    payBill: (id: number) => Promise<void>;
}

const BookingList: React.FC<BookingListProps> = ({
    bookings,
    role,
    onCancel,
    onDelete,
    onUpdateStatus,
    onAccept,
    payBill
}) => {
    const [bills, setBills] = useState<{ [key: number]: GetBillByBookingIdResponse }>({});
    const [selectedBill, setSelectedBill] = useState<BillDTO | null>(null);
    const [isPaymentPanelOpen, setPaymentPanelOpen] = useState(false);

    useEffect(() => {
        const fetchBills = async () => {
            const billPromises = bookings.map(async (booking) => {
                if (booking.bookingId) {
                    try {
                        const billResponse: GetBillByBookingIdResponse = await getBillByBookingId(booking.bookingId);
                        return { [booking.bookingId]: billResponse };
                    } catch (error) {
                        console.error(`Error fetching bill for booking ${booking.bookingId}:`, error);
                        return {};
                    }
                }
                return {};
            });

            const billResults = await Promise.all(billPromises);
            const combinedBills = Object.assign({}, ...billResults);
            setBills(combinedBills);
        };

        fetchBills();
    }, [bookings]);

    const handlePayNow = (bill: BillDTO) => {
        setSelectedBill(bill);
        setPaymentPanelOpen(true);
    };

    const closePaymentPanel = () => {
        setPaymentPanelOpen(false);
        setSelectedBill(null);
    };


    const isCancelled = (status: string | undefined): boolean => {
        if (!status) return false;
        return ['CUSTOMER_CANCELLED', 'DRIVER_CANCELLED', 'ADMIN_CANCELLED'].includes(status.toUpperCase());
    };

    const formatStatus = (status: string | undefined): JSX.Element => {
        if (!status) return <></>;

        switch (status.toUpperCase()) {
            case 'CUSTOMER_CANCELLED':
                return (
                    <div className="group relative inline-block">
                        <span className="flex items-center">
                            <FontAwesomeIcon icon={faUser} className="text-red-500 mr-1" />
                            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        </span>
                        <span className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                            Cancelled by Customer
                        </span>
                    </div>
                );
            case 'DRIVER_CANCELLED':
                return (
                    <div className="group relative inline-block">
                        <span className="flex items-center">
                            <FontAwesomeIcon icon={faCar} className="text-red-500 mr-1" />
                            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        </span>
                        <span className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                            Cancelled by Driver
                        </span>
                    </div>
                );
            case 'ADMIN_CANCELLED':
                return (
                    <div className="group relative inline-block">
                        <span className="flex items-center">
                            <FontAwesomeIcon icon={faUserTie} className="text-red-500 mr-1" />
                            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        </span>
                        <span className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                            Cancelled by Admin
                        </span>
                    </div>
                );
            case 'ACCEPTED':
                return (
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-1" />
                        <span>Accepted</span>
                    </div>
                );
            default:
                return <span>{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</span>;
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-6 transform hover:scale-105 transition-transform">
                <FontAwesomeIcon icon={faHistory} className="mr-3 text-indigo-600" />
                Booking History
            </h2>

            {bookings.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500 animate-pulse">No bookings found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-sm">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                            <tr>
                                <th className="px-6 py-4 text-left text-white">Booking Number</th>
                                <th className="px-6 py-4 text-left text-white">Pickup</th>
                                <th className="px-6 py-4 text-left text-white">Destination</th>
                                <th className="px-6 py-4 text-left text-white">Status</th>
                                <th className="px-6 py-4 text-left text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr
                                    key={booking.bookingId}
                                    className="border-b hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        #{booking.bookingNumber}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mr-2" />
                                            {booking.pickupAddress}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faLocationArrow} className="text-blue-500 mr-2" />
                                            {booking.destinationAddress}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center
                                                ${booking.status?.toUpperCase() === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                                    booking.status?.toUpperCase() === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        booking.status?.toUpperCase().includes('CANCELLED') ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'}`}
                                        >
                                            {formatStatus(booking.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            {(role.toUpperCase() === 'CUSTOMER' || role.toUpperCase() === 'DRIVER') &&
                                                !isCancelled(booking.status) &&
                                                booking.status?.toUpperCase() !== 'ACCEPTED' && (
                                                    <button
                                                        onClick={() => onCancel?.(booking.bookingId || 0)}
                                                        className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transform hover:scale-105 transition-all duration-200"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                                        Cancel
                                                    </button>
                                                )}

                                            {role.toUpperCase() === 'CUSTOMER' &&
                                                booking.status?.toUpperCase() === 'ACCEPTED' &&
                                                bills[booking.bookingId || 0]?.paymentStatus === 'PENDING' && (
                                                    <button
                                                        onClick={() => handlePayNow(bills[booking.bookingId || 0])}
                                                        className="flex items-center whitespace-nowrap px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transform hover:scale-105 transition-all duration-200"
                                                    >
                                                        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                                                        <span className="inline-block">Pay Now</span>
                                                    </button>
                                                )}

                                            {role === 'DRIVER' &&
                                                booking.status?.toUpperCase() === 'PENDING' && (
                                                    <button
                                                        onClick={() => onAccept?.(booking.bookingId || 0)}
                                                        className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transform hover:scale-105 transition-all duration-200"
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                                        Accept
                                                    </button>
                                                )}

                                            {role === 'ADMIN' && (
                                                <>
                                                    <select
                                                        className="px-3 py-1 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        value={booking.status}
                                                        onChange={(e) => onUpdateStatus?.(booking.bookingId || 0, e.target.value)}
                                                    >
                                                        <option value="PENDING">PENDING</option>
                                                        <option value="ACCEPTED">ACCEPTED</option>
                                                        <option value="ADMIN_CANCELLED">CANCELLED</option>
                                                        <option value="COMPLETED">COMPLETED</option>
                                                    </select>
                                                    <button
                                                        onClick={() => onDelete?.(booking.bookingId || 0)}
                                                        className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transform hover:scale-105 transition-all duration-200"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${isPaymentPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                {isPaymentPanelOpen && selectedBill && (
                            <PaymentPanel
                                isOpen={isPaymentPanelOpen}
                                onClose={closePaymentPanel}
                                billDetails={selectedBill}
                                payBill={payBill}
                            />
                )}
            </div>
        </div>
    );
};

export default BookingList;