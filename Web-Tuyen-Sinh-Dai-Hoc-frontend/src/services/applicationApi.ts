// Application API service
import { apiClient } from './api';
import type { ApiResponse } from './api';

// Types for application data
export interface School {
  id: string;
  name: string;
  code: string;
  totalQuota: number;
  createdAt: string;
  admissionMethods: AdmissionMethod[];
  majors: Major[];
}

export interface Major {
  id: string;
  name: string;
  code: string;
  quota: number;
  schoolId: string;
  school?: School;
  combinations: MajorCombination[];
}

export interface AdmissionMethod {
  id: string;
  name: string;
  description?: string;
  schoolId: string;
}

export interface AdmissionCombination {
  id: string;
  name: string;
  subjects: string[];
}

export interface MajorCombination {
  majorId: string;
  combinationId: string;
  combination: AdmissionCombination;
}

export interface Application {
  id: string;
  studentId: string;
  schoolId: string;
  majorId: string;
  priority: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  submittedAt: string;
  school: School;
  major: Major;
}

export interface ApplicationRequest {
  schoolId: string;
  majorId: string;
  priority: number;
}

export const applicationApi = {
  // Get all schools with their majors and admission methods
  getSchools: async (): Promise<School[]> => {
    const response = await apiClient.get<ApiResponse<School[]>>('/schools');
    return response.data.data;
  },

  // Get specific school by ID
  getSchool: async (id: string): Promise<School> => {
    const response = await apiClient.get<ApiResponse<School>>(`/schools/${id}`);
    return response.data.data;
  },

  // Get majors (optionally filtered by school)
  getMajors: async (schoolId?: string): Promise<Major[]> => {
    const endpoint = schoolId ? `/majors?schoolId=${schoolId}` : '/majors';
    const response = await apiClient.get<ApiResponse<Major[]>>(endpoint);
    return response.data.data;
  },

  // Get specific major by ID
  getMajor: async (id: string): Promise<Major> => {
    const response = await apiClient.get<ApiResponse<Major>>(`/majors/${id}`);
    return response.data.data;
  },

  // Get admission combinations
  getAdmissionCombinations: async (): Promise<AdmissionCombination[]> => {
    const response = await apiClient.get<ApiResponse<AdmissionCombination[]>>('/combinations');
    return response.data.data;
  },

  // Get combinations for a specific major
  getMajorCombinations: async (majorId: string): Promise<AdmissionCombination[]> => {
    const response = await apiClient.get<ApiResponse<AdmissionCombination[]>>(`/majors/${majorId}/combinations`);
    return response.data.data;
  },

  // Student application operations
  getMyApplications: async (): Promise<Application[]> => {
    const response = await apiClient.get<ApiResponse<Application[]>>('/student/applications');
    return response.data.data;
  },

  submitApplication: async (applicationData: ApplicationRequest): Promise<Application> => {
    const response = await apiClient.post<ApiResponse<Application>>('/student/applications', applicationData);
    return response.data.data;
  },

  deleteApplication: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/student/applications/${id}`);
    return response.data;
  },
};