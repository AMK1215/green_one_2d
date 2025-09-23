// TwoDConfirmPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// React-Bootstrap Modal is kept for simplicity.
import { Modal } from "react-bootstrap";
// React Toastify for UI feedback (requires installation and setup in your project)
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import custom CSS
import "../../assets/css/twoD.css";
import { AuthContext } from '../../contexts/AuthContext';
import CONFIG from "../../services/config";
import axios from 'axios';

const TwoDConfirmPage = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const updateProfile = authContext?.updateProfile;
    
    // Always call hooks at the top level
    const [total, setTotal] = useState(0);
    const [betData, setBetData] = useState([]);
    const [smShow, setSmShow] = useState(false);
    const [betAmount, setBetAmount] = useState(0);
    const [num, setNum] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);

    // Use useEffect to handle data validation and initialization
    useEffect(() => {
        try {
            const betsData = localStorage.getItem("bets");
            if (betsData) {
                const bets = JSON.parse(betsData);
                if (bets && bets.amounts && bets.amounts.length > 0) {
                    setTotal(bets.totalAmount || 0);
                    setBetData(bets.amounts || []);
                    setIsValid(true);
                } else {
                    setIsValid(false);
                    setTimeout(() => navigate('/2d'), 100);
                }
            } else {
                setIsValid(false);
                setTimeout(() => navigate('/2d'), 100);
            }
        } catch (error) {
            console.error("Error parsing bets from localStorage:", error);
            setIsValid(false);
            setTimeout(() => navigate('/2d'), 100);
        }
    }, [navigate]);

    // Function to open the edit modal with specific number and amount
    const popUpModal = (numberToEdit, amountToEdit) => {
        setSmShow(true);
        setBetAmount(Number(amountToEdit));
        setNum(String(numberToEdit));
    };

    // Function to handle editing a bet
    const editBet = (editNum, newAmount) => {
        const amount = Number(newAmount);
        
        // Client-side validation for minimum bet amount
        if (isNaN(amount) || amount < 100) {
            toast.error("ထိုးကြေး အနည်းဆုံး ၁၀၀ ထည့်ပါ။", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return; // Stop execution if validation fails
        }

        setBetData((prevState) => {
            let updatedTotal = 0;
            // Map over previous state to update the specific bet
            const updatedBetData = prevState.map((bet) => {
                if (bet.num === editNum) {
                    return { num: editNum, amount: amount };
                }
                return bet;
            });

            // Recalculate total from the updated data
            updatedTotal = updatedBetData.reduce((sum, bet) => sum + bet.amount, 0);
            setTotal(updatedTotal);

            // Update local storage with the new bet data
            localStorage.setItem("bets", JSON.stringify({ totalAmount: updatedTotal, amounts: updatedBetData }));
            return updatedBetData;
        });

        setSmShow(false); // Close the modal after editing
    };

    // Function to delete a single bet
    const deleteBet = (numToDelete) => {
        setBetData((prevState) => {
            // Filter out the bet to be deleted
            const updatedBetData = prevState.filter((bet) => bet.num !== numToDelete);

            // Find the amount of the deleted bet to subtract from total
            const amountToDeduct = prevState.find((bet) => bet.num === numToDelete)?.amount || 0;
            setTotal((prevTotal) => prevTotal - amountToDeduct);

            // Create new object for local storage
            const remainBet = {
                totalAmount: prevState.reduce((totalAcc, bet) => totalAcc + (bet.num !== numToDelete ? bet.amount : 0), 0),
                amounts: updatedBetData
            };
            localStorage.setItem("bets", JSON.stringify(remainBet));

            return updatedBetData;
        });
    };

    const handleConfirmBet = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.TWO_D_BET}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    totalAmount: total,
                    amounts: betData,
                }),
            });
            const data = await res.json();
            if (res.ok && data.status === "Request was successful.") {
                // Fetch latest user profile and update context
                try {
                    const profileRes = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.USER}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    
                    // Check if response is JSON before parsing
                    const contentType = profileRes.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const profileData = await profileRes.json();
                        if (profileData && profileData.data && updateProfile) {
                            updateProfile(profileData.data);
                        }
                    } else {
                        console.warn("Profile update: Received non-JSON response, skipping profile update");
                    }
                } catch (e) {
                    console.error("Profile update error:", e);
                    // Continue with success flow even if profile update fails
                }
                
                // Clear bets from localStorage after successful bet
                localStorage.removeItem("bets");
                
                // Show success toast
                if (toast && typeof toast.success === 'function') {
                    toast.success(data.message || "ထီအောင်မြင်စွာ ထိုးပြီးပါပြီ။", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                }
                
                // Navigate back to 2D page after a short delay
                setTimeout(() => {
                    navigate('/2d');
                }, 2000);
                
            } else if (Array.isArray(data)) {
                if (toast && typeof toast.error === 'function') {
                    toast.error("Over-limit digits: " + data.join(", "));
                }
            } else {
                if (toast && typeof toast.error === 'function') {
                    toast.error(data.message || "Bet failed!");
                }
            }
        } catch (err) {
            console.error("Bet confirmation error:", err);
            if (toast && typeof toast.error === 'function') {
                toast.error("Network or server error");
            }
        }
        setLoading(false);
    };

    // Don't render if data is invalid
    if (!isValid) {
        return (
            <div className="min-h-screen animated-bg particle-bg flex items-center justify-center twoD-page">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                    <p className="text-gold">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer 
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="min-h-screen animated-bg particle-bg py-6 flex flex-col items-center twoD-page">
                {/* Header Section */}
                <div className="w-full max-w-md mx-auto mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/80 text-white hover:bg-gray-700/80 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            ပြန်သွားမည်
                        </button>
                        <h1 className="text-xl font-bold text-white modern-title">ထီအတည်ပြုခြင်း</h1>
                        <div className="w-20"></div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="w-full max-w-md mx-auto confirm-page-card rounded-3xl shadow-2xl p-6 mb-6">
                    {/* Card Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white modern-title mb-1">ရွေးချယ်ထားသောဂဏန်းများ</h2>
                            <p className="text-sm text-gray-300">သင့်ရွေးချယ်ထားသော ဂဏန်းများကို စစ်ဆေးပါ</p>
                        </div>
                        <button 
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105" 
                            onClick={() => navigate(-1)}
                        >
                            ထပ်ထည့်မည်
                        </button>
                    </div>

                    {/* Selected Numbers List */}
                    <div className="space-y-3 mb-6">
                        {betData.map((bet, idx) => (
                            <div
                                key={idx}
                                className="bet-item-card rounded-2xl p-4"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 number-display-box rounded-xl flex items-center justify-center">
                                            <span className="font-black text-2xl text-gold modern-title">{bet.num}</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-lg">{bet.amount} ကျပ်</p>
                                            <p className="text-gray-400 text-sm">ထိုးကြေး</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            className="px-3 py-2 rounded-lg bg-gradient-to-r from-gold/80 to-gold text-gray-900 font-semibold shadow hover:from-gold hover:to-gold/80 transition-all transform hover:scale-105" 
                                            onClick={() => popUpModal(bet.num, bet.amount)}
                                        >
                                            ပြင်ဆင်မည်
                                        </button>
                                        <button 
                                            className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105" 
                                            onClick={() => deleteBet(bet.num)}
                                        >
                                            ဖျက်မည်
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Section */}
                    <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-4 border border-gold/30">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-bold text-lg">စုစုပေါင်း</p>
                                <p className="text-gray-300 text-sm">{betData.length} ဂဏန်း</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gold modern-title">{total.toLocaleString()} ကျပ်</p>
                                <p className="text-gray-300 text-sm">ထိုးကြေးစုစုပေါင်း</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirm Button */}
                <div className="w-full max-w-md mx-auto">
                    <button
                        className="w-full py-5 rounded-3xl twoD-fab text-gray-900 font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleConfirmBet}
                        disabled={loading || betData.length === 0}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                တင်နေသည်...
                            </div>
                        ) : (
                            'အတည်ပြုမည်'
                        )}
                    </button>
                </div>

                {/* Edit Bet Modal */}
                <Modal 
                    show={smShow} 
                    onHide={() => setSmShow(false)} 
                    centered 
                    size="sm"
                    contentClassName="!bg-transparent !border-none !shadow-none !max-w-sm"
                    backdropClassName="!bg-black/70 !backdrop-blur-sm"
                    dialogClassName="!m-4 !mb-20"
                    style={{ zIndex: 9999 }}
                >
                    <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl border border-gold/30 shadow-2xl overflow-hidden w-full max-w-sm mx-auto">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gray-700/80 via-gray-800/80 to-gray-700/80 px-4 py-3 border-b border-gold/20">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white drop-shadow-lg">
                                    ပြင်ဆင်မည့် ဂဏန်းနှင့် ထိုးကြေး
                                </h3>
                                <button
                                    onClick={() => setSmShow(false)}
                                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 pb-6 bg-gray-800/90">
                            <div className="space-y-4">
                                {/* Number Display */}
                                <div className="text-center">
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">ဂဏန်း</label>
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl flex items-center justify-center border border-gold/30">
                                        <span className="font-black text-2xl text-gold modern-title">{num}</span>
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-300">ထိုးကြေး (ကျပ်)</label>
                                    <input
                                        type="number"
                                        value={betAmount || ''}
                                        onChange={e => setBetAmount(Number(e.target.value) || 0)}
                                        className="w-full px-3 py-2 rounded-xl border border-gold/30 bg-gray-700/80 text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                                        placeholder="100"
                                        min="100"
                                        step="1"
                                    />
                                    <p className="text-xs text-gray-400 text-center">အနည်းဆုံး ၁၀၀ ကျပ်</p>
                                </div>

                                {/* Save Button */}
                                <button
                                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-gold to-gold/80 text-white font-bold text-lg shadow-lg hover:from-gold/90 hover:to-gold transition-all transform hover:scale-105"
                                    onClick={() => editBet(num, betAmount)}
                                >
                                    သိမ်းမည်
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default TwoDConfirmPage;
