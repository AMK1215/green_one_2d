import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Debug sidebar state
    console.log('Sidebar open:', sidebarOpen);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.hamburger')) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    // Don't show layout for login/register pages
    if (!isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {/* Navbar */}
            <Navbar 
                user={user} 
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                sidebarOpen={sidebarOpen}
            />

            {/* Sidebar */}
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} pt-16 pb-20 lg:ml-64`}>
                <div className="p-4 md:p-6">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <Footer />

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;
