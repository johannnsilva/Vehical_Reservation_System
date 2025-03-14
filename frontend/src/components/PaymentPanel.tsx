import React from 'react';
import { BillDTO } from '../types/bill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

interface PaymentPanelProps {
    isOpen: boolean;
    onClose: () => void;
    billDetails: BillDTO;
    payBill: (id: number) => Promise<void>;
}

const PaymentPanel: React.FC<PaymentPanelProps> = ({ isOpen, onClose, billDetails, payBill }) => {
    if (!isOpen) return null;

    const handlePayBill = async () => {
        try {
            if (billDetails.billId) {
                await payBill(billDetails.billId);
                alert('Bill paid successfully!');
                onClose();
            } else {
                alert('Bill ID is missing.');
            }
        } catch (error) {
            console.error('Failed to pay bill', error);
            alert('Failed to pay bill');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                        Payment Details
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div>
                    <p className="text-gray-700 mb-2">
                        Bill ID: <span className="font-semibold">{billDetails.billId}</span>
                    </p>
                    <p className="text-gray-700 mb-2">
                        Booking ID: <span className="font-semibold">{billDetails.bookingId}</span>
                    </p>
                    <p className="text-gray-700 mb-2">
                        Amount: <span className="font-semibold">Rs {billDetails.totalAmount}</span>
                    </p>
                    <p className="text-gray-700 mb-2">
                        Status: <span className="font-semibold">{billDetails.paymentStatus}</span>
                    </p>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handlePayBill}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200"
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPanel;