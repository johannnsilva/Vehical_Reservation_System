import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsersCog, 
    faUser, 
    faUserCircle,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import UserStatusToggle from '../../components/UserStatusToggle';
import useUserManagement from '../../hooks/useUserManagement';
import { User } from '../../types/user';

const UserManagementPage: React.FC = () => {
    const { users, loading, customerData, driverData, updateUserStatus } = useUserManagement();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user => {
        const isNotAdmin = user.role !== 'ADMIN';
        if (!isNotAdmin) return false;

        let userName = '';
        if (user.role === 'CUSTOMER' && customerData[user.id]) {
            userName = customerData[user.id]?.name || '';
        } else if (user.role === 'DRIVER' && driverData[user.id]) {
            userName = driverData[user.id]?.name || '';
        }

        return userName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleStatusChange = async (userId: number, newStatus: "active" | "blocked") => {
        try {
            await updateUserStatus(userId, newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
            <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-6 transform hover:scale-105 transition-transform">
                <FontAwesomeIcon icon={faUsersCog} className="mr-3 text-indigo-600" />
                User Management
            </h2>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="search"
                        className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        placeholder="Search users by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500 animate-pulse">No users available.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-sm">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                            <tr>
                                <th className="px-6 py-4 text-left text-white">Profile</th>
                                <th className="px-6 py-4 text-left text-white">Username</th>
                                <th className="px-6 py-4 text-left text-white">Status</th>
                                <th className="px-6 py-4 text-left text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user: User) => {
                                let profilePicture = null;
                                let name = 'N/A';

                                if (user.role === 'CUSTOMER' && customerData[user.id]) {
                                    profilePicture = customerData[user.id]?.profilePicturePath || null;
                                    name = customerData[user.id]?.name || 'N/A';
                                } else if (user.role === 'DRIVER' && driverData[user.id]) {
                                    profilePicture = driverData[user.id]?.profilePicturePath || null;
                                    name = driverData[user.id]?.name || 'N/A';
                                }

                                return (
                                    <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {profilePicture ? (
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                                                        src={`http://localhost:8080/${profilePicture}`}
                                                        alt={name}
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://via.placeholder.com/40';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faUserCircle} className="text-white text-lg" />
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <FontAwesomeIcon icon={faUser} className="mr-1 text-indigo-500" />
                                                        {user.role.toLowerCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.username}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center
                                                ${user.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <UserStatusToggle
                                                currentStatus={user.status}
                                                onStatusChange={(newStatus) => handleStatusChange(user.id, newStatus)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;