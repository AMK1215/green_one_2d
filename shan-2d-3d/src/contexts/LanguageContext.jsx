import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    // Default to English, fallback to Myanmar if stored language is not found
    const [language, setLanguage] = useState(() => {
        const stored = localStorage.getItem('app_language');
        return stored && ['en', 'my'].includes(stored) ? stored : 'en';
    });
    
    console.log('LanguageProvider rendering with language:', language);

    // Save language preference to localStorage
    useEffect(() => {
        localStorage.setItem('app_language', language);
    }, [language]);

    const content = {
        en: {
            // Common
            back: 'Back',
            home: 'Home',
            loading: 'Loading...',
            refresh: 'Refresh',
            confirm: 'Confirm',
            cancel: 'Cancel',
            save: 'Save',
            edit: 'Edit',
            delete: 'Delete',
            close: 'Close',
            submit: 'Submit',
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info',
            
            // Navigation
            dashboard: 'Dashboard',
            profile: 'Profile',
            deposit: 'Deposit',
            withdraw: 'Withdraw',
            transactions: 'Transactions',
            history: 'History',
            winners: 'Winners',
            
            // Wallet
            wallet: 'Wallet',
            balance: 'Balance',
            total_amount: 'Total Amount',
            amount: 'Amount',
            
            // 2D Lottery
            two_d: '2D',
            two_d_betting: '2D Betting',
            two_d_winners: '2D Winners',
            two_d_history: '2D History',
            two_d_daily_winners: '2D Daily Winners',
            select_numbers: 'Select Numbers',
            selected_numbers: 'Selected Numbers',
            bet_amount: 'Bet Amount',
            win_amount: 'Win Amount',
            winning_number: 'Winning Number',
            morning_session: 'Morning Session',
            evening_session: 'Evening Session',
            all_sessions: 'All Sessions',
            no_winners: 'No winners for this session',
            
            // 3D Lottery
            three_d: '3D',
            three_d_betting: '3D Betting',
            three_d_winners: '3D Winners',
            three_d_history: '3D History',
            three_d_results: '3D Results',
            three_digit_number: '3-digit number',
            permutation: 'Permutation',
            add_permutation: 'Add Permutation',
            quick_select: 'Quick Select',
            break_groups: 'Break Groups',
            single_numbers: 'Single Numbers',
            double_numbers: 'Double Numbers',
            front_numbers: 'Front Numbers',
            back_numbers: 'Back Numbers',
            power_numbers: 'Power Numbers',
            first_twenty: 'First 20',
            
            // Betting
            place_bet: 'Place Bet',
            bet_confirmation: 'Bet Confirmation',
            bet_success: 'Bet placed successfully',
            bet_failed: 'Failed to place bet',
            insufficient_balance: 'Insufficient balance',
            select_at_least_one: 'Please select at least one number',
            enter_valid_amount: 'Please enter a valid amount',
            enter_three_digit: 'Please enter a 3-digit number',
            number_already_selected: 'This number is already selected',
            
            // Time and Date
            current_time: 'Current Time',
            draw_time: 'Draw Time',
            draw_date: 'Draw Date',
            today: 'Today',
            yesterday: 'Yesterday',
            
            // Status
            pending: 'Pending',
            won: 'Won',
            lost: 'Lost',
            processing: 'Processing...',
            
            // Actions
            try_again: 'Try Again',
            start_betting: 'Start Betting',
            view_results: 'View Results',
            check_history: 'Check History',
            logout: 'Logout',
            
            // Deposit/Withdraw/Transaction
            deposit_amount: 'Deposit Amount',
            withdraw_amount: 'Withdraw Amount',
            reference_number: 'Reference Number',
            select_bank: 'Select Bank',
            account_name: 'Account Name',
            account_number: 'Account Number',
            payment_method: 'Payment Method',
            password: 'Password',
            submit_deposit: 'Submit Deposit',
            submit_withdraw: 'Submit Withdraw',
            quick_amounts: 'Quick Amounts',
            deposit_history: 'Deposit History',
            withdraw_history: 'Withdraw History',
            transaction_history: 'Transaction History',
            status: 'Status',
            date: 'Date',
            time: 'Time',
            approved: 'Approved',
            pending: 'Pending',
            rejected: 'Rejected',
            no_transactions: 'No transactions found',
            loading_transactions: 'Loading transactions...',
            balance: 'Balance',
            current_balance: 'Current Balance',
            add_money_to_account: 'Add money to your gaming account',
            select_payment_method: 'Select a payment method',
            cash_out_winnings: 'Cash out your winnings',
            withdrawal_request: 'Withdrawal Request',
            view_deposit_withdraw_history: 'View your deposit and withdrawal history',
            failed_to_load_transaction_history: 'Failed to load transaction history'
        },
        my: {
            // Common
            back: 'ပြန်သွားမည်',
            home: 'ပင်မ',
            loading: 'ဖွင့်နေသည်...',
            refresh: 'ပြန်လည်ဖွင့်မည်',
            confirm: 'အတည်ပြုမည်',
            cancel: 'ပယ်ဖျက်မည်',
            save: 'သိမ်းမည်',
            edit: 'တည်းဖြတ်မည်',
            delete: 'ဖျက်မည်',
            close: 'ပိတ်မည်',
            submit: 'တင်သွင်းမည်',
            success: 'အောင်မြင်ပါပြီ',
            error: 'အမှားတစ်ခုရှိပါသည်',
            warning: 'သတိပေးချက်',
            info: 'အချက်အလက်',
            
            // Navigation
            dashboard: 'ပင်မစာမျက်နှာ',
            profile: 'ကိုယ်ရေးကိုယ်တာ',
            deposit: 'ငွေဖြည့်မည်',
            withdraw: 'ငွေထုတ်မည်',
            transactions: 'လွှဲပြောင်းမှုများ',
            history: 'မှတ်တမ်း',
            winners: 'အနိုင်ရရှိသူများ',
            
            // Wallet
            wallet: 'ပိုက်ဆံအိတ်',
            balance: 'လက်ကျန်ငွေ',
            total_amount: 'စုစုပေါင်းငွေ',
            amount: 'ငွေပမာဏ',
            
            // 2D Lottery
            two_d: '၂ဒီ',
            two_d_betting: '၂ဒီထိုးခြင်း',
            two_d_winners: '၂ဒီအနိုင်ရရှိသူများ',
            two_d_history: '၂ဒီမှတ်တမ်း',
            two_d_daily_winners: '၂ဒီနေ့စဉ်အနိုင်ရရှိသူများ',
            select_numbers: 'ဂဏန်းရွေးမည်',
            selected_numbers: 'ရွေးချယ်ထားသောဂဏန်းများ',
            bet_amount: 'ထိုးငွေ',
            win_amount: 'အနိုင်ငွေ',
            winning_number: 'အနိုင်ဂဏန်း',
            morning_session: 'မနက်ပိုင်းအချိန်',
            evening_session: 'ညနေပိုင်းအချိန်',
            all_sessions: 'အားလုံးသောအချိန်များ',
            no_winners: 'ဤအချိန်အတွက် အနိုင်ရရှိသူမရှိပါ',
            
            // 3D Lottery
            three_d: '၃ဒီ',
            three_d_betting: '၃ဒီထိုးခြင်း',
            three_d_winners: '၃ဒီအနိုင်ရရှိသူများ',
            three_d_history: '၃ဒီမှတ်တမ်း',
            three_d_results: '၃ဒီရလဒ်များ',
            three_digit_number: '၃လုံးဂဏန်း',
            permutation: 'ပတ်လည်ထိုးမည်',
            add_permutation: 'ပတ်လည်ထိုးမည်',
            quick_select: 'အမြန်ရွေးရန်',
            break_groups: 'ဘရိတ်အုပ်စုများ',
            single_numbers: 'တစ်လုံးဂဏန်းများ',
            double_numbers: 'နှစ်လုံးဂဏန်းများ',
            front_numbers: 'ရှေ့ဂဏန်းများ',
            back_numbers: 'နောက်ဂဏန်းများ',
            power_numbers: 'ပါဝါဂဏန်းများ',
            first_twenty: 'ပထမ ၂၀',
            
            // Betting
            place_bet: 'ထိုးမည်',
            bet_confirmation: 'ထိုးခြင်းအတည်ပြုချက်',
            bet_success: 'ထီအောင်မြင်စွာ ထိုးပြီးပါပြီ',
            bet_failed: 'ထိုးခြင်းမအောင်မြင်ပါ',
            insufficient_balance: 'လက်ကျန်ငွေမလုံလောက်ပါ',
            select_at_least_one: 'အနည်းဆုံး ဂဏန်းတစ်လုံးရွေးပါ',
            enter_valid_amount: 'ငွေပမာဏကို မှန်ကန်စွာရိုက်ထည့်ပါ',
            enter_three_digit: '၃လုံးဂဏန်းကို ရိုက်ထည့်ပါ',
            number_already_selected: 'ဤဂဏန်းကို ရွေးပြီးပါပြီ',
            
            // Time and Date
            current_time: 'လက်ရှိအချိန်',
            draw_time: 'ထုတ်ချိန်',
            draw_date: 'ထုတ်ရက်',
            today: 'ယနေ့',
            yesterday: 'မနေ့က',
            
            // Status
            pending: 'စောင့်ဆိုင်းနေပါသည်',
            won: 'အောင်မြင်ပါပြီ',
            lost: 'ရှုံးနိမ့်ပါပြီ',
            processing: 'လုပ်ဆောင်နေပါသည်...',
            
            // Actions
            try_again: 'ပြန်လည်ကြိုးစားပါ',
            start_betting: 'ထိုးခြင်းစတင်ပါ',
            view_results: 'ရလဒ်များကြည့်ပါ',
            check_history: 'မှတ်တမ်းစစ်ဆေးပါ',
            logout: 'ထွက်မည်',
            
            // Deposit/Withdraw/Transaction
            deposit_amount: 'ငွေဖြည့်ပမာဏ',
            withdraw_amount: 'ငွေထုတ်ပမာဏ',
            reference_number: 'ကိုးကားနံပါတ်',
            select_bank: 'ဘဏ်ရွေးပါ',
            account_name: 'အကောင့်အမည်',
            account_number: 'အကောင့်နံပါတ်',
            payment_method: 'ငွေပေးချေနည်း',
            password: 'စကားဝှက်',
            submit_deposit: 'ငွေဖြည့်တင်သွင်းမည်',
            submit_withdraw: 'ငွေထုတ်တင်သွင်းမည်',
            quick_amounts: 'အမြန်ပမာဏများ',
            deposit_history: 'ငွေဖြည့်မှတ်တမ်း',
            withdraw_history: 'ငွေထုတ်မှတ်တမ်း',
            transaction_history: 'လွှဲပြောင်းမှုမှတ်တမ်း',
            status: 'အခြေအနေ',
            date: 'ရက်စွဲ',
            time: 'အချိန်',
            approved: 'အတည်ပြုပြီး',
            pending: 'စောင့်ဆိုင်းနေပါသည်',
            rejected: 'ငြင်းပယ်ပြီး',
            no_transactions: 'လွှဲပြောင်းမှုမရှိပါ',
            loading_transactions: 'လွှဲပြောင်းမှုများဖွင့်နေသည်...',
            balance: 'လက်ကျန်ငွေ',
            current_balance: 'လက်ရှိလက်ကျန်ငွေ',
            add_money_to_account: 'သင့်ဂိမ်းအကောင့်သို့ငွေထည့်ပါ',
            select_payment_method: 'ငွေပေးချေနည်းရွေးပါ',
            cash_out_winnings: 'သင့်အနိုင်ရငွေများထုတ်ယူပါ',
            withdrawal_request: 'ငွေထုတ်တောင်းဆိုမှု',
            view_deposit_withdraw_history: 'သင့်ငွေဖြည့်နှင့်ငွေထုတ်မှတ်တမ်းများကြည့်ပါ',
            failed_to_load_transaction_history: 'လွှဲပြောင်းမှုမှတ်တမ်းဖွင့်ရန်မအောင်မြင်ပါ'
        }
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = content[language];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        return value || key; // Fallback to key if translation not found
    };

    const switchLanguage = (lang) => {
        if (['en', 'my'].includes(lang)) {
            setLanguage(lang);
        }
    };

    const value = {
        language,
        setLanguage: switchLanguage,
        content: content[language],
        t // Translation function
    };
    
    console.log('LanguageProvider value:', value);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export { LanguageContext };
