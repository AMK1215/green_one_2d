import CONFIG from './config.js';

class AuthService {
    constructor() {
        this.API_BASE_URL = CONFIG.API_BASE_URL;
        this.token = localStorage.getItem(CONFIG.AUTH.TOKEN_KEY);
        this.user = this.getStoredUser();
    }

    // Check if user is authenticated
    isAuthenticated() {
        if (!this.token) return false;
        
        // Check if token is expired
        const userData = this.getStoredUser();
        if (!userData) return false;
        
        const now = new Date().getTime();
        const tokenTime = userData.tokenTime || 0;
        const sessionTimeout = userData.sessionTimeout || CONFIG.AUTH.SESSION_TIMEOUT;
        
        if (now - tokenTime > sessionTimeout) {
            this.logout();
            return false;
        }
        
        return true;
    }

    // Get stored user data
    getStoredUser() {
        try {
            const userData = localStorage.getItem(CONFIG.AUTH.USER_DATA_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    // Get current user data
    getCurrentUserData() {
        return this.getStoredUser();
    }

    // Login
    async login(credentials, rememberMe = false) {
        try {
            console.log('Login attempt with credentials:', credentials);
            console.log('API URL:', `${this.API_BASE_URL}${CONFIG.ENDPOINTS.LOGIN}`);
            
            const response = await fetch(`${this.API_BASE_URL}${CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                // Handle different response structures
                let token, user;
                
                if (data.success && data.data) {
                    // Standard response format
                    token = data.data.token;
                    user = data.data.user;
                } else if (data.status && data.data) {
                    // API response format with status field
                    token = data.data.token;
                    user = data.data.user;
                } else if (data.token && data.user) {
                    // Direct response format
                    token = data.token;
                    user = data.user;
                } else if (data.access_token) {
                    // Alternative token format
                    token = data.access_token;
                    user = data.user || data;
                } else {
                    console.log('Unexpected response format:', data);
                    return { success: false, message: 'Invalid response format', errors: data.errors };
                }
                
                this.token = token;
                const userData = {
                    ...user,
                    tokenTime: new Date().getTime(),
                    rememberMe: rememberMe
                };
                
                // Set session timeout based on remember me
                const sessionTimeout = rememberMe ? 30 * 24 * 60 * 60 * 1000 : CONFIG.AUTH.SESSION_TIMEOUT; // 30 days or 24 hours
                userData.sessionTimeout = sessionTimeout;
                
                localStorage.setItem(CONFIG.AUTH.TOKEN_KEY, this.token);
                localStorage.setItem(CONFIG.AUTH.USER_DATA_KEY, JSON.stringify(userData));
                this.user = userData;
                
                console.log('Login successful, user data:', userData);
                return { success: true, data: { token, user } };
            } else {
                console.log('Login failed:', data);
                return { success: false, message: data.message || 'Login failed', errors: data.errors };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Register
    async register(userData) {
        try {
            const response = await fetch(`${this.API_BASE_URL}${CONFIG.ENDPOINTS.REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                return { success: true, message: data.message || 'Registration successful' };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Logout
    async logout() {
        try {
            if (this.token) {
                await fetch(`${this.API_BASE_URL}${CONFIG.ENDPOINTS.LOGOUT}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/json',
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.token = null;
            this.user = null;
            localStorage.removeItem(CONFIG.AUTH.TOKEN_KEY);
            localStorage.removeItem(CONFIG.AUTH.USER_DATA_KEY);
        }
    }

    // Get user info
    async getUserInfo() {
        try {
            const response = await fetch(`${this.API_BASE_URL}${CONFIG.ENDPOINTS.USER}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const userData = {
                    ...data.data,
                    tokenTime: new Date().getTime()
                };
                localStorage.setItem(CONFIG.AUTH.USER_DATA_KEY, JSON.stringify(userData));
                this.user = userData;
                return { success: true, data: data.data };
            } else {
                return { success: false, message: data.message || 'Failed to get user info' };
            }
        } catch (error) {
            console.error('Get user info error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Change password
    async changePassword(passwordData) {
        try {
            const response = await fetch(`${this.API_BASE_URL}${CONFIG.ENDPOINTS.CHANGE_PASSWORD}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(passwordData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                return { success: true, message: data.message || 'Password changed successfully' };
            } else {
                return { success: false, message: data.message || 'Failed to change password' };
            }
        } catch (error) {
            console.error('Change password error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Update profile
    async updateProfile(profileData) {
        try {
            const response = await fetch(`${this.API_BASE_URL}${CONFIG.ENDPOINTS.PROFILE}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const userData = {
                    ...this.user,
                    ...data.data,
                    tokenTime: new Date().getTime()
                };
                localStorage.setItem(CONFIG.AUTH.USER_DATA_KEY, JSON.stringify(userData));
                this.user = userData;
                return { success: true, message: data.message || 'Profile updated successfully' };
            } else {
                return { success: false, message: data.message || 'Failed to update profile' };
            }
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Get auth headers
    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json',
        };
    }
}

export default new AuthService();
