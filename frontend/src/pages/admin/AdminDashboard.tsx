/* eslint-disable @typescript-eslint/no-explicit-any */
import SidePanel from '../../components/SidePanel';
import { Routes, Route, Navigate } from 'react-router-dom';
import { faCar, faTaxi, faFileInvoice, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import AdminBookingPage from './AdminBookingPage';
import VehicleManagementPage from '../driver/VehicleManagementPage';
import AdminBillingPage from './AdminBillingPage';
import UserManagementPage from './UserManagementPage';

const AdminDashboard = () => {
    const adminRoutes = [
        { path: '/admin/user-management', label: 'User Management', icon: faUsersCog },
        { path: '/admin/booking-management', label: 'Booking Management', icon: faTaxi },
        { path: '/admin/vehicle-management', label: 'Vehicle Management', icon: faCar },
        { path: '/admin/billing', label: 'Billing Management', icon: faFileInvoice }
    ];

    return (
        <div className="flex h-screen">
            <SidePanel routes={adminRoutes} />
            <div className="flex-1 bg-gray-100 px-4 pt-4 ml-64">
                <Routes>
                    {/* Add default redirect to user management */}
                    <Route path="/" element={<Navigate to="/admin/user-management" replace />} />
                    <Route path="/user-management" element={<UserManagementPage />} />
                    <Route path="/booking-management" element={<AdminBookingPage />} />
                    <Route path="/vehicle-management" element={<VehicleManagementPage />} />
                    <Route path="/billing" element={<AdminBillingPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
