export interface Nguyenvong {
  maNguyenvong: string;
  tenNganh: string;
  tenTruong: string;
  diemChuan?: number;
  diemDat?: number;
  phuongThucXetTuyen?: string;
  trangThai: "Trúng tuyển" | "Không trúng tuyển" | "Đủ điều kiện xét tuyển";
  ghiChu?: string;
  priorityOrder: number;
  isAboveCutoff?: boolean;
}

export interface KetQua {
  cccd: string;
  fullName: string;
  trangThaiKetQuaTongThe: "Trúng tuyển NV1" | "Trúng tuyển các NV sau" | "Không trúng tuyển" | "Chưa có kết quả";
  nguyenvongDetails?: Nguyenvong[];
  totalScore?: number;
}

// Backend API response interfaces
export interface BackendApplicationResult {
  majorName: string;
  schoolName: string;
  priorityOrder: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  cutoffScore?: number;
  studentScore?: number;
  isAboveCutoff?: boolean;
}

export interface BackendResultsResponse {
  cccd: string;
  fullName: string;
  overallStatus: string;
  applications: BackendApplicationResult[];
  totalScore?: number;
}