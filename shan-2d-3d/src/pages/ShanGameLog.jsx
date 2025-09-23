import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const ShanGameLog = () => {
    const { user } = useAuth();
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, win, loss

    useEffect(() => {
        if (user?.user_name) {
            fetchGameLog();
        }
    }, [user]);

    const fetchGameLog = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiService.getShanGameLog(user.user_name);
            
            if (response.success && response.data) {
                setGameData(response.data);
            } else {
                setError('Failed to load game log data');
            }
        } catch (error) {
            console.error('Error fetching game log:', error);
            setError('An error occurred while loading game log');
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount) => {
        return parseFloat(amount.replace(/,/g, '')).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getStatusBadge = (status, settledStatus) => {
        if (settledStatus === 'settled_win') {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30">WIN</span>;
        } else if (settledStatus === 'settled_loss') {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30">LOSS</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-30">PENDING</span>;
        }
    };

    const filteredTransactions = () => {
        if (!gameData?.data?.transactions) return [];
        
        const transactions = gameData.data.transactions;
        if (filter === 'win') {
            return transactions.filter(t => t.settled_status === 'settled_win');
        } else if (filter === 'loss') {
            return transactions.filter(t => t.settled_status === 'settled_loss');
        }
        return transactions;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-400 text-lg mb-4">{error}</div>
                <button
                    onClick={fetchGameLog}
                    className="bg-gold hover:bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!gameData?.data) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No game log data available</div>
            </div>
        );
    }

    const { agent_info, date_info, today_summary, transactions } = gameData.data;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Shan Game Log</h1>
                <p className="text-gray-400">Today's gaming transactions and statistics</p>
            </div>

            {/* Date and Agent Info */}
            <div className="glass-effect rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-white font-semibold mb-2">Date</h3>
                        <p className="text-gray-300">{date_info.date}</p>
                        <p className="text-sm text-gray-400">{date_info.timezone}</p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-2">Agent</h3>
                        <p className="text-gray-300">{agent_info.agent_name}</p>
                        <p className="text-sm text-gray-400">Code: {agent_info.agent_code}</p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-2">Member Account</h3>
                        <p className="text-gray-300">{gameData.data.member_account}</p>
                    </div>
                </div>
            </div>

            {/* Today's Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-effect rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-gold mb-2">{today_summary.total_transactions}</div>
                    <div className="text-gray-400 text-sm">Total Transactions</div>
                </div>
                <div className="glass-effect rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">${formatAmount(today_summary.total_transaction_amount)}</div>
                    <div className="text-gray-400 text-sm">Total Transaction Amount</div>
                </div>
                <div className="glass-effect rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">${formatAmount(today_summary.total_bet_amount)}</div>
                    <div className="text-gray-400 text-sm">Total Bet Amount</div>
                </div>
                <div className="glass-effect rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">${formatAmount(today_summary.total_valid_amount)}</div>
                    <div className="text-gray-400 text-sm">Total Valid Amount</div>
                </div>
            </div>

            {/* Balance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-effect rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-gold mb-2">${formatAmount(today_summary.avg_before_balance)}</div>
                    <div className="text-gray-400 text-sm">Average Before Balance</div>
                </div>
                <div className="glass-effect rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-gold mb-2">${formatAmount(today_summary.avg_after_balance)}</div>
                    <div className="text-gray-400 text-sm">Average After Balance</div>
                </div>
            </div>

            {/* Filter and Transactions */}
            <div className="glass-effect rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Logs</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'all' 
                                    ? 'bg-gold text-gray-900' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('win')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'win' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Wins
                        </button>
                        <button
                            onClick={() => setFilter('loss')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'loss' 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Losses
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700 border-opacity-50">
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                                <th className="text-right py-3 px-4 text-gray-400 font-medium">Bet Amount</th>
                                <th className="text-right py-3 px-4 text-gray-400 font-medium">Transaction Amount</th>
                                <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions().map((transaction) => (
                                <tr key={transaction.id} className="border-b border-gray-700 border-opacity-30 hover:bg-gray-800 hover:bg-opacity-30">
                                    <td className="py-3 px-4 text-gray-300 text-sm">
                                        {formatDateTime(transaction.created_at)}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-300">
                                        ${formatAmount(transaction.bet_amount)}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-300">
                                        ${formatAmount(transaction.transaction_amount)}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {getStatusBadge(transaction.status, transaction.settled_status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredTransactions().length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No transactions found for the selected filter.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShanGameLog;
