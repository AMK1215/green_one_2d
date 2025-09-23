import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const ShanGame = () => {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const gameData = {
        product_code: 100200,
        game_type: 'Shan'
      };

      if (nickname.trim()) {
        gameData.nickname = nickname.trim();
      }

      const result = await apiService.launchShanGame(gameData);
      
      if (result.success && result.data.url) {
        setSuccess('Game launched successfully! Redirecting...');
        
        // Open game in new window/tab
        setTimeout(() => {
          window.open(result.data.url, '_blank');
        }, 1500);
      } else {
        setError(result.message || 'Failed to launch game');
      }
    } catch (error) {
      console.error('Game launch error:', error);
      setError('An error occurred while launching the game. Please try again.');
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
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Shan Game</h2>
          <p className="text-gold text-sm md:text-base">Launch your favorite Shan games</p>
        </div>

        {/* Game Launch Form */}
        <div className="glass-effect rounded-2xl p-6 md:p-8 shadow-2xl max-w-md mx-auto">
          <h3 className="text-white text-xl font-bold text-center mb-6">Launch Game</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Code (Fixed) */}
            <div>
              <label htmlFor="product_code" className="block text-white text-sm font-medium mb-2">
                Product Code
              </label>
              <input 
                type="number" 
                id="product_code" 
                value="100200"
                readOnly
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-gold border-opacity-50 rounded-lg text-gold font-medium cursor-not-allowed"
              />
              <p className="text-gray-400 text-xs mt-1">Fixed value for Shan games</p>
            </div>

            {/* Game Type (Fixed) */}
            <div>
              <label htmlFor="game_type" className="block text-white text-sm font-medium mb-2">
                Game Type
              </label>
              <input 
                type="text" 
                id="game_type" 
                value="Shan"
                readOnly
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-gold border-opacity-50 rounded-lg text-gold font-medium cursor-not-allowed"
              />
              <p className="text-gray-400 text-xs mt-1">Fixed value for Shan games</p>
            </div>

            {/* Nickname (Optional) */}
            <div>
              <label htmlFor="nickname" className="block text-white text-sm font-medium mb-2">
                Nickname (Optional)
              </label>
              <input 
                type="text" 
                id="nickname" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-all duration-300"
                placeholder="Enter your nickname"
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

            {/* Launch Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full gold-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gold focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Launching...
                </div>
              ) : (
                'Launch Game'
              )}
            </button>
          </form>
        </div>

        {/* Game Information */}
        <div className="glass-effect rounded-xl p-6 mt-8 max-w-2xl mx-auto">
          <h3 className="text-white font-bold text-lg mb-4">Game Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Current Balance:</span>
              <span className="text-gold font-medium">
                {user?.balanceFloat ? `${user.balanceFloat.toLocaleString()} MMK` : '0 MMK'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Username:</span>
              <span className="text-white font-medium">{user?.user_name || 'User'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Game Status:</span>
              <span className="text-green-400 font-medium">Ready to Play</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Provider:</span>
              <span className="text-white font-medium">Shan Gaming</span>
            </div>
          </div>
        </div>

        {/* Game Information Card */}
        <div className="mt-8">
          <div className="glass-effect rounded-xl p-6 max-w-md mx-auto text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-white font-bold text-lg mb-2">Shan Gaming Platform</h3>
            <p className="text-gold text-sm mb-4">Product Code: 100200 | Game Type: Shan</p>
            <p className="text-gray-300 text-xs">Click "Launch Game" to start playing with your current balance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShanGame;
