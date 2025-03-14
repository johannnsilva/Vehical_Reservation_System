/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const clearAuthAndRedirect = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Add any other auth-related items you need to clear
    window.location.href = '/login';
};

api.interceptors.request.use(
    (config: any) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: any) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Only attempt refresh once and only if it's a 401 error
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    clearAuthAndRedirect();
                    return Promise.reject(error);
                }

                // Create a new axios instance without interceptors for refresh token request
                const response = await axios.post(`${baseURL}/auth/refresh-token`, {
                    refreshToken: refreshToken
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const newAccessToken = response.data.accessToken;
                if (!newAccessToken) {
                    throw new Error('No access token received');
                }
                localStorage.setItem('accessToken', newAccessToken);

                // Update the original request with new access token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                clearAuthAndRedirect();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;