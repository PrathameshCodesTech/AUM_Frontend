import api from './api';

const cpInviteService = {
  // Get CP's permanent invite
  getPermanentInvite: async () => {
    try {
      const response = await api.get('/cp/permanent-invite/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get permanent invite' };
    }
  },

  // Get list of signups via invite
  getInviteSignups: async (status = null, search = null) => {
    try {
      const params = {};
      if (status) params.status = status;
      if (search) params.search = search;
      
      const response = await api.get('/cp/invite-signups/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get signups' };
    }
  },

  // 🆕 NEW: Send invite via email
  sendInviteEmail: async (email) => {
    try {
      const response = await api.post('/cp/send-invite-email/', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to send email' };
    }
  },

  // Copy link to clipboard
  copyLink: async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      return true;
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  },

  // Share via WhatsApp
  shareViaWhatsApp: (link, cpName) => {
    const message = `Hi! 👋

Join AssetKart and start investing in premium real estate! 🏢

Use my referral link to sign up:
${link}

You'll be linked to me and I can guide you through your investment journey.

Best regards,
${cpName}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  },

  // Share via Email
  shareViaEmail: (link, cpName) => {
    const subject = 'Join AssetKart - Start Investing Today!';
    const body = `Hi,

I'd like to invite you to join AssetKart, a platform for investing in premium real estate.

Use my referral link to sign up:
${link}

Looking forward to seeing you there!

Best regards,
${cpName}`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  },

  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  },

  // Format date
  formatDate: (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Format phone
  formatPhone: (phone) => {
    if (!phone) return '-';
    // +919876543212 → +91 98765 43212
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
  },
};

export default cpInviteService;