// cpPropertyService.js
// =====================================================
// Service for CP Property Operations
// Handles: Authorized Properties, Referral Links
// =====================================================

import api from './api';

const cpPropertyService = {
  /**
   * Get authorized properties
   * GET /api/cp/properties/
   */
  getAuthorizedProperties: async () => {
    try {
      const response = await api.get('/cp/properties/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch properties'
      };
    }
  },

  /**
   * Get referral link for specific property
   * GET /api/cp/properties/{property_id}/referral-link/
   */
  getReferralLink: async (propertyId) => {
    try {
      const response = await api.get(`/cp/properties/${propertyId}/referral-link/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch referral link'
      };
    }
  },

  /**
   * Share via WhatsApp
   */
  shareViaWhatsApp: (link, propertyName) => {
    const message = encodeURIComponent(
      `Check out this amazing investment opportunity: ${propertyName}\n\n${link}\n\nInvest with confidence!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  },

  /**
   * Share via Facebook
   */
  shareViaFacebook: (link) => {
    const url = encodeURIComponent(link);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'width=600,height=400'
    );
  },

  /**
   * Share via Twitter
   */
  shareViaTwitter: (link, propertyName) => {
    const text = encodeURIComponent(`Check out ${propertyName} - Great investment opportunity!`);
    const url = encodeURIComponent(link);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=600,height=400'
    );
  },

  /**
   * Share via LinkedIn
   */
  shareViaLinkedIn: (link) => {
    const url = encodeURIComponent(link);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'width=600,height=400'
    );
  },

  /**
   * Share via Email
   */
  shareViaEmail: (link, propertyName, cpName) => {
    const subject = encodeURIComponent(`Investment Opportunity: ${propertyName}`);
    const body = encodeURIComponent(
      `Hi,\n\nI wanted to share this exciting investment opportunity with you:\n\n${propertyName}\n\n${link}\n\nFeel free to reach out if you have any questions!\n\nBest regards,\n${cpName}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  },

  /**
   * Copy link to clipboard
   */
  copyToClipboard: async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      return {
        success: true,
        message: 'Link copied to clipboard!'
      };
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        return {
          success: true,
          message: 'Link copied to clipboard!'
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: 'Failed to copy link'
        };
      }
    }
  },

  /**
   * Download brochure
   */
  downloadBrochure: async (propertyId, propertyName) => {
    try {
      // If custom brochure exists, download it
      // Otherwise, trigger system-generated brochure download
      const response = await api.get(
        `/cp/properties/${propertyId}/brochure/`,
        { responseType: 'blob' }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${propertyName}_Brochure.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'Brochure downloaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to download brochure'
      };
    }
  }
};

export default cpPropertyService;