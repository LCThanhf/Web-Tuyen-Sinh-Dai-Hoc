import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, Result, Spin } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../../services/studentApi';
import { applicationApi } from '../../services/applicationApi';

const { Title, Text } = Typography;

interface DashboardData {
  hasPersonalInfo: boolean;
  personalInfoStatus: string;
  applicationCount: number;
  applications: any[];
  hasSubmittedApplication: boolean;
}

const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    hasPersonalInfo: false,
    personalInfoStatus: 'PENDING',
    applicationCount: 0,
    applications: [],
    hasSubmittedApplication: false
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch personal info status
        const personalInfo = await studentApi.getPersonalInfo();
        
        // Fetch applications
        const applications = await applicationApi.getMyApplications();
        
        setDashboardData({
          hasPersonalInfo: !!personalInfo,
          personalInfoStatus: personalInfo?.status || 'PENDING',
          applicationCount: applications.length,
          applications: applications,
          hasSubmittedApplication: applications.length > 0
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  const { hasPersonalInfo, personalInfoStatus, applicationCount, hasSubmittedApplication } = dashboardData;
  const hoSoHopLe = personalInfoStatus === 'APPROVED';
  const ketQuaTuyểnSinh = null; // Will be implemented later when results are available

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
            {!hasPersonalInfo ? (
              <Result
                icon={<InfoCircleOutlined style={{ color: '#1890ff' }} />}
                title="Bạn chưa đăng ký thông tin cá nhân"
                extra={<Button type="primary" onClick={() => navigate('/student/info-registration/personal')}>Đăng ký ngay</Button>}
                style={{ padding: '0 0 24px 0' }}
              />
            ) : (
              <>
                <p>Tình trạng hồ sơ cá nhân: {
                  hoSoHopLe ? 
                    <Text type="success"><CheckCircleOutlined /> Đã duyệt</Text> : 
                    personalInfoStatus === 'REJECTED' ?
                      <Text type="danger"><ExclamationCircleOutlined /> Bị từ chối</Text> :
                      <Text type="warning"><ExclamationCircleOutlined /> Đang chờ duyệt</Text>
                }</p>
                <p>Nguyện vọng đã đăng ký: {applicationCount} nguyện vọng</p>
                {hasSubmittedApplication && (
                  <p>Trạng thái nguyện vọng: {
                    dashboardData.applications.some(app => app.status === 'APPROVED') ?
                      <Text type="success">Có nguyện vọng được duyệt</Text> :
                    dashboardData.applications.some(app => app.status === 'REJECTED') ?
                      <Text type="danger">Có nguyện vọng bị từ chối</Text> :
                      <Text type="warning">Đang chờ duyệt</Text>
                  }</p>
                )}
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
        <Title level={4}>Bạn muốn làm gì tiếp theo?</Title>
        <Space size="large">
          {!hasPersonalInfo ? (
            <Button 
              type="primary" 
              size="middle" 
              style={{ width: '200px' }} 
              onClick={() => navigate('/student/info-registration/personal')}
            >
              Đăng ký thông tin cá nhân
            </Button>
          ) : (
            <Button 
              type="primary" 
              size="middle" 
              style={{ width: '186px' }} 
              onClick={() => navigate('/student/register-nguyenvong')}
            >
              Đăng ký nguyện vọng
            </Button>
          )}
          <Button 
            type="primary" 
            size="middle" 
            style={{ width: '186px' }} 
            onClick={() => navigate('/student/profile')}
          >
            Cập nhật thông tin
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default StudentDashboardPage;