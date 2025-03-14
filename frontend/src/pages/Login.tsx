/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useRef } from 'react';
import { authApi } from '../api';
import { User } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [formState, setFormState] = useState({
        username: '',
        password: '',
        error: '',
        isLoading: false
    });
    const navigate = useNavigate();

    const performLogin = useCallback(async () => {
        if (formState.isLoading) return;
        
        setFormState(prev => ({ ...prev, error: '', isLoading: true }));

        try {
            const response = await authApi.login(formState.username, formState.password);
            
            // Store tokens and user data
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            const user: User = {
                id: response.id,
                username: response.username,
                role: response.role,
                customerId: response.customerId || undefined,
                driverId: response.driverId || undefined,
                status: response.status as "active" | "blocked" || "active"
            };

            localStorage.setItem('user', JSON.stringify(user));

            // Navigate based on role
            switch(user.role) {
                case 'CUSTOMER':
                    navigate('/customer/');
                    break;
                case 'DRIVER':
                    navigate('/driver/');
                    break;
                case 'ADMIN':
                    navigate('/admin/');
                    break;
                default:
                    navigate('/');
            }

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error ||
                               err.message || 
                               'Login failed. Please try again.';
            setFormState(prev => ({ ...prev, error: errorMessage }));
        } finally {
            setFormState(prev => ({ ...prev, isLoading: false }));
        }
    }, [formState.username, formState.password, formState.isLoading, navigate]);

    const handleSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!formState.username) {
            setFormState(prev => ({ ...prev, error: 'Username is required' }));
            return;
        }
        if (!formState.password) {
            setFormState(prev => ({ ...prev, error: 'Password is required' }));
            return;
        }

        performLogin();
    }, [formState.username, formState.password, performLogin]);

    const handleInputChange = useCallback((field: 'username' | 'password', value: string) => {
        setFormState(prev => ({ ...prev, [field]: value, error: '' }));
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 mt-20">
                <div className="flex w-full max-w-6xl mx-auto gap-6">
                    <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center">
                            <FontAwesomeIcon icon={faSignInAlt} className="mr-2 text-indigo-600" />
                            Login
                        </h2>
                        {formState.error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{formState.error}</span>
                            </div>
                        )}
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <div>
                                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="username"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
                                        value={formState.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        required
                                    />
                                    <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="password"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
                                        value={formState.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        required
                                    />
                                    <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <button 
                                    type="submit"
                                    className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition-transform ${formState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    disabled={formState.isLoading}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }}
                                >
                                    {formState.isLoading ? 'Logging in...' : 'Log In'}
                                </button>
                            </div>
                        </form>
                        <p className="mt-4 text-center text-gray-600">
                            Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Sign Up</Link>
                        </p>
                    </div>
                    <div className="flex-1">
                        <img 
                            src="/assets/images/login.jpg" 
                            alt="Login" 
                            className="object-cover w-full h-full rounded-lg shadow-lg"
                            style={{ minHeight: '500px' }} 
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
