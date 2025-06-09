import React, { useState, useEffect, useMemo } from 'react';
import { Table, Select, Space, Card, Row, Col, Typography, Spin, Tag, message } from 'antd';
import { BookOutlined, FormOutlined, SolutionOutlined } from '@ant-design/icons';
import { analyticsApi } from '../../services/analyticsApi';

const { Option } = Select;
const { Title, Text } = Typography;

// Backend-integrated interface that maps to API response
interface MajorStatistic {
  id: string;
  name: string;
  code: string;
  quota: number;
  school: {
    id: string;
    name: string;
    code: string;
  };
  totalApplications: number;
  approvedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
}

const ApplicationsBySchoolMajorPage: React.FC = () => {
  const [majorStats, setMajorStats] = useState<MajorStatistic[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>(undefined);
  const [selectedMajorId, setSelectedMajorId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Load backend data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch major statistics data
        const majorStatsData = await analyticsApi.getMajorStats();
        console.log('=== ApplicationsBySchoolMajorPage Debug ===');
        console.log('Raw majorStatsData:', majorStatsData);
        console.log('Number of majors:', majorStatsData?.length || 0);
        if (majorStatsData && majorStatsData.length > 0) {
          console.log('First major sample:', majorStatsData[0]);
          console.log('Schools in data:', majorStatsData.map((major: any) => ({ id: major.school?.id, name: major.school?.name, code: major.school?.code })));
        }
        setMajorStats(majorStatsData);
      } catch (error) {
        console.error('Error loading application statistics:', error);
        message.error('Có lỗi khi tải dữ liệu thống kê nguyện vọng');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter majors by selected school
  const filteredMajorsBySchool = useMemo(() => {
    if (!selectedSchoolId) {
      return majorStats;
    }
    return majorStats.filter(stat => stat.school.id === selectedSchoolId);
  }, [selectedSchoolId, majorStats]);

  // Get unique schools from major stats for dropdown
  const uniqueSchools = useMemo(() => {
    const schoolMap = new Map();
    majorStats.forEach(stat => {
      schoolMap.set(stat.school.id, stat.school);
    });
    const schools = Array.from(schoolMap.values());
    console.log('=== uniqueSchools Debug ===');
    console.log('majorStats length:', majorStats.length);
    console.log('schoolMap size:', schoolMap.size);
    console.log('uniqueSchools result:', schools);
    console.log('School IDs in result:', schools.map((s: any) => s.id));
    console.log('School names in result:', schools.map((s: any) => s.name));
    return schools;
  }, [majorStats]);

  // Prepare table data
  const tableData = useMemo(() => {
    return filteredMajorsBySchool
      .filter(stat => !selectedMajorId || stat.id === selectedMajorId)
      .map(stat => ({
        key: stat.id,
        schoolName: stat.school.name,
        majorName: stat.name,
        majorCode: stat.code,
        quota: stat.quota,
        totalApplications: stat.totalApplications,
        approvedApplications: stat.approvedApplications,
        pendingApplications: stat.pendingApplications,
        rejectedApplications: stat.rejectedApplications,
      }));
  }, [filteredMajorsBySchool, selectedMajorId]);

  // Table columns definition
  const columns = [
    {
      title: 'Trường',
      dataIndex: 'schoolName',
      key: 'schoolName',
      sorter: (a: any, b: any) => a.schoolName.localeCompare(b.schoolName),
    },
    {
      title: 'Mã Ngành',
      dataIndex: 'majorCode',
      key: 'majorCode',
      sorter: (a: any, b: any) => a.majorCode.localeCompare(b.majorCode),
    },
    {
      title: 'Tên Ngành',
      dataIndex: 'majorName',
      key: 'majorName',
      sorter: (a: any, b: any) => a.majorName.localeCompare(b.majorName),
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
      sorter: (a: any, b: any) => a.quota - b.quota,
      render: (quota: number) => <Tag color="cyan">{quota}</Tag>,
      align: 'center' as const,
    },
    {
      title: 'Tổng số NV',
      dataIndex: 'totalApplications',
      key: 'totalApplications',
      sorter: (a: any, b: any) => a.totalApplications - b.totalApplications,
      render: (count: number) => <Tag color="blue">{count}</Tag>,
      align: 'center' as const,
    },
    {
      title: 'Đã duyệt',
      dataIndex: 'approvedApplications',
      key: 'approvedApplications',
      sorter: (a: any, b: any) => a.approvedApplications - b.approvedApplications,
      render: (count: number) => <Tag color="green">{count}</Tag>,
      align: 'center' as const,
    },
    {
      title: 'Chờ duyệt',
      dataIndex: 'pendingApplications',
      key: 'pendingApplications',
      sorter: (a: any, b: any) => a.pendingApplications - b.pendingApplications,
      render: (count: number) => <Tag color="orange">{count}</Tag>,
      align: 'center' as const,
    },
    {
      title: 'Từ chối',
      dataIndex: 'rejectedApplications',
      key: 'rejectedApplications',
      sorter: (a: any, b: any) => a.rejectedApplications - b.rejectedApplications,
      render: (count: number) => <Tag color="red">{count}</Tag>,
      align: 'center' as const,
    },
  ];

  // Calculate summary statistics
  const totalApplicationsCount = useMemo(() => 
    majorStats.reduce((sum, stat) => sum + stat.totalApplications, 0), [majorStats]);
  
  const totalApproved = useMemo(() => 
    majorStats.reduce((sum, stat) => sum + stat.approvedApplications, 0), [majorStats]);
  
  const totalPending = useMemo(() => 
    majorStats.reduce((sum, stat) => sum + stat.pendingApplications, 0), [majorStats]);
  
  const totalRejected = useMemo(() => 
    majorStats.reduce((sum, stat) => sum + stat.rejectedApplications, 0), [majorStats]);

  return (
    <div>
      <Title level={3}>Thống kê Nguyện vọng theo Trường/Ngành</Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
            <Col span={6}>
              <Card bordered={false}>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <BookOutlined style={{ fontSize: 30, color: '#1890ff' }} />
                  <Text type="secondary">Tổng số nguyện vọng</Text>
                  <Title level={4}>{totalApplicationsCount}</Title>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <SolutionOutlined style={{ fontSize: 30, color: '#52c41a' }} />
                  <Text type="secondary">Đã duyệt</Text>
                  <Title level={4}>{totalApproved}</Title>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <FormOutlined style={{ fontSize: 30, color: '#faad14' }} />
                  <Text type="secondary">Chờ duyệt</Text>
                  <Title level={4}>{totalPending}</Title>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <BookOutlined style={{ fontSize: 30, color: '#f5222d' }} />
                  <Text type="secondary">Từ chối</Text>
                  <Title level={4}>{totalRejected}</Title>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Space style={{ marginBottom: 16 }}>
            <Select
              placeholder="Lọc theo Trường"
              style={{ width: 250 }}
              onChange={value => {
                setSelectedSchoolId(value);
                setSelectedMajorId(undefined); // Reset major when school changes
              }}
              value={selectedSchoolId}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {uniqueSchools.map(school => (
                <Option key={school.id} value={school.id}>
                  {school.name} ({school.code})
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Lọc theo Ngành"
              style={{ width: 250 }}
              onChange={value => setSelectedMajorId(value)}
              value={selectedMajorId}
              disabled={!selectedSchoolId && filteredMajorsBySchool.length === 0}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {filteredMajorsBySchool.map(stat => (
                <Option key={stat.id} value={stat.id}>
                  {stat.name} ({stat.code})
                </Option>
              ))}
            </Select>
          </Space>

          {/* Statistics Table */}
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="key"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} ngành`,
            }}
            bordered
            locale={{ emptyText: 'Không có dữ liệu nguyện vọng phù hợp.' }}
          />
        </>
      )}
    </div>
  );
};

export default ApplicationsBySchoolMajorPage;