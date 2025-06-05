import React, { useState } from "react";
import { Input, Button, Typography, Card, message, Alert, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import type { KetQua, Nguyenvong } from "../../types/result";

const { Title, Text } = Typography;

// Dữ liệu kết quả mẫu mô phỏng các trường hợp thực tế
const sampleResults: KetQua[] = [
  {
    cccd: "111111111", // TRÚNG TUYỂN NV1
    fullName: "Nguyễn Văn A",
    trangThaiKetQuaTongThe: "Trúng tuyển NV1",
    nguyenvongDetails: [
      {
        maNguyenvong: "NV1",
        tenNganh: "Công nghệ thông tin",
        tenTruong: "Đại học Bách Khoa Hà Nội",
        diemChuan: 26.0,
        diemDat: 27.5,
        phuongThucXetTuyen: "Điểm thi THPT", // DỮ LIỆU MẪU
        trangThai: "Trúng tuyển",
        ghiChu: "Bạn đã trúng tuyển nguyện vọng 1 và được ưu tiên xét tuyển."
      },
      {
        maNguyenvong: "NV2",
        tenNganh: "Khoa học máy tính",
        tenTruong: "Đại học Công nghệ - ĐHQGHN",
        diemChuan: 25.5,
        diemDat: 26.0,
        phuongThucXetTuyen: "Đánh giá năng lực ĐHQGHN", // DỮ LIỆU MẪU
        trangThai: "Đủ điều kiện xét tuyển", // Trạng thái này sẽ được xử lý lại bằng logic bên dưới
      },
      {
        maNguyenvong: "NV3",
        tenNganh: "An toàn thông tin",
        tenTruong: "Học viện Kỹ thuật Mật mã",
        diemChuan: 24.0,
        diemDat: 25.0,
        phuongThucXetTuyen: "Học bạ THPT", // DỮ LIỆU MẪU
        trangThai: "Đủ điều kiện xét tuyển", // Trạng thái này sẽ được xử lý lại bằng logic bên dưới
      }
    ],
  },
  {
    cccd: "222222222", // TRÚNG TUYỂN CÁC NV SAU (ở đây là NV2)
    fullName: "Trần Thị B",
    trangThaiKetQuaTongThe: "Trúng tuyển các NV sau",
    nguyenvongDetails: [
      {
        maNguyenvong: "NV1",
        tenNganh: "Kinh tế đối ngoại",
        tenTruong: "Đại học Ngoại Thương",
        diemChuan: 27.0,
        diemDat: 26.5,
        phuongThucXetTuyen: "Điểm thi THPT", // DỮ LIỆU MẪU
        trangThai: "Không trúng tuyển",
      },
      {
        maNguyenvong: "NV2",
        tenNganh: "Kinh tế quốc tế",
        tenTruong: "Đại học Kinh Tế Quốc Dân",
        diemChuan: 25.0,
        diemDat: 25.5,
        phuongThucXetTuyen: "Học bạ THPT", // DỮ LIỆU MẪU
        trangThai: "Trúng tuyển", // Trúng tuyển ở đây
      },
      {
        maNguyenvong: "NV3",
        tenNganh: "Marketing",
        tenTruong: "Đại học Thương Mại",
        diemChuan: 24.5,
        diemDat: 25.0,
        phuongThucXetTuyen: "Điểm thi THPT", // DỮ LIỆU MẪU
        trangThai: "Đủ điều kiện xét tuyển", // Trạng thái này sẽ được xử lý lại
      }
    ],
  },
  {
    cccd: "333333333", // KHÔNG TRÚNG TUYỂN NGUYỆN VỌNG NÀO
    fullName: "Lê Văn C",
    trangThaiKetQuaTongThe: "Không trúng tuyển",
    nguyenvongDetails: [
      {
        maNguyenvong: "NV1",
        tenNganh: "Luật Kinh tế",
        tenTruong: "Đại học Luật Hà Nội",
        diemChuan: 24.0,
        diemDat: 23.5,
        phuongThucXetTuyen: "Điểm thi THPT", // DỮ LIỆU MẪU
        trangThai: "Không trúng tuyển",
      },
      {
        maNguyenvong: "NV2",
        tenNganh: "Quản trị kinh doanh",
        tenTruong: "Học viện Tài chính",
        diemChuan: 25.0,
        diemDat: 24.0,
        phuongThucXetTuyen: "Học bạ THPT", // DỮ LIỆU MẪU
        trangThai: "Không trúng tuyển",
      }
    ],
  },
  {
    cccd: "444444444", // CHƯA CÓ KẾT QUẢ
    fullName: "Phạm Thu D",
    trangThaiKetQuaTongThe: "Chưa có kết quả",
    nguyenvongDetails: [], // Không có chi tiết nguyện vọng nếu chưa có kết quả
  },
];

const Results: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState<KetQua | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const processResults = (foundResult: KetQua): KetQua => {
    // Tạo một bản sao để không làm thay đổi dữ liệu gốc
    const processedResult = { ...foundResult };
    if (processedResult.nguyenvongDetails) {
      let hasAdmittedNV = false;
      let admittedNV = "";

      // Duyệt qua từng nguyện vọng
      processedResult.nguyenvongDetails = processedResult.nguyenvongDetails.map(nv => {
        const newNv = { ...nv }; // Tạo bản sao của từng nguyện vọng

        if (hasAdmittedNV) {
          // Nếu đã trúng tuyển ở nguyện vọng trước đó
          newNv.trangThai = "Không trúng tuyển";
          newNv.ghiChu = `Bạn đã trúng tuyển nguyện vọng ${admittedNV}.`;
        } else if (newNv.trangThai === "Trúng tuyển") {
          // Nếu đây là nguyện vọng trúng tuyển đầu tiên
          hasAdmittedNV = true;
          admittedNV = newNv.maNguyenvong;
          // Ghi chú có thể được giữ nguyên hoặc điều chỉnh tùy theo bạn muốn
        }
        return newNv;
      });
    }
    return processedResult;
  };

  const onSearch = () => {
    setError("");
    setResult(null);
    setLoading(true);

    if (!searchValue.trim()) {
      message.warning("Vui lòng nhập CCCD");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const found = sampleResults.find(
        (r) => r.cccd === searchValue.trim()
      );

      if (found) {
        // Xử lý lại trạng thái nguyện vọng trước khi hiển thị
        setResult(processResults(found));
      } else {
        setError("Không tìm thấy kết quả phù hợp với CCCD này. Vui lòng kiểm tra lại thông tin.");
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: KetQua['trangThaiKetQuaTongThe']): "success" | "warning" | "danger" | "secondary" | undefined => {
    switch (status) {
      case "Trúng tuyển NV1":
      case "Trúng tuyển các NV sau":
        return "success";
      case "Không trúng tuyển":
        return "danger";
      case "Chưa có kết quả":
        return "warning";
      default:
        return "secondary";
    }
  };

 return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>Cổng Tra Cứu Kết Quả Tuyển Sinh Đại Học</Title>
      
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 30 }}>
        <Input
          placeholder="Nhập số CCCD/CMND"
          size="large"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={onSearch}
          style={{ width: "50%", marginBottom: 16 }}
        />
        <Button
          type="primary"
          size="large"
          onClick={onSearch}
          loading={loading}
          style={{ width: "50%" }}
        >
          Tra cứu
        </Button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} tip="Đang tra cứu kết quả..." />
        </div>
      )}

      {error && !loading && (
        <Alert
          message="Tra cứu không thành công"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: 20 }}
        />
      )}

      {!loading && result && (
        <Card style={{ marginTop: 20, boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: 8 }}>
          <Title level={4} style={{ borderBottom: "1px solid #eee", paddingBottom: 10, marginBottom: 20 }}>Thông tin Kết quả Tuyển sinh</Title>
          <p><b>Họ và tên:</b> {result.fullName}</p>
          <p><b>CCCD:</b> {result.cccd}</p>
          <p>
            <b>Trạng thái kết quả tổng thể:</b>{" "}
            <Text strong type={getStatusColor(result.trangThaiKetQuaTongThe)}>
              {result.trangThaiKetQuaTongThe}
            </Text>
          </p>

          {result.trangThaiKetQuaTongThe === "Chưa có kết quả" ? (
            <Alert
              message="Thông báo quan trọng"
              description="Hiện tại, kết quả tuyển sinh của bạn chưa được công bố. Vui lòng quay lại tra cứu sau."
              type="info"
              showIcon
              style={{ marginTop: 20 }}
            />
          ) : result.nguyenvongDetails && result.nguyenvongDetails.length > 0 ? (
            <>
              <Title level={5} style={{ marginTop: 30, borderTop: "1px dashed #eee", paddingTop: 20 }}>Chi tiết các nguyện vọng:</Title>
              {result.nguyenvongDetails.map((nv, index) => (
                <Card key={index} size="small" style={{ marginBottom: 15, borderColor: nv.trangThai === "Trúng tuyển" ? "#52c41a" : (nv.trangThai === "Đủ điều kiện xét tuyển" ? "#faad14" : "#ff4d4f") }}>
                  <p><b>{nv.maNguyenvong}:</b> {nv.tenNganh} - {nv.tenTruong}</p>
                  <p><b>Điểm chuẩn:</b> {nv.diemChuan}</p>
                  <p><b>Điểm đạt:</b> {nv.diemDat}</p>
                  <p><b>Phương thức xét tuyển:</b> {nv.phuongThucXetTuyen}</p> {/* HIỂN THỊ TRƯỜNG NÀY */}
                  <p>
                    <b>Trạng thái:</b>{" "}
                    <Text strong type={nv.trangThai === "Trúng tuyển" ? "success" : (nv.trangThai === "Đủ điều kiện xét tuyển" ? "warning" : "danger")}>
                      {nv.trangThai}
                    </Text>
                  </p>
                  {nv.ghiChu && <Text type="secondary" italic>{nv.ghiChu}</Text>}
                </Card>
              ))}
            </>
          ) : (
            <Alert
              message="Không tìm thấy thông tin nguyện vọng chi tiết"
              description="Có thể hệ thống đang cập nhật hoặc bạn không có nguyện vọng nào được đăng ký."
              type="warning"
              showIcon
              style={{ marginTop: 20 }}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default Results;