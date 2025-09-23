import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
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
    if (formData.new_password !== formData.new_password_confirmation) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation
      });
      
      if (result.success) {
        setSuccess('Password changed successfully!');
        setFormData({
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        });
      } else {
        setError(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
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

      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Change Password</h2>
          <p className="text-gold text-sm md:text-base">Update your account security</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 md:p-8 shadow-2xl max-w-md mx-auto">
          <h3 className="text-white text-xl font-bold text-center mb-6">Update Password</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="current_password" className="block text-white text-sm font-medium mb-2">
                Current Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label htmlFor="new_password" className="block text-white text-sm font-medium mb-2">
                New Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="new_password_confirmation" className="block text-white text-sm font-medium mb-2">
                Confirm New Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                id="new_password_confirmation"
                name="new_password_confirmation"
                value={formData.new_password_confirmation}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
                placeholder="Confirm new password"
              />
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gold focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Updating...
                </div>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
