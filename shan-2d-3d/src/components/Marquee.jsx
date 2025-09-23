import React from 'react';

const Marquee = () => {
    const announcements = [
        "🎉 Welcome to SKM WebDelight - Your Ultimate Gaming Platform!",
        "💰 New players get 100% bonus on first deposit!",
        "🎮 Shan Komee games now available 24/7!",
        "🎰 Try our new slot games and win big!",
        "🎲 2D & 3D Lottery draws every day!",
        "🏆 Join our VIP program for exclusive rewards!",
        "📱 Play on mobile - Download our app now!",
        "🎁 Daily promotions and special offers available!"
    ];

    return (
        <div className="bg-gradient-to-r from-gold to-yellow-400 rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                    <span className="text-2xl">📢</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap">
                        {announcements.map((announcement, index) => (
                            <span key={index} className="inline-block mr-8 text-gray-900 font-medium">
                                {announcement}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marquee;
