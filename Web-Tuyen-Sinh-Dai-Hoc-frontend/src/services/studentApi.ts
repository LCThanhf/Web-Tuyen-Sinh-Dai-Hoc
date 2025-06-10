// Student API service - comprehensive service for all student-related operations
import { apiClient } from './api';
import type { ApiResponse } from './api';

// Types for student data
export interface PersonalInfo {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  ethnicity: string;
  religion?: string;
  cccd: string;
  cccdIssueDate: string;
  cccdIssuePlace: string;
  permanentAddress: string;
  currentAddress: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  cccdFrontFile?: string;
  cccdBackFile?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  adminNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Score {
  id?: string;
  type: 'THPT' | 'TRANSCRIPT' | 'ASSESSMENT';
  examNumber?: string;
  examBan?: string;
  scores: { [key: string]: number | number[] }; // Support both single scores and arrays
  subjectAverages?: { [key: string]: number };
  averageOverall?: number;
  assessmentType?: string;
  assessmentUnit?: string;
  assessmentScore?: number;
  noScoreDeclared?: boolean;
  files?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt?: string;
  updatedAt?: string;
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
  personalInfo?: PersonalInfo;
}

export const studentApi = {
  // Personal Information
  getPersonalInfo: async (): Promise<PersonalInfo | null> => {
    const response = await apiClient.get<ApiResponse<PersonalInfo>>('/student/personal-info');
    return response.data.data;
  },

  // Get complete student profile (new method for handling actual backend response)
  getStudentProfile: async (): Promise<StudentWithPersonalInfo | null> => {
    const response = await apiClient.get<ApiResponse<StudentWithPersonalInfo>>('/student/personal-info');
    return response.data.data;
  },

  updatePersonalInfo: async (data: Partial<PersonalInfo>): Promise<PersonalInfo> => {
    const response = await apiClient.put<ApiResponse<PersonalInfo>>('/student/personal-info', data);
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

  // Score file upload methods
  uploadExamFile: async (file: File, scoreId?: string): Promise<{ fileUrl: string; score: Score }> => {
    const formData = new FormData();
    formData.append('examFile', file);
    if (scoreId) formData.append('scoreId', scoreId);
    
    const response = await apiClient.post<ApiResponse<{ fileUrl: string; score: Score }>>('/student/scores/upload-exam-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  uploadTranscriptFile: async (file: File, scoreId?: string): Promise<{ fileUrl: string; score: Score }> => {
    const formData = new FormData();
    formData.append('transcriptFile', file);
    if (scoreId) formData.append('scoreId', scoreId);
    
    const response = await apiClient.post<ApiResponse<{ fileUrl: string; score: Score }>>('/student/scores/upload-transcript-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  uploadAssessmentFile: async (file: File, scoreId?: string): Promise<{ fileUrl: string; score: Score }> => {
    const formData = new FormData();
    formData.append('assessmentFile', file);
    if (scoreId) formData.append('scoreId', scoreId);
    
    const response = await apiClient.post<ApiResponse<{ fileUrl: string; score: Score }>>('/student/scores/upload-assessment-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
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