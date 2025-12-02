import api from './api';

const walletService = {
  // Create wallet
  createWallet: async () => {
    try {
      const response = await api.post('/wallet/create/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create wallet' };
    }
  },

  // Get wallet balance
  getBalance: async () => {
    try {
      const response = await api.get('/wallet/balance/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch balance' };
    }
  },

  // Add funds to wallet
  addFunds: async (amount, paymentMethod = 'razorpay', paymentId = null) => {
    try {
      const response = await api.post('/wallet/add-funds/', {
        amount,
        payment_method: paymentMethod,
        payment_id: paymentId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to add funds' };
    }
  },

  // Get transaction history
  getTransactions: async () => {
    try {
      const response = await api.get('/wallet/transactions/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch transactions' };
    }
  },
};

export default walletService;