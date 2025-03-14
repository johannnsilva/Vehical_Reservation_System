/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './client';
import { UserDTO, LoginResponse, RegisterResponse, GetUserByIdResponse, RefreshTokenResponse, UpdatePasswordRequest, User } from '../types/user';

export const registerUser = async (userDTO: UserDTO): Promise<RegisterResponse> => {
    try {
        const response = await api.post('/auth/register', userDTO);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error registering user';
    }
};

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await api.post('/auth/login', null, {
            params: { username, password },
        });
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error logging in';
    }
};

export const refreshToken = async (refreshTokenValue: string): Promise<RefreshTokenResponse> => {
    try {
        const response = await api.post('/auth/refresh-token', { refreshToken: refreshTokenValue });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error refreshing token';
    }
};

export const getUserById = async (id: number): Promise<GetUserByIdResponse> => {
    try {
        const response = await api.get(`/auth/user/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching user details';
    }
};

export const updatePassword = async (updatePasswordRequest: UpdatePasswordRequest): Promise<void> => {
    try {
        await api.put('/auth/update-password', updatePasswordRequest);
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error updating password';
    }
};

export const fetchAllUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/auth/users');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error fetching users';
    }
};

export const updateUserStatus = async ({ userId, status }: { userId: number; status: 'active' | 'blocked' }): Promise<void> => {
    try {
        await api.put(`/auth/user/${userId}/status`, null, {
            params: { status }
        });
    } catch (error: any) {
        throw error.response?.data || error.message || 'Error updating user status';
    }
};
