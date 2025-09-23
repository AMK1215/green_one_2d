import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const Withdraw = () => {
  const [formData, setFormData] = useState({
    payment_method: '',
    account_name: '',
    account_number: '',
    amount: '',
    password: ''
  });
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickAmounts = [10000, 25000, 50000, 100000, 200000, 500000];

  useEffect(() => {
    loadPaymentTypes();
  }, []);

  const loadPaymentTypes = async () => {
    try {
      const result = await apiService.getPaymentTypes();
      console.log('Payment types result:', result);
      if (result.success) {
        // Handle different response formats
        const data = result.data;
        if (Array.isArray(data)) {
          setPaymentTypes(data);
        } else if (data && Array.isArray(data.data)) {
          setPaymentTypes(data.data);
        } else {
          setPaymentTypes([]);
        }
      } else {
        setPaymentTypes([]);
      }
    } catch (error) {
      console.error('Error loading payment types:', error);
      setPaymentTypes([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuickAmount = (amount) => {
    setFormData({
      ...formData,
      amount: amount.toString()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await apiService.withdraw(formData);
      
      if (result.success) {
        setSuccess('Withdrawal request submitted successfully!');
        setFormData({
          payment_method: '',
          account_name: '',
          account_number: '',
          amount: '',
          password: ''
        });
      } else {
        setError(result.message || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Withdraw Funds</h2>
          <p className="text-gold text-sm md:text-base">Cash out your winnings</p>
        </div>

        {/* Balance Card */}
        <div className="glass-effect rounded-xl p-6 mb-8 max-w-md mx-auto">
          <div className="text-center">
            <h3 className="text-white text-lg font-bold mb-2">Available Balance</h3>
            <div className="text-2xl font-bold text-gold">
              {user?.balanceFloat ? `${user.balanceFloat.toLocaleString()} MMK` : '0 MMK'}
            </div>
          </div>
        </div>

        {/* Withdraw Form */}
        <div className="glass-effect rounded-2xl p-6 md:p-8 shadow-2xl max-w-md mx-auto">
          <h3 className="text-white text-xl font-bold text-center mb-6">Withdrawal Request</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Payment Method */}
            <div>
              <label htmlFor="payment_method" className="block text-white text-sm font-medium mb-2">
                Payment Method <span className="text-red-400">*</span>
              </label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:border-gold transition-all duration-300"
              >
                <option value="" className="bg-gray-800">Select payment method</option>
                {Array.isArray(paymentTypes) && paymentTypes.map((type) => (
                  <option key={type.id} value={type.id} className="bg-gray-800">
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Name */}
            <div>
              <label htmlFor="account_name" className="block text-white text-sm font-medium mb-2">
                Account Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="account_name"
                name="account_name"
                value={formData.account_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
                placeholder="Enter account name"
              />
            </div>

            {/* Account Number */}
            <div>
              <label htmlFor="account_number" className="block text-white text-sm font-medium mb-2">
                Account Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="account_number"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
                placeholder="Enter account number"
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-white text-sm font-medium mb-2">
                Amount (MMK) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="1000"
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
                placeholder="Enter amount"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Quick Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickAmount(amount)}
                    className="px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white text-sm hover:bg-opacity-20 transition-all duration-300"
                  >
                    {amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gold focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Submit Withdrawal Request'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
