// Student API service - comprehensive service for all student-related operations
import { apiClient } from './api';
import type { ApiResponse } from './api';

// Types for student data - updated to match backend structure
export interface PersonalInfo {
  id?: string;
  // User registration data (read-only)
  fullName?: string;
  cccd?: string;
  email?: string;
  // Editable personal info
  dob?: string;
  gender?: 'MALE' | 'FEMALE';
  cccdIssuePlace?: string;
  cccdIssueDate?: string;
  address?: string;
  city?: string;
  district?: string;
  highSchoolName?: string;
  graduationYear?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  adminNote?: string;
}

export interface Score {
  id?: string;
  examType: 'THPT' | 'DGNL' | 'COMPETENCY';
  subject: string;
  score: number;
  year: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface Priority {
  id?: string;
  studentId?: string;
  priorityArea: string;
  priorityObject: string;
  areaFile?: string;
  objectFile?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Achievement {
  id?: string;
  name: string;
  type: 'ACADEMIC' | 'SPORTS' | 'ARTS' | 'OTHER';
  level: 'DISTRICT' | 'PROVINCE' | 'NATIONAL' | 'INTERNATIONAL';
  year: number;
  organization: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface Certificate {
  id?: string;
  name: string;
  type: 'LANGUAGE' | 'IT' | 'PROFESSIONAL' | 'OTHER';
  level?: string;
  issueDate: string;
  issueOrganization: string;
  expiryDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

// Interface for the actual backend response structure
export interface StudentWithPersonalInfo {
  student: {
    id: string;
    userId: string;
    dob?: string;
    gender?: 'MALE' | 'FEMALE';
    cccdIssuePlace?: string;
    cccdIssueDate?: string;
    address?: string;
    city?: string;
    district?: string;
    highSchoolName?: string;
    graduationYear?: number;
    user: {
      cccd: string;
      fullName: string;
      email: string;
      phone: string;
    };
  };
  personalInfo?: {
    id: string;
    studentId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    adminNote?: string;
    reviewedAt?: string;
    reviewedBy?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const studentApi = {
  // Personal Information - updated to handle backend response
  getPersonalInfo: async (): Promise<PersonalInfo | null> => {
    try {
      const response = await apiClient.get<ApiResponse<StudentWithPersonalInfo>>('/student/personal-info');
      const data = response.data.data;
      
      if (!data) return null;
      
      // Map backend response to frontend format
      return {
        id: data.personalInfo?.id,
        // User registration data (read-only)
        fullName: data.student.user.fullName,
        cccd: data.student.user.cccd,
        email: data.student.user.email,
        // Editable personal info
        dob: data.student.dob,
        gender: data.student.gender,
        cccdIssuePlace: data.student.cccdIssuePlace,
        cccdIssueDate: data.student.cccdIssueDate,
        address: data.student.address,
        city: data.student.city,
        district: data.student.district,
        highSchoolName: data.student.highSchoolName,
        graduationYear: data.student.graduationYear?.toString(),
        status: data.personalInfo?.status || 'PENDING',
        rejectionReason: data.personalInfo?.adminNote,
        adminNote: data.personalInfo?.adminNote
      };
    } catch (error) {
      console.error('Error fetching personal info:', error);
      return null;
    }
  },

  // Get complete student profile
  getStudentProfile: async (): Promise<StudentWithPersonalInfo | null> => {
    const response = await apiClient.get<ApiResponse<StudentWithPersonalInfo>>('/student/personal-info');
    return response.data.data;
  },

  updatePersonalInfo: async (data: Partial<PersonalInfo>): Promise<PersonalInfo> => {
    // Map frontend data to backend expected format (only send editable fields)
    const backendData = {
      dob: data.dob,
      gender: data.gender,
      cccdIssuePlace: data.cccdIssuePlace,
      cccdIssueDate: data.cccdIssueDate,
      address: data.address,
      city: data.city,
      district: data.district,
      highSchoolName: data.highSchoolName,
      graduationYear: data.graduationYear
    };

    const response = await apiClient.put<ApiResponse<any>>('/student/personal-info', backendData);
    return response.data.data;
  },

  deletePersonalInfo: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>('/student/personal-info');
    return response.data;
  },

  // Scores
  getScores: async (): Promise<Score[]> => {
    const response = await apiClient.get<ApiResponse<Score[]>>('/student/scores');
    return response.data.data;
  },

  saveScore: async (data: Partial<Score>): Promise<Score> => {
    const response = await apiClient.post<ApiResponse<Score>>('/student/scores', data);
    return response.data.data;
  },

  deleteScore: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/student/scores/${id}`);
    return response.data;
  },

  // Priority
  getPriority: async (): Promise<Priority | null> => {
    const response = await apiClient.get<ApiResponse<Priority>>('/student/priority');
    return response.data.data;
  },

  updatePriority: async (data: Partial<Priority>): Promise<Priority> => {
    const response = await apiClient.put<ApiResponse<Priority>>('/student/priority', data);
    return response.data.data;
  },

  deletePriority: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>('/student/priority');
    return response.data;
  },

  // Achievement
  getAchievement: async (): Promise<Achievement | null> => {
    const response = await apiClient.get<ApiResponse<Achievement>>('/student/achievement');
    return response.data.data;
  },

  updateAchievement: async (data: Partial<Achievement>): Promise<Achievement> => {
    const response = await apiClient.put<ApiResponse<Achievement>>('/student/achievement', data);
    return response.data.data;
  },

  deleteAchievement: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>('/student/achievement');
    return response.data;
  },

  // Certificate
  getCertificate: async (): Promise<Certificate | null> => {
    const response = await apiClient.get<ApiResponse<Certificate>>('/student/certificate');
    return response.data.data;
  },

  updateCertificate: async (data: Partial<Certificate>): Promise<Certificate> => {
    const response = await apiClient.put<ApiResponse<Certificate>>('/student/certificate', data);
    return response.data.data;
  },

  deleteCertificate: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>('/student/certificate');
    return response.data;
  },
};