const CONFIG = {
    API_BASE_URL: 'http://localhost:8000/api',
    AUTH: {
        TOKEN_KEY: 'auth_token',
        USER_DATA_KEY: 'user_data',
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    },
    ENDPOINTS: {
        LOGIN: '/login',
        REGISTER: '/register',
        LOGOUT: '/logout',
        USER: '/user',
        CHANGE_PASSWORD: '/change-password',
        PROFILE: '/profile',
        BANKS: '/banks',
        CONTACT: '/contact',
        PROMOTIONS: '/promotion',
        LAUNCH_GAME: '/shankomee/launch-game',
        AGENT_PAYMENT_TYPES: '/agentfinicialPaymentType',
        DEPOSIT: '/depositfinicial',
        DEPOSIT_LOGS: '/depositlogfinicial',
        PAYMENT_TYPES: '/paymentTypefinicial',
        WITHDRAW: '/withdrawfinicial',
        WITHDRAW_LOGS: '/withdrawlogfinicial',
        SHAN_GAME_LOG: 'https://luckymillion.pro/api/today-transactions',
        
        // 2D Lottery Endpoints
        TWO_D_BET: '/twod-bet',
        TWO_D_DAILY_WINNERS: '/two-d-daily-winners',
        TWO_D_BET_SLIPS: '/twod-bet-slips',
        TWO_D_LIVE_DATA: 'https://api.thaistock2d.com/live',
        
        // Additional 2D Lottery Endpoints (for future use)
        TWO_D_HISTORY: '/twod-history',
        TWO_D_RESULTS: '/twod-results',
        TWO_D_ANNOUNCEMENTS: '/twod-announcements',
        TWO_D_SETTINGS: '/twod-settings',
    }
};

export default CONFIG;
