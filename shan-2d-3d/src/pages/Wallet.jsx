import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const Wallet = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await apiService.getUserData();
            console.log('Wallet API response:', response);

            if (response.success && response.data) {
                const userInfo = response.data.data || response.data;
                console.log('Wallet user data extracted:', userInfo);
                setUserData(userInfo);
            } else {
                if (user) {
                    setUserData(user);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (user) {
                setUserData(user);
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

    const quickActions = [
        {
            id: 'deposit',
            title: 'Deposit',
            icon: '💰',
            color: 'from-green-500 to-green-600',
            path: '/deposit'
        },
        {
            id: 'withdraw',
            title: 'Withdraw',
            icon: '💸',
            color: 'from-blue-500 to-blue-600',
            path: '/withdraw'
        },
        {
            id: 'transactions',
            title: 'Transactions',
            icon: '📊',
            color: 'from-purple-500 to-purple-600',
            path: '/transactions'
        },
        {
            id: 'transfer',
            title: 'Transfer',
            icon: '🔄',
            color: 'from-orange-500 to-orange-600',
            path: '/transfer'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">My Wallet</h1>
                <p className="text-gray-400">Manage your funds and transactions</p>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-gray-900 shadow-2xl">
                <div className="text-center">
                    <h2 className="text-lg font-semibold mb-2">Total Balance</h2>
                    {loading ? (
                        <div className="animate-pulse">
                            <div className="h-12 bg-gray-300 rounded-lg mb-2"></div>
                        </div>
                    ) : (
                        <div className="text-4xl font-bold">
                            ${formatBalance(parseFloat(userData?.balance || 0))}
                        </div>
                    )}
                    <p className="text-sm opacity-75 mt-2">Available for gaming</p>
                </div>
            </div>

            {/* Balance Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700 border-opacity-50">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-white mb-2">Main Balance</h3>
                        {loading ? (
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-600 rounded"></div>
                            </div>
                        ) : (
                            <div className="text-2xl font-bold text-gold">
                                ${formatBalance(parseFloat(userData?.main_balance || 0))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700 border-opacity-50">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-white mb-2">Account Status</h3>
                        <div className={`text-lg font-bold ${userData?.status === 1 ? 'text-green-400' : 'text-red-400'}`}>
                            {userData?.status === 1 ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => window.location.href = action.path}
                            className={`bg-gradient-to-br ${action.color} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                        >
                            <div className="text-center">
                                <div className="text-3xl mb-2">{action.icon}</div>
                                <div className="font-semibold">{action.title}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Transactions Preview */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 border-opacity-50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                    <button 
                        onClick={() => window.location.href = '/transactions'}
                        className="text-gold hover:text-yellow-300 text-sm font-medium"
                    >
                        View All
                    </button>
                </div>
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-400">No recent transactions</p>
                    <p className="text-gray-500 text-sm">Your transaction history will appear here</p>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
