import React from 'react';

const Announcements = () => {
    const announcements = [
        {
            id: 1,
            title: "Welcome to SKM Gaming Platform",
            content: "We're excited to announce the launch of our new gaming platform with amazing features and games!",
            date: "2024-01-15",
            type: "announcement"
        },
        {
            id: 2,
            title: "New Games Added",
            content: "Check out our latest collection of slot games and table games. More exciting games coming soon!",
            date: "2024-01-14",
            type: "update"
        },
        {
            id: 3,
            title: "Maintenance Notice",
            content: "Scheduled maintenance will be performed on January 20th from 2:00 AM to 4:00 AM. We apologize for any inconvenience.",
            date: "2024-01-13",
            type: "maintenance"
        }
    ];

    const getTypeColor = (type) => {
        switch (type) {
            case 'announcement':
                return 'bg-blue-500';
            case 'update':
                return 'bg-green-500';
            case 'maintenance':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Announcements</h1>
                <p className="text-gray-400">Stay updated with the latest news and updates</p>
            </div>

            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 border-opacity-50">
                        <div className="flex items-start space-x-4">
                            <div className={`w-3 h-3 rounded-full ${getTypeColor(announcement.type)} mt-2`}></div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-semibold text-white">{announcement.title}</h3>
                                    <span className="text-sm text-gray-400">{announcement.date}</span>
                                </div>
                                <p className="text-gray-300 leading-relaxed">{announcement.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {announcements.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📢</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Announcements</h3>
                    <p className="text-gray-400">Check back later for updates</p>
                </div>
            )}
        </div>
    );
};

export default Announcements;
