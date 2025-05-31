import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Input, Space, Tag, Typography, Spin, Select } from 'antd';
import { UserOutlined, SearchOutlined, SolutionOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Dùng để điều hướng

const { Title } = Typography;
const { Option } = Select;

// Định nghĩa kiểu dữ liệu cho một thí sinh
interface Student {
  id: string; // ID của thí sinh (tài khoản)
  studentCode: string; // Mã số sinh viên (nếu có, hoặc ID tài khoản)
  fullName: string;
  email: string;
  phone: string;
  dob: string; // Ngày sinh
  accountStatus: 'Hoạt động' | 'Chưa kích hoạt' | 'Đã khóa'; // Trạng thái tài khoản
  registrationDate: string; // Ngày đăng ký tài khoản
}

// Giả lập dữ liệu thí sinh
const dummyStudents: Student[] = [
  {
    id: 'S001',
    studentCode: 'SV001',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    dob: '15/01/2006',
    accountStatus: 'Hoạt động',
    registrationDate: '2024-03-01',
  },
  {
    id: 'S002',
    studentCode: 'SV002',
    fullName: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0987654321',
    dob: '20/03/2006',
    accountStatus: 'Hoạt động',
    registrationDate: '2024-03-05',
  },
  {
    id: 'S003',
    studentCode: 'SV003',
    fullName: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0901234567',
    dob: '01/07/2006',
    accountStatus: 'Chưa kích hoạt',
    registrationDate: '2024-03-10',
  },
  {
    id: 'S004',
    studentCode: 'SV004',
    fullName: 'Phạm Thị D',
    email: 'phamthid@example.com',
    phone: '0911223344',
    dob: '10/02/2006',
    accountStatus: 'Đã khóa',
    registrationDate: '2024-03-12',
  },
  {
    id: 'S005',
    studentCode: 'SV005',
    fullName: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    phone: '0976543210',
    dob: '05/09/2006',
    accountStatus: 'Hoạt động',
    registrationDate: '2024-03-15',
  },
];

const StudentListPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterAccountStatus, setFilterAccountStatus] = useState<string | undefined>(undefined);
  const navigate = useNavigate(); // Hook để điều hướng giữa các route

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập API call
      setStudents(dummyStudents);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const getStatusColor = (status: Student['accountStatus']) => {
    switch (status) {
      case 'Hoạt động': return 'green';
      case 'Chưa kích hoạt': return 'orange';
      case 'Đã khóa': return 'red';
      default: return 'default';
    }
  };

  // Lọc và tìm kiếm thí sinh
  const filteredStudents = useMemo(() => {
    let result = students;
    if (filterAccountStatus) {
      result = result.filter(student => student.accountStatus === filterAccountStatus);
    }
    if (searchText) {
      result = result.filter(student =>
        student.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase()) ||
        student.phone.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return result;
  }, [students, filterAccountStatus, searchText]);

  // Điều hướng đến trang quản lý hồ sơ/minh chứng của thí sinh
  const handleViewProof = (studentId: string) => {
    // Trong thực tế, bạn có thể điều hướng đến một trang chi tiết hồ sơ của thí sinh đó
    // hoặc filter bảng trong ProofManagementPage theo studentId
    // Ví dụ: navigate(`/admin/students/proof-management?studentId=${studentId}`);
    message.info(`Xem hồ sơ minh chứng của thí sinh ID: ${studentId}. (Cần tích hợp API hoặc trang chi tiết)`);
    // Hoặc điều hướng trực tiếp đến trang duyệt minh chứng và hiển thị modal nếu muốn
    // navigate(`/admin/students/proof-management`);
    // Sau đó trong ProofManagementPage dùng useEffect để bắt param và hiển thị modal
  };

  // Điều hướng đến trang quản lý nguyện vọng của thí sinh
  const handleViewApplications = (studentId: string) => {
    // Tương tự như handleViewProof, có thể điều hướng hoặc filter
    // Ví dụ: navigate(`/admin/students/application-management?studentId=${studentId}`);
    message.info(`Xem nguyện vọng của thí sinh ID: ${studentId}. (Cần tích hợp API hoặc trang chi tiết)`);
  };

  const columns = [
    {
      title: 'Mã SV',
      dataIndex: 'studentCode',
      key: 'studentCode',
      sorter: (a: Student, b: Student) => a.studentCode.localeCompare(b.studentCode),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: Student, b: Student) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Ngày ĐK',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      sorter: (a: Student, b: Student) => a.registrationDate.localeCompare(b.registrationDate),
    },
    {
      title: 'Trạng thái TK',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      render: (status: Student['accountStatus']) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: 'Hoạt động' },
        { text: 'Chưa kích hoạt', value: 'Chưa kích hoạt' },
        { text: 'Đã khóa', value: 'Đã khóa' },
      ],
      onFilter: (value: any, record: Student) => record.accountStatus === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text: string, record: Student) => (
        <Space size="middle">
          <Button icon={<SolutionOutlined />} onClick={() => handleViewProof(record.id)}>
            Hồ sơ & Minh chứng
          </Button>
          <Button icon={<BookOutlined />} onClick={() => handleViewApplications(record.id)}>
            Nguyện vọng
          </Button>
          {/* Có thể thêm nút chỉnh sửa thông tin thí sinh nếu muốn */}
          {/* <Button icon={<EditOutlined />} onClick={() => message.info(`Sửa thông tin thí sinh ${record.fullName}`)}>Sửa</Button> */}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Danh sách Thí sinh</Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm theo tên, mã SV, email, SĐT..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 350 }}
        />
        <Select
          placeholder="Lọc theo Trạng thái tài khoản"
          style={{ width: 220 }}
          allowClear
          value={filterAccountStatus}
          onChange={value => setFilterAccountStatus(value)}
        >
          <Option value="Hoạt động">Hoạt động</Option>
          <Option value="Chưa kích hoạt">Chưa kích hoạt</Option>
          <Option value="Đã khóa">Đã khóa</Option>
        </Select>
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
    </div>
  );
};

export default StudentListPage;