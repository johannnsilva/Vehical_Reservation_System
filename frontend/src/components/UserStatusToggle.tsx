import React, { useState, useEffect } from 'react';

interface UserStatusToggleProps {
    currentStatus: 'active' | 'blocked';
    onStatusChange: (newStatus: 'active' | 'blocked') => void;
}

const UserStatusToggle: React.FC<UserStatusToggleProps> = ({ currentStatus, onStatusChange }) => {
    const [isActive, setIsActive] = useState(currentStatus === 'active');

    useEffect(() => {
        setIsActive(currentStatus === 'active');
    }, [currentStatus]);

    const toggleStatus = () => {
        const newStatus = isActive ? 'blocked' : 'active';
        setIsActive(!isActive);
        onStatusChange(newStatus);
    };

    return (
        <label className="inline-flex relative items-center cursor-pointer">
            <input
                type="checkbox"
                checked={isActive}
                onChange={toggleStatus}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 transition-colors duration-300 ease-in-out flex items-center">
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
        </label>
    );
};

export default UserStatusToggle;