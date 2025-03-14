/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useRef } from 'react';
import { UserDTO } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Signup = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [formState, setFormState] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        error: {} as {[key: string]: string},
        isLoading: false
    });
    const navigate = useNavigate();

    const performSignup = useCallback(async () => {
        if (formState.isLoading) return;
        
        setFormState(prev => ({ ...prev, error: {}, isLoading: true }));

        const newUser: UserDTO = { 
            username: formState.username, 
            password: formState.password 
        };

        try {
            navigate('/role-selector', { state: { userData: newUser } });
        } catch (err: any) {
            const errorData = err.response?.data || { message: 'Signup failed' };
            setFormState(prev => ({ ...prev, error: errorData }));
        } finally {
            setFormState(prev => ({ ...prev, isLoading: false }));
        }
    }, [formState.username, formState.password, formState.isLoading, navigate]);

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number';
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return 'Password must contain at least one special character';
        }
        return null;
    };

    const handleSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        event.stopPropagation();

        // Create new errors object and copy existing message if present
        const errors: {[key: string]: string} = {};
        if (formState.error.message) {
            errors.message = formState.error.message;
        }
        
        if (!formState.username) {
            errors.username = 'Username is required';
        }
        if (!formState.password) {
            errors.password = 'Password is required';
        } else {
            const passwordError = validatePassword(formState.password);
            if (passwordError) {
                errors.password = passwordError;
            }
        }
        if (!formState.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formState.password !== formState.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(errors).length > 0) {
            setFormState(prev => ({ ...prev, error: errors }));
            return;
        }

        performSignup();
    }, [formState.username, formState.password, formState.confirmPassword, formState.error.message, performSignup]);

    const handleInputChange = useCallback((field: 'username' | 'password' | 'confirmPassword', value: string) => {
        setFormState(prev => ({ 
            ...prev, 
            [field]: value, 
            error: { ...prev.error, [field]: '' } 
        }));
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 mt-20">
                <div className="flex w-full max-w-6xl mx-auto gap-6">
                    <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUserPlus} className="mr-2 text-indigo-600" />
                            Signup
                        </h2>
                        {formState.error.message && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{formState.error.message}</span>
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
                                {formState.error.username && (
                                    <p className="text-red-500 text-xs italic">{formState.error.username}</p>
                                )}
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
                                {formState.error.password && (
                                    <p className="text-red-500 text-xs italic">{formState.error.password}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
                                        value={formState.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        required
                                    />
                                    <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {formState.error.confirmPassword && (
                                    <p className="text-red-500 text-xs italic">{formState.error.confirmPassword}</p>
                                )}
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
                                    {formState.isLoading ? 'Signing up...' : 'Sign Up'}
                                </button>
                            </div>
                        </form>
                        <p className="mt-4 text-center text-gray-600">
                            Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
                        </p>
                    </div>
                    <div className="flex-1">
                        <img 
                            src="/assets/images/signup.jpg" 
                            alt="Signup" 
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

export default Signup;
