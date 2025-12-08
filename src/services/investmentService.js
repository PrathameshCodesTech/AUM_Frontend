import api from './api';

const investmentService = {
  // Create new investment
// Create new investment
createInvestment: async (propertyId, amount, unitsCount, referralCode) => {  // ✅ Add referralCode
  try {
    const response = await api.post('/wallet/investments/create/', {
      property_id: propertyId,
      amount,
      units_count: unitsCount,
      referral_code: referralCode  // ✅ ADD THIS LINE
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create investment' };
  }
},

  // Get user's investments
  getMyInvestments: async () => {
    try {
      const response = await api.get('/wallet/investments/my-investments/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch investments' };
    }
  },

  getPortfolioAnalytics: async () => {
    try {
      const response = await api.get('/wallet/investments/portfolio/analytics/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch portfolio analytics' };
    }
  },
  // Get investment detail
  getInvestmentDetail: async (investmentId) => {
    try {
      const response = await api.get(`/wallet/investments/${investmentId}/details/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch investment details' };
    }
  },
  
};

export default investmentService;