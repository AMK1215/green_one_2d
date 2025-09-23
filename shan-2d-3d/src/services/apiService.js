import CONFIG from './config.js';
import authService from './authService.js';

class ApiService {
    constructor() {
        this.API_BASE_URL = CONFIG.API_BASE_URL;
    }

    // Make authenticated API request
    async makeRequest(endpoint, options = {}) {
        const url = `${this.API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authService.getAuthHeaders(),
            ...options.headers,
        };

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            return { success: response.ok, data, status: response.status };
        } catch (error) {
            console.error('API request error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Get user data
    async getUserData() {
        console.log('Making request to:', CONFIG.ENDPOINTS.USER);
        const result = await this.makeRequest(CONFIG.ENDPOINTS.USER);
        console.log('getUserData result:', result);
        return result;
    }

    // Get banks
    async getBanks() {
        return await this.makeRequest(CONFIG.ENDPOINTS.BANKS);
    }

    // Get contact info
    async getContact() {
        return await this.makeRequest(CONFIG.ENDPOINTS.CONTACT);
    }

    // Get promotions
    async getPromotions() {
        return await this.makeRequest(CONFIG.ENDPOINTS.PROMOTIONS);
    }

    // Launch Shan game
    async launchShanGame(gameData) {
        return await this.makeRequest(CONFIG.ENDPOINTS.LAUNCH_GAME, {
            method: 'POST',
            body: JSON.stringify(gameData),
        });
    }

    // Get agent payment types
    async getAgentPaymentTypes() {
        return await this.makeRequest(CONFIG.ENDPOINTS.AGENT_PAYMENT_TYPES);
    }

    // Submit deposit
    async deposit(depositData) {
        const url = `${this.API_BASE_URL}${CONFIG.ENDPOINTS.DEPOSIT}`;
        const headers = {
            'Accept': 'application/json',
            ...authService.getAuthHeaders(),
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: depositData, // FormData object
            });
            const data = await response.json();
            return { success: response.ok, data, status: response.status };
        } catch (error) {
            console.error('API request error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Get deposit logs
    async getDepositLogs() {
        return await this.makeRequest(CONFIG.ENDPOINTS.DEPOSIT_LOGS);
    }

    // Get payment types
    async getPaymentTypes() {
        return await this.makeRequest(CONFIG.ENDPOINTS.PAYMENT_TYPES);
    }

    // Submit withdrawal
    async withdraw(withdrawData) {
        return await this.makeRequest(CONFIG.ENDPOINTS.WITHDRAW, {
            method: 'POST',
            body: JSON.stringify(withdrawData),
        });
    }

    // Get withdrawal logs
    async getWithdrawLogs() {
        return await this.makeRequest(CONFIG.ENDPOINTS.WITHDRAW_LOGS);
    }

    // Get Shan Game Log (Today's transactions)
    async getShanGameLog(userName) {
        try {
            const url = CONFIG.ENDPOINTS.SHAN_GAME_LOG;
            const requestData = {
                agent_code: "SCT931",
                member_account: userName
            };

            console.log('Making Shan Game Log request to:', url);
            console.log('Request data:', requestData);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log('Shan Game Log response:', data);

            return { 
                success: response.ok, 
                data, 
                status: response.status 
            };
        } catch (error) {
            console.error('Shan Game Log API request error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }
}

export default new ApiService();
