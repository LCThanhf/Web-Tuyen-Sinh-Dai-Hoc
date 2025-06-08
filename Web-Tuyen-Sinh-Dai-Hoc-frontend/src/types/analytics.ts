// TypeScript interfaces for Analytics data structures

// Dashboard Overview Types
export interface DashboardOverview {
  totalStudents: number;
  totalSchools: number;
  totalMajors: number;
  totalApplications: number;
}

export interface ApplicationsSummary {
  pending: number;
  approved: number;
  rejected: number;
  approvalRate: string;
}

export interface DashboardStats {
  overview: DashboardOverview;
  applications: ApplicationsSummary;
}

// School Statistics Types
export interface SchoolApplicationStat {
  school: {
    id: string;
    name: string;
    code: string;
  };
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  majors: Array<{
    major: {
      id: string;
      name: string;
      code: string;
    };
    applicationCount: number;
  }>;
}

// Major Statistics Types
export interface MajorApplicationStat {
  major: {
    id: string;
    name: string;
    code: string;
  };
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  schools: Array<{
    school: {
      id: string;
      name: string;
      code: string;
    };
    applicationCount: number;
  }>;
}

// Status Statistics Types
export interface StatusStats {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  count: number;
  percentage: string;
}

// Recent Applications Types
export interface RecentApplication {
  id: string;
  student: {
    user: {
      fullName: string;
      cccd: string;
    };
  };
  school: {
    name: string;
    code: string;
  };
  major: {
    name: string;
    code: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionDate: string;
  priorityOrder: number;
}

// Document Statistics Types
export interface DocumentTypeStats {
  type: string;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  approvalRate: string;
}

export interface DocumentStats {
  byType: DocumentTypeStats[];
  summary: {
    totalDocuments: number;
    pendingDocuments: number;
    approvedDocuments: number;
    rejectedDocuments: number;
    overallApprovalRate: string;
  };
}

// Application Trends Types
export interface TrendDataPoint {
  date: string;
  applications: number;
  approvals: number;
  rejections: number;
}

export interface ApplicationTrends {
  data: TrendDataPoint[];
  summary: {
    totalApplications: number;
    averagePerDay: string;
    peakDay: {
      date: string;
      count: number;
    };
  };
}

// Combined Analytics Data Type
export interface AnalyticsData {
  dashboard?: DashboardStats;
  schools?: SchoolApplicationStat[];
  majors?: MajorApplicationStat[];
  status?: StatusStats[];
  recent?: RecentApplication[];
  documents?: DocumentStats;
  trends?: ApplicationTrends;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
