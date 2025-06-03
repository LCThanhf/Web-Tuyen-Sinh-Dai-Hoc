import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Result } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Dữ liệu giả định cho trạng thái hồ sơ (bạn sẽ thay bằng dữ liệu thực tế từ API)
  const hoSoDaNop = false; // Ví dụ: chưa nộp hồ sơ
  const hoSoHopLe = false;
  const ketQuaTuyểnSinh = null; // Ví dụ: chưa có kết quả

  return (
    <div>
      <Title level={3}>Chào mừng bạn đến với Hệ thống Tuyển sinh!</Title>
      <Text>Bạn có thể theo dõi quá trình nộp hồ sơ, tra cứu kết quả và cập nhật thông tin cá nhân tại đây.</Text>

      <Row gutter={[24, 24]} style={{ marginTop: 30 }}>
        {/* Card Trạng thái hồ sơ */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            title="Trạng thái hồ sơ của bạn"
            bordered={false}
            actions={[
              <Button type="link" onClick={() => navigate('/student/status')}>Xem chi tiết</Button>
            ]}
          >
            {!hoSoDaNop ? (
              <Result
                icon={<InfoCircleOutlined style={{ color: '#1890ff' }} />}
                title="Bạn chưa đăng ký thông tin sinh."
                extra={<Button type="primary" onClick={() => navigate('/student/info-registration')}>Đăng ký ngay</Button>}
                style={{ padding: '0 0 24px 0' }}
              />
            ) : (
              <>
                <p>Tình trạng: {hoSoHopLe ? <Text type="success"><CheckCircleOutlined /> Đã nộp và hợp lệ</Text> : <Text type="warning"><ExclamationCircleOutlined /> Đã nộp, đang chờ duyệt/có lỗi</Text>}</p>
                <p>Nguyện vọng đã đăng ký: 3 nguyện vọng</p> {/* Dữ liệu giả định */}
                <p>Hồ sơ đã nộp: 15/05/2025</p> {/* Dữ liệu giả định */}
              </>
            )}
          </Card>
        </Col>

        {/* Card Tra cứu kết quả */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            title="Kết quả tuyển sinh"
            bordered={false}
            actions={[
              <Button type="link" onClick={() => navigate('/student/results')}>Tra cứu kết quả</Button>
            ]}
          >
            {ketQuaTuyểnSinh ? (
              <Result
                status="success"
                title="Chúc mừng bạn đã trúng tuyển!"
                subTitle="Hãy xem chi tiết kết quả và hướng dẫn nhập học."
                style={{ padding: '0 0 24px 0' }}
              />
            ) : (
              <Result
                icon={<InfoCircleOutlined style={{ color: '#faad14' }} />}
                title="Kết quả chưa có"
                subTitle="Kết quả tuyển sinh sẽ được công bố vào [Ngày công bố kết quả]."
                style={{ padding: '0 0 24px 0' }}
              />
            )}
          </Card>
        </Col>

        {/* Card Liên kết nhanh / Thông báo */}
        <Col xs={24} sm={24} lg={8}>
          <Card
            title="Thông báo & Hỗ trợ"
            bordered={false}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong><InfoCircleOutlined /> Cập nhật Quy chế tuyển sinh 2025</Text>
              <Text type="secondary">Vui lòng đọc kỹ các quy định mới nhất của Bộ GD&ĐT.</Text>
              <Button type="link" size="small">Xem chi tiết</Button>
              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '10px 0' }} />
              <Text strong><InfoCircleOutlined /> Hướng dẫn tải lên minh chứng</Text>
              <Text type="secondary">Đảm bảo các file minh chứng của bạn rõ ràng và đúng định dạng.</Text>
              <Button type="link" size="small">Xem hướng dẫn</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Title level={4}>Bạn muốn làm gì tiếp theo ?</Title>
        <Space size="large">
          <Button type="primary" size="middle"  style={{ width: '186px' }} onClick={() => navigate('/student/register-nguyenvong')}>Đăng ký nguyện vọng</Button>
          <Button type="primary" size="middle"  style={{ width: '186px' }} onClick={() => navigate('/student/profile')}>Cập nhật thông tin</Button>
        </Space>
      </div>
    </div>
  );
};

export default StudentDashboardPage;