import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const result = await apiService.getPromotions();
      console.log('Promotions API response:', result); // Added for debugging
      
      if (result.success && result.data) {
        // Handle different response formats
        let promotionsData = result.data;
        
        // If data is nested (e.g., { data: { promotions: [...] } })
        if (promotionsData.data && Array.isArray(promotionsData.data)) {
          promotionsData = promotionsData.data;
        }
        // If data is an object with a promotions property
        else if (promotionsData.promotions && Array.isArray(promotionsData.promotions)) {
          promotionsData = promotionsData.promotions;
        }
        // If data is already an array
        else if (Array.isArray(promotionsData)) {
          // Data is already an array, use as is
        }
        // If data is not an array, create empty array
        else {
          console.warn('Promotions data is not an array:', promotionsData);
          promotionsData = [];
        }
        
        setPromotions(promotionsData);
      } else {
        console.error('Promotions API response not successful:', result);
        setError(result.message || 'Failed to load promotions');
        setPromotions([]); // Ensure it's always an array
      }
    } catch (error) {
      console.error('Error loading promotions:', error);
      setError('Failed to load promotions');
      setPromotions([]); // Ensure it's always an array
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
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Promotions</h2>
          <p className="text-gold text-sm md:text-base">Special offers and bonuses</p>
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
          ) : !Array.isArray(promotions) || promotions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎁</div>
              <p className="text-gray-300">No promotions available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.isArray(promotions) && promotions.map((promotion, index) => (
                <div key={index} className="glass-effect rounded-lg p-6 card-hover">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">🎁</div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-2">{promotion.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{promotion.description}</p>
                      {promotion.bonus && (
                        <div className="text-gold font-bold text-lg mb-2">
                          Bonus: {promotion.bonus}
                        </div>
                      )}
                      {promotion.valid_until && (
                        <div className="text-gray-400 text-xs">
                          Valid until: {new Date(promotion.valid_until).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Promotions;
