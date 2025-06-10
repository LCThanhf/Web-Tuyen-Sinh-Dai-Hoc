// ./pages/admin/AdminHomePage.tsx
import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Statistic, Spin, Alert, Progress, Table, Tag } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  FormOutlined, 
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { analyticsApi } from '../../services/analyticsApi';
import type { DashboardStats, RecentApplication, DocumentStats } from '../../types/analytics';

const { Title, Text } = Typography;

const AdminHomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [documentStats, setDocumentStats] = useState<DocumentStats | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all dashboard data in parallel
        const [
          dashboardData,
          recentData,
          documentData
        ] = await Promise.all([
          analyticsApi.getDashboardStats(),
          analyticsApi.getRecentApplications(),
          analyticsApi.getDocumentStats()
        ]);

        setDashboardStats(dashboardData);
        setRecentApplications(recentData);
        setDocumentStats(documentData);

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" tip="Đang tải dữ liệu dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        action={
          <button onClick={() => window.location.reload()}>
            Thử lại
          </button>
        }
      />
    );
  }

  // Recent applications table columns
  const recentApplicationsColumns = [
    {
      title: 'Học sinh',
      dataIndex: ['student', 'user', 'fullName'],
      key: 'studentName',
    },
    {
      title: 'Trường',
      dataIndex: ['school', 'name'],
      key: 'schoolName',
    },
    {
      title: 'Ngành',
      dataIndex: ['major', 'name'],
      key: 'majorName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          PENDING: 'orange',
          APPROVED: 'green',
          REJECTED: 'red'
        };
        const labels = {
          PENDING: 'Chờ duyệt',
          APPROVED: 'Đã duyệt',
          REJECTED: 'Từ chối'
        };
        return <Tag color={colors[status as keyof typeof colors]}>{labels[status as keyof typeof labels]}</Tag>;
      },
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
  ];

  return (
    <div>
      <Title level={2}>Dashboard Quản trị</Title>
      <Text type="secondary">Tổng quan hệ thống tuyển sinh đại học</Text>
      
      {/* Overview Statistics */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số học sinh"
              value={dashboardStats?.overview.totalStudents || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số trường"
              value={dashboardStats?.overview.totalSchools || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số ngành"
              value={dashboardStats?.overview.totalMajors || 0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng hồ sơ"
              value={dashboardStats?.overview.totalApplications || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Application Status Overview */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Trạng thái hồ sơ" extra={<Text>Tỷ lệ duyệt: {dashboardStats?.applications.approvalRate}%</Text>}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Chờ duyệt"
                  value={dashboardStats?.applications.pending || 0}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đã duyệt"
                  value={dashboardStats?.applications.approved || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Từ chối"
                  value={dashboardStats?.applications.rejected || 0}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
            
            <div style={{ marginTop: 16 }}>
              <Text strong>Tỷ lệ duyệt hồ sơ</Text>
              <Progress 
                percent={parseFloat(dashboardStats?.applications.approvalRate || '0')}
                strokeColor="#52c41a"
                showInfo={false}
                style={{ marginTop: 8 }}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Thống kê tài liệu">
            {documentStats && (
              <>
                <Statistic
                  title="Tổng tài liệu"
                  value={documentStats.total || documentStats.summary?.totalDocuments || 0}
                  prefix={<FormOutlined />}
                />
                <div style={{ marginTop: 16 }}>
                  <Text>Tỷ lệ duyệt: {documentStats.approvalRate || documentStats.summary?.overallApprovalRate || '0'}%</Text>
                  <Progress 
                    percent={parseFloat(documentStats.approvalRate || documentStats.summary?.overallApprovalRate || '0')}
                    size="small"
                    strokeColor="#1890ff"
                    style={{ marginTop: 4 }}
                  />
                </div>
                <div style={{ marginTop: 12 }}>
                  <Row>
                    <Col span={12}>
                      <Text type="secondary">Chờ duyệt: {documentStats.pending || documentStats.summary?.pendingDocuments || 0}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Đã duyệt: {documentStats.approved || documentStats.summary?.approvedDocuments || 0}</Text>
                    </Col>
                  </Row>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Applications */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Hồ sơ mới nhất" extra={<Text type="secondary">{recentApplications.length} hồ sơ</Text>}>
            <Table
              dataSource={recentApplications}
              columns={recentApplicationsColumns}
              rowKey="id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHomePage;