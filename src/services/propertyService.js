import api from './api';

const propertyService = {
  // Get all properties with filters
  getProperties: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.city) params.append('city', filters.city);
      if (filters.property_type) params.append('property_type', filters.property_type);
      if (filters.builder_name) params.append('builder_name', filters.builder_name);
      if (filters.min_investment) params.append('min_investment', filters.min_investment);
      if (filters.max_investment) params.append('max_investment', filters.max_investment);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort_by && filters.sort_by !== 'default') params.append('sort_by', filters.sort_by);  // ← ADD THIS

      const response = await api.get(`/properties/?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch properties' };
    }
  },

  // Get single property details
    getPropertyDetail: async (propertyId, deep = true) => {
    try {
      const url = deep ? `/properties/${propertyId}/?deep=true` : `/properties/${propertyId}/`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch property details' };
    }
  },

  // Express interest in property
  expressInterest: async (propertyId, tokenCount) => {
    try {
      const response = await api.post(`/properties/${propertyId}/express-interest/`, {
        token_count: tokenCount,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to express interest' };
    }
  },

  // Get filter options (cities, builders, property types)
  getFilterOptions: async () => {
    try {
      const response = await api.get('/properties/filter-options/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch filter options' };
    }
  },

  // Add this to your existing propertyService.js
  getPropertyAnalytics: async (slug) => {
    try {
      const response = await api.get(`/properties/${slug}/analytics/`);
      return response.data;
    } catch (error) {
      console.error('Analytics fetch error:', error);
      throw error;
    }
  }

};

export default propertyService;