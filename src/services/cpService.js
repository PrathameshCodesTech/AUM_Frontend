// cpService.js
// =====================================================
// Service for General CP Operations
// Handles: Dashboard, Stats, Performance
// =====================================================

import api from './api';

const cpService = {
  /**
   * Get CP dashboard statistics
   * GET /api/cp/dashboard/stats/
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/cp/dashboard/stats/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch dashboard stats'
      };
    }
  },

  /**
   * Get CP performance metrics
   * GET /api/cp/performance/
   */
  getPerformance: async () => {
    try {
      const response = await api.get('/cp/performance/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch performance'
      };
    }
  },

  /**
   * Get linked customers
   * GET /api/cp/customers/
   */
  getCustomers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.is_active !== undefined) {
        params.append('is_active', filters.is_active);
      }
      if (filters.is_expired !== undefined) {
        params.append('is_expired', filters.is_expired);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await api.get(`/cp/customers/?${params.toString()}`);
      return {
        success: true,
        count: response.data.count,
        data: response.data.results
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch customers'
      };
    }
  },

  /**
   * Get commissions
   * GET /api/cp/commissions/
   */
  getCommissions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) {
        params.append('status', filters.status);
      }

      const response = await api.get(`/cp/commissions/?${params.toString()}`);
      return {
        success: true,
        count: response.data.count,
        data: response.data.results
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch commissions'
      };
    }
  }
};

export default cpService;