import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import useAdminBills from '../../hooks/useAdminBills';
import BillList from '../../components/BillList';

const AdminBillingPage: React.FC = () => {
    const { bills, loading, error } = useAdminBills();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 rounded-md">
                    Billing Management
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="ml-2" />
                </h1>
            </div>
            {loading && <p>Loading billing details...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            <BillList bills={bills} role='ADMIN' payBill={function (): Promise<void> {
                throw new Error('Function not implemented.');
            } }/>
            {bills.length === 0 && !loading && !error && <p>No bills found.</p>}
        </div>
    );
};

export default AdminBillingPage;