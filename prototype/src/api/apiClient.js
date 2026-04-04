import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (userData) => apiClient.post('/users/register', userData),
  login: (credentials) => apiClient.post('/users/login', credentials),
  getProfile: (userId) => apiClient.get(`/users/${userId}`),
  updateProfile: (userId, userData) => apiClient.put(`/users/${userId}`, userData),
};

export const policyAPI = {
  calculatePremium: (data) => apiClient.post('/policies/calculate-premium', data),
  createPolicy: (data) => apiClient.post('/policies', data),
  getActivePolicy: (userId) => apiClient.get(`/policies/user/${userId}`),
};

export const claimAPI = {
  getClaims: (userId) => apiClient.get(`/claims/user/${userId}`),
  getClaimDetails: (claimId) => apiClient.get(`/claims/${claimId}`),
  requestClaim: (claimData) => apiClient.post('/claims/request', claimData),
};

export const eventAPI = {
  triggerEvent: (eventData) => apiClient.post('/events/trigger', eventData),
};

export const analyticsAPI = {
  getWorkerAnalytics: (userId) => apiClient.get(`/analytics/worker/${userId}`),
  getAdminAnalytics: () => apiClient.get('/analytics/admin'),
};

export default apiClient;
