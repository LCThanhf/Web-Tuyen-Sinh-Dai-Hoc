export interface Nguyenvong {
  maNguyenvong: string;
  tenNganh: string;
  tenTruong: string;
  diemChuan: number;
  diemDat: number;
  phuongThucXetTuyen: string;
  trangThai: "Trúng tuyển" | "Không trúng tuyển" | "Đủ điều kiện xét tuyển";
  ghiChu?: string;
}

export interface KetQua {
  cccd: string;
  fullName: string;
  trangThaiKetQuaTongThe: "Trúng tuyển NV1" | "Trúng tuyển các NV sau" | "Không trúng tuyển" | "Chưa có kết quả";
  nguyenvongDetails?: Nguyenvong[];
}