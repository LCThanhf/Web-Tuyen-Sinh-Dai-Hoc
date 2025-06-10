// Status/Application management service for the Status page
import { apiClient } from './api';
import type { ApiResponse } from './api';

// Types for the Status component
export interface StatusApplication {
  id: string;
  stt: number;
  method: string;
  schoolCode: string;
  school: string;
  majorCode: string;
  major: string;
  combo?: string;
  unit?: string;
  calculatedScore: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionDate: string;
  lastUpdated: string;
}

export interface StatusFormData {
  method: string;
  schoolCode: string;
  majorCode: string;
  combo?: string;
  unit?: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
}

export interface Major {
  id: string;
  name: string;
  code: string;
  schoolId: string;
}

export interface AdmissionCombination {
  id: string;
  name: string;
  subjects: string[];
}

// Backend application response format
interface BackendApplication {
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
  createdAt: string;
  updatedAt: string;
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

export class StatusService {
  // Cache for combinations to avoid repeated API calls
  private static combinationsCache: AdmissionCombination[] | null = null;

  // Get student's applications
  static async getApplications(): Promise<StatusApplication[]> {
    try {
      const response = await apiClient.get<ApiResponse<BackendApplication[]>>('/student/applications');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch applications');
      }

      // Load combinations data if not cached
      if (!this.combinationsCache) {
        this.combinationsCache = await this.getAdmissionCombinations();
      }

      return response.data.data.map((app, index) => this.transformApplication(app, index + 1));
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Vui lòng đăng nhập để xem nguyện vọng của bạn.');
      }
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách nguyện vọng.');
    }
  }

  // Submit new application
  static async submitApplication(formData: StatusFormData): Promise<StatusApplication> {
    try {
      const applicationData = {
        schoolId: formData.schoolCode,
        majorId: formData.majorCode,
        admissionMethod: formData.method,
        combinationId: formData.combo ? await this.getCombinationIdByName(formData.combo) : undefined,
        organizingUnit: formData.unit
      };

      const response = await apiClient.post<ApiResponse<BackendApplication>>('/student/applications', applicationData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to submit application');
      }

      return this.transformApplication(response.data.data, 1); // Priority order will be updated on refetch
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Dữ liệu không hợp lệ.');
      }
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi nộp nguyện vọng.');
    }
  }

  // Delete application
  static async deleteApplication(applicationId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`/student/applications/${applicationId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete application');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa nguyện vọng.');
    }
  }

  // Get all schools
  static async getSchools(): Promise<School[]> {
    try {
      const response = await apiClient.get<ApiResponse<School[]>>('/schools');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch schools');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error('Có lỗi xảy ra khi tải danh sách trường.');
    }
  }

  // Get majors by school
  static async getMajorsBySchool(schoolId: string): Promise<Major[]> {
    try {
      const response = await apiClient.get<ApiResponse<Major[]>>(`/majors?schoolId=${schoolId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch majors');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error('Có lỗi xảy ra khi tải danh sách ngành.');
    }
  }

  // Get admission combinations
  static async getAdmissionCombinations(): Promise<AdmissionCombination[]> {
    try {
      // Return cached data if available
      if (this.combinationsCache) {
        return this.combinationsCache;
      }

      const response = await apiClient.get<ApiResponse<AdmissionCombination[]>>('/combinations');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch combinations');
      }

      // Cache the result
      this.combinationsCache = response.data.data;
      return response.data.data;
    } catch (error: any) {
      throw new Error('Có lỗi xảy ra khi tải danh sách tổ hợp môn.');
    }
  }

  // Clear combinations cache (useful for refresh)
  static clearCombinationsCache(): void {
    this.combinationsCache = null;
  }

  // Helper method to get combination ID by name
  private static async getCombinationIdByName(combinationName: string): Promise<string | undefined> {
    try {
      const combinations = await this.getAdmissionCombinations();
      const combination = combinations.find(c => c.name === combinationName);
      return combination?.id;
    } catch (error) {
      console.warn('Could not fetch combination ID for:', combinationName);
      return undefined;
    }
  }
  // Transform backend application to frontend format
  private static transformApplication(app: BackendApplication, stt: number): StatusApplication {
    let method = app.admissionMethod;
    let combo: string | undefined;
    let unit: string | undefined;

    // Determine if it's a score-based method (should show combination)
    const isScoreBased = method === 'Điểm THPT' || 
                        method === 'Học bạ' ||
                        method === 'Điểm THPT / Học bạ';

    // For score-based methods, use combination if available
    if (isScoreBased && app.combinationId && this.combinationsCache) {
      const combination = this.combinationsCache.find(c => c.id === app.combinationId);
      combo = combination ? combination.name : 'Tổ hợp không xác định';
    }

    // For assessment methods, use organizing unit
    if (!isScoreBased && app.organizingUnit) {
      unit = app.organizingUnit;
    }

    return {
      id: app.id,
      stt: app.priorityOrder || stt,
      method,
      schoolCode: app.school.code,
      school: app.school.name,
      majorCode: app.major.code,
      major: app.major.name,
      combo,
      unit,
      calculatedScore: 0, // Would be calculated based on student's scores
      status: app.status,
      submissionDate: app.submissionDate,
      lastUpdated: app.updatedAt // Fix: use updatedAt from backend response
    };
  }

  // Update application priority order (if backend supports it)
  static async updateApplicationPriority(applicationId: string, newPriorityOrder: number): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<any>>(`/student/applications/${applicationId}/priority`, {
        priorityOrder: newPriorityOrder
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update priority');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thứ tự nguyện vọng.');
    }
  }
}
