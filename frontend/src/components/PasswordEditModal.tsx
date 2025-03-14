/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

interface PasswordEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdatePassword: (data: any) => void;
}

const PasswordEditModal: React.FC<PasswordEditModalProps> = ({ isOpen, onClose, onUpdatePassword }) => {
    const [passwordUpdate, setPasswordUpdate] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [updateError, setUpdateError] = useState<string|null>(null);

    if (!isOpen) return null;

    const handleCancelEdit = () => {
        onClose();
        setUpdateError(null);
        setPasswordUpdate({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateError(null);
        if (passwordUpdate.newPassword !== passwordUpdate.confirmPassword) {
            setUpdateError("New password and confirm password don't match.");
            return;
        }

        try {
            await onUpdatePassword({
                oldPassword: passwordUpdate.oldPassword,
                newPassword: passwordUpdate.newPassword,
            });
            alert('Password updated successfully!');
            onClose();
        } catch (err:any) {
            setUpdateError(err.message || 'Failed to update password');
        }
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCancelEdit} />

                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

               
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 text-center" id="modal-title">
                            Update Password
                        </h3>
                        <form onSubmit={handleUpdatePasswordSubmit} className="space-y-4 mt-4">
                            <div>
                                <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">Old Password:</label>
                                <input type="password" id="oldPassword" name="oldPassword" value={passwordUpdate.oldPassword} onChange={(e) => setPasswordUpdate({ ...passwordUpdate, oldPassword: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
                                <input type="password" id="newPassword" name="newPassword" value={passwordUpdate.newPassword} onChange={(e) => setPasswordUpdate({ ...passwordUpdate, newPassword: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password:</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" value={passwordUpdate.confirmPassword} onChange={(e) => setPasswordUpdate({ ...passwordUpdate, confirmPassword: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            {updateError && <p className="text-red-500 text-xs italic">{updateError}</p>}
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="submit" className="w-full inline-flex items-center justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm transition-all duration-200 transform hover:scale-105 mx-2">
                                    Update Password
                                    <FontAwesomeIcon icon={faSyncAlt} className="ml-2 self-center" />
                                </button>
                                <button type="button" className="mt-3 w-full inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-all duration-200 transform hover:scale-105" onClick={handleCancelEdit}>
                                    Cancel
                                    <FontAwesomeIcon icon={faTimes} className="ml-2 self-center" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordEditModal;
