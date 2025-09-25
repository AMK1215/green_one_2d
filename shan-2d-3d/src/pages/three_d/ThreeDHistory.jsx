import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { IoWalletOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import useFetch from '../../hooks/useFetch';
import CONFIG from '../../services/config';

const ThreeDHistory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch 3D bet history
  const { data: betHistory, loading, error } = useFetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.THREE_D_BET_SLIPS}`);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Force refresh by updating the URL or using a timestamp
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'won':
        return 'text-green-400';
      case 'lost':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'won':
        return 'အောင်မြင်ပါပြီ';
      case 'lost':
        return 'ရှုံးနိမ့်ပါပြီ';
      case 'pending':
        return 'စောင့်ဆိုင်းနေပါသည်';
      default:
        return 'မသိရသေးပါ';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101223] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-white mt-4">Loading 3D History...</p>
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
          <h1 className="text-xl font-bold text-yellow-400">3D History</h1>
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

      {/* Bet History */}
      <div className="max-w-md mx-auto">
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Error loading history: {error}</p>
            <button
              onClick={handleRefresh}
              className="bg-[#12486b] text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : !betHistory || betHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No 3D bet history found</p>
            <button
              onClick={() => navigate('/3d')}
              className="bg-[#12486b] text-white px-4 py-2 rounded-lg"
            >
              Start Betting
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-yellow-400 mb-4">Your 3D Bet History</h2>
            {betHistory.map((bet, index) => (
              <div key={index} className="bg-[#1a1f35] rounded-lg p-4 border border-gray-600">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-300">Slip No: {bet.slip_no}</p>
                    <p className="text-xs text-gray-400">{formatDate(bet.created_at)}</p>
                  </div>
                  <span className={`text-sm font-semibold ${getStatusColor(bet.status)}`}>
                    {getStatusText(bet.status)}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-300 mb-2">Numbers:</p>
                  <div className="flex flex-wrap gap-1">
                    {bet.numbers && bet.numbers.map((number, numIndex) => (
                      <span
                        key={numIndex}
                        className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold"
                      >
                        {number}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-300">Total Amount:</p>
                    <p className="text-white font-semibold">{bet.total_bet_amount?.toLocaleString()} Kyats</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Win Amount:</p>
                    <p className="text-green-400 font-semibold">
                      {bet.win_amount ? `${bet.win_amount.toLocaleString()} Kyats` : '0 Kyats'}
                    </p>
                  </div>
                </div>

                {bet.result && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <p className="text-sm text-gray-300">Result:</p>
                    <p className="text-white font-semibold">{bet.result}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDHistory;
