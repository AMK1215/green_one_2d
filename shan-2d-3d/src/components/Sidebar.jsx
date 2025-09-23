import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const location = useLocation();

    const navigationItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
        { name: '2D Lottery', path: '/2d', icon: '🎯' },
        { name: 'Deposit', path: '/deposit', icon: '💰' },
        { name: 'Withdraw', path: '/withdraw', icon: '💸' },
        { name: 'Profile', path: '/profile', icon: '👤' },
        { name: 'Transactions', path: '/transactions', icon: '📊' },
        { name: 'Shan Game Log', path: '/shan-game-log', icon: '🎮' },
        { name: '2D Winners', path: '/2d/daily-winner', icon: '🏆' },
        { name: '2D History', path: '/morning-bet-slip', icon: '📋' },
        { name: 'Banks', path: '/banks', icon: '🏦' },
        { name: 'Contact', path: '/contact', icon: '📞' },
        { name: 'Promotions', path: '/promotions', icon: '🎁' },
    ];

    const handleLogout = () => {
        logout();
        onClose();
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div className={`sidebar fixed top-0 left-0 h-full w-64 bg-gray-900 bg-opacity-95 backdrop-blur-md border-r border-gray-700 border-opacity-50 transform transition-transform duration-300 ease-in-out z-40 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 lg:hidden"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div className="flex flex-col h-full pt-16">
                    {/* Navigation Items */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    isActive(item.path)
                                        ? 'bg-gold bg-opacity-20 text-gold border border-gold border-opacity-30'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <span className="text-lg mr-3">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                        
                        {/* Logout Button - positioned after Promotions */}
                        <div className="mt-4 pt-4 border-t border-gray-700 border-opacity-50">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900 hover:bg-opacity-20 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-400 border-opacity-30 hover:border-opacity-50"
                            >
                                <span className="text-lg mr-3">🚪</span>
                                Logout
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
