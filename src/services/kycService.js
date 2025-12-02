import api from './api';

const kycService = {
  // Upload Aadhaar PDF
// Upload Aadhaar PDF
  uploadAadhaar: async (file, yob, fullName) => {
    try {
      const formData = new FormData();
      formData.append('pdf_file', file);  // Changed from 'file' to 'pdf_file'
      if (yob) formData.append('yob', yob);
      if (fullName) formData.append('full_name', fullName);

      const response = await api.post('/kyc/aadhaar/upload-pdf/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to upload Aadhaar' };
    }
  },

  // Verify PAN
  verifyPAN: async (panNumber) => {
    try {
      const response = await api.post('/kyc/pan/verify/', {
        pan_number: panNumber,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to verify PAN' };
    }
  },

 // Verify Bank Account
  verifyBank: async (accountNumber, ifscCode) => {
    try {
      const response = await api.post('/kyc/bank/verify/', {
        id_number: accountNumber,  // Changed from account_number
        ifsc: ifscCode,            // Changed from ifsc_code
        ifsc_details: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to verify bank account' };
    }
  },

  // Skip Bank Verification
  skipBank: async () => {
    try {
      // Just return success - bank is optional
      return { success: true, message: 'Bank verification skipped' };
    } catch (error) {
      throw error.response?.data || { error: 'Failed to skip bank verification' };
    }
  },

  // Get KYC Status
  getKYCStatus: async () => {
    try {
      const response = await api.get('/kyc/status/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch KYC status' };
    }
  },

  // Get Full KYC Details
  getKYCDetails: async () => {
    try {
      const response = await api.get('/kyc/me/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch KYC details' };
    }
  },
};

export default kycService;