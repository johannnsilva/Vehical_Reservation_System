/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import { driverApi } from '../../api';
import { DriverDTO } from '../../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faPhone, faImage } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CreateDriver = () => {
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewProfilePicture, setPreviewProfilePicture] = useState<string | null>(null);

  interface ErrorType {
    message?: string;
    name?: string;
    licenseNumber?: string;
    phoneNumber?: string;
  }
  const [error, setError] = useState<ErrorType>({});
  const navigate = useNavigate();
  const location = useLocation();
  const registeredUserData = location.state?.userData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!registeredUserData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        User registration data missing. Please signup again.
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Create new errors object and preserve any existing backend message
    const errors: ErrorType = {};
    if (error.message) {
      errors.message = error.message;
    }

    if (!name) {
      errors.name = 'Name is required';
    }
    if (!licenseNumber) {
      errors.licenseNumber = 'License Number is required';
    }
    if (!phoneNumber) {
      errors.phoneNumber = 'Phone Number is required';
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    const driverData: DriverDTO = {
      name,
      licenseNumber,
      phoneNumber,
      userId: 0,
    };

    try {
      await driverApi.createDriver(driverData, profilePicture);
      alert('Driver profile created successfully! Please login.');
      navigate('/login');
    } catch (err: any) {
      const errorData = err.response?.data || { message: 'Driver creation failed' };
      setError(errorData);
    }
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

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-20">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 rounded-md text-center hover:scale-105 transition-transform">
              Create Driver Profile
              <FontAwesomeIcon icon={faUser} className="ml-2" />
            </h1>
          </div>
          {/* Profile Picture at the Top */}
          <div className="flex flex-col items-center mb-6">
            <div
              onClick={triggerFileInput}
              className="cursor-pointer relative rounded-full overflow-hidden h-32 w-32 border-4 border-gray-200 bg-gray-200 flex items-center justify-center transition-transform duration-300 hover:scale-105"
            >
              {previewProfilePicture ? (
                <img src={previewProfilePicture} className="h-full w-full object-cover" />
              ) : (
                <FontAwesomeIcon icon={faUser} className="text-gray-400 h-16 w-16" />
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-shadow duration-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {error.name && <p className="text-red-500 text-xs italic">{error.name}</p>}
              </div>
              <div>
                <label htmlFor="licenseNumber" className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                  License Number:
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-shadow duration-200"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                />
                {error.licenseNumber && (
                  <p className="text-red-500 text-xs italic">{error.licenseNumber}</p>
                )}
                {error.message &&
                  typeof error.message === 'string' &&
                  error.message.includes('License number already exists') && (
                    <p className="text-red-500 text-xs italic">License number already exists</p>
                  )}
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  Phone Number:
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-shadow duration-200"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                {error.phoneNumber && (
                  <p className="text-red-500 text-xs italic">{error.phoneNumber}</p>
                )}
              </div>
            </div>

            <label className="hidden" htmlFor="profilePicture">
              <FontAwesomeIcon icon={faImage} />
              Profile Picture
            </label>

            {error.message &&
              typeof error.message === 'string' &&
              !error.message.includes('License number already exists') && (
                <p className="text-red-500 text-xs italic">{error.message}</p>
              )}

            <div className="flex items-center justify-between mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-105"
                type="submit"
              >
                Create Driver Profile
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateDriver;
