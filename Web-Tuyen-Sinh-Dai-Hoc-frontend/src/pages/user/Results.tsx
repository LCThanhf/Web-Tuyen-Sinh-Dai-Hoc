import React, { useState } from "react";
import { Input, Button, Typography, Card, message, Alert, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import type { KetQua } from "../../types/result";
import { ResultsService } from "../../services/resultsService";

const { Title, Text } = Typography;

const Results: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState<KetQua | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const processResults = (foundResult: KetQua): KetQua => {
    // The ResultsService already handles the logic for determining status
    // based on priority order, so we can use the data as-is
    const processedResult = { ...foundResult };
    
    if (processedResult.nguyenvongDetails) {
      let hasAdmittedNV = false;
      let admittedNV = "";

      // Sort by priority order first
      processedResult.nguyenvongDetails.sort((a, b) => a.priorityOrder - b.priorityOrder);

      // Process each application
      processedResult.nguyenvongDetails = processedResult.nguyenvongDetails.map(nv => {
        const newNv = { ...nv };

        if (hasAdmittedNV) {
          // If already admitted to a higher priority choice, mark others as not admitted
          if (newNv.trangThai !== "Trúng tuyển") {
            newNv.trangThai = "Không trúng tuyển";
            newNv.ghiChu = `Bạn đã trúng tuyển nguyện vọng ${admittedNV}.`;
          }
        } else if (newNv.trangThai === "Trúng tuyển") {
          // Mark this as the admitted choice
          hasAdmittedNV = true;
          admittedNV = newNv.maNguyenvong;
        }

        return newNv;
      });
    }
    
    return processedResult;
  };

  const onSearch = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    if (!searchValue.trim()) {
      message.warning("Vui lòng nhập CCCD");
      setLoading(false);
      return;
    }

    try {
      const resultData = await ResultsService.checkResultsByCCCD(searchValue.trim());
      setResult(processResults(resultData));
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi tra cứu kết quả. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
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
                  {nv.diemChuan && <p><b>Điểm chuẩn:</b> {nv.diemChuan}</p>}
                  {nv.diemDat && <p><b>Điểm đạt:</b> {nv.diemDat}</p>}
                  {result.totalScore && <p><b>Tổng điểm của bạn:</b> {result.totalScore.toFixed(2)}</p>}
                  {nv.phuongThucXetTuyen && <p><b>Phương thức xét tuyển:</b> {nv.phuongThucXetTuyen}</p>}
                  <p>
                    <b>Trạng thái:</b>{" "}
                    <Text strong type={nv.trangThai === "Trúng tuyển" ? "success" : (nv.trangThai === "Đủ điều kiện xét tuyển" ? "warning" : "danger")}>
                      {nv.trangThai}
                    </Text>
                  </p>
                  {nv.isAboveCutoff !== undefined && nv.diemChuan && nv.diemDat && (
                    <p>
                      <b>So với điểm chuẩn:</b>{" "}
                      <Text type={nv.isAboveCutoff ? "success" : "danger"}>
                        {nv.isAboveCutoff ? "Đạt điểm chuẩn" : "Chưa đạt điểm chuẩn"}
                      </Text>
                    </p>
                  )}
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