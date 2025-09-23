// TwoDPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// React-Bootstrap Modal is kept for simplicity.
import { Modal } from "react-bootstrap";
// React Icons for visual elements
import { BiCheckCircle } from "react-icons/bi";
// Import config for API endpoints
import CONFIG from "../../services/config";
// Static assets (images)
import list from "../../assets/img/list.png";
import winner from "../../assets/img/winner.png";
import holiday from "../../assets/img/holiday.png";
// UserWallet component (assumed to be styled with Tailwind internally)
import UserWallet from "../../components/UserWallet";
// Import custom CSS
import "../../assets/css/twoD.css";
import { LanguageContext } from "../../contexts/LanguageContext";

const TwoDPage = () => {
    // Static times for the modal, removing unused ones
    const times = [
        { id: 2, time: "12:00 PM" },
        { id: 4, time: "04:30 PM" },
    ];

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Static user data, replacing API call
    const user = { balance: 9876543, name: "Jane Doe" };

    // Static data for lottery home links
    const lottoHome = [
        { id: 1, title: "မှတ်တမ်း", img: list, link: "/morning-bet-slip" },
        { id: 2, title: "ကံထူးရှင်များ", img: winner, link: "/2d/daily-winner" },
        { id: 3, title: "ပိတ်ရက်", img: holiday, link: "/2d/holiday" },
    ];

    // --- Live 2D Data Integration ---
    const [liveData, setLiveData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      let intervalId;

      const fetchLiveData = () => {
        fetch(CONFIG.ENDPOINTS.TWO_D_LIVE_DATA)
          .then(res => res.json())
          .then(data => {
            setLiveData(data);
            setLoading(false);
          })
          .catch(err => {
            setError("Failed to load live data");
            setLoading(false);
          });
      };

      fetchLiveData(); // Initial fetch
      intervalId = setInterval(fetchLiveData, 2000); // Fetch every 2 seconds

      return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);
    // --- End Live 2D Data Integration ---

    const navigate = useNavigate();
    const { content } = useContext(LanguageContext);

    // Removed authentication check useEffect as API is removed.
    // useEffect(() => {
    //   if (!auth) {
    //     navigate("/login");
    //   }
    // }, [auth, navigate]);

    // Static data for modern and internet digits, replacing API calls
    const modern = {
        modern_morningData: { modern_digit: "45" },
        modern_eveningData: { modern_digit: "78" },
    };
    const internet = {
        morningData: { internet_digit: "32" },
        eveningData: { internet_digit: "01" },
    };

    // Add state for history modal
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const handleHistoryModalOpen = () => setShowHistoryModal(true);
    const handleHistoryModalClose = () => setShowHistoryModal(false);

    // Loading and error states for live data
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div
          className="min-h-screen animated-bg particle-bg pb-6 twoD-page"
        >
          {/* User Wallet */}
          {/* UserWallet removed as per user request */}

          {/* Lottery Home Navigation */}
          <div className="w-full max-w-md mx-auto flex justify-between gap-2 mb-2 sticky top-16 z-30">
            {lottoHome.map((item) => (
              item.title === "မှတ်တမ်း" ? (
                <button
                  key={item.id}
                  className="flex-1"
                  onClick={handleHistoryModalOpen}
                >
                  <div className="flex flex-col items-center p-3 glass-effect rounded-xl shadow-lg border-2 border-gold/30 bg-gradient-to-br from-gold/20 via-gray-800/50 to-dark-gold/20 hover:from-gold/40 hover:to-dark-gold/40 hover:shadow-2xl transition-all">
                    <img src={item.img} alt={item.title} className="w-8 h-8 mb-1" />
                    <span className="text-xs font-semibold text-gold drop-shadow">{item.title}</span>
                  </div>
                </button>
              ) : (
                <NavLink to={item.link} key={item.id} className="flex-1">
                  <div className="flex flex-col items-center p-3 glass-effect rounded-xl shadow-lg border-2 border-gold/30 bg-gradient-to-br from-gold/20 via-gray-800/50 to-dark-gold/20 hover:from-gold/40 hover:to-dark-gold/40 hover:shadow-2xl transition-all">
                    <img src={item.img} alt={item.title} className="w-8 h-8 mb-1" />
                    <span className="text-xs font-semibold text-gold drop-shadow">{item.title}</span>
                  </div>
                </NavLink>
              )
            ))}
          </div>


          {/* Current 2D Result Section */}
          <div className="w-full max-w-md mx-auto glass-effect rounded-3xl shadow-2xl mb-4 p-6 flex flex-col items-center py-8 border-2 border-gold/30 bg-gradient-to-br from-gold/20 via-gray-800/50 to-dark-gold/20">
            <h1 className="text-8xl font-black text-white mb-6 drop-shadow-2xl glow-effect bg-gray-800/90 rounded-3xl px-12 py-4 border-4 border-gold/50 shadow-2xl modern-title hover-lift">{liveData?.live?.twod ?? "--"}</h1>
            <div className="flex items-center gap-3 text-white mb-3">
              <BiCheckCircle className="text-green-400 text-2xl animate-pulse" />
              <span className="text-sm font-bold text-white modern-subtitle">Updated: {liveData?.live?.date} - {liveData?.live?.time}</span>
            </div>
            <span className="text-sm text-gray-200 mb-6 modern-subtitle">
              {liveData?.server_time ? `${liveData.server_time} တွင် ထီပိတ်ပါမည်။` : ""}
            </span>

            {/* Sticky Bet Button - Below Live Data */}
            {!show && (
              <div className="w-full mb-6">
                <button
                  onClick={handleShow}
                  className="w-full twoD-fab text-gray-900 font-bold py-4 px-8 rounded-full shadow-2xl text-xl border-3 border-gold/80 hover:scale-105 active:scale-95 transition-all glow-effect"
                >
                  ထိုးမည်
                </button>
              </div>
            )}

            {/* Previous Results Table */}
            <div className="w-full glass-effect rounded-3xl p-6 space-y-6 border border-gold/30 shadow-2xl hover-lift">
              {liveData?.result?.map((number, index) => (
                <div key={index} className={`pb-3 ${index !== liveData.result.length - 1 ? 'border-b border-gold/30' : ''}`}> 
                  <div className="text-sm font-bold mb-3 text-white flex items-center gap-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-gold animate-pulse"></span>
                    <span className="modern-subtitle">{number.open_time}</span>
                  </div>
                  <div className="grid grid-cols-3 text-center text-sm font-bold text-white mb-2">
                    <div className="modern-subtitle">Set</div>
                    <div className="modern-subtitle">Value</div>
                    <div className="modern-subtitle">2D</div>
                  </div>
                  <div className="grid grid-cols-3 text-center text-lg font-bold text-white">
                    <div className="modern-subtitle">{number.set}</div>
                    <div className="modern-subtitle">{number.value}</div>
                    <div className="modern-subtitle">{number.twod}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modern and Internet Digits */}
            <div className="w-full glass-effect rounded-3xl px-6 py-6 mt-8 space-y-6 border border-gold/30 shadow-2xl hover-lift">
              <div className="flex justify-between items-center border-b border-gold/30 pb-3">
                <span className="text-sm font-bold flex items-center gap-2 text-white modern-subtitle"><svg className="w-5 h-5 text-gold animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>9:00 AM</span>
                <div className="text-center">
                  <div className="text-sm text-gray-200 flex items-center gap-2 modern-subtitle"><svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20" /></svg>မော်ဒန်</div>
                  <div className="text-xl font-bold text-white modern-title">{modern?.modern_morningData?.modern_digit ?? "-"}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-200 flex items-center gap-2 modern-subtitle"><svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12h20" /></svg>အင်တာနက်</div>
                  <div className="text-xl font-bold text-white modern-title">{internet?.morningData?.internet_digit ?? "-"}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold flex items-center gap-2 text-white modern-subtitle"><svg className="w-5 h-5 text-gold animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>2:00 PM</span>
                <div className="text-center">
                  <div className="text-sm text-gray-200 flex items-center gap-2 modern-subtitle"><svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20" /></svg>မော်ဒန်</div>
                  <div className="text-xl font-bold text-white modern-title">{modern?.modern_eveningData?.modern_digit ?? "-"}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-200 flex items-center gap-2 modern-subtitle"><svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12h20" /></svg>အင်တာနက်</div>
                  <div className="text-xl font-bold text-white modern-title">{internet?.eveningData?.internet_digit ?? "-"}</div>
                </div>
              </div>
            </div>
          </div>


          {/* Time Selection Modal */}
          <Modal 
            show={show} 
            onHide={handleClose} 
            centered 
            dialogClassName="z-50"
            contentClassName="!bg-transparent !border-none !shadow-none"
            backdropClassName="!bg-black/70 !backdrop-blur-sm"
          >
            <div className="time-selection-modal rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="time-selection-header px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-blue-400 drop-shadow-lg">
                    ထိုးမည့်အချိန် ရွေးပါ။
                  </h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 bg-gray-800/90">
                {/* Updated info */}
                {liveData?.live?.date && liveData?.live?.time && (
                  <div className="flex items-center justify-center text-sm text-gray-300 mb-6 gap-2">
                    <BiCheckCircle className="text-teal-400 text-lg" />
                    <span>Updated: {liveData.live.date} - {liveData.live.time}</span>
                  </div>
                )}

                {/* Time selection buttons */}
                <div className="space-y-4">
                  {times.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setShow(false);
                        navigate(`/2d/bet?time=${item.id}`);
                      }}
                      className="time-selection-button w-full py-5 px-6 rounded-2xl text-white font-bold text-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                    >
                      {item.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Modal>

          {/* History Session Modal */}
          <Modal show={showHistoryModal} onHide={handleHistoryModalClose} centered dialogClassName="z-50 mb-32">
            <Modal.Header closeButton className="!border-b-0 bg-gradient-to-br from-gold/20 via-gray-800/50 to-dark-gold/20 rounded-t-2xl">
              <Modal.Title>
                <span className="font-bold text-lg text-blue-700 drop-shadow">
                  {content?.two_d_history_modal?.title || "မှတ်တမ်း ရွေးပါ။"}
                </span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-6 bg-gray-800/90 rounded-b-2xl border-t-0">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => { setShowHistoryModal(false); navigate('/morning-bet-slip'); }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white font-extrabold text-xl shadow-lg border-2 border-blue-400/60 hover:from-blue-500 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  မနက်ပိုင်းမှတ်တမ်း
                </button>
                <button
                  onClick={() => { setShowHistoryModal(false); navigate('/evening-bet-slip'); }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-extrabold text-xl shadow-lg border-2 border-yellow-400/60 hover:from-yellow-500 hover:to-orange-600 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                  ညနေပိုင်းမှတ်တမ်း
                </button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      );
};

export default TwoDPage;
