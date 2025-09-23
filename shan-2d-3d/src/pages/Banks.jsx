import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const Banks = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      const result = await apiService.getBanks();
      if (result.success) {
        setBanks(result.data || []);
      } else {
        setError(result.message || 'Failed to load banks');
      }
    } catch (error) {
      console.error('Error loading banks:', error);
      setError('Failed to load banks');
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
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Available Banks</h2>
          <p className="text-gold text-sm md:text-base">Supported payment methods</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="glass-effect rounded-xl p-6 max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full"></div>
            </div>
          ) : banks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏦</div>
              <p className="text-gray-300">No banks available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banks.map((bank, index) => (
                <div key={index} className="glass-effect rounded-lg p-4 card-hover">
                  <h3 className="text-white font-bold text-lg mb-2">{bank.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">{bank.description}</p>
                  <div className="text-gold text-sm">Status: {bank.status || 'Active'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banks;
