// cpInviteService.js
// =====================================================
// Service for CP Invite System
// Handles: Send Invites, Track Usage
// =====================================================

import api from './api';

const cpInviteService = {
  /**
   * Get all invites
   * GET /api/cp/invites/
   */
  getInvites: async () => {
    try {
      const response = await api.get('/cp/invites/');
      return {
        success: true,
        count: response.data.count,
        data: response.data.results
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch invites'
      };
    }
  },

  /**
   * Send new invite
   * POST /api/cp/invites/
   */
  sendInvite: async (inviteData) => {
    try {
      const response = await api.post('/cp/invites/', inviteData);
      return {
        success: true,
        data: response.data.data,
        inviteLink: response.data.invite_link,
        message: response.data.message || 'Invite sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send invite',
        details: error.response?.data
      };
    }
  },

  /**
   * Get invite status
   * GET /api/cp/invites/{code}/status/
   */
  getInviteStatus: async (inviteCode) => {
    try {
      const response = await api.get(`/cp/invites/${inviteCode}/status/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch invite status'
      };
    }
  },

  /**
   * Copy invite link to clipboard
   */
  copyInviteLink: async (inviteLink) => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      return {
        success: true,
        message: 'Invite link copied to clipboard!'
      };
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = inviteLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        return {
          success: true,
          message: 'Invite link copied to clipboard!'
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
   * Share invite via WhatsApp
   */
  shareViaWhatsApp: (inviteLink, name, cpName) => {
    const message = encodeURIComponent(
      `Hi ${name},\n\nI'd like to invite you to join AssetKart - a trusted real estate investment platform.\n\nUse my exclusive invite link:\n${inviteLink}\n\nLet me know if you have any questions!\n\nBest regards,\n${cpName}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  },

  /**
   * Share invite via Email
   */
  shareViaEmail: (inviteLink, email, name, cpName) => {
    const subject = encodeURIComponent(`Invitation to Join AssetKart`);
    const body = encodeURIComponent(
      `Hi ${name},\n\nI'd like to personally invite you to join AssetKart, a trusted real estate investment platform where you can invest in premium properties.\n\nUse my exclusive invite link to sign up:\n${inviteLink}\n\nWhy AssetKart?\n• Verified properties\n• Low minimum investment\n• High returns\n• Transparent process\n\nFeel free to reach out if you have any questions!\n\nBest regards,\n${cpName}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  },

  /**
   * Format phone number for display
   */
  formatPhone: (phone) => {
    // Format: +91 98765 43210
    if (phone.startsWith('+91')) {
      const number = phone.substring(3);
      return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
    }
    return phone;
  },

  /**
   * Calculate days until expiry
   */
  getDaysUntilExpiry: (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  },

  /**
   * Check if invite is valid
   */
  isInviteValid: (invite) => {
    return !invite.is_used && !invite.is_expired && invite.is_valid;
  },

  /**
   * Get invite status badge info
   */
  /**
 * Get invite status badge info
 */
getStatusBadge: (invite) => {
  if (invite.is_used) {
    return { 
      label: 'Used', 
      color: '#28a745',
      className: 'used'
    };
  }
  if (invite.is_expired || !invite.is_valid) {
    return { 
      label: 'Expired', 
      color: '#dc3545',
      className: 'expired'
    };
  }
  return { 
    label: 'Active', 
    color: '#007bff',
    className: 'active'
  };
}
};

export default cpInviteService;