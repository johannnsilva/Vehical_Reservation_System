/* eslint-disable @typescript-eslint/no-explicit-any */
import SidePanel from '../../components/SidePanel';
import { Routes, Route, Navigate } from 'react-router-dom';
import {  faUser, faTaxi, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import Profile from '../../components/Profile';
import useCustomerProfile from '../../hooks/useCustomerProfile';
import CustomerBookingPage from './CustomerBookingPage';
import BillingPage from './BillingPage';
import { User } from '../../types';
import { useEffect, useState } from 'react';

const CustomerDashboard = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser) as User);
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const { profile, loading, error, updateProfile } = useCustomerProfile(user as User);
    const customerRoutes = [
        { path: '/customer/profile', label: 'Profile', icon: faUser },
        { path: '/customer/bookings', label: 'Bookings', icon: faTaxi },
        { path: '/customer/billing', label: 'Billing', icon: faFileInvoice },
    ];


    if (loading) {
        return <div>Loading profile...</div>;
     }
     if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex h-screen">
            <SidePanel routes={customerRoutes} />
            <div className="flex-1 bg-gray-100 px-4 pt-4 ml-64">
                <Routes>
                    {/* Add default redirect to profile */}
                    <Route path="/" element={<Navigate to="/customer/profile" replace />} />
                    <Route path="/profile" element={
                        <Profile 
                            userRole="Customer"
                            profileDetails={profile}
                            onUpdateProfile={updateProfile}
                        />
                    } />
                    <Route path="/bookings" element={<CustomerBookingPage />} />
                    <Route path="/billing" element={<BillingPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default CustomerDashboard;
