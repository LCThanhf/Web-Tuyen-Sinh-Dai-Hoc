




import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Spin,
  Select,
  Modal,
} from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

// --- Dữ liệu nguyện vọng giả lập ---
const dummyApplications = [
  { id: 'NV001', studentId: 'S001', schoolName: 'ĐH Bách Khoa HN', majorName: 'Công nghệ thông tin', combination: 'A00', priorityOrder: 1, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 25.5, totalScore: 25.5 },
  { id: 'NV002', studentId: 'S001', schoolName: 'ĐH Bách Khoa HN', majorName: 'Khoa học Máy tính', combination: 'A01', priorityOrder: 2, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 25.0, totalScore: 25.0 },
  { id: 'NV003', studentId: 'S002', schoolName: 'ĐH Ngoại Thương', majorName: 'Kinh tế Quốc tế', combination: 'D01', priorityOrder: 1, admissionMethod: 'Học bạ', scoreForMethod: 28.0, totalScore: 28.0 },
  { id: 'NV004', studentId: 'S003', schoolName: 'ĐH Quốc gia HN', majorName: 'Công nghệ thông tin', combination: 'A00', priorityOrder: 1, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 26.0, totalScore: 26.0 },
  { id: 'NV005', studentId: 'S004', schoolName: 'ĐH Y Hà Nội', majorName: 'Y đa khoa', combination: 'B00', priorityOrder: 1, admissionMethod: 'ĐGNL/TD', scoreForMethod: 950, totalScore: 950 },
  { id: 'NV006', studentId: 'S004', schoolName: 'ĐH Quốc gia HN', majorName: 'Công nghệ thông tin', combination: 'A00', priorityOrder: 2, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 27.0, totalScore: 27.0 },
];

// Danh sách thí sinh giả lập (chỉ giữ các trường cần thiết cho tìm kiếm và hiển thị nguyện vọng)
const dummyStudents = [
  { id: 'S001', citizenId: '001123456789', fullName: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0912345678', dob: '15/01/2006' },
  { id: 'S002', citizenId: '001987654321', fullName: 'Trần Thị B', email: 'tranthib@example.com', phone: '0987654321', dob: '20/03/2006' },
  { id: 'S003', citizenId: '001090123456', fullName: 'Lê Văn C', email: 'levanc@example.com', phone: '0901234567', dob: '01/07/2006' },
  { id: 'S004', citizenId: '001911223344', fullName: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0911223344', dob: '10/02/2006' },
];

const StudentAndProofManagementPage: React.FC = () => {
  const [students, setStudents] = useState(dummyStudents);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterByNameOrId, setFilterByNameOrId] = useState('');

  // Modal Nguyện vọng
  const [isApplicationModalVisible, setIsApplicationModalVisible] = useState(false);
  const [selectedStudentForApplication, setSelectedStudentForApplication] = useState<any>(null);
  const [studentApplications, setStudentApplications] = useState<any[]>([]);

  useEffect(() => {
    // Nếu bạn muốn giả lập gọi API, bật loading trong 500ms rồi load data
    setLoading(true);
    setTimeout(() => {
      setStudents(dummyStudents);
      setLoading(false);
    }, 500);
  }, []);

  // Lọc thí sinh theo tìm kiếm
  const filteredStudents = students.filter(student => {
    const text = searchText.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(text) ||
      student.citizenId.includes(text) ||
      student.email.toLowerCase().includes(text) ||
      student.phone.includes(text)
    );
  });

  // Xử lý mở modal nguyện vọng
  const handleViewApplications = (student: any) => {
    setSelectedStudentForApplication(student);
    const apps = dummyApplications.filter(app => app.studentId === student.id);
    setStudentApplications(apps);
    setIsApplicationModalVisible(true);
  };

  const handleApplicationModalClose = () => {
    setIsApplicationModalVisible(false);
    setSelectedStudentForApplication(null);
    setStudentApplications([]);
  };

  // Cột của bảng Nguyện vọng (thêm cột mã NV)
  const applicationColumns = [
    {
      title: 'Mã NV',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as const,
      width: 80,
    },
    {
      title: 'Thứ tự NV',
      dataIndex: 'priorityOrder',
      key: 'priorityOrder',
      sorter: (a: any, b: any) => a.priorityOrder - b.priorityOrder,
      align: 'center' as const,
      width: 100,
    },
    {
      title: 'Trường ĐK',
      dataIndex: 'schoolName',
      key: 'schoolName',
    },
    {
      title: 'Ngành ĐK',
      dataIndex: 'majorName',
      key: 'majorName',
    },
    {
      title: 'Tổ hợp',
      dataIndex: 'combination',
      key: 'combination',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'PTXT',
      dataIndex: 'admissionMethod',
      key: 'admissionMethod',
      width: 150,
      align: 'center' as const,
    },
    {
      title: 'Điểm XT',
      dataIndex: 'scoreForMethod',
      key: 'scoreForMethod',
      width: 100,
      align: 'right' as const,
      render: (score?: number) => score !== undefined ? score.toFixed(2) : 'N/A',
    },
    {
      title: 'Tổng điểm',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 100,
      align: 'right' as const,
      render: (score: number) => score.toFixed(2),
      sorter: (a: any, b: any) => a.totalScore - b.totalScore,
    },
  ];

  // Cột của bảng thí sinh, chỉ giữ cần thiết + cột hành động nút nguyện vọng
  const columns = [
    {
      title: 'CCCD',
      dataIndex: 'citizenId',
      key: 'citizenId',
      sorter: (a: any, b: any) => a.citizenId.localeCompare(b.citizenId),
      width: 150,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: any, b: any) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      width: 110,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 130,
      render: (_: any, record: any) => (
        <Button
          icon={<BookOutlined />}
          onClick={() => handleViewApplications(record)}
          size="small"
          type="primary"
        >
          Nguyện vọng
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Quản lý Nguyện vọng Thí sinh</Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm theo tên, CCCD, email, SĐT..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 350 }}
          allowClear
        />
      </Space>

      <Spin spinning={loading} tip="Đang tải danh sách thí sinh...">
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          locale={{ emptyText: 'Không có thí sinh nào trong danh sách.' }}
        />
      </Spin>

      {/* Modal Nguyện vọng */}
      <Modal
        title={<><BookOutlined /> Nguyện vọng của {selectedStudentForApplication?.fullName}</>}
        visible={isApplicationModalVisible}
        onCancel={handleApplicationModalClose}
        footer={[
          <Button key="close" onClick={handleApplicationModalClose}>
            Đóng
          </Button>,
        ]}
        width={900}
      >
        <Spin spinning={loading}>
          <Table
            columns={applicationColumns}
            dataSource={studentApplications}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
            locale={{ emptyText: 'Thí sinh này chưa đăng ký nguyện vọng nào.' }}
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default StudentAndProofManagementPage;
