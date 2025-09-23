import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const navigationItems = [
        {
            id: 'home',
            path: '/dashboard',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            label: 'Home'
        },
        {
            id: 'ads',
            path: '/promotions',
            icon: (
                <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full text-center" style={{fontSize: '8px'}}>
                        ADS
                    </div>
                </div>
            ),
            label: 'Promotions'
        },
        {
            id: 'announcements',
            path: '/announcements',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            ),
            label: 'Announcements'
        },
        {
            id: 'wallet',
            path: '/wallet',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            label: 'Wallet'
        },
        {
            id: 'logout',
            path: null,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            ),
            label: 'Logout',
            isLogout: true
        }
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gold to-yellow-400 border-t-2 border-b-2 border-gray-800 z-50">
            <div className="flex justify-around items-center py-2">
                {navigationItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => item.isLogout ? handleLogout() : navigate(item.path)}
                        className={`flex flex-col items-center justify-center p-2 transition-all duration-200 ${
                            item.isLogout 
                                ? 'text-red-600 hover:text-red-700 hover:scale-105' 
                                : isActive(item.path) 
                                    ? 'text-black scale-110 font-bold' 
                                    : 'text-black hover:text-gray-800 hover:scale-105'
                        }`}
                    >
                        <div className="mb-1">
                            {item.icon}
                        </div>
                        <span className="text-xs font-medium">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </footer>
    );
};

export default Footer;
