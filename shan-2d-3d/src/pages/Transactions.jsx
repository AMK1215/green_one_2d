import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const Transactions = () => {
  const [depositLogs, setDepositLogs] = useState([]);
  const [withdrawLogs, setWithdrawLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('deposits');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTransactionLogs();
  }, []);

  const loadTransactionLogs = async () => {
    setLoading(true);
    try {
      const [depositResult, withdrawResult] = await Promise.all([
        apiService.getDepositLogs(),
        apiService.getWithdrawLogs()
      ]);

      if (depositResult.success) {
        setDepositLogs(depositResult.data || []);
      }

      if (withdrawResult.success) {
        setWithdrawLogs(withdrawResult.data || []);
      }
    } catch (error) {
      console.error('Error loading transaction logs:', error);
      setError('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'rejected':
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const renderTransactionList = (transactions, type) => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-300">No {type} transactions found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div key={index} className="glass-effect rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-white font-medium">
                  {type === 'deposit' ? '💰 Deposit' : '💸 Withdrawal'}
                </h4>
                <p className="text-gray-300 text-sm">
                  {formatDate(transaction.created_at)}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                  {type === 'deposit' ? '+' : '-'}{transaction.amount ? transaction.amount.toLocaleString() : '0'} MMK
                </div>
                <div className={`text-sm ${getStatusColor(transaction.status)}`}>
                  {transaction.status || 'Pending'}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {transaction.reference_number && (
                <div>
                  <span className="text-gray-400">Reference:</span>
                  <span className="text-white ml-2">{transaction.reference_number}</span>
                </div>
              )}
              {transaction.payment_method && (
                <div>
                  <span className="text-gray-400">Method:</span>
                  <span className="text-white ml-2">{transaction.payment_method}</span>
                </div>
              )}
              {transaction.account_name && (
                <div>
                  <span className="text-gray-400">Account:</span>
                  <span className="text-white ml-2">{transaction.account_name}</span>
                </div>
              )}
              {transaction.account_number && (
                <div>
                  <span className="text-gray-400">Account #:</span>
                  <span className="text-white ml-2">{transaction.account_number}</span>
                </div>
              )}
            </div>

            {transaction.notes && (
              <div className="mt-2 pt-2 border-t border-white border-opacity-10">
                <span className="text-gray-400 text-sm">Notes:</span>
                <p className="text-white text-sm mt-1">{transaction.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Top Navigation Bar */}
      <nav className="bg-transparent">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <img 
              src="/TemplateData/shan.jpg" 
              alt="GoldenMM Logo" 
              className="w-10 h-10 rounded-full border-2 border-gold"
            />
            <h1 className="text-white font-bold text-lg md:text-xl">GoldenMM</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white hover:text-gold transition-colors duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Transaction History</h2>
          <p className="text-gold text-sm md:text-base">View your deposit and withdrawal history</p>
        </div>

        {/* Balance Card */}
        <div className="glass-effect rounded-xl p-6 mb-8 max-w-md mx-auto">
          <div className="text-center">
            <h3 className="text-white text-lg font-bold mb-2">Current Balance</h3>
            <div className="text-2xl font-bold text-gold">
              {user?.balanceFloat ? `${user.balanceFloat.toLocaleString()} MMK` : '0 MMK'}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="glass-effect rounded-xl p-6 max-w-4xl mx-auto">
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('deposits')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'deposits'
                  ? 'gold-gradient text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Deposits ({depositLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'withdrawals'
                  ? 'gold-gradient text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Withdrawals ({withdrawLogs.length})
            </button>
          </div>

          {/* Transaction Lists */}
          <div className="min-h-[400px]">
            {activeTab === 'deposits' && renderTransactionList(depositLogs, 'deposit')}
            {activeTab === 'withdrawals' && renderTransactionList(withdrawLogs, 'withdrawal')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
