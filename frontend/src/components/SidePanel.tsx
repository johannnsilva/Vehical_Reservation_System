/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface SidePanelProps {
    routes: { path: string; label: string; icon: any }[];
}

const SidePanel: React.FC<SidePanelProps> = ({ routes }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            navigate('/login');
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout process failed. Please try again.');
        }
    };

    return (
        <div className="bg-gray-800 text-white h-screen fixed top-0 left-0 w-64 flex flex-col transition-transform duration-300 ease-in-out transform">
            <div className="p-4">
                <h1 className="text-2xl font-bold">Mega App</h1>
            </div>
            <ul className="mt-4 flex-grow">
                {routes.map((route, index) => (
                    <li key={index} className={`
                        px-4 py-2
                        hover:bg-gray-700
                        transition-colors duration-200
                        ${location.pathname === route.path ? 'bg-gray-700' : ''} // Highlight active route
                    `}>
                        <Link to={route.path} className="flex items-center">
                            <FontAwesomeIcon icon={route.icon} className="mr-3" />
                            {route.label}
                        </Link>
                    </li>
                ))}
            </ul>
             <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center hover:bg-gray-700 px-4 py-2 rounded transition-colors duration-200 w-full text-left"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SidePanel;
