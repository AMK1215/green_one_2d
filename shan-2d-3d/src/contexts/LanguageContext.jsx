import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('my'); // Default to Myanmar

    const content = {
        back: 'ပြန်သွားမည်',
        two_d_winners: {
            title: '2D Daily Winners',
            subtitle: 'ထိုးဂဏန်းအနိုင်ရရှိသူများ',
            date: 'ရက်စွဲ',
            session: 'အချိန်',
            all_sessions: 'အားလုံး',
            morning: 'မနက်ပိုင်း',
            evening: 'ညနေပိုင်း',
            actions: 'လုပ်ဆောင်ချက်များ',
            loading: 'ဖွင့်နေသည်...',
            refresh: 'ပြန်လည်ဖွင့်မည်',
            winning_number: 'အနိုင်ဂဏန်း',
            winners: 'အနိုင်ရရှိသူများ',
            bet_amount: 'ထိုးငွေ',
            win_amount: 'အနိုင်ငွေ',
            no_winners: 'ဤအချိန်အတွက် အနိုင်ရရှိသူမရှိပါ'
        },
        two_d_history_modal: {
            title: 'မှတ်တမ်း ရွေးပါ။'
        }
    };

    const value = {
        language,
        setLanguage,
        content
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export { LanguageContext };
