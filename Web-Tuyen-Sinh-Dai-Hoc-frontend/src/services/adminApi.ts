// Admin API service for application management
import { apiClient } from './api';
import type { ApiResponse } from './api';

// Types for admin application data
export interface AdminApplication {
  id: string;
  studentId: string;
  schoolId: string;
  majorId: string;
  combinationId?: string;
  admissionMethod: string;
  organizingUnit?: string;
  priorityOrder: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionDate: string;
  adminNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  student: {
    id: string;
    user: {
      fullName: string;
      cccd: string;
      email: string;
      phone?: string;
    };
  };
  school: {
    id: string;
    name: string;
    code: string;
  };
  major: {
    id: string;
    name: string;
    code: string;
  };
}

export interface ApplicationFilter {
  page?: number;
  limit?: number;
  schoolId?: string;
  majorId?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ApplicationsResponse {
  applications: AdminApplication[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApproveRejectRequest {
  adminNote?: string;
}

// Types for school management
export interface AdminAdmissionMethod {
  id?: string;
  name: string;
  percentage: number;
}

export interface AdminMajorCombination {
  id: string;
  name: string;
  subjects: string[];
}

export interface AdminMajor {
  id: string;
  name: string;
  code: string;
  schoolId: string;
  quota: number;
  isActive: boolean;
  school: {
    id: string;
    name: string;
    code: string;
  };
  combinations: Array<{
    combination: AdminMajorCombination;
  }>;
  _count: {
    applications: number;
  };
}

export interface AdminSchool {
  id: string;
  name: string;
  code: string;
  totalQuota: number;
  isActive?: boolean;
  admissionMethods: AdminAdmissionMethod[];
  majors: AdminMajor[];
  _count?: {
    majors: number;
    applications: number;
  };
}

export interface CreateSchoolRequest {
  name: string;
  code: string;
  totalQuota: number;
  admissionMethods: Omit<AdminAdmissionMethod, 'id'>[];
}

export interface UpdateSchoolRequest {
  name: string;
  code: string;
  totalQuota: number;
  admissionMethods: Omit<AdminAdmissionMethod, 'id'>[];
}

export interface CreateMajorRequest {
  name: string;
  code: string;
  schoolId: string;
  quota: number;
  admissionCombinationIds?: string[];
}

export interface UpdateMajorRequest {
  name: string;
  code: string;
  schoolId: string;
  quota: number;
  admissionCombinationIds?: string[];
}

export interface CreateCombinationRequest {
  name: string;
  subjects: string[];
}

export interface UpdateCombinationRequest {
  name: string;
  subjects: string[];
}

// Types for student management
export interface AdminStudent {
  id: string;
  userId: string;
  dob?: string;
  gender?: string;
  cccdIssuePlace?: string;
  cccdIssueDate?: string;
  address?: string;
  city?: string;
  district?: string;
  highSchoolName?: string;
  graduationYear?: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    cccd: string;
    fullName: string;
    email: string;
    phone?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
  personalInfo?: {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
  };
  scores: Array<{
    id: string;
    type: string;
    scores: any;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
  }>;
  priorities: Array<{
    id: string;
    priorityArea?: string;
    priorityObject?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }>;
  achievements: Array<{
    id: string;
    achievementType: string;
    description?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }>;
  certificates: Array<{
    id: string;
    certificateType: string;
    issuingBody?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }>;
  applications: Array<{
    id: string;
    priorityOrder: number;
    admissionMethod: string;
    organizingUnit?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    submissionDate: string;
    adminNote?: string;
    school: {
      id: string;
      name: string;
      code: string;
    };
    major: {
      id: string;
      name: string;
      code: string;
    };
  }>;
}

export interface StudentsFilter {
  page?: number;
  limit?: number;
  search?: string;
}

export interface StudentsResponse {
  students: AdminStudent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Types for document verification
export interface DocumentVerificationRequest {
  adminNote?: string;
}

export interface DocumentFilter {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface DocumentsResponse<T> {
  documents: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PersonalInfoDocument {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      cccd: string;
    };
  };
}

export interface ScoreDocument {
  id: string;
  type: string;
  scores: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  student: {
    id: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      cccd: string;
    };
  };
}

export interface PriorityDocument {
  id: string;
  priorityArea?: string;
  priorityObject?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  student: {
    id: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      cccd: string;
    };
  };
}

export interface AchievementDocument {
  id: string;
  achievementType: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  student: {
    id: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      cccd: string;
    };
  };
}

export interface CertificateDocument {
  id: string;
  certificateType: string;
  issuingBody?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  student: {
    id: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      cccd: string;
    };
  };
}

