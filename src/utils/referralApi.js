import axios from 'axios';
import { VITE_APP_API_URL } from './constants';

// User referral API functions
export const referralApi = {
  // Get user's referral transactions (both as referrer and referred)
  getUserReferralTransactions: async () => {
    try {
      const response = await axios.get(`${VITE_APP_API_URL}/api/auth/referral-transactions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user referral transactions:', error);
      throw error;
    }
  },

  // Get user's referral code and stats
  getUserReferralStats: async () => {
    try {
      const response = await axios.get(`${VITE_APP_API_URL}/api/auth/referral-stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user referral stats:', error);
      throw error;
    }
  },

  // Generate referral link
  generateReferralLink: (referralCode) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${referralCode}`;
  }
};

// Admin referral API functions
export const adminReferralApi = {
  // Get all referral transactions for admin
  getAllReferralTransactions: async (page = 1, limit = 10, status = 'all') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status !== 'all' && { status })
      });
      
      const response = await axios.get(`${VITE_APP_API_URL}/api/admin/referral-transactions?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching referral transactions:', error);
      throw error;
    }
  },

  // Get specific referral transaction details
  getReferralTransaction: async (id) => {
    try {
      const response = await axios.get(`${VITE_APP_API_URL}/api/admin/referral-transaction/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching referral transaction:', error);
      throw error;
    }
  },

  // Approve referral transaction
  approveReferralTransaction: async (id, rewardAmount, notes = '') => {
    try {
      const response = await axios.put(`${VITE_APP_API_URL}/api/admin/referral-transaction/${id}`, {
        action: 'approve',
        rewardAmount,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error approving referral transaction:', error);
      throw error;
    }
  },

  // Reject referral transaction
  rejectReferralTransaction: async (id, reason) => {
    try {
      const response = await axios.put(`${VITE_APP_API_URL}/api/admin/referral-transaction/${id}`, {
        action: 'reject',
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting referral transaction:', error);
      throw error;
    }
  },

  // Update referral transaction (status, rewardAmount, rejectionReason)
  updateReferralTransaction: async (id, updateData) => {
    try {
      const response = await axios.put(`${VITE_APP_API_URL}/api/admin/referral-transaction/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating referral transaction:', error);
      throw error;
    }
  },

  // Note: Admin doesn't need referral stats as per requirements
};

export default referralApi;
