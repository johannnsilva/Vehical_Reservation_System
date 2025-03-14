/* eslint-disable @typescript-eslint/no-explicit-any */
import SidePanel from '../../components/SidePanel';
import { Routes, Route, Navigate } from 'react-router-dom';
import { faUser, faCar, faCalendarCheck, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import Profile from '../../components/Profile';
import useDriverProfile from '../../hooks/useDriverProfile';
import VehicleManagementPage from './VehicleManagementPage';
import DriverBookingPage from './DriverBookingPage';
import BillingPage from './BillingPage';
import { User } from '../../types';
import { useEffect, useState } from 'react';

const DriverDashboard = () => {
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

    const { profile, loading, error, updateProfile } = useDriverProfile(user);


    const driverRoutes = [
        { path: '/driver/profile', label: 'Profile', icon: faUser },
        { path: '/driver/vehicles', label: 'Vehicles', icon: faCar },
        { path: '/driver/bookings', label: 'Bookings', icon: faCalendarCheck },
        { path: '/driver/billing', label: 'Billing History', icon: faMoneyBill },
    ];


    if (loading) {
        return <div>Loading profile...</div>;
     }
     if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="flex h-screen">
            <SidePanel routes={driverRoutes} />
            <div className="flex-1 bg-gray-100 px-4 pt-4 ml-64">
                <Routes>
                    {/* Add default redirect to profile */}
                    <Route path="/" element={<Navigate to="/driver/profile" replace />} />
                    <Route path="/profile" element={
                        <Profile 
                            userRole="Driver"
                            profileDetails={profile}
                            onUpdateProfile={updateProfile}
                        />
                    } />
                    <Route path="/vehicles" element={<VehicleManagementPage />} />
                    <Route path="/bookings" element={<DriverBookingPage />} />
                    <Route path="/billing" element={<BillingPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default DriverDashboard;
