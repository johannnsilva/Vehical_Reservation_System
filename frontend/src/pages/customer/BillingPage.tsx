import React from 'react';
import useCustomerBills from '../../hooks/useCustomerBills';
import BillList from '../../components/BillList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';

const BillingPage: React.FC = () => {
    const { bills, loading, error,payBill } = useCustomerBills();

    return (
        <div className="min-h-screen  bg-gray-100">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 rounded-md">
                    Billing History
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="ml-2" />
                </h1>
            </div>
            {loading && <p className="text-gray-600">Loading billing details...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            <BillList bills={bills} role='CUSTOMER' payBill={payBill}/>
           
        </div>
    );
};

export default BillingPage;