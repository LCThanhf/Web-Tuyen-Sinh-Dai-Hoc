import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Spin,
  Modal,
  message,
  Tag,
  Tooltip,
  Card,
  Descriptions
} from 'antd';
import { 
  SearchOutlined, 
  BookOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  TrophyOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { adminApi, type AdminStudent, type StudentsFilter } from '../../services/adminApi';

const { Title } = Typography;

const StudentListPageNew: React.FC = () => {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) => 
      `${range[0]}-${range[1]} của ${total} thí sinh`,
  });

  // Modal states
  const [isApplicationModalVisible, setIsApplicationModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null);

  // Fetch students data
  const fetchStudents = async (filters: StudentsFilter = {}) => {
    try {
      setLoading(true);
      const response = await adminApi.getStudents({
        page: filters.page || pagination.current,
        limit: filters.limit || pagination.pageSize,
        search: filters.search || searchText,
      });

      setStudents(response.students);
      setPagination(prev => ({
        ...prev,
        current: response.pagination.page,
        total: response.pagination.total,
        pageSize: response.pagination.limit,
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Không thể tải danh sách thí sinh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle search
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchStudents({ page: 1, search: searchText });
  };

  // Handle table pagination change
  const handleTableChange = (paginationInfo: any) => {
    const newPagination = {
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    };
    setPagination(prev => ({ ...prev, ...newPagination }));
    fetchStudents({ 
      page: paginationInfo.current, 
      limit: paginationInfo.pageSize,
      search: searchText 
    });
  };

  // Handle view applications
  const handleViewApplications = (student: AdminStudent) => {
    setSelectedStudent(student);
    setIsApplicationModalVisible(true);
  };

  // Handle view student details
  const handleViewDetails = (student: AdminStudent) => {
    setSelectedStudent(student);
    setIsDetailModalVisible(true);
  };

  // Get status color for various statuses
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      case 'PENDING': return 'orange';
      default: return 'default';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Từ chối';
      case 'PENDING': return 'Chờ duyệt';
      default: return status;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Student table columns
  const columns = [
    {
      title: 'CCCD',
      dataIndex: ['user', 'cccd'],
      key: 'cccd',
      width: 130,
      sorter: true,
    },
    {
      title: 'Họ và tên',
      dataIndex: ['user', 'fullName'],
      key: 'fullName',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
      width: 220,
    },
    {
      title: 'SĐT',
      dataIndex: ['user', 'phone'],
      key: 'phone',
      width: 120,
      render: (phone: string) => phone || 'N/A',
    },
    {
      title: 'Trạng thái TT',
      key: 'personalInfoStatus',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: AdminStudent) => (
        <Tag color={getStatusColor(record.personalInfo?.status || 'PENDING')}>
          {getStatusText(record.personalInfo?.status || 'PENDING')}
        </Tag>
      ),
    },
    {
      title: 'Nguyện vọng',
      key: 'applicationsCount',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: AdminStudent) => (
        <Tag color="blue">{record.applications.length}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      align: 'center' as const,
      render: (_: any, record: AdminStudent) => (
        <Space>
          <Tooltip title="Chi tiết thí sinh">
            <Button
              icon={<UserOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Xem nguyện vọng">
            <Button
              icon={<BookOutlined />}
              size="small"
              type="primary"
              onClick={() => handleViewApplications(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Application table columns
  const applicationColumns = [
    {
      title: 'Thứ tự',
      dataIndex: 'priorityOrder',
      key: 'priorityOrder',
      sorter: (a: any, b: any) => a.priorityOrder - b.priorityOrder,
      align: 'center' as const,
      width: 80,
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
      title: 'PTXT',
      dataIndex: 'admissionMethod',
      key: 'admissionMethod',
      width: 150,
      align: 'center' as const,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center' as const,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'adminNote',
      key: 'adminNote',
      render: (note: string) => note || 'N/A',
    },
  ];

  return (
    <div>
      <Title level={3}>Quản lý Thí sinh và Nguyện vọng</Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm theo tên, CCCD, email..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 350 }}
          allowClear
        />
        <Button type="primary" onClick={handleSearch} style={{ marginBottom: 10 }}>
          Tìm kiếm
        </Button>
      </Space>

      <Spin spinning={loading} tip="Đang tải danh sách thí sinh...">
        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          bordered
          size="middle"
          locale={{ emptyText: 'Không có thí sinh nào trong hệ thống.' }}
        />
      </Spin>

      {/* Applications Modal */}
      <Modal
        title={
          <Space>
            <BookOutlined />
            <span>Nguyện vọng của {selectedStudent?.user.fullName}</span>
          </Space>
        }
        visible={isApplicationModalVisible}
        onCancel={() => setIsApplicationModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsApplicationModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={1000}
      >
        <Table
          columns={applicationColumns}
          dataSource={selectedStudent?.applications || []}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
          size="small"
          locale={{ emptyText: 'Thí sinh này chưa đăng ký nguyện vọng nào.' }}
        />
      </Modal>

      {/* Student Details Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>Chi tiết thí sinh: {selectedStudent?.user.fullName}</span>
          </Space>
        }
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={900}
      >
        {selectedStudent && (
          <div>
            {/* Basic Information */}
            <Card title="Thông tin cơ bản" size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="CCCD">{selectedStudent.user.cccd}</Descriptions.Item>
                <Descriptions.Item label="Họ và tên">{selectedStudent.user.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedStudent.user.email}</Descriptions.Item>
                <Descriptions.Item label="SĐT">{selectedStudent.user.phone || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  {selectedStudent.dob ? formatDate(selectedStudent.dob) : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">{selectedStudent.gender || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{selectedStudent.address || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Thành phố">{selectedStudent.city || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Trường THPT">{selectedStudent.highSchoolName || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Năm tốt nghiệp">{selectedStudent.graduationYear || 'N/A'}</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Document Status */}
            <Card title="Trạng thái hồ sơ" size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <FileTextOutlined /> Thông tin cá nhân: {' '}
                  <Tag color={getStatusColor(selectedStudent.personalInfo?.status || 'PENDING')}>
                    {getStatusText(selectedStudent.personalInfo?.status || 'PENDING')}
                  </Tag>
                </div>
                <div>
                  <TrophyOutlined /> Điểm số ({selectedStudent.scores.length}): {' '}
                  {selectedStudent.scores.map((score, index) => (
                    <Tag key={index} color={getStatusColor(score.status)}>
                      {score.type}: {getStatusText(score.status)}
                    </Tag>
                  ))}
                </div>
                <div>
                  <SafetyCertificateOutlined /> Ưu tiên ({selectedStudent.priorities.length}): {' '}
                  {selectedStudent.priorities.map((priority, index) => (
                    <Tag key={index} color={getStatusColor(priority.status)}>
                      {getStatusText(priority.status)}
                    </Tag>
                  ))}
                </div>
                <div>
                  <TrophyOutlined /> Thành tích ({selectedStudent.achievements.length}): {' '}
                  {selectedStudent.achievements.map((achievement, index) => (
                    <Tag key={index} color={getStatusColor(achievement.status)}>
                      {achievement.achievementType}: {getStatusText(achievement.status)}
                    </Tag>
                  ))}
                </div>
                <div>
                  <SafetyCertificateOutlined /> Chứng chỉ ({selectedStudent.certificates.length}): {' '}
                  {selectedStudent.certificates.map((cert, index) => (
                    <Tag key={index} color={getStatusColor(cert.status)}>
                      {cert.certificateType}: {getStatusText(cert.status)}
                    </Tag>
                  ))}
                </div>
              </Space>
            </Card>

            {/* Applications Summary */}
            <Card title="Tóm tắt nguyện vọng" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tổng số nguyện vọng">
                  {selectedStudent.applications.length}
                </Descriptions.Item>
                <Descriptions.Item label="Được duyệt">
                  {selectedStudent.applications.filter(app => app.status === 'APPROVED').length}
                </Descriptions.Item>
                <Descriptions.Item label="Chờ duyệt">
                  {selectedStudent.applications.filter(app => app.status === 'PENDING').length}
                </Descriptions.Item>
                <Descriptions.Item label="Từ chối">
                  {selectedStudent.applications.filter(app => app.status === 'REJECTED').length}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentListPageNew;
