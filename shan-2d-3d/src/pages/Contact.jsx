import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const result = await apiService.getContact();
      if (result.success) {
        setContactInfo(result.data);
      } else {
        setError(result.message || 'Failed to load contact information');
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
      setError('Failed to load contact information');
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
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Contact Support</h2>
          <p className="text-gold text-sm md:text-base">Get help when you need it</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="glass-effect rounded-xl p-6 max-w-2xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full"></div>
            </div>
          ) : contactInfo ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-white font-bold text-xl mb-2">Customer Support</h3>
              </div>
              
              <div className="space-y-4">
                {contactInfo.phone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                      <span className="text-black text-lg">📱</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Phone</p>
                      <p className="text-gold">{contactInfo.phone}</p>
                    </div>
                  </div>
                )}
                
                {contactInfo.email && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                      <span className="text-black text-lg">✉️</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <p className="text-gold">{contactInfo.email}</p>
                    </div>
                  </div>
                )}
                
                {contactInfo.address && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                      <span className="text-black text-lg">📍</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Address</p>
                      <p className="text-gold">{contactInfo.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📞</div>
              <p className="text-gray-300">Contact information not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
