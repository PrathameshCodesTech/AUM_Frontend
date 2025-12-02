import api from './api';

const authService = {
  // Send OTP to mobile number
// Send OTP to mobile number
  sendOTP: async (phoneNumber, isSignup = false, name = '', email = '') => {
    try {
      const payload = { 
        phone: phoneNumber,
        is_signup: isSignup
      };
      
      // If signup, include name and email
      if (isSignup) {
        payload.name = name;
        payload.email = email;
      }

      const response = await api.post('/auth/send-otp/', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to send OTP' };
    }
  },

  // Verify OTP
  verifyOTP: async (phoneNumber, otp) => {
    try {
      const response = await api.post('/auth/verify-otp/', {
        phone: phoneNumber,
        otp: otp,
      });
      
      // Store tokens if verification successful
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Invalid OTP' };
    }
  },

  // Complete registration (after OTP verification for new users)
  completeRegistration: async (phoneNumber, name, email) => {
    try {
      const response = await api.post('/auth/register/', {
        phone: phoneNumber,
        name: name,
        email: email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout/');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } catch (error) {
      // Clear tokens even if API call fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
  // Complete user profile
  completeProfile: async (profileData) => {
    try {
      const response = await api.post('/auth/complete-profile/', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to complete profile' };
    }
  },
};

export default authService;