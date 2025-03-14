/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAddressCard, faIdCard, faPhone, faCarAlt, faEdit, faLock } from '@fortawesome/free-solid-svg-icons';
import ProfileEditModal from './ProfileEditModal';
import PasswordEditModal from './PasswordEditModal';
import { authApi } from '../api';

interface ProfileProps {
    userRole: string;
    profileDetails: any;
    onUpdateProfile: (data: any, profilePicture: File | null) => void;
}

const Profile: React.FC<ProfileProps> = ({ userRole, profileDetails, onUpdateProfile }) => {
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [updatePasswordError, setUpdatePasswordError] = useState<string | null>(null);

    const handleUpdatePasswordSubmit = useCallback(async (passwordData: any) => {
        setUpdatePasswordError(null);
        try {
            await authApi.updatePassword(passwordData);
            setPasswordModalOpen(false);
            alert('Password updated successfully!');
        } catch (error: any) {
            setUpdatePasswordError(error.message || 'Failed to update password.');
        }
    }, []);

    const profilePicturePath = profileDetails.customer?.profilePicturePath || profileDetails.driver?.profilePicturePath;

    return (
        <div className=" bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        {profilePicturePath ? (
                            <img
                                className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
                                src={`http://localhost:8080/${profilePicturePath}`}
                                alt="Profile picture"
                                onError={() => console.error('Error loading profile picture')}
                            />
                        ) : (
                            <div className="h-40 w-40 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faUser} className="text-gray-400 text-4xl" />
                            </div>
                        )}
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">
                        {profileDetails.customer?.name || profileDetails.driver?.name || 'N/A'}
                    </h2>
                    <p className="text-gray-600">{userRole}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className={`grid grid-cols-1 ${userRole === 'Driver' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
                        {userRole === 'Customer' && (
                            <>
                                <div className="bg-gray-50 rounded-lg p-6 aspect-square flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                                    <div className="text-center">
                                        <div className="bg-blue-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faAddressCard} className="text-blue-600 text-2xl" />
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">Address</p>
                                        <p className="font-medium text-gray-800">{profileDetails.customer?.address || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6 aspect-square flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                                    <div className="text-center">
                                        <div className="bg-green-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faIdCard} className="text-green-600 text-2xl" />
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">NIC</p>
                                        <p className="font-medium text-gray-800">{profileDetails.customer?.nic || 'N/A'}</p>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="bg-gray-50 rounded-lg p-6 aspect-square flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                            <div className="text-center">
                                <div className="bg-orange-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faPhone} className="text-orange-600 text-2xl" />
                                </div>
                                <p className="text-sm text-gray-500 mb-2">Phone Number</p>
                                <p className="font-medium text-gray-800">
                                    {profileDetails.customer?.phoneNumber || profileDetails.driver?.phoneNumber || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {userRole === 'Driver' && (
                            <div className="bg-gray-50 rounded-lg p-6 aspect-square flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                                <div className="text-center">
                                    <div className="bg-purple-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faCarAlt} className="text-purple-600 text-2xl" />
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">License Number</p>
                                    <p className="font-medium text-gray-800">{profileDetails.driver?.licenseNumber || 'N/A'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-center space-x-4">
                        <button
                            onClick={() => setIsEditingModalOpen(true)}
                            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                        >
                            <FontAwesomeIcon icon={faEdit} />
                            <span>Edit Profile</span>
                        </button>
                        <button
                            onClick={() => setPasswordModalOpen(true)}
                            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
                        >
                            <FontAwesomeIcon icon={faLock} />
                            <span>Update Password</span>
                        </button>
                    </div>

                    {updatePasswordError && (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-600 text-center">
                            {updatePasswordError}
                        </div>
                    )}
                </div>
            </div>

            <ProfileEditModal
                isOpen={isEditingModalOpen}
                onClose={() => setIsEditingModalOpen(false)}
                profileDetails={profileDetails}
                userRole={userRole}
                onSave={onUpdateProfile}
            />
            <PasswordEditModal
                isOpen={isPasswordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
                onUpdatePassword={handleUpdatePasswordSubmit}
            />
        </div>
    );
};

export default Profile;