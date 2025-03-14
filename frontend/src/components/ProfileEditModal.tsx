/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSave, faTimes } from '@fortawesome/free-solid-svg-icons'; // Add this import for the placeholder icon

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileDetails: any;
    userRole: string;
    onSave: (data: any, profilePicture: File | null) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, profileDetails, userRole, onSave }) => {
    const [editableDetails, setEditableDetails] = useState({ ...profileDetails });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewProfilePicture, setPreviewProfilePicture] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleCancelEdit = () => {
        onClose();
        setPreviewProfilePicture(null);
        setProfilePicture(null);
    };

    const handleSaveProfile = () => {
        onSave(editableDetails, profilePicture);
        onClose();
        setPreviewProfilePicture(null);
        setProfilePicture(null);
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePicture(file);
            setPreviewProfilePicture(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const profilePicturePath = profileDetails.customer?.profilePicturePath || profileDetails.driver?.profilePicturePath;
    const currentProfilePicture = previewProfilePicture || (profilePicturePath ? `http://localhost:8080/${profilePicturePath}` : null);

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose} />
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 text-center" id="modal-title">
                            Edit Profile
                        </h3>
                        <div className="mt-4 flex flex-col items-center">
                            <div
                                onClick={triggerFileInput}
                                className="relative cursor-pointer rounded-full overflow-hidden h-32 w-32 border-4 border-gray-200 bg-gray-200 flex items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-105"
                            >
                                {currentProfilePicture ? (
                                    <img
                                        className="h-full w-full object-cover"
                                        src={currentProfilePicture}
                                        onError={() => setPreviewProfilePicture(null)}
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faUserCircle} className="h-full w-full text-gray-400" />
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    id="profilePicture"
                                    className="hidden"
                                    onChange={handleProfilePictureChange}
                                    accept="image/*"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Click to change profile picture</p>
                        </div>
                        <div className="mt-2 space-y-4">
                            <div>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    placeholder="Name"
                                    value={editableDetails.customer?.name || editableDetails.driver?.name}
                                    onChange={(e) => {
                                        if (userRole === 'Customer') {
                                            setEditableDetails({ ...editableDetails, customer: { ...editableDetails.customer, name: e.target.value } });
                                        }
                                        if (userRole === 'Driver') {
                                            setEditableDetails({ ...editableDetails, driver: { ...editableDetails.driver, name: e.target.value } });
                                        }
                                    }}
                                />
                            </div>
                            {
                                userRole === 'Customer' && (
                                    <>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                            placeholder="Address"
                                            value={editableDetails.customer?.address}
                                            onChange={(e) => setEditableDetails({ ...editableDetails, customer: { ...editableDetails.customer, address: e.target.value } })}
                                        />
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                            placeholder="NIC"
                                            value={editableDetails.customer?.nic}
                                            onChange={(e) => setEditableDetails({ ...editableDetails, customer: { ...editableDetails.customer, nic: e.target.value } })}
                                        />
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                            placeholder="Phone Number"
                                            value={editableDetails.customer?.phoneNumber}
                                            onChange={(e) => setEditableDetails({ ...editableDetails, customer: { ...editableDetails.customer, phoneNumber: e.target.value } })}
                                        />
                                    </>
                                )
                            }
                            {
                                userRole === 'Driver' && (
                                    <div>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                            placeholder="License Number"
                                            value={editableDetails.driver?.licenseNumber}
                                            onChange={(e) => setEditableDetails({ ...editableDetails, driver: { ...editableDetails.driver, licenseNumber: e.target.value } })}
                                        />
                                    </div>
                                )
                            }
                             {
                                userRole === 'Driver' && (
                                    <div>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                            placeholder="Phone Number"
                                            value={editableDetails.driver?.phoneNumber}
                                            onChange={(e) => setEditableDetails({ ...editableDetails, driver: { ...editableDetails.driver, phoneNumber: e.target.value } })}
                                        />
                                    </div>
                                )
                            }

                            <div className="flex justify-end gap-4">
                                <button onClick={handleSaveProfile} className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform duration-300 ease-in-out transform hover:scale-105 flex items-center"
                                    disabled={
                                        (userRole === 'Customer' && (!editableDetails.customer?.name || !editableDetails.customer?.address || !editableDetails.customer?.nic || !editableDetails.customer?.phoneNumber)) ||
                                        (userRole === 'Driver' && (!editableDetails.driver?.name || !editableDetails.driver?.licenseNumber || !editableDetails.driver?.phoneNumber))
                                    }>Save
                                    <FontAwesomeIcon icon={faSave} className="ml-2" />
                                </button>
                                <button onClick={handleCancelEdit} className="bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform duration-300 ease-in-out transform hover:scale-105 flex items-center">Cancel
                                    <FontAwesomeIcon icon={faTimes} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditModal;
