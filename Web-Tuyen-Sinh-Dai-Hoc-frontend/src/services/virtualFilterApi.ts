// Virtual Filter API service for admission simulation
import { apiClient } from './api';
import type { ApiResponse } from './api';

// Types for virtual filter operations
export interface VirtualFilterRequest {
  schoolId?: string;
  majorId?: string;
  minScore?: number;
  maxResults?: number;
  simulationMode?: boolean;
}

export interface AdmissionResult {
  studentId: string;
  studentName: string;
  cccd: string;
  totalScore: number;
  majorId: string;
  majorName: string;
  schoolId: string;
  schoolName: string;
  priorityOrder: number;
  admissionStatus: 'ADMITTED' | 'WAITLIST' | 'REJECTED';
  rank: number;
}

export interface VirtualFilterResponse {
  results: AdmissionResult[];
  summary: {
    totalProcessed: number;
    admitted: number;
    waitlisted: number;
    rejected: number;
    averageScore: string;
    majorsProcessed: number;
  };
  simulationMode: boolean;
}

export interface QuotaInfo {
  majorId: string;
  majorName: string;
  majorCode: string;
  school: {
    id: string;
    name: string;
    code: string;
  };
  quota: number;
  currentAdmitted: number;
  currentPending: number;
  totalApplications: number;
  availableSlots: number;
  fillPercentage: string;
  competitionRatio: string;
}

export interface CutoffPrediction {
  majorId: string;
  majorName: string;
  schoolName: string;
  quota: number;
  totalApplications: number;
  predictedCutoff: string;
  minScore: string;
  maxScore: string;
  averageScore: string;
  competitionRatio: string;
}

export interface QuotaScenario {
  quota: number;
  description?: string;
}

export interface ScenarioResult {
  quota: number;
  description: string;
  admitted: number;
  cutoffScore: string;
  averageAdmittedScore: string;
  competitionRatio: string;
}

export interface QuotaSimulationResponse {
  majorInfo: {
    id: string;
    name: string;
    schoolName: string;
    currentQuota: number;
  };
  totalApplications: number;
  scenarios: ScenarioResult[];
}

const virtualFilterApi = {
  // Main virtual filtering endpoint
  runVirtualFilter: async (request: VirtualFilterRequest): Promise<VirtualFilterResponse> => {
    const response = await apiClient.post<ApiResponse<VirtualFilterResponse>>(
      '/virtual-filter/run',
      request
    );
    return response.data.data;
  },

  // Get admission quotas and current fill status
  getAdmissionQuotas: async (schoolId?: string): Promise<QuotaInfo[]> => {
    const params = new URLSearchParams();
    if (schoolId) params.append('schoolId', schoolId);
    
    const response = await apiClient.get<ApiResponse<QuotaInfo[]>>(
      `/virtual-filter/quotas?${params.toString()}`
    );
    return response.data.data;
  },

  // Get cutoff score predictions
  getCutoffPredictions: async (majorId?: string, schoolId?: string): Promise<CutoffPrediction[]> => {
    const params = new URLSearchParams();
    if (majorId) params.append('majorId', majorId);
    if (schoolId) params.append('schoolId', schoolId);
    
    const response = await apiClient.get<ApiResponse<CutoffPrediction[]>>(
      `/virtual-filter/cutoffs?${params.toString()}`
    );
    return response.data.data;
  },

  // Simulate different quota scenarios
  simulateQuotaScenarios: async (majorId: string, scenarios: QuotaScenario[]): Promise<QuotaSimulationResponse> => {
    const response = await apiClient.post<ApiResponse<QuotaSimulationResponse>>(
      '/virtual-filter/simulate',
      { majorId, scenarios }
    );
    return response.data.data;
  }
};

export default virtualFilterApi;
