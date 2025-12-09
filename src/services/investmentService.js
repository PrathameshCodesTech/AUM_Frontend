import api from './api';

const investmentService = {
  // Create new investment
// Create new investment
createInvestment: async (propertyId, amount, unitsCount, referralCode) => {
  try {
    const payload = {
      property_id: propertyId,  // ✅ CHANGED: property → property_id
      amount: amount,
      units_count: unitsCount,
    };
    
    // ✅ Only include referral_code if it has a value
    if (referralCode) {
      payload.referral_code = referralCode;
    }
    
    console.log('📤 Sending investment payload:', payload);
    
    const response = await api.post('/wallet/investments/create/', payload);
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
  // Check if user has CP relation
checkCPRelation: async () => {
  try {
    const response = await api.get('/wallet/investments/check-cp-relation/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to check CP relation' };
  }
},
  
};

export default investmentService;