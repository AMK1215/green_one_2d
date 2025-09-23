import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import apiService from '../services/apiService';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    user_name: '',
    phone: '',
    email: ''
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Fetch fresh user data from API
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setFetching(true);
      const response = await apiService.getUserData();
      console.log('Profile API response:', response);
      
      if (response.success && response.data) {
        // Handle the API response structure: { status, message, data: { user_data } }
        const userInfo = response.data.data || response.data;
        console.log('User data extracted:', userInfo);
        
        setUserData(userInfo);
        setFormData({
          name: userInfo.name || '',
          user_name: userInfo.user_name || '',
          phone: userInfo.phone || '',
          email: userInfo.email || ''
        });
      } else {
        console.error('API response not successful:', response);
        // Fallback to user data from auth context
        if (user) {
          console.log('Using fallback user data from auth context:', user);
          setUserData(user);
          setFormData({
            name: user.name || '',
            user_name: user.user_name || '',
            phone: user.phone || '',
            email: user.email || ''
          });
        } else {
          setError('Failed to load user data');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to user data from auth context
      if (user) {
        console.log('Using fallback user data from auth context due to error:', user);
        setUserData(user);
        setFormData({
          name: user.name || '',
          user_name: user.user_name || '',
          phone: user.phone || '',
          email: user.email || ''
        });
      } else {
        setError('Failed to load user data');
      }
    } finally {
      setFetching(false);
    }
  };

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

    try {
      const result = await authService.updateProfile(formData);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        updateUser({ ...user, ...formData });
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
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
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Profile</h2>
          <p className="text-gold text-sm md:text-base">Manage your account information</p>
        </div>

        {fetching ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* User Information Display */}
            <div className="glass-effect rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white text-xl font-bold mb-6">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">User ID</label>
                    <div className="text-white font-semibold">{userData?.id || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Username</label>
                    <div className="text-white font-semibold">{userData?.user_name || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Full Name</label>
                    <div className="text-white font-semibold">{userData?.name || 'N/A'}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Phone Number</label>
                    <div className="text-white font-semibold">{userData?.phone || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Email</label>
                    <div className="text-white font-semibold">{userData?.email || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Account Status</label>
                    <div className={`font-semibold ${userData?.status === 1 ? 'text-green-400' : 'text-red-400'}`}>
                      {userData?.status === 1 ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Balance Information */}
              <div className="mt-6 pt-6 border-t border-gray-700 border-opacity-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Current Balance</label>
                    <div className="text-2xl font-bold text-gold">
                      ${parseFloat(userData?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Main Balance</label>
                    <div className="text-2xl font-bold text-gold">
                      ${parseFloat(userData?.main_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Profile Form */}
            <div className="glass-effect rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white text-xl font-bold text-center mb-6">Update Profile</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:bg-gray-800 focus:bg-opacity-70 transition-all duration-300"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="user_name" className="block text-white text-sm font-medium mb-2">
                      Username <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="user_name"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:bg-gray-800 focus:bg-opacity-70 transition-all duration-300"
                      placeholder="Enter username"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:bg-gray-800 focus:bg-opacity-70 transition-all duration-300"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:bg-gray-800 focus:bg-opacity-70 transition-all duration-300"
                      placeholder="Enter email address"
                    />
                  </div>
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
                    'Update Profile'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
