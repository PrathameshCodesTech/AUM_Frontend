import api from './api';

const adminService = {
  // ========================================
  // DASHBOARD STATS
  // ========================================
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats/');
    return response.data;
  },

  // ========================================
  // USER MANAGEMENT
  // ========================================
  getUsers: async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/admin/users/?${params}`);
  
  // ✅ DRF pagination format - wrap it
  return {
    success: true,
    results: response.data.results,
    count: response.data.count,
    next: response.data.next,
    previous: response.data.previous
  };
},

  getUserDetail: async (userId) => {
  const response = await api.get(`/admin/users/${userId}/`);
  
  // ✅ Your backend returns { success: true, data: {...} }
  // So this should work as-is, but let's make it consistent
  return response.data;
},

  userAction: async (userId, action, reason = '') => {
    const response = await api.post(`/admin/users/${userId}/action/`, {
      action,
      reason
    });
    return response.data;
  },

  // ========================================
  // KYC MANAGEMENT
  // ========================================
 // ========================================
// KYC MANAGEMENT
// ========================================
getPendingKYC: async () => {
  const response = await api.get('/admin/kyc/pending/');
  return {
    success: true,
    results: response.data.results || response.data,
    count: response.data.count || 0
  };
},

getAllKYC: async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/admin/kyc/all/?${params}`);
  return {
    success: true,
    results: response.data.results || response.data,
    count: response.data.count || 0
  };
},

getKYCDetail: async (kycId) => {  // 👈 NEW
  const response = await api.get(`/admin/kyc/${kycId}/`);
  return response.data;
},

kycAction: async (kycId, action, reason = '') => {
  const response = await api.post(`/admin/kyc/${kycId}/action/`, {
    action,
    rejection_reason: reason
  });
  return response.data;
},

// ========================================
// PROPERTY MANAGEMENT
// ========================================
getProperties: async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/admin/properties/?${params}`);
  
  // ✅ Wrap DRF pagination response
  return {
    success: true,
    results: response.data.results || response.data,
    count: response.data.count || 0,
    next: response.data.next,
    previous: response.data.previous
  };
},

getPropertyDetail: async (propertyId) => {
  const response = await api.get(`/admin/properties/${propertyId}/`);
  return response.data; // ✅ Already wrapped by backend
},

createProperty: async (formData) => {
  const response = await api.post('/admin/properties/create/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data; // ✅ Already wrapped by backend
},

updateProperty: async (propertyId, formData) => {
  const response = await api.put(`/admin/properties/${propertyId}/update/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data; // ✅ Already wrapped by backend
},

deleteProperty: async (propertyId) => {
  const response = await api.delete(`/admin/properties/${propertyId}/delete/`);
  return response.data; // ✅ Already wrapped by backend
},

propertyAction: async (propertyId, action) => {
  const response = await api.post(`/admin/properties/${propertyId}/action/`, {
    action
  });
  return response.data; // ✅ Already wrapped by backend
},

// / ========================================
// IMAGE MANAGEMENT (NEW)
// ========================================
getPropertyImages: async (propertyId) => {
  const response = await api.get(`/admin/properties/${propertyId}/images/`);
  return {
    success: true,
    results: response.data.results || response.data,
    count: response.data.count || 0
  };
},

uploadPropertyImage: async (propertyId, formData) => {
  const response = await api.post(`/admin/properties/${propertyId}/images/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
},

deletePropertyImage: async (propertyId, imageId) => {
  const response = await api.delete(`/admin/properties/${propertyId}/images/${imageId}/`);
  return response.data;
},

// ========================================
// DOCUMENT MANAGEMENT (NEW)
// ========================================
getPropertyDocuments: async (propertyId) => {
  const response = await api.get(`/admin/properties/${propertyId}/documents/`);
  return {
    success: true,
    results: response.data.results || response.data,
    count: response.data.count || 0
  };
},

uploadPropertyDocument: async (propertyId, formData) => {
  const response = await api.post(`/admin/properties/${propertyId}/documents/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
},

deletePropertyDocument: async (propertyId, documentId) => {
  const response = await api.delete(`/admin/properties/${propertyId}/documents/${documentId}/`);
  return response.data;
},

// ========================================
// UNIT MANAGEMENT (NEW)
// ========================================
getPropertyUnits: async (propertyId) => {
  const response = await api.get(`/admin/properties/${propertyId}/units/`);
  return {
    success: true,
    results: response.data.results || response.data,
    count: response.data.count || 0
  };
},

createPropertyUnit: async (propertyId, data) => {
  const response = await api.post(`/admin/properties/${propertyId}/units/create/`, data);
  return response.data;
},

updatePropertyUnit: async (propertyId, unitId, data) => {
  const response = await api.put(`/admin/properties/${propertyId}/units/${unitId}/update/`, data);
  return response.data;
},

deletePropertyUnit: async (propertyId, unitId) => {
  const response = await api.delete(`/admin/properties/${propertyId}/units/${unitId}/`);
  return response.data;
},


  // ========================================
// INVESTMENT MANAGEMENT
// ========================================
getInvestmentStats: async () => {
  const response = await api.get('/admin/investments/stats/');
  return response.data; // ✅ Already wrapped by backend
},

getInvestments: async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/admin/investments/?${params}`);
  
  // ✅ Wrap DRF pagination response
  return {
    success: true,
    results: response.data.results || response.data,
    count: response.data.count || 0,
    next: response.data.next,
    previous: response.data.previous
  };
},

getInvestmentDetail: async (investmentId) => {
  const response = await api.get(`/admin/investments/${investmentId}/`);
  return response.data; // ✅ Already wrapped by backend
},

investmentAction: async (investmentId, action, reason = '') => {
  const response = await api.post(`/admin/investments/${investmentId}/action/`, {
    action,
    rejection_reason: reason
  });
  return response.data; // ✅ Already wrapped by backend
},

getInvestmentsByProperty: async (propertyId) => {
  const response = await api.get(`/admin/investments/by-property/${propertyId}/`);
  return response.data; // ✅ Already wrapped by backend
},

getInvestmentsByCustomer: async (customerId) => {
  const response = await api.get(`/admin/investments/by-customer/${customerId}/`);
  return response.data; // ✅ Already wrapped by backend
},

};

export default adminService;