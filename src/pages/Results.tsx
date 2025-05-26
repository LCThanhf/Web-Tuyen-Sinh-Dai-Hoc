import React, { useState } from "react";
import { Input, Button, Typography, Card, message } from "antd";

const { Title, Text } = Typography;

interface KetQua {
  cccd: string;
  fullName: string;
  school: string;
  major: string;
  method: string;
  score: number;
  admissionStatus: string;
}

// Dữ liệu kết quả mẫu
const sampleResults: KetQua[] = [
  {
    cccd: "123456789",
    fullName: "Nguyễn Văn A",
    school: "Đại học Bách Khoa",
    major: "Công nghệ thông tin",
    method: "Điểm thi THPT",
    score: 26.5,
    admissionStatus: "Đã nhập học",
  },
  {
    cccd: "987654321",
    fullName: "Trần Thị B",
    school: "Đại học Kinh Tế",
    major: "Kinh tế quốc tế",
    method: "Học bạ",
    score: 24.0,
    admissionStatus: "Chưa nhập học",
  },
];

const Results: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState<KetQua | null>(null);
  const [error, setError] = useState("");

  const onSearch = () => {
    setError("");
    setResult(null);
    if (!searchValue.trim()) {
      message.warning("Vui lòng nhập CCCD hoặc Số báo danh");
      return;
    }

    // Tìm kết quả theo CCCD hoặc số báo danh (mình giả lập CCCD)
    const found = sampleResults.find(
      (r) => r.cccd === searchValue.trim()
    );

    if (found) {
      setResult(found);
    } else {
      setError("Không tìm thấy kết quả phù hợp.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Title level={3}>Tra cứu Kết quả Tuyển sinh</Title>
      <Input.Search
        placeholder="Nhập CCCD hoặc Số báo danh"
        enterButton="Tra cứu"
        size="middle"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={onSearch}
      />

      {error && (
        <Text type="danger" style={{ marginTop: 20, display: "block" }}>
          {error}
        </Text>
      )}

      {result && (
        <Card style={{ marginTop: 20 }}>
          <Title level={4}>Kết quả trúng tuyển</Title>
          <p><b>Họ tên:</b> {result.fullName}</p>
          <p><b>Trường:</b> {result.school}</p>
          <p><b>Ngành:</b> {result.major}</p>
          <p><b>Phương thức xét tuyển:</b> {result.method}</p>
          <p><b>Điểm:</b> {result.score}</p>
          <p><b>Trạng thái nhập học:</b> {result.admissionStatus}</p>
        </Card>
      )}
    </div>
  );
};

export default Results;
