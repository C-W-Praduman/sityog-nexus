import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // In a real app, you might verify the token with the backend here
            // For now, we'll just parse the user from the token if you want, 
            // or trust the localStorage for initial load.
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        const { token, user } = response.data;
        
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
    };

    const register = async (name, email, password) => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password });
        return response.data; // Now returns { message: 'OTP sent...' }
    };

    const verifyOTP = async (email, otp) => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, { email, otp });
        return response.data;
    };

    const forgotPassword = async (email) => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
        return response.data;
    };

    const resetPassword = async (email, otp, newPassword) => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { email, otp, newPassword });
        return response.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser,
            token, 
            login, 
            register, 
            verifyOTP, 
            forgotPassword, 
            resetPassword, 
            logout, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
