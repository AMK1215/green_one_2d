import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import apiService from '../services/apiService';
import { Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Deposit = () => {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState('');
  const [refrence_no, setRefrence_no] = useState('');
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const languageContext = useContext(LanguageContext);
  
  // Add error handling for missing context
  if (!languageContext) {
    console.error('Deposit must be used within a LanguageProvider');
    return <div>Loading...</div>;
  }
  
  const { t } = languageContext;

  useEffect(() => {
    loadBanks();
    fetchUserBalance();
  }, [user]);

  useEffect(() => {
    if (banks && banks.length > 0) {
      setSelectedBank(banks[0]);
    }
  }, [banks]);

  const fetchUserBalance = async () => {
    try {
      setBalanceLoading(true);
      const response = await apiService.getUserData();
      console.log('Deposit page API response:', response);
      
      if (response.success && response.data) {
        // Handle the API response structure: { status, message, data: { user_data } }
        const userInfo = response.data.data || response.data;
        console.log('Deposit page user data extracted:', userInfo);
        
        if (userInfo.balance) {
          setBalance(parseFloat(userInfo.balance));
        } else if (user) {
          // Fallback to user data from auth context
          setBalance(parseFloat(user.balance || 0));
        }
      } else {
        // Fallback to user data from auth context
        if (user) {
          setBalance(parseFloat(user.balance || 0));
        }
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      // Fallback to user data from auth context
      if (user) {
        setBalance(parseFloat(user.balance || 0));
      }
    } finally {
      setBalanceLoading(false);
    }
  };

  const loadBanks = async () => {
    try {
      const result = await apiService.getBanks();
      console.log('Banks result:', result);
      if (result.success) {
        // Handle different response formats
        const data = result.data;
        if (Array.isArray(data)) {
          setBanks(data);
        } else if (data && Array.isArray(data.data)) {
          setBanks(data.data);
        } else {
          setBanks([]);
        }
      } else {
        setBanks([]);
      }
    } catch (error) {
      console.error('Error loading banks:', error);
      setBanks([]);
    }
  };

  const handleCopyText = (e) => {
    e.preventDefault();
    if (selectedBank?.account_number) {
      navigator.clipboard.writeText(selectedBank.account_number);
      toast.success('Copied to clipboard');
    }
  };

  const deposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const inputData = {
        'agent_payment_type_id': selectedBank?.id,
        amount,
        refrence_no
      };

      const result = await apiService.deposit(inputData);
      
      if (result.success) {
        toast.success('Deposit successfully');
        setAmount('');
        setRefrence_no('');
        navigate('/information?tab=logs&type=deposit');
      } else {
        setError(result.message || 'Failed to submit deposit request');
        toast.error(result.message || 'Failed to submit deposit request');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <ToastContainer />
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
      <div className="container mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">{t('deposit')}</h2>
          <p className="text-white text-sm md:text-base opacity-90">{t('add_money_to_account')}</p>
        </div>

        {/* Balance Card */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-gold to-yellow-400 rounded-lg px-6 py-4 shadow-lg">
            <div className="text-center">
              <p className="text-xs text-gray-800 font-medium">{t('current_balance')}</p>
              <div className="text-2xl font-bold text-gray-900">
                {balanceLoading ? (
                  <div className="animate-pulse">Loading...</div>
                ) : (
                  `${balance.toLocaleString()} MMK`
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Form */}
        <div className="glass-effect rounded-2xl p-6 md:p-8 shadow-2xl max-w-md mx-auto">
          <form onSubmit={deposit} className="space-y-6">
            {/* Header with Choose Bank Button */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-bold">{t('deposit')}</h3>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition-all duration-300 font-bold shadow-lg border-2 border-gold"
                onClick={() => setShow(true)}
              >
                {t('select_bank')}
              </button>
            </div>

            {/* Selected Bank Display */}
            {selectedBank ? (
              <div className="bg-gold/10 border-2 border-gold rounded-xl p-4 mb-6 shadow-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gold/30 flex items-center justify-center shadow-md">
                      {selectedBank.image ? (
                        <img
                          className="w-10 h-10 rounded-lg object-cover"
                          src={"https://tttgamingmm.site" + selectedBank.image}
                          alt={selectedBank.payment_type}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center text-black font-bold text-sm shadow-md" style={{ display: selectedBank.image ? 'none' : 'flex' }}>
                        {selectedBank.payment_type?.charAt(0) || 'B'}
                      </div>
                    </div>
                    <div>
                      <h6 className="font-bold text-white text-sm">{selectedBank.payment_type}</h6>
                      <h6 className="font-bold text-gold text-sm">{selectedBank.account_number}</h6>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition-all duration-300 font-bold shadow-md border-2 border-gold"
                    onClick={handleCopyText}
                  >
                    Copy
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 mb-6">
                <p className="text-red-300 text-sm text-center font-medium">Please select a bank to continue</p>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-white text-sm font-bold">{t('deposit_amount')} (MMK) <span className="text-red-400">*</span></label>
              <input
                type="number"
                className="w-full px-4 py-4 bg-white/20 border-2 border-gold/50 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:border-gold focus:bg-white/30 transition-all duration-300 text-lg font-medium"
                placeholder="Enter amount"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                min="1000"
                required
              />
              {error?.amount && <span className='text-red-400 text-sm font-medium'>*{error.amount}</span>}
              {error && <span className='text-red-400 text-sm font-medium'>*{error}</span>}
            </div>

            {/* Reference Input */}
            <div className="space-y-2">
              <label className="block text-white text-sm font-bold">{t('reference_number')} <span className="text-red-400">*</span></label>
              <input
                type="text"
                className="w-full px-4 py-4 bg-white/20 border-2 border-gold/50 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:border-gold focus:bg-white/30 transition-all duration-300 text-lg font-medium"
                placeholder="Enter last 6 digits of receipt"
                onChange={(e) => setRefrence_no(e.target.value)}
                value={refrence_no}
                required
              />
              {error?.refrence_no && <span className='text-red-400 text-sm font-medium'>*{error.refrence_no}</span>}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type='submit'
                className="w-full py-4 bg-gradient-to-r from-gold to-yellow-400 text-black rounded-xl font-black text-lg hover:from-gold/90 hover:to-yellow-400/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                disabled={loading || !selectedBank}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Spinner animation='border' size='sm' className="mr-2" />
                    Processing...
                  </div>
                ) : (
                  t('submit_deposit')
                )}
              </button>
            </div>
          </form>

          {/* Bank Selection Modal */}
          {show && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 relative border border-gold/30">
                <div className="text-center mb-6">
                  <h5 className="font-bold text-xl text-gold">{t('select_bank')}</h5>
                  <p className="text-white text-sm mt-1 opacity-90">{t('select_payment_method')}</p>
                </div>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {banks?.length > 0 ? banks.map((bank, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setShow(false);
                        setSelectedBank(bank);
                      }}
                      className="flex gap-3 bg-white/5 hover:bg-gold/10 cursor-pointer p-3 rounded-lg border border-white/10 hover:border-gold/30 transition-all duration-300 items-center"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center">
                        {bank.image ? (
                          <img 
                            src={"https://tttgamingmm.site" + bank.image} 
                            className="w-10 h-10 rounded-lg object-cover" 
                            alt={bank.payment_type}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-10 h-10 rounded-lg bg-gold/30 flex items-center justify-center text-gold font-bold text-sm" style={{ display: bank.image ? 'none' : 'flex' }}>
                          {bank.payment_type?.charAt(0) || 'B'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{bank.payment_type}</p>
                        <p className="text-gold text-xs">Account: {bank.account_number}</p>
                        <p className="text-gray-400 text-xs">Name: {bank.account_name}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No banks available</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setShow(false)} 
                  className="w-full px-4 py-3 bg-gold text-black rounded-lg font-bold hover:bg-gold/80 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deposit;
