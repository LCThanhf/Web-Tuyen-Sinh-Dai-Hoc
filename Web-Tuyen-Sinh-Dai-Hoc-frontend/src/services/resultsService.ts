import { apiClient, type ApiResponse } from './api';
import type { BackendResultsResponse, KetQua, Nguyenvong, BackendApplicationResult } from '../types/result';

export class ResultsService {
  // Check results by CCCD - Public endpoint
  static async checkResultsByCCCD(cccd: string): Promise<KetQua> {
    try {
      const response = await apiClient.get<ApiResponse<BackendResultsResponse>>(
        `/results/check/${cccd}`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch results');
      }

      return this.transformBackendResponse(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy kết quả phù hợp với CCCD này. Vui lòng kiểm tra lại thông tin.');
      } else if (error.response?.status === 400) {
        throw new Error('Số CCCD không đúng định dạng. Vui lòng nhập lại.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Có lỗi xảy ra khi tra cứu kết quả. Vui lòng thử lại sau.');
      }
    }
  }

  // Get authenticated student's results
  static async getMyResults(): Promise<KetQua> {
    try {
      const response = await apiClient.get<ApiResponse<BackendResultsResponse>>(
        `/results/my-results`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch results');
      }

      return this.transformBackendResponse(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Vui lòng đăng nhập để xem kết quả của bạn.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Có lỗi xảy ra khi tải kết quả. Vui lòng thử lại sau.');
      }
    }
  }  // Transform backend response to frontend format
  private static transformBackendResponse(backendData: BackendResultsResponse): KetQua {
    // Transform applications to nguyenvong details
    const nguyenvongDetails: Nguyenvong[] = backendData.applications.map((app) => {
      // Map backend status to frontend status
      let trangThai: "Trúng tuyển" | "Không trúng tuyển" | "Đủ điều kiện xét tuyển";
      switch (app.status) {
        case 'APPROVED':
          trangThai = "Trúng tuyển";
          break;
        case 'PENDING':
          trangThai = "Đủ điều kiện xét tuyển";
          break;
        case 'REJECTED':
        default:
          trangThai = "Không trúng tuyển";
          break;
      }

      return {
        maNguyenvong: `NV${app.priorityOrder}`,
        tenNganh: app.majorName,
        tenTruong: app.schoolName,
        diemChuan: app.cutoffScore,
        diemDat: app.studentScore,
        phuongThucXetTuyen: this.inferAdmissionMethod(app),
        trangThai,
        priorityOrder: app.priorityOrder,
        isAboveCutoff: app.isAboveCutoff,
        ghiChu: this.generateNote(app, trangThai, app.priorityOrder === 1)
      };
    });

    // Map backend overall status to frontend format
    let trangThaiKetQuaTongThe: "Trúng tuyển NV1" | "Trúng tuyển các NV sau" | "Không trúng tuyển" | "Chưa có kết quả";
    
    // Check backend overall status first, then verify with individual applications
    if (backendData.overallStatus === 'Trúng tuyển') {
      // Check if admitted to first choice
      const firstChoiceAdmitted = nguyenvongDetails.some(nv => nv.priorityOrder === 1 && nv.trangThai === "Trúng tuyển");
      trangThaiKetQuaTongThe = firstChoiceAdmitted ? "Trúng tuyển NV1" : "Trúng tuyển các NV sau";
    } else if (backendData.overallStatus === 'Chờ kết quả') {
      trangThaiKetQuaTongThe = "Chưa có kết quả";
    } else {
      trangThaiKetQuaTongThe = "Không trúng tuyển";
    }

    return {
      cccd: backendData.cccd,
      fullName: backendData.fullName,
      trangThaiKetQuaTongThe,
      nguyenvongDetails,
      totalScore: backendData.totalScore
    };
  }
  // Infer admission method based on application data
  private static inferAdmissionMethod(_app: BackendApplicationResult): string {
    // Since this info isn't in the backend response, we'll use a generic label
    // You may want to extend the backend to include this information
    return "Xét tuyển theo hồ sơ năng lực";
  }

  // Generate appropriate notes for each application
  private static generateNote(
    app: BackendApplicationResult, 
    trangThai: string, 
    isFirstChoice: boolean
  ): string | undefined {
    if (trangThai === "Trúng tuyển") {
      if (isFirstChoice) {
        return "Bạn đã trúng tuyển nguyện vọng 1 và được ưu tiên xét tuyển.";
      } else {
        return `Bạn đã trúng tuyển nguyện vọng ${app.priorityOrder}.`;
      }
    } else if (trangThai === "Không trúng tuyển" && app.cutoffScore && app.studentScore) {
      const gap = app.cutoffScore - app.studentScore;
      return `Điểm của bạn thấp hơn điểm chuẩn ${gap.toFixed(2)} điểm.`;
    } else if (trangThai === "Đủ điều kiện xét tuyển") {
      return "Hồ sơ của bạn đang được xem xét. Vui lòng theo dõi kết quả.";
    }
    return undefined;
  }

  // Get admission statistics (public endpoint)
  static async getAdmissionStatistics() {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/results/statistics');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch statistics');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching admission statistics:', error);
      throw new Error('Có lỗi xảy ra khi tải thống kê tuyển sinh.');
    }
  }

  // Get admission updates (public endpoint)
  static async getAdmissionUpdates() {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/results/updates');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch updates');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching admission updates:', error);
      throw new Error('Có lỗi xảy ra khi tải cập nhật tuyển sinh.');
    }
  }
}
