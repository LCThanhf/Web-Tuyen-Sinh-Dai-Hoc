export interface CreateStudentRequest {
  email: string;
  password: string;
  fullName: string;
  citizenId: string;
  phone: string;
  dob: string;
  gender: 'MALE' | 'FEMALE';
  cccdIssuePlace: string;
  cccdIssueDate: string;
  address: string;
  city: string;
  district: string;
  highSchoolName: string;
  graduationYear: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdatePersonalInfoRequest {
  fullName?: string;
  phone?: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE';
  cccdIssuePlace?: string;
  cccdIssueDate?: string;
  address?: string;
  city?: string;
  district?: string;
  highSchoolName?: string;
  graduationYear?: number;
}