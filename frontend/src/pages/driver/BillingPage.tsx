import React from 'react';
import useDriverBills from '../../hooks/useDriverBills';
import BillList from '../../components/BillList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';

const BillingPage: React.FC = () => {
    const { bills, loading, error } = useDriverBills();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 rounded-md">
                    Billing History
                    <FontAwesomeIcon icon={faMoneyBill} className="ml-2" />
                </h1>
            </div>
            {loading && <p>Loading billing details...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            <BillList bills={bills} role='DRIVER' payBill={function (): Promise<void> {
                throw new Error('Function not implemented.');
            } } />
             {bills.length === 0 && !loading && !error && <p>No bills found for this driver.</p>}
        </div>
    );
};

export default BillingPage;