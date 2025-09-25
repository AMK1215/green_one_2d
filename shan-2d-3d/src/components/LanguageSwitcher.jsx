import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { MdLanguage } from 'react-icons/md';

const LanguageSwitcher = ({ className = '' }) => {
    const context = useContext(LanguageContext);
    
    // Add error handling for missing context
    if (!context) {
        console.error('LanguageSwitcher must be used within a LanguageProvider');
        return null;
    }
    
    const { language, setLanguage } = context;

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <div className="flex items-center gap-2">
                <MdLanguage className="w-5 h-5 text-yellow-400" />
                <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-[#1a1f35] text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                >
                    <option value="en">English</option>
                    <option value="my">မြန်မာ</option>
                </select>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
