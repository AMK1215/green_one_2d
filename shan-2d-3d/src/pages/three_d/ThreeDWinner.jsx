import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { IoWalletOutline } from "react-icons/io5";
import { FaPlus, FaTrophy } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import useFetch from '../../hooks/useFetch';
import CONFIG from '../../services/config';

const ThreeDWinner = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch 3D winners
  const { data: winners, loading, error } = useFetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.THREE_D_WINNERS}`);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      window.location.reload();
    }, 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSessionType = (timeString) => {
    const time = new Date(timeString);
    const hour = time.getHours();
    
    if (hour >= 0 && hour < 12) {
      return { type: 'Morning', color: 'text-blue-400' };
    } else {
      return { type: 'Evening', color: 'text-purple-400' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101223] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-white mt-4">Loading 3D Winners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101223] text-white p-4">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/3d')}
            className="text-yellow-400 hover:text-yellow-300"
          >
            ← Back to 3D
          </button>
          <h1 className="text-xl font-bold text-yellow-400">3D Winners</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
          >
            <MdRefresh className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex justify-around items-center bg-[#12486b] border-2 border-[#576265] rounded-3xl p-3">
          <IoWalletOutline className="w-6 h-6 text-white" />
          <span className="text-base font-medium">ပိုက်ဆံအိတ်</span>
          <span className="text-base font-bold font-['Lato']">
            {user?.balance ? `${user.balance.toLocaleString()} Kyats` : '0 Kyats'}
          </span>
          <button 
            onClick={() => navigate('/deposit')}
            className="bg-white text-[#12486b] p-2 rounded-full"
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Time */}
      <div className="max-w-md mx-auto mb-6">
        <div className="bg-[#1a1f35] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaTrophy className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-semibold text-yellow-400">3D Results</span>
          </div>
          <p className="text-white text-sm">Current Time: {formatTime(currentTime)}</p>
        </div>
      </div>

      {/* Winners List */}
      <div className="max-w-md mx-auto">
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Error loading winners: {error}</p>
            <button
              onClick={handleRefresh}
              className="bg-[#12486b] text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : !winners || winners.length === 0 ? (
          <div className="text-center py-8">
            <FaTrophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No 3D results available yet</p>
            <p className="text-sm text-gray-500">Results will be displayed here after the draw</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-yellow-400 mb-4">Recent 3D Results</h2>
            {winners.map((winner, index) => {
              const session = getSessionType(winner.draw_time);
              return (
                <div key={index} className="bg-[#1a1f35] rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-300">Draw Date: {formatDate(winner.draw_time)}</p>
                      <p className={`text-sm font-semibold ${session.color}`}>
                        {session.type} Session
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">Draw Time</p>
                      <p className="text-white font-semibold">
                        {new Date(winner.draw_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-300 mb-2">Winning Numbers:</p>
                    <div className="flex justify-center gap-2">
                      {winner.winning_numbers && winner.winning_numbers.split('').map((digit, digitIndex) => (
                        <div
                          key={digitIndex}
                          className="w-12 h-12 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xl font-bold"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-300">Total Winners:</p>
                      <p className="text-white font-semibold">{winner.total_winners || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Total Prize:</p>
                      <p className="text-green-400 font-semibold">
                        {winner.total_prize ? `${winner.total_prize.toLocaleString()} Kyats` : '0 Kyats'}
                      </p>
                    </div>
                  </div>

                  {winner.prize_per_winner && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <p className="text-sm text-gray-300">Prize per Winner:</p>
                      <p className="text-yellow-400 font-semibold">
                        {winner.prize_per_winner.toLocaleString()} Kyats
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="max-w-md mx-auto mt-8">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/3d')}
            className="bg-[#12486b] hover:bg-[#0d3a5a] text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Place 3D Bet
          </button>
          <button
            onClick={() => navigate('/3d/history')}
            className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            My History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreeDWinner;