export const adminApi = {
  // Application management
  getApplications: async (filters: ApplicationFilter = {}): Promise<ApplicationsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.schoolId) params.append('schoolId', filters.schoolId);
    if (filters.majorId) params.append('majorId', filters.majorId);
    if (filters.status) params.append('status', filters.status);

    const response = await apiClient.get<ApiResponse<ApplicationsResponse>>(
      `/admin/applications?${params.toString()}`
    );
    return response.data.data;
  },

  approveApplication: async (id: string, data: ApproveRejectRequest): Promise<AdminApplication> => {
    const response = await apiClient.put<ApiResponse<AdminApplication>>(
      `/admin/applications/${id}/approve`,
      data
    );
    return response.data.data;
  },

  rejectApplication: async (id: string, data: ApproveRejectRequest): Promise<AdminApplication> => {
    const response = await apiClient.put<ApiResponse<AdminApplication>>(
      `/admin/applications/${id}/reject`,
      data
    );
    return response.data.data;
  },

  // School management
  getSchools: async (): Promise<AdminSchool[]> => {
    const response = await apiClient.get<ApiResponse<AdminSchool[]>>('/admin/schools');
    return response.data.data;
  },

  getSchool: async (id: string): Promise<AdminSchool> => {
    const response = await apiClient.get<ApiResponse<AdminSchool>>(`/admin/schools/${id}`);
    return response.data.data;
  },

  createSchool: async (data: CreateSchoolRequest): Promise<AdminSchool> => {
    const response = await apiClient.post<ApiResponse<AdminSchool>>('/admin/schools', data);
    return response.data.data;
  },

  updateSchool: async (id: string, data: UpdateSchoolRequest): Promise<AdminSchool> => {
    const response = await apiClient.put<ApiResponse<AdminSchool>>(`/admin/schools/${id}`, data);
    return response.data.data;
  },

  deleteSchool: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/admin/schools/${id}`);
  },

  // Major management within schools
  getMajors: async (schoolId?: string): Promise<AdminMajor[]> => {
    const params = schoolId ? `?schoolId=${schoolId}` : '';
    const response = await apiClient.get<ApiResponse<AdminMajor[]>>(`/admin/majors${params}`);
    return response.data.data;
  },

  getMajor: async (id: string): Promise<AdminMajor> => {
    const response = await apiClient.get<ApiResponse<AdminMajor>>(`/admin/majors/${id}`);
    return response.data.data;
  },

  createMajor: async (data: CreateMajorRequest): Promise<AdminMajor> => {
    const response = await apiClient.post<ApiResponse<AdminMajor>>('/admin/majors', data);
    return response.data.data;
  },

  updateMajor: async (id: string, data: UpdateMajorRequest): Promise<AdminMajor> => {
    const response = await apiClient.put<ApiResponse<AdminMajor>>(`/admin/majors/${id}`, data);
    return response.data.data;
  },

  deleteMajor: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/admin/majors/${id}`);
  },
  // Admission combinations
  getCombinations: async (): Promise<AdminMajorCombination[]> => {
    const response = await apiClient.get<ApiResponse<AdminMajorCombination[]>>('/admin/combinations');
    return response.data.data;
  },

  getCombination: async (id: string): Promise<AdminMajorCombination> => {
    const response = await apiClient.get<ApiResponse<AdminMajorCombination>>(`/admin/combinations/${id}`);
    return response.data.data;
  },

  createCombination: async (data: CreateCombinationRequest): Promise<AdminMajorCombination> => {
    const response = await apiClient.post<ApiResponse<AdminMajorCombination>>('/admin/combinations', data);
    return response.data.data;
  },

  updateCombination: async (id: string, data: UpdateCombinationRequest): Promise<AdminMajorCombination> => {
    const response = await apiClient.put<ApiResponse<AdminMajorCombination>>(`/admin/combinations/${id}`, data);
    return response.data.data;
  },

  deleteCombination: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/admin/combinations/${id}`);
  },

  // Student management
  getStudents: async (filters: StudentsFilter = {}): Promise<StudentsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);

    const response = await apiClient.get<ApiResponse<StudentsResponse>>(
      `/admin/students?${params.toString()}`
    );
    return response.data.data;
  },

  getStudent: async (id: string): Promise<AdminStudent> => {
    const response = await apiClient.get<ApiResponse<AdminStudent>>(`/admin/students/${id}`);
    return response.data.data;
  },

  // Document verification - Personal Info
  getPersonalInfoDocuments: async (filters: DocumentFilter = {}): Promise<DocumentsResponse<PersonalInfoDocument>> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);

    const response = await apiClient.get<ApiResponse<DocumentsResponse<PersonalInfoDocument>>>(
      `/admin/documents/personal-info?${params.toString()}`
    );
    return response.data.data;
  },

  approvePersonalInfo: async (id: string, data: DocumentVerificationRequest = {}): Promise<PersonalInfoDocument> => {
    const response = await apiClient.put<ApiResponse<PersonalInfoDocument>>(
      `/admin/documents/personal-info/${id}/approve`,
      data
    );
    return response.data.data;
  },

  rejectPersonalInfo: async (id: string, data: DocumentVerificationRequest): Promise<PersonalInfoDocument> => {
    const response = await apiClient.put<ApiResponse<PersonalInfoDocument>>(
      `/admin/documents/personal-info/${id}/reject`,
      data
    );
    return response.data.data;
  },

  // Document verification - Scores
  getScoreDocuments: async (filters: DocumentFilter = {}): Promise<DocumentsResponse<ScoreDocument>> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);

    const response = await apiClient.get<ApiResponse<DocumentsResponse<ScoreDocument>>>(
      `/admin/documents/scores?${params.toString()}`
    );
    return response.data.data;
  },

  approveScores: async (id: string, data: DocumentVerificationRequest = {}): Promise<ScoreDocument> => {
    const response = await apiClient.put<ApiResponse<ScoreDocument>>(
      `/admin/documents/scores/${id}/approve`,
      data
    );
    return response.data.data;
  },

  rejectScores: async (id: string, data: DocumentVerificationRequest): Promise<ScoreDocument> => {
    const response = await apiClient.put<ApiResponse<ScoreDocument>>(
      `/admin/documents/scores/${id}/reject`,
      data
    );
    return response.data.data;
  },

  // Document verification - Priority
  getPriorityDocuments: async (filters: DocumentFilter = {}): Promise<DocumentsResponse<PriorityDocument>> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);

    const response = await apiClient.get<ApiResponse<DocumentsResponse<PriorityDocument>>>(
      `/admin/documents/priority?${params.toString()}`
    );
    return response.data.data;
  },

  approvePriority: async (id: string, data: DocumentVerificationRequest = {}): Promise<PriorityDocument> => {
    const response = await apiClient.put<ApiResponse<PriorityDocument>>(
      `/admin/documents/priority/${id}/approve`,
      data
    );
    return response.data.data;
  },

  rejectPriority: async (id: string, data: DocumentVerificationRequest): Promise<PriorityDocument> => {
    const response = await apiClient.put<ApiResponse<PriorityDocument>>(
      `/admin/documents/priority/${id}/reject`,
      data
    );
    return response.data.data;
  },

  // Document verification - Achievements
  getAchievementDocuments: async (filters: DocumentFilter = {}): Promise<DocumentsResponse<AchievementDocument>> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);

    const response = await apiClient.get<ApiResponse<DocumentsResponse<AchievementDocument>>>(
      `/admin/documents/achievement?${params.toString()}`
    );
    return response.data.data;
  },

  approveAchievement: async (id: string, data: DocumentVerificationRequest = {}): Promise<AchievementDocument> => {
    const response = await apiClient.put<ApiResponse<AchievementDocument>>(
      `/admin/documents/achievement/${id}/approve`,
      data
    );
    return response.data.data;
  },

  rejectAchievement: async (id: string, data: DocumentVerificationRequest): Promise<AchievementDocument> => {
    const response = await apiClient.put<ApiResponse<AchievementDocument>>(
      `/admin/documents/achievement/${id}/reject`,
      data
    );
    return response.data.data;
  },

  // Document verification - Certificates
  getCertificateDocuments: async (filters: DocumentFilter = {}): Promise<DocumentsResponse<CertificateDocument>> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);

    const response = await apiClient.get<ApiResponse<DocumentsResponse<CertificateDocument>>>(
      `/admin/documents/certificate?${params.toString()}`
    );
    return response.data.data;
  },

  approveCertificate: async (id: string, data: DocumentVerificationRequest = {}): Promise<CertificateDocument> => {
    const response = await apiClient.put<ApiResponse<CertificateDocument>>(
      `/admin/documents/certificate/${id}/approve`,
      data
    );
    return response.data.data;
  },

  rejectCertificate: async (id: string, data: DocumentVerificationRequest): Promise<CertificateDocument> => {
    const response = await apiClient.put<ApiResponse<CertificateDocument>>(
      `/admin/documents/certificate/${id}/reject`,
      data
    );
    return response.data.data;
  },

  // Generic document verification APIs
  getPendingDocuments: async (type?: string): Promise<any[]> => {
    const params = type ? `?type=${type}` : '';
    const response = await apiClient.get<ApiResponse<any[]>>(`/admin/documents${params}`);
    return response.data.data;
  },

  approveDocument: async (type: string, id: string, data: DocumentVerificationRequest = {}): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>(
      `/admin/documents/${type}/${id}/approve`,
      data
    );
    return response.data.data;
  },

  rejectDocument: async (type: string, id: string, data: DocumentVerificationRequest): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>(
      `/admin/documents/${type}/${id}/reject`,
      data
    );
    return response.data.data;
  },
};
