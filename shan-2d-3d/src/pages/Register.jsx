import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    phone: '',
    user_name: '',
    password: '',
    password_confirmation: '',
    payment_type: '',
    account_name: '',
    account_number: '',
    agent_referral_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate password confirmation
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        setSuccess(result.message || 'Registration successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="glass-effect rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/TemplateData/shan.jpg" 
            alt="GoldenMM Logo" 
            className="w-20 h-20 rounded-full border-4 border-gold mx-auto mb-4"
          />
          <h1 className="text-white text-2xl font-bold mb-2">GoldenMM</h1>
          <p className="text-gold text-sm">Create Your Account</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label htmlFor="user_name" className="block text-white text-sm font-medium mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
              placeholder="Enter full name"
            />
          </div>

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
              placeholder="Enter password"
            />
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-white text-sm font-medium mb-2">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
              placeholder="Confirm password"
            />
          </div>

          <div>
            <label htmlFor="payment_type" className="block text-white text-sm font-medium mb-2">
              Payment Type <span className="text-red-400">*</span>
            </label>
            <select
              id="payment_type"
              name="payment_type"
              value={formData.payment_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:border-gold transition-all duration-300"
            >
              <option value="" className="bg-gray-800">Select payment type</option>
              <option value="bank" className="bg-gray-800">Bank Transfer</option>
              <option value="mobile" className="bg-gray-800">Mobile Payment</option>
              <option value="cash" className="bg-gray-800">Cash</option>
            </select>
          </div>

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

          <div>
            <label htmlFor="agent_referral_code" className="block text-white text-sm font-medium mb-2">
              Agent Referral Code
            </label>
            <input
              type="text"
              id="agent_referral_code"
              name="agent_referral_code"
              value={formData.agent_referral_code}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
              placeholder="Enter agent referral code (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gold focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-300 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-yellow-300 transition-colors duration-300 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
