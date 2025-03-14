/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api';
import { UserDTO } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCar } from '@fortawesome/free-solid-svg-icons';

const RoleSelector = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userDataFromSignup = location.state?.userData;
    const [registrationError, setRegistrationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    if (!userDataFromSignup) {
        return <div className="flex justify-center items-center h-screen bg-gray-100">User data missing. Please signup again.</div>;
    }

    const handleRoleSelection = async (role: string) => {
        setRegistrationError('');
        setSuccessMessage('');

        const userDTO: UserDTO = {
            username: userDataFromSignup.username,
            password: userDataFromSignup.password,
            role: role.toUpperCase(),
        };

        try {
            await authApi.registerUser(userDTO);
            setSuccessMessage('Registration successful! Please complete your profile.');

            if (role === 'customer') {
                navigate('/customer/create', { state: { userData: userDTO } });
            } else if (role === 'driver') {
                navigate('/driver/create', { state: { userData: userDTO } });
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            setRegistrationError(error.toString());
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-20">
                <div className="bg-white p-8 rounded-lg shadow-lg w-[800px]">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Select Your Role</h2>
                    {successMessage && <p className="text-green-500 text-sm italic mb-4 text-center">{successMessage}</p>}
                    {registrationError && <p className="text-red-500 text-xs italic mb-4 text-center">{registrationError}</p>}
                    <div className="flex space-x-8 justify-center">
                        <div 
                            className="cursor-pointer p-8 bg-blue-50 rounded-lg w-[300px] hover:bg-blue-100 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            onClick={() => handleRoleSelection('customer')}
                        >
                            <FontAwesomeIcon icon={faUser} className="text-blue-500 text-5xl mb-4" />
                            <h3 className="font-bold text-2xl mb-4 text-blue-600">Customer</h3>
                            <p className="text-base text-gray-600">Sign up as a customer to book rides and enjoy seamless transportation services.</p>
                        </div>
                        <div 
                            className="cursor-pointer p-8 bg-green-50 rounded-lg w-[300px] hover:bg-green-100 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            onClick={() => handleRoleSelection('driver')}
                        >
                            <FontAwesomeIcon icon={faCar} className="text-green-500 text-5xl mb-4" />
                            <h3 className="font-bold text-2xl mb-4 text-green-600">Driver</h3>
                            <p className="text-base text-gray-600">Sign up as a driver to offer ride services and grow your business with us.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RoleSelector;
