import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const ShanLaunchGame = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        nickname: ''
    });
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch fresh user data from API
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setFetching(true);
            const response = await apiService.getUserData();
            console.log('ShanLaunchGame API response:', response);
            
            if (response.success && response.data) {
                // Handle the API response structure: { status, message, data: { user_data } }
                const userInfo = response.data.data || response.data;
                console.log('ShanLaunchGame user data extracted:', userInfo);
                setUserData(userInfo);
            } else {
                // Fallback to user data from auth context
                if (user) {
                    setUserData(user);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to user data from auth context
            if (user) {
                setUserData(user);
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

    const showAlert = (message, type = 'error') => {
        if (type === 'success') {
            setSuccess(message);
            setError('');
        } else {
            setError(message);
            setSuccess('');
        }
        
        // Auto clear after 5 seconds
        setTimeout(() => {
            setError('');
            setSuccess('');
        }, 5000);
    };

    const launchGame = async (gameData) => {
        try {
            const result = await apiService.launchShanGame(gameData);
            
            if (result.success && result.data.url) {
                showAlert('Game launched successfully! Redirecting...', 'success');
                
                // Redirect to game URL in same window
                setTimeout(() => {
                    window.location.href = result.data.url;
                }, 1500);
            } else {
                showAlert(result.message || 'Failed to launch game', 'error');
            }
        } catch (error) {
            console.error('Game launch error:', error);
            showAlert('An error occurred while launching the game. Please try again.', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const gameData = {
            product_code: 100200,
            game_type: 'Shan'
        };

        if (formData.nickname.trim()) {
            gameData.nickname = formData.nickname.trim();
        }

        await launchGame(gameData);
        setLoading(false);
    };

    const quickLaunch = () => {
        const gameData = {
            product_code: 100200,
            game_type: 'Shan'
        };

        if (formData.nickname.trim()) {
            gameData.nickname = formData.nickname.trim();
        }

        setLoading(true);
        launchGame(gameData).finally(() => setLoading(false));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Shan Game</h1>
                <p className="text-gray-400">Launch your favorite Shan games</p>
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
                            name="product_code" 
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
                            name="game_type" 
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
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:bg-gray-800 focus:bg-opacity-70 transition-all duration-300"
                            placeholder="Enter your nickname"
                        />
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-sm">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{success}</span>
                            </div>
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
            <div className="glass-effect rounded-xl p-6 max-w-2xl mx-auto">
                <h3 className="text-white font-bold text-lg mb-4">Game Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-300">Current Balance:</span>
                        <span className="text-white font-medium">
                            {fetching ? (
                                <span className="animate-pulse">Loading...</span>
                            ) : userData?.balance ? (
                                `${parseFloat(userData.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })} MMK`
                            ) : (
                                '0 MMK'
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Username:</span>
                        <span className="text-white font-medium">
                            {userData?.user_name || user?.user_name || 'User'}
                        </span>
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
            <div className="glass-effect rounded-xl p-6 max-w-md mx-auto text-center">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-white font-bold text-lg mb-2">Shan Gaming Platform</h3>
                <p className="text-gold text-sm mb-4">Product Code: 100200 | Game Type: Shan</p>
                <p className="text-gray-300 text-xs">Click "Launch Game" to start playing with your current balance</p>
            </div>
        </div>
    );
};

export default ShanLaunchGame;
