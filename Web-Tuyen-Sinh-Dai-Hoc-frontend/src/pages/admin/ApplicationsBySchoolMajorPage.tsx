import React, { useState, useEffect, useMemo } from 'react';
import { Table, Select, Space, Card, Row, Col, Typography, Spin, Tag } from 'antd';
import { BookOutlined, FormOutlined, SolutionOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';


const { Option } = Select;
const { Title, Text } = Typography;

// Định nghĩa kiểu dữ liệu cơ bản
interface School {
  id: string;
  name: string;
  code: string;
}

interface Major {
  id: string;
  name: string;
  code: string;
  schoolId: string;
}

interface Application {
  id: string;
  studentName: string;
  studentId: string;
  majorId: string;
  schoolId: string;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  submissionDate: string; // Ngày nộp
}

// Giả lập dữ liệu trạng thái hồ sơ
const dummyApplications: Application[] = [
  { id: 'app001', studentName: 'Nguyễn Văn A', studentId: 'S001', majorId: '101', schoolId: '1', status: 'Đã duyệt', submissionDate: '2024-05-10' },
  { id: 'app002', studentName: 'Trần Thị B', studentId: 'S002', majorId: '101', schoolId: '1', status: 'Chờ duyệt', submissionDate: '2024-05-11' },
  { id: 'app003', studentName: 'Lê Văn C', studentId: 'S003', majorId: '102', schoolId: '1', status: 'Đã duyệt', submissionDate: '2024-05-12' },
  { id: 'app004', studentName: 'Phạm Thị D', studentId: 'S004', majorId: '201', schoolId: '3', status: 'Chờ duyệt', submissionDate: '2024-05-13' },
  { id: 'app005', studentName: 'Hoàng Văn E', studentId: 'S005', majorId: '201', schoolId: '3', status: 'Từ chối', submissionDate: '2024-05-14' },
  { id: 'app006', studentName: 'Nguyễn Thị F', studentId: 'S006', majorId: '101', schoolId: '1', status: 'Đã duyệt', submissionDate: '2024-05-15' },
  { id: 'app007', studentName: 'Đặng Văn G', studentId: 'S007', majorId: '103', schoolId: '2', status: 'Chờ duyệt', submissionDate: '2024-05-16' },
  { id: 'app008', studentName: 'Bùi Thị H', studentId: 'S008', majorId: '103', schoolId: '2', status: 'Đã duyệt', submissionDate: '2024-05-17' },
  { id: 'app009', studentName: 'Võ Văn I', studentId: 'S009', majorId: '202', schoolId: '3', status: 'Đã duyệt', submissionDate: '2024-05-18' },
  { id: 'app010', studentName: 'Dương Thị K', studentId: 'S010', majorId: '202', schoolId: '3', status: 'Chờ duyệt', submissionDate: '2024-05-19' },
];

const ApplicationsBySchoolMajorPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>(undefined);
  const [selectedMajorId, setSelectedMajorId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Giả lập tải dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Giả lập độ trễ API
      await new Promise(resolve => setTimeout(resolve, 500));

      const dummySchools: School[] = [
        { id: '1', name: 'Đại học Bách Khoa Hà Nội', code: 'BKA' },
        { id: '2', name: 'Đại học Quốc gia Hà Nội', code: 'QGHN' },
        { id: '3', name: 'Đại học Ngoại Thương', code: 'NT' },
      ];
      setSchools(dummySchools);

      const dummyMajors: Major[] = [
        { id: '101', name: 'Khoa học Máy tính', code: 'IT1', schoolId: '1' },
        { id: '102', name: 'Kỹ thuật Điện tử Viễn thông', code: 'ET', schoolId: '1' },
        { id: '103', name: 'Công nghệ thông tin', code: 'CNTT', schoolId: '2' },
        { id: '201', name: 'Kinh tế Quốc tế', code: 'KTQT', schoolId: '3' },
        { id: '202', name: 'Quản trị Kinh doanh', code: 'QTKD', schoolId: '3' },
      ];
      setMajors(dummyMajors);
      setApplications(dummyApplications);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Hàm ánh xạ ID sang tên
  const getSchoolName = (id: string) => schools.find(s => s.id === id)?.name || 'N/A';
  const getMajorName = (id: string) => majors.find(m => m.id === id)?.name || 'N/A';

  // Lọc ngành theo trường được chọn
  const filteredMajorsBySchool = useMemo(() => {
    if (!selectedSchoolId) {
      return majors; // Nếu không chọn trường, hiển thị tất cả ngành
    }
    return majors.filter(major => major.schoolId === selectedSchoolId);
  }, [selectedSchoolId, majors]);

  // Thống kê số lượng nguyện vọng cho từng ngành
  const majorApplicationCounts = useMemo(() => {
    const counts: { [majorId: string]: { total: number; approved: number; pending: number; rejected: number } } = {};
    applications.forEach(app => {
      if (!counts[app.majorId]) {
        counts[app.majorId] = { total: 0, approved: 0, pending: 0, rejected: 0 };
      }
      counts[app.majorId].total++;
      if (app.status === 'Đã duyệt') {
        counts[app.majorId].approved++;
      } else if (app.status === 'Chờ duyệt') {
        counts[app.majorId].pending++;
      } else if (app.status === 'Từ chối') {
        counts[app.majorId].rejected++;
      }
    });
    return counts;
  }, [applications]);


  // Dữ liệu hiển thị trong bảng
  const tableData = useMemo(() => {
    return filteredMajorsBySchool
      .filter(major => !selectedMajorId || major.id === selectedMajorId) // Lọc thêm theo ngành nếu có
      .map(major => {
        const counts = majorApplicationCounts[major.id] || { total: 0, approved: 0, pending: 0, rejected: 0 };
        return {
          key: major.id,
          schoolName: getSchoolName(major.schoolId),
          majorName: major.name,
          majorCode: major.code,
          totalApplications: counts.total,
          approvedApplications: counts.approved,
          pendingApplications: counts.pending,
          rejectedApplications: counts.rejected,
        };
      });
  }, [filteredMajorsBySchool, selectedMajorId, majorApplicationCounts, getSchoolName]);


  // Định nghĩa các cột cho bảng
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
      title: 'Tổng số NV',
      dataIndex: 'totalApplications',
      key: 'totalApplications',
      sorter: (a: any, b: any) => a.totalApplications - b.totalApplications,
      render: (count: number) => <Tag color="blue">{count}</Tag>,
      align: 'center' as const, // Căn giữa cột
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

  // Tính tổng số nguyện vọng cho các Card thống kê
  const totalApplicationsCount = useMemo(() => applications.length, [applications]);
  const totalApproved = useMemo(() => applications.filter(app => app.status === 'Đã duyệt').length, [applications]);
  const totalPending = useMemo(() => applications.filter(app => app.status === 'Chờ duyệt').length, [applications]);
  const totalRejected = useMemo(() => applications.filter(app => app.status === 'Từ chối').length, [applications]);


  return (
    <div>
      <Title level={3}>Thống kê Nguyện vọng theo Trường/Ngành</Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
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

          <Space style={{ marginBottom: 16 }}>
            <Select
              placeholder="Lọc theo Trường"
              style={{ width: 250 }}
              onChange={value => {
                setSelectedSchoolId(value);
                setSelectedMajorId(undefined); // Reset major khi chọn trường mới
              }}
              value={selectedSchoolId}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {schools.map(school => (
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
              disabled={!selectedSchoolId && majors.length === 0} // Disable nếu không có trường hoặc không có ngành
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {filteredMajorsBySchool.map(major => (
                <Option key={major.id} value={major.id}>
                  {major.name} ({major.code})
                </Option>
              ))}
            </Select>
          </Space>

          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="key"
            pagination={{ pageSize: 10 }}
            bordered
            locale={{ emptyText: 'Không có dữ liệu nguyện vọng phù hợp.' }}
          />
        </>
      )}
    </div>
  );
};

export default ApplicationsBySchoolMajorPage;