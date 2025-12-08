// cpApplicationService.js
// =====================================================
// CP Application & Profile Service
// Handles CP profile management and updates
// =====================================================

import api from './api';

const cpApplicationService = {
  /**
   * Get CP Profile
   * @returns {Promise<Object>} CP profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/cp/profile/');
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get CP Profile Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 
               error.response?.data?.message || 
               'Failed to load profile'
      };
    }
  },

  /**
   * Update CP Profile
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.company_name - Company name (if agent_type=company)
   * @param {string} profileData.business_address - Business address
   * @param {string} profileData.bank_name - Bank name
   * @param {string} profileData.account_number - Bank account number
   * @param {string} profileData.ifsc_code - Bank IFSC code
   * @param {string} profileData.account_holder_name - Account holder name
   * @returns {Promise<Object>} Updated profile data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.patch('/cp/profile/', profileData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update CP Profile Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 
               error.response?.data?.message || 
               'Failed to update profile'
      };
    }
  },

  /**
   * Get CP Application Status
   * Used for checking application status on /cp/application-status page
   * @returns {Promise<Object>} Application status
   */
  getApplicationStatus: async () => {
    try {
      const response = await api.get('/cp/application/status/');
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Application Status Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 
               error.response?.data?.message || 
               'Failed to load application status'
      };
    }
  },

/**
 * Apply as CP (Public endpoint - no auth required)
 * @param {Object} applicationData - Application form data
 * @returns {Promise<Object>} Application submission result
 */
apply: async (applicationData) => {
  try {
    const response = await api.post('/cp/apply/', applicationData);
    
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Application submitted successfully'
    };
  } catch (error) {
    console.error('CP Application Error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 
             error.response?.data?.message || 
             'Failed to submit application'
    };
  }
},

  /**
   * Upload Document
   * @param {string} documentType - Type of document (pan, gst, rera, bank_proof, address_proof)
   * @param {File} file - Document file
   * @returns {Promise<Object>} Upload result
   */
  uploadDocument: async (documentType, file) => {
    try {
      const formData = new FormData();
      formData.append('document_type', documentType);
      formData.append('file', file);

      const response = await api.post('/cp/documents/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        data: response.data,
        message: 'Document uploaded successfully'
      };
    } catch (error) {
      console.error('Upload Document Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 
               error.response?.data?.message || 
               'Failed to upload document'
      };
    }
  },

  /**
   * Get CP Documents List
   * @returns {Promise<Object>} List of uploaded documents
   */
  getDocuments: async () => {
    try {
      const response = await api.get('/cp/documents/');
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Documents Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 
               error.response?.data?.message || 
               'Failed to load documents'
      };
    }
  },

  /**
   * Delete Document
   * @param {number} documentId - Document ID
   * @returns {Promise<Object>} Deletion result
   */
  deleteDocument: async (documentId) => {
    try {
      await api.delete(`/cp/documents/${documentId}/`);
      
      return {
        success: true,
        message: 'Document deleted successfully'
      };
    } catch (error) {
      console.error('Delete Document Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 
               error.response?.data?.message || 
               'Failed to delete document'
      };
    }
  },

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  },

  /**
   * Format tier name
   * @param {string} tier - Tier slug (bronze, silver, gold, platinum)
   * @returns {string} Formatted tier name
   */
  formatTierName: (tier) => {
    if (!tier) return 'Bronze';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  },

  /**
   * Get tier badge color
   * @param {string} tier - Tier slug
   * @returns {string} Color code
   */
  getTierColor: (tier) => {
    const colors = {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2'
    };
    return colors[tier?.toLowerCase()] || colors.bronze;
  },

  /**
   * Validate IFSC Code
   * @param {string} ifsc - IFSC code to validate
   * @returns {boolean} Is valid
   */
  validateIFSC: (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  },

  /**
   * Validate PAN Number
   * @param {string} pan - PAN number to validate
   * @returns {boolean} Is valid
   */
  validatePAN: (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  },

  /**
   * Validate GST Number
   * @param {string} gst - GST number to validate
   * @returns {boolean} Is valid
   */
  validateGST: (gst) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  },

  /**
   * Validate Bank Account Number
   * @param {string} accountNumber - Account number to validate
   * @returns {boolean} Is valid
   */
  validateAccountNumber: (accountNumber) => {
    // Bank account numbers in India are typically 9-18 digits
    const accountRegex = /^[0-9]{9,18}$/;
    return accountRegex.test(accountNumber);
  }
};

export default cpApplicationService;
