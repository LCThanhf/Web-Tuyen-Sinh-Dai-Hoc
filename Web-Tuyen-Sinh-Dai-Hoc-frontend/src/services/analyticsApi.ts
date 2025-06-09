// Analytics API Service for Admin Dashboard
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to create headers with auth
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API call function with error handling
const makeApiCall = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: createAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API call failed');
    }

    return data.data;
  } catch (error) {
    console.error(`Analytics API Error (${endpoint}):`, error);
    throw error;
  }
};

// Analytics API functions for all 7 endpoints
export const analyticsApi = {
  // 1. Dashboard Overview Statistics
  getDashboardStats: async () => {
    return await makeApiCall('/analytics/dashboard');
  },

  // 2. School-wise Application Statistics
  getSchoolStats: async () => {
    return await makeApiCall('/analytics/schools');
  },

  // 3. Major-wise Application Statistics  
  getMajorStats: async () => {
    return await makeApiCall('/analytics/majors');
  },

  // 4. Application Status Statistics
  getStatusStats: async () => {
    return await makeApiCall('/analytics/status');
  },

  // 5. Recent Applications Activity
  getRecentApplications: async () => {
    return await makeApiCall('/analytics/recent');
  },

  // 6. Document Verification Statistics
  getDocumentStats: async () => {
    return await makeApiCall('/analytics/documents');
  },

  // 7. Application Trends (30-day)
  getApplicationTrends: async () => {
    return await makeApiCall('/analytics/trends');
  }
};

export default analyticsApi;
