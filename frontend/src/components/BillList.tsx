import React, { useState } from 'react';
import { Bill } from '../types';
import PaymentPanel from './PaymentPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHistory, 
    faMoneyBillWave,
    faFileInvoiceDollar,
    faCalendarAlt,
    faBookmark,
    faCheckCircle,
    faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';

interface BillListProps {
    bills: Bill[];
    role: string;
    payBill: (id: number) => Promise<void>;
}

const BillList: React.FC<BillListProps> = ({ bills, role, payBill }) => {
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [isPaymentPanelOpen, setPaymentPanelOpen] = useState(false);

    const handlePayNow = (bill: Bill) => {
        setSelectedBill(bill);
        setPaymentPanelOpen(true);
    };

    const closePaymentPanel = () => {
        setPaymentPanelOpen(false);
        setSelectedBill(null);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-6 transform hover:scale-105 transition-transform">
                <FontAwesomeIcon icon={faHistory} className="mr-3 text-indigo-600" />
                Billing History
            </h2>

            {bills.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500 animate-pulse">No billing history available.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-sm">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                            <tr>
                                <th className="px-6 py-4 text-left text-white">Bill Number</th>
                                <th className="px-6 py-4 text-left text-white">Booking Reference</th>
                                <th className="px-6 py-4 text-left text-white">Amount</th>
                                <th className="px-6 py-4 text-left text-white">Status</th>
                                <th className="px-6 py-4 text-left text-white">Date</th>
                                {role.toUpperCase() === 'CUSTOMER' && (
                                    <th className="px-6 py-4 text-left text-white">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map(bill => (
                                <tr key={bill.billId} 
                                    className="border-b hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-indigo-500 mr-2" />
                                            #{bill.billId}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faBookmark} className="text-blue-500 mr-2" />
                                            {bill.bookingId}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 mr-2" />
                                            Rs {bill.totalAmount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center
                                            ${bill.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 
                                              bill.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-gray-100 text-gray-800'}`}>
                                            <FontAwesomeIcon 
                                                icon={bill.paymentStatus === 'PAID' ? faCheckCircle : faHourglassHalf} 
                                                className="mr-2" 
                                            />
                                            {bill.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-500 mr-2" />
                                            {new Date(bill.billDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    {role.toUpperCase() === 'CUSTOMER' && (
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {bill.paymentStatus === 'PENDING' && (
                                                    <button
                                                        onClick={() => handlePayNow(bill)}
                                                        className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transform hover:scale-105 transition-all duration-200"
                                                    >
                                                        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                                                        Pay
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${isPaymentPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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

export default BillList;