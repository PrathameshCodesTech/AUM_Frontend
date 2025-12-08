import api from "./api";

const adminService = {
  // ========================================
  // DASHBOARD STATS
  // ========================================
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard/stats/");
    return response.data;
  },

  // ========================================
  // USER MANAGEMENT
  // ========================================
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/users/?${params}`);

    return {
      success: true,
      results: response.data.results,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
    };
  },

  getUserDetail: async (userId) => {
    const response = await api.get(`/admin/users/${userId}/`);
    return response.data;
  },

  userAction: async (userId, action, reason = "") => {
    const response = await api.post(`/admin/users/${userId}/action/`, {
      action,
      reason,
    });
    return response.data;
  },

  // ========================================
  // KYC MANAGEMENT
  // ========================================
  getPendingKYC: async () => {
    const response = await api.get("/admin/kyc/pending/");
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  getAllKYC: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/kyc/all/?${params}`);
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  getKYCDetail: async (kycId) => {
    const response = await api.get(`/admin/kyc/${kycId}/`);
    return response.data;
  },

  kycAction: async (kycId, action, reason = "") => {
    const response = await api.post(`/admin/kyc/${kycId}/action/`, {
      action,
      rejection_reason: reason,
    });
    return response.data;
  },

  // ========================================
  // PROPERTY MANAGEMENT
  // ========================================
  getProperties: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/properties/?${params}`);

    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
      next: response.data.next,
      previous: response.data.previous,
    };
  },

  getPropertyDetail: async (propertyId) => {
    const response = await api.get(`/admin/properties/${propertyId}/`);
    return response.data;
  },

  createProperty: async (formData) => {
    const response = await api.post("/admin/properties/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateProperty: async (propertyId, formData) => {
    const response = await api.put(
      `/admin/properties/${propertyId}/update/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deleteProperty: async (propertyId) => {
    const response = await api.delete(
      `/admin/properties/${propertyId}/delete/`
    );
    return response.data;
  },

  propertyAction: async (propertyId, action) => {
    const response = await api.post(`/admin/properties/${propertyId}/action/`, {
      action,
    });
    return response.data;
  },

  // ========================================
  // IMAGE MANAGEMENT
  // ========================================
  getPropertyImages: async (propertyId) => {
    const response = await api.get(`/admin/properties/${propertyId}/images/`);
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  uploadPropertyImage: async (propertyId, formData) => {
    const response = await api.post(
      `/admin/properties/${propertyId}/images/upload/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deletePropertyImage: async (propertyId, imageId) => {
    const response = await api.delete(
      `/admin/properties/${propertyId}/images/${imageId}/`
    );
    return response.data;
  },

  // ========================================
  // DOCUMENT MANAGEMENT
  // ========================================
  getPropertyDocuments: async (propertyId) => {
    const response = await api.get(
      `/admin/properties/${propertyId}/documents/`
    );
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  uploadPropertyDocument: async (propertyId, formData) => {
    const response = await api.post(
      `/admin/properties/${propertyId}/documents/upload/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deletePropertyDocument: async (propertyId, documentId) => {
    const response = await api.delete(
      `/admin/properties/${propertyId}/documents/${documentId}/`
    );
    return response.data;
  },

  // ========================================
  // UNIT MANAGEMENT
  // ========================================
  getPropertyUnits: async (propertyId) => {
    const response = await api.get(`/admin/properties/${propertyId}/units/`);
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  createPropertyUnit: async (propertyId, data) => {
    const response = await api.post(
      `/admin/properties/${propertyId}/units/create/`,
      data
    );
    return response.data;
  },

  updatePropertyUnit: async (propertyId, unitId, data) => {
    const response = await api.put(
      `/admin/properties/${propertyId}/units/${unitId}/update/`,
      data
    );
    return response.data;
  },

  deletePropertyUnit: async (propertyId, unitId) => {
    const response = await api.delete(
      `/admin/properties/${propertyId}/units/${unitId}/`
    );
    return response.data;
  },

  getPropertyTypes: async () => {
    const response = await api.get("/admin/properties/types/");
    return response.data;
  },

  // ========================================
  // INVESTMENT MANAGEMENT
  // ========================================
  getInvestmentStats: async () => {
    const response = await api.get("/admin/investments/stats/");
    return response.data;
  },

  getInvestments: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/investments/?${params}`);

    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
      next: response.data.next,
      previous: response.data.previous,
    };
  },

  getInvestmentDetail: async (investmentId) => {
    const response = await api.get(`/admin/investments/${investmentId}/`);
    return response.data;
  },

  investmentAction: async (investmentId, action, reason = "") => {
    const response = await api.post(
      `/admin/investments/${investmentId}/action/`,
      {
        action,
        rejection_reason: reason,
      }
    );
    return response.data;
  },

  getInvestmentsByProperty: async (propertyId) => {
    const response = await api.get(
      `/admin/investments/by-property/${propertyId}/`
    );
    return response.data;
  },

  getInvestmentsByCustomer: async (customerId) => {
    const response = await api.get(
      `/admin/investments/by-customer/${customerId}/`
    );
    return response.data;
  },

  // ========================================
  // CP APPLICATION MANAGEMENT
  // ========================================
  getCPApplications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/cp/applications/?${params}`);
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  getCPApplicationDetail: async (applicationId) => {
    const response = await api.get(`/admin/cp/applications/${applicationId}/`);
    return response.data;
  },

  cpApplicationAction: async (applicationId, action, data = {}) => {
    try {
      let endpoint, payload;

      if (action === "approve") {
        endpoint = `/admin/cp/${applicationId}/approve/`;
        payload = {
          partner_tier: data.partner_tier || "bronze",
          program_start_date: new Date().toISOString().split("T")[0],
          notes: data.notes || "Approved after document verification",
        };
      } else if (action === "reject") {
        endpoint = `/admin/cp/${applicationId}/reject/`;
        payload = {
          rejection_reason:
            data.rejection_reason || data.notes || "Application rejected",
        };
      } else {
        throw new Error("Invalid action");
      }

      const response = await api.post(endpoint, payload);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Action completed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to process application",
        details: error.response?.data,
      };
    }
  },

  // ========================================
  // CP LIST MANAGEMENT (NEW)
  // ========================================
  getCPList: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      if (filters.is_verified !== undefined) {
        params.append("is_verified", filters.is_verified);
      }
      if (filters.is_active !== undefined) {
        params.append("is_active", filters.is_active);
      }
      if (filters.partner_tier) {
        params.append("tier", filters.partner_tier);
      }
      if (filters.search) {
        params.append("search", filters.search);
      }

      const response = await api.get(`/admin/cp/?${params}`);

      return {
        success: true,
        results: response.data.results || response.data,
        count: response.data.count || 0,
      };
    } catch (error) {
      console.error("Error fetching CP list:", error);
      return {
        success: false,
        results: [],
        count: 0,
        error: error.response?.data?.error || "Failed to fetch CP list",
      };
    }
  },

  getCPDetail: async (cpId) => {
    try {
      const response = await api.get(`/admin/cp/${cpId}/`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch CP details",
      };
    }
  },

  // ========================================
  // CP ACTIVATION/DEACTIVATION (NEW)
  // ========================================
  activateCP: async (cpId) => {
    try {
      const response = await api.post(`/admin/cp/${cpId}/activate/`);
      return {
        success: true,
        message: response.data.message || "CP activated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to activate CP",
      };
    }
  },

  deactivateCP: async (cpId) => {
    try {
      const response = await api.post(`/admin/cp/${cpId}/deactivate/`);
      return {
        success: true,
        message: response.data.message || "CP deactivated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to deactivate CP",
      };
    }
  },

  // ========================================
  // CP PROPERTY AUTHORIZATION (NEW)
  // ========================================
  authorizePropertiesToCP: async (cpId, propertyIds) => {
    try {
      const response = await api.post(
        `/admin/cp/${cpId}/authorize-properties/`,
        {
          property_ids: propertyIds,
        }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Properties authorized successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to authorize properties",
      };
    }
  },

  revokePropertyFromCP: async (cpId, propertyId) => {
    try {
      const response = await api.delete(
        `/admin/cp/${cpId}/properties/${propertyId}/`
      );
      return {
        success: true,
        message: response.data.message || "Property authorization revoked",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to revoke authorization",
      };
    }
  },

  getAuthorizedProperties: async (cpId) => {
    try {
      const response = await api.get(`/admin/cp/${cpId}/properties/`);
      return {
        success: true,
        results: response.data.results || response.data,
        count: response.data.count || 0,
      };
    } catch (error) {
      return {
        success: false,
        results: [],
        error:
          error.response?.data?.error ||
          "Failed to fetch authorized properties",
      };
    }
  },

  // Helper: Get all properties for authorization modal
  getAllPropertiesForAuthorization: async () => {
    try {
      const response = await api.get("/admin/properties/");
      return {
        success: true,
        results: response.data.results || response.data,
        count: response.data.count || 0,
      };
    } catch (error) {
      return {
        success: false,
        results: [],
        error: error.response?.data?.error || "Failed to fetch properties",
      };
    }
  },

  createCP: async (cpData) => {
  try {
    const response = await api.post('/admin/cp/create/', cpData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      credentials: response.data.credentials
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create CP',
      errors: error.response?.data?.errors
    };
  }
},
};

export default adminService;
