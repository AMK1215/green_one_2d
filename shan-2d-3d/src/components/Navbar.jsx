import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const Navbar = ({ user, onMenuClick, sidebarOpen }) => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserBalance();
    }, [user]);

    const fetchUserBalance = async () => {
        try {
            setLoading(true);
            const response = await apiService.getUserData();
            console.log('Navbar API response:', response);
            
            if (response.success && response.data) {
                // Handle the API response structure: { status, message, data: { user_data } }
                const userInfo = response.data.data || response.data;
                console.log('Navbar user data extracted:', userInfo);
                
                if (userInfo.balance) {
                    setBalance(parseFloat(userInfo.balance));
                } else if (user) {
                    // Fallback to user data from auth context
                    setBalance(parseFloat(user.balance || 0));
                }
            } else {
                // Fallback to user data from auth context
                if (user) {
                    setBalance(parseFloat(user.balance || 0));
                }
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
            // Fallback to user data from auth context
            if (user) {
                setBalance(parseFloat(user.balance || 0));
            }
        } finally {
            setLoading(false);
        }
    };

    const formatBalance = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900 bg-opacity-95 backdrop-blur-md border-b border-gray-700 border-opacity-50">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Menu button and Site name */}
                    <div className="flex items-center">
                        <button
                            onClick={onMenuClick}
                            className="hamburger p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold transition-all duration-200"
                            aria-label="Toggle sidebar"
                        >
                            <svg
                                className={`h-6 w-6 transition-transform duration-200 ${sidebarOpen ? 'rotate-90' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <div className="ml-4">
                            <img 
                                src="/TemplateData/game_type/shan.jpg" 
                                alt="SKM Logo" 
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Center - Balance Display */}
                    <div className="flex-1 flex justify-center">
                        <div className="bg-gradient-to-r from-gold to-yellow-400 rounded-lg px-6 py-2 shadow-lg">
                            <div className="text-center">
                                <p className="text-xs text-gray-800 font-medium">Balance</p>
                                <div className="text-lg font-bold text-gray-900">
                                    {loading ? (
                                        <div className="animate-pulse">Loading...</div>
                                    ) : (
                                        `$${formatBalance(balance)}`
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - User info */}
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-white">
                                {user?.name || user?.user_name || 'Player'}
                            </p>
                            <p className="text-xs text-gray-400">
                                ID: {user?.id || 'N/A'}
                            </p>
                        </div>
                        
                        <div className="w-8 h-8 bg-gradient-to-r from-gold to-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-gray-900 font-bold text-sm">
                                {(user?.name || user?.user_name || 'P').charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
