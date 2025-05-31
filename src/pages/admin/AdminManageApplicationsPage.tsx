import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Select,
  Tag,
  Typography,
  Tooltip
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';

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

interface AdmissionCombination {
  id: string;
  name: string; // Tên tổ hợp, ví dụ: A00, D01
  subjects: string[]; // Danh sách các môn
  majorId: string;
  schoolId: string;
}

// Kiểu dữ liệu cho một nguyện vọng đăng ký của thí sinh
interface StudentApplication {
  id: string; // ID của nguyện vọng
  studentId: string;
  studentName: string;
  schoolId: string;
  majorId: string;
  combinationId: string;
  priorityOrder: number; // Thứ tự nguyện vọng
  status: 'Đã nộp' | 'Đã xét' | 'Trúng tuyển' | 'Trượt'; // Trạng thái xét tuyển của nguyện vọng
  submissionDate: string; // Ngày nộp
}

// Giả lập dữ liệu
const dummySchools: School[] = [
  { id: '1', name: 'Đại học Bách Khoa Hà Nội', code: 'BKA' },
  { id: '2', name: 'Đại học Quốc gia Hà Nội', code: 'QGHN' },
  { id: '3', name: 'Đại học Ngoại Thương', code: 'NT' },
];

const dummyMajors: Major[] = [
  { id: '101', name: 'Khoa học Máy tính', code: 'IT1', schoolId: '1' },
  { id: '102', name: 'Kỹ thuật Điện tử Viễn thông', code: 'ET', schoolId: '1' },
  { id: '103', name: 'Công nghệ thông tin', code: 'CNTT', schoolId: '2' },
  { id: '201', name: 'Kinh tế Quốc tế', code: 'KTQT', schoolId: '3' },
  { id: '202', name: 'Quản trị Kinh doanh', code: 'QTKD', schoolId: '3' },
];

const dummyCombinations: AdmissionCombination[] = [
  { id: 'C001', name: 'A00', subjects: ['Toán', 'Lý', 'Hóa'], majorId: '101', schoolId: '1' },
  { id: 'C002', name: 'A01', subjects: ['Toán', 'Lý', 'Anh'], majorId: '101', schoolId: '1' },
  { id: 'C003', name: 'D07', subjects: ['Toán', 'Hóa', 'Anh'], majorId: '101', schoolId: '1' },
  { id: 'C004', name: 'A00', subjects: ['Toán', 'Lý', 'Hóa'], majorId: '102', schoolId: '1' },
  { id: 'C005', name: 'A01', subjects: ['Toán', 'Lý', 'Anh'], majorId: '102', schoolId: '1' },
  { id: 'C006', name: 'A00', subjects: ['Toán', 'Lý', 'Hóa'], majorId: '103', schoolId: '2' },
  { id: 'C007', name: 'D01', subjects: ['Toán', 'Văn', 'Anh'], majorId: '201', schoolId: '3' },
  { id: 'C008', name: 'A00', subjects: ['Toán', 'Lý', 'Hóa'], majorId: '202', schoolId: '3' },
];

const dummyStudentApplications: StudentApplication[] = [
  { id: 'APP_NV001', studentId: 'SV001', studentName: 'Nguyễn Văn A', schoolId: '1', majorId: '101', combinationId: 'C001', priorityOrder: 1, status: 'Đã nộp', submissionDate: '2024-05-20' },
  { id: 'APP_NV002', studentId: 'SV001', studentName: 'Nguyễn Văn A', schoolId: '1', majorId: '102', combinationId: 'C004', priorityOrder: 2, status: 'Đã nộp', submissionDate: '2024-05-20' },
  { id: 'APP_NV003', studentId: 'SV002', studentName: 'Trần Thị B', schoolId: '3', majorId: '201', combinationId: 'C007', priorityOrder: 1, status: 'Đã nộp', submissionDate: '2024-05-18' },
  { id: 'APP_NV004', studentId: 'SV003', studentName: 'Lê Văn C', schoolId: '2', majorId: '103', combinationId: 'C006', priorityOrder: 1, status: 'Đã xét', submissionDate: '2024-05-15' },
  { id: 'APP_NV005', studentId: 'SV004', studentName: 'Phạm Thị D', schoolId: '1', majorId: '101', combinationId: 'C002', priorityOrder: 1, status: 'Đã nộp', submissionDate: '2024-05-22' },
  { id: 'APP_NV006', studentId: 'SV005', studentName: 'Hoàng Văn E', schoolId: '3', majorId: '202', combinationId: 'C008', priorityOrder: 1, status: 'Trúng tuyển', submissionDate: '2024-05-21' },
];

const AdminManageApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [combinations, setCombinations] = useState<AdmissionCombination[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingApplication, setEditingApplication] = useState<StudentApplication | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterSchoolId, setFilterSchoolId] = useState<string | undefined>(undefined);
  const [filterMajorId, setFilterMajorId] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');

  // States cho dropdown trong Modal (để thêm/sửa)
  const [modalSelectedSchoolId, setModalSelectedSchoolId] = useState<string | undefined>(undefined);
  const [modalSelectedMajorId, setModalSelectedMajorId] = useState<string | undefined>(undefined);
  const [modalFilteredMajors, setModalFilteredMajors] = useState<Major[]>([]);
  const [modalFilteredCombinations, setModalFilteredCombinations] = useState<AdmissionCombination[]>([]);

  useEffect(() => {
    setLoading(true);
    // Giả lập tải dữ liệu từ API
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSchools(dummySchools);
      setMajors(dummyMajors);
      setCombinations(dummyCombinations);
      setApplications(dummyStudentApplications);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Lọc ngành theo trường cho modal
  useEffect(() => {
    if (modalSelectedSchoolId) {
      setModalFilteredMajors(majors.filter(major => major.schoolId === modalSelectedSchoolId));
      if (editingApplication && editingApplication.schoolId === modalSelectedSchoolId) {
        // Giữ lại majorId nếu nó thuộc trường đang chọn
        form.setFieldsValue({ majorId: editingApplication.majorId });
        setModalSelectedMajorId(editingApplication.majorId);
      } else {
        form.setFieldsValue({ majorId: undefined, combinationId: undefined });
        setModalSelectedMajorId(undefined);
      }
    } else {
      setModalFilteredMajors([]);
      form.setFieldsValue({ majorId: undefined, combinationId: undefined });
      setModalSelectedMajorId(undefined);
    }
  }, [modalSelectedSchoolId, majors, editingApplication, form]);

  // Lọc tổ hợp theo ngành cho modal
  useEffect(() => {
    if (modalSelectedMajorId) {
      setModalFilteredCombinations(combinations.filter(combo => combo.majorId === modalSelectedMajorId));
      if (editingApplication && editingApplication.majorId === modalSelectedMajorId) {
        form.setFieldsValue({ combinationId: editingApplication.combinationId });
      } else {
        form.setFieldsValue({ combinationId: undefined });
      }
    } else {
      setModalFilteredCombinations([]);
      form.setFieldsValue({ combinationId: undefined });
    }
  }, [modalSelectedMajorId, combinations, editingApplication, form]);


  // Hàm ánh xạ ID sang tên
  const getSchoolName = (id: string) => schools.find(s => s.id === id)?.name || 'N/A';
  const getMajorName = (id: string) => majors.find(m => m.id === id)?.name || 'N/A';
  const getCombinationName = (id: string) => combinations.find(c => c.id === id)?.name || 'N/A';

  const getStatusColor = (status: StudentApplication['status']) => {
    switch (status) {
      case 'Đã nộp': return 'blue';
      case 'Đã xét': return 'orange';
      case 'Trúng tuyển': return 'green';
      case 'Trượt': return 'red';
      default: return 'default';
    }
  };

  // Lọc và tìm kiếm dữ liệu bảng chính
  const filteredApplications = useMemo(() => {
    let result = applications;

    if (filterSchoolId) {
      result = result.filter(app => app.schoolId === filterSchoolId);
    }
    if (filterMajorId) {
      result = result.filter(app => app.majorId === filterMajorId);
    }
    if (filterStatus) {
      result = result.filter(app => app.status === filterStatus);
    }
    if (searchText) {
      result = result.filter(app =>
        app.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
        app.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
        getSchoolName(app.schoolId).toLowerCase().includes(searchText.toLowerCase()) ||
        getMajorName(app.majorId).toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return result;
  }, [applications, filterSchoolId, filterMajorId, filterStatus, searchText, getSchoolName, getMajorName]);

  // Mở modal thêm nguyện vọng
  const handleAddApplication = () => {
    setEditingApplication(null);
    form.resetFields();
    setModalSelectedSchoolId(undefined);
    setModalSelectedMajorId(undefined);
    setIsModalVisible(true);
  };

  // Mở modal sửa nguyện vọng
  const handleEditApplication = (record: StudentApplication) => {
    setEditingApplication(record);
    form.setFieldsValue(record);
    setModalSelectedSchoolId(record.schoolId); // Thiết lập giá trị cho select trường
    setModalSelectedMajorId(record.majorId); // Thiết lập giá trị cho select ngành
    setIsModalVisible(true);
  };

  // Xóa nguyện vọng
  const handleDeleteApplication = (id: string) => {
    setLoading(true);
    // Giả lập API call xóa
    setTimeout(() => {
      setApplications(applications.filter(app => app.id !== id));
      message.success('Xóa nguyện vọng thành công!');
      setLoading(false);
    }, 300);
  };

  // Xử lý khi submit form (thêm mới hoặc cập nhật)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập API call

      if (editingApplication) {
        // Cập nhật nguyện vọng hiện có
        const updatedApplications = applications.map(app =>
          app.id === editingApplication.id ? { ...app, ...values } : app
        );
        setApplications(updatedApplications);
        message.success('Cập nhật nguyện vọng thành công!');
      } else {
        // Thêm nguyện vọng mới
        const newApplication: StudentApplication = {
          ...values,
          id: `APP_NV${applications.length + 1001}`, // ID tạm thời
          submissionDate: new Date().toISOString().slice(0, 10), // Ngày hiện tại
        };
        setApplications([...applications, newApplication]);
        message.success('Thêm nguyện vọng mới thành công!');
      }
      setIsModalVisible(false);
      setLoading(false);
    } catch (errorInfo) {
      console.log('Validate Failed:', errorInfo);
      message.error('Vui lòng điền đầy đủ và đúng thông tin!');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Mã NV',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: StudentApplication, b: StudentApplication) => a.id.localeCompare(b.id),
    },
    {
      title: 'Mã SV',
      dataIndex: 'studentId',
      key: 'studentId',
      sorter: (a: StudentApplication, b: StudentApplication) => a.studentId.localeCompare(b.studentId),
    },
    {
      title: 'Họ và tên SV',
      dataIndex: 'studentName',
      key: 'studentName',
      sorter: (a: StudentApplication, b: StudentApplication) => a.studentName.localeCompare(b.studentName),
    },
    {
      title: 'Trường',
      dataIndex: 'schoolId',
      key: 'schoolName',
      render: (schoolId: string) => getSchoolName(schoolId),
      sorter: (a: StudentApplication, b: StudentApplication) => getSchoolName(a.schoolId).localeCompare(getSchoolName(b.schoolId)),
    },
    {
      title: 'Ngành',
      dataIndex: 'majorId',
      key: 'majorName',
      render: (majorId: string) => getMajorName(majorId),
      sorter: (a: StudentApplication, b: StudentApplication) => getMajorName(a.majorId).localeCompare(getMajorName(b.majorId)),
    },
    {
      title: 'Tổ hợp',
      dataIndex: 'combinationId',
      key: 'combinationName',
      render: (combinationId: string) => getCombinationName(combinationId),
      sorter: (a: StudentApplication, b: StudentApplication) => getCombinationName(a.combinationId).localeCompare(getCombinationName(b.combinationId)),
    },
    {
      title: 'Thứ tự NV',
      dataIndex: 'priorityOrder',
      key: 'priorityOrder',
      sorter: (a: StudentApplication, b: StudentApplication) => a.priorityOrder - b.priorityOrder,
      align: 'center' as const,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: StudentApplication['status']) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Đã nộp', value: 'Đã nộp' },
        { text: 'Đã xét', value: 'Đã xét' },
        { text: 'Trúng tuyển', value: 'Trúng tuyển' },
        { text: 'Trượt', value: 'Trượt' },
      ],
      onFilter: (value: any, record: StudentApplication) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text: string, record: StudentApplication) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditApplication(record)}
            type="primary"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nguyện vọng này?"
            onConfirm={() => handleDeleteApplication(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const currentFilteredMajors = useMemo(() => {
    return filterSchoolId ? majors.filter(major => major.schoolId === filterSchoolId) : majors;
  }, [filterSchoolId, majors]);


  return (
    <div>
      <Title level={3}>Quản lý Nguyện vọng Đăng ký</Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm theo SV, mã NV, trường, ngành..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo Trường"
          style={{ width: 200 }}
          onChange={value => {
            setFilterSchoolId(value);
            setFilterMajorId(undefined); // Reset major filter when school changes
          }}
          value={filterSchoolId}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
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
          style={{ width: 200 }}
          onChange={value => setFilterMajorId(value)}
          value={filterMajorId}
          disabled={!filterSchoolId && majors.length === 0} // Disable nếu không có trường hoặc không có ngành
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {currentFilteredMajors.map(major => (
            <Option key={major.id} value={major.id}>
              {major.name} ({major.code})
            </Option>
          ))}
        </Select>
         <Select
          placeholder="Lọc theo Trạng thái"
          style={{ width: 180 }}
          allowClear
          value={filterStatus}
          onChange={value => setFilterStatus(value)}
        >
          <Option value="Đã nộp">Đã nộp</Option>
          <Option value="Đã xét">Đã xét</Option>
          <Option value="Trúng tuyển">Trúng tuyển</Option>
          <Option value="Trượt">Trượt</Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddApplication}
        >
          Thêm Nguyện vọng
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredApplications}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
        loading={loading}
        locale={{ emptyText: 'Không có nguyện vọng nào phù hợp.' }}
      />

      <Modal
        title={editingApplication ? 'Chỉnh sửa Nguyện vọng' : 'Thêm Nguyện vọng Mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingApplication ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          name="application_form"
          initialValues={editingApplication || {}}
        >
          <Form.Item
            name="studentId"
            label="Mã Sinh viên"
            rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
          >
            <Input disabled={!!editingApplication} placeholder="Mã SV của thí sinh" />
          </Form.Item>
          <Form.Item
            name="studentName"
            label="Họ và tên Sinh viên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên sinh viên!' }]}
          >
            <Input placeholder="Tên của thí sinh" />
          </Form.Item>

          <Form.Item
            name="schoolId"
            label="Trường"
            rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}
          >
            <Select
              placeholder="Chọn trường"
              onChange={value => {
                setModalSelectedSchoolId(value);
                form.setFieldsValue({ majorId: undefined, combinationId: undefined }); // Reset major and combination
              }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {schools.map(school => (
                <Option key={school.id} value={school.id}>
                  {school.name} ({school.code})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="majorId"
            label="Ngành"
            rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}
          >
            <Select
              placeholder="Chọn ngành"
              onChange={value => {
                setModalSelectedMajorId(value);
                form.setFieldsValue({ combinationId: undefined }); // Reset combination
              }}
              disabled={!modalSelectedSchoolId} // Vô hiệu hóa nếu chưa chọn trường
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {modalFilteredMajors.map(major => (
                <Option key={major.id} value={major.id}>
                  {major.name} ({major.code})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="combinationId"
            label="Tổ hợp xét tuyển"
            rules={[{ required: true, message: 'Vui lòng chọn tổ hợp xét tuyển!' }]}
          >
            <Select
              placeholder="Chọn tổ hợp"
              disabled={!modalSelectedMajorId} // Vô hiệu hóa nếu chưa chọn ngành
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {modalFilteredCombinations.map(combo => (
                <Option key={combo.id} value={combo.id}>
                  {combo.name} ({combo.subjects.join(', ')})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="priorityOrder"
            label="Thứ tự Nguyện vọng"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự nguyện vọng!' },
                    { type: 'number', min: 1, message: 'Thứ tự phải là số và lớn hơn 0!' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái Nguyện vọng"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Đã nộp">Đã nộp</Option>
              <Option value="Đã xét">Đã xét</Option>
              <Option value="Trúng tuyển">Trúng tuyển</Option>
              <Option value="Trượt">Trượt</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminManageApplicationsPage;