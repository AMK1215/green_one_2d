import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            if (authService.isAuthenticated()) {
                const userData = authService.getCurrentUserData();
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials, rememberMe = false) => {
        setLoading(true);
        try {
            const result = await authService.login(credentials, rememberMe);
            if (result.success) {
                setUser(result.data.user);
                setIsAuthenticated(true);
                return result;
            }
            return result;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const result = await authService.register(userData);
            return result;
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };