import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const studentApi = {
  // Personal Information
  getPersonalInfo: async () => {
    const response = await axios.get(`${API_BASE_URL}/student/personal-info`);
    return response.data;
  },

  updatePersonalInfo: async (data: any) => {
    const response = await axios.put(`${API_BASE_URL}/student/personal-info`, data);
    return response.data;
  },

  // Scores
  getScores: async () => {
    const response = await axios.get(`${API_BASE_URL}/student/scores`);
    return response.data;
  },

  saveScore: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/student/scores`, data);
    return response.data;
  },

  // Priority
  getPriority: async () => {
    const response = await axios.get(`${API_BASE_URL}/student/priority`);
    return response.data;
  },

  updatePriority: async (data: any) => {
    const response = await axios.put(`${API_BASE_URL}/student/priority`, data);
    return response.data;
  },

  // Achievement
  getAchievement: async () => {
    const response = await axios.get(`${API_BASE_URL}/student/achievement`);
    return response.data;
  },

  updateAchievement: async (data: any) => {
    const response = await axios.put(`${API_BASE_URL}/student/achievement`, data);
    return response.data;
  },

  // Certificate
  getCertificate: async () => {
    const response = await axios.get(`${API_BASE_URL}/student/certificate`);
    return response.data;
  },

  updateCertificate: async (data: any) => {
    const response = await axios.put(`${API_BASE_URL}/student/certificate`, data);
    return response.data;
  },
};