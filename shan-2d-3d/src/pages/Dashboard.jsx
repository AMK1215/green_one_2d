import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BannerSlider from '../components/BannerSlider';
import Marquee from '../components/Marquee';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const provider = searchParams.get("provider");

    const gameCategories = [
        {
            id: '2d',
            name: '2D',
            image: '/TemplateData/game_type/2d_lottery.png',
            buttonText: '2D'
        },
        {
            id: 'shankomee',
            name: 'Shan',
            image: '/TemplateData/game_type/shan.png',
            buttonText: 'Shan'
        },
        {
            id: 'hot',
            name: 'Hot',
            image: '/TemplateData/game_type/ponewine.jpg',
            buttonText: 'Hot'
        },
        {
            id: '3d',
            name: '3D',
            image: '/TemplateData/game_type/3d_lottery.png',
            buttonText: '3D'
        }
    ];

    const slotProviders = [
        {
            id: 1,
            name: 'Pragmatic Play',
            image: '/TemplateData/slots/Pragmatic_Play.png',
            status: 'active'
        },
        {
            id: 2,
            name: 'PGSoft',
            image: '/TemplateData/slots/Asia Gaming.png',
            status: 'active'
        },
        {
            id: 3,
            name: 'Live22',
            image: '/TemplateData/slots/Felix gaming.png',
            status: 'active'
        },
        {
            id: 4,
            name: 'JiLi',
            image: '/TemplateData/slots/JILI.png',
            status: 'active'
        },
        {
            id: 5,
            name: 'CQ9',
            image: '/TemplateData/slots/CQ9 (2).png',
            status: 'active'
        },
        {
            id: 6,
            name: 'JDB',
            image: '/TemplateData/slots/king_855.png',
            status: 'active'
        },
        {
            id: 7,
            name: 'PlayStar',
            image: '/TemplateData/slots/GENIUS.png',
            status: 'active'
        },
        {
            id: 8,
            name: 'Joker',
            image: '/TemplateData/slots/Joker.png',
            status: 'active'
        },
        {
            id: 9,
            name: 'Spadegaming',
            image: '/TemplateData/slots/Sky Wind.png',
            status: 'active'
        },
        {
            id: 10,
            name: 'KA Gaming',
            image: '/TemplateData/slots/KA Gaming.png',
            status: 'active'
        },
        {
            id: 11,
            name: 'Wazdan',
            image: '/TemplateData/slots/Wazdan.png',
            status: 'active'
        },
        {
            id: 12,
            name: 'Asia Gaming',
            image: '/TemplateData/slots/Asia Gaming.png',
            status: 'active'
        }
    ];

    const handleCategoryClick = (category) => {
        // If clicking on Shan, navigate to launch game
        if (category.id === 'shankomee') {
            navigate('/shan-launch-game');
            return;
        }
        
        // If clicking on 2D, navigate to 2D lottery page
        if (category.id === '2d') {
            navigate('/2d');
            return;
        }
        
        // For other categories, you can add navigation logic here
        console.log('Category clicked:', category);
    };

    const handleProviderClick = (provider) => {
        if (provider.status === 'active') {
            console.log('Provider clicked:', provider);
            // You can add provider-specific game launch logic here
        }
    };

    return (
        <div className="px-1 lg:block">
            {/* Banner Slider */}
            <BannerSlider />

            {/* Marquee */}
            <Marquee />

            {/* Modern Tab Navigation */}
            <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x snap-mandatory">
                {/* 2D Tab */}
                <button
                    className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
                        ${type === "2d"
                            ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
                            : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"}
                    `}
                    style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
                    onClick={() => handleCategoryClick({id: '2d'})}
                >
                    <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200 flex items-center justify-center">
                        <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                            <img
                                src="/TemplateData/game_type/2d_lottery.png"
                                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                                alt="2D"
                            />
                        </div>
                    </div>
                    <span className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-300 group-hover:scale-105 transition-transform duration-200">
                        2D
                    </span>
                </button>

                {/* Shan Game Tab */}
                <button
                    className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
                        ${type === "shankomee"
                            ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
                            : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"}
                    `}
                    style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
                    onClick={() => navigate("/shan-launch-game")}
                >
                    <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200 flex items-center justify-center">
                        <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                            <img
                                src="/TemplateData/game_type/shan.png"
                                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                                alt="Shan Game"
                            />
                        </div>
                    </div>
                    <span className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-300 group-hover:scale-105 transition-transform duration-200">
                        Shan
                    </span>
                </button>

                {/* Hot Games Tab */}
                <button
                    className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
                        ${type === "hot"
                            ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
                            : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"}
                    `}
                    style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
                    onClick={() => navigate("/?type=hot")}
                >
                    <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200 flex items-center justify-center">
                        <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                            <img
                                src="/TemplateData/game_type/ponewine.jpg"
                                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                                alt="Hot Games"
                            />
                        </div>
                    </div>
                    <span className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-300 group-hover:scale-105 transition-transform duration-200">
                        Hot
                    </span>
                </button>

                {/* 3D Tab */}
                <button
                    className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
                        ${type === "3d"
                            ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
                            : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"}
                    `}
                    style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
                    onClick={() => navigate("/?type=3d")}
                >
                    <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200 flex items-center justify-center">
                        <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                            <img
                                src="/TemplateData/game_type/3d_lottery.png"
                                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                                alt="3D"
                            />
                        </div>
                    </div>
                    <span className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-300 group-hover:scale-105 transition-transform duration-200">
                        3D
                    </span>
                </button>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {/* Slot Section */}
                {!type && (
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <h2 className="text-2xl font-bold text-yellow-400 mr-4">Slot</h2>
                            <div className="flex-1 h-px bg-gray-600"></div>
                        </div>

                        {/* Slot Providers Grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
                            {slotProviders.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="cursor-pointer group flex flex-col items-center"
                                    onClick={() => handleProviderClick(provider)}
                                >
                                    <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200">
                                        <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                                            <img
                                                src={provider.image}
                                                alt={provider.name}
                                                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-center w-full">
                                        <span className="px-4 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-300 group-hover:scale-105 transition-transform duration-200">
                                            {provider.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Individual Type View */}
                {type && !provider && (
                    <div className="space-y-4">
                        <h5 className="text-xl font-bold text-yellow-400">
                            {gameCategories.find(cat => cat.id === type)?.name || 'Games'}
                        </h5>
                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
                            {slotProviders.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="cursor-pointer group flex flex-col items-center"
                                    onClick={() => handleProviderClick(provider)}
                                >
                                    <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200">
                                        <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                                            <img
                                                src={provider.image}
                                                alt={provider.name}
                                                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-center w-full">
                                        <span className="px-4 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-300 group-hover:scale-105 transition-transform duration-200">
                                            {provider.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-yellow-400/30 p-6">
                        <div className="text-center">
                            <div className="text-4xl mb-4">💰</div>
                            <h3 className="text-xl font-semibold text-yellow-400 mb-2">Quick Deposit</h3>
                            <p className="text-gray-400 mb-4">Add funds instantly</p>
                            <button 
                                onClick={() => navigate('/deposit')}
                                className="bg-yellow-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-300 transition-colors duration-200 hover:scale-105"
                            >
                                Deposit Now
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-yellow-400/30 p-6">
                        <div className="text-center">
                            <div className="text-4xl mb-4">💸</div>
                            <h3 className="text-xl font-semibold text-yellow-400 mb-2">Quick Withdraw</h3>
                            <p className="text-gray-400 mb-4">Cash out your winnings</p>
                            <button 
                                onClick={() => navigate('/withdraw')}
                                className="bg-yellow-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-300 transition-colors duration-200 hover:scale-105"
                            >
                                Withdraw Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;