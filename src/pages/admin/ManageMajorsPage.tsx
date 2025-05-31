import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

// Định nghĩa kiểu dữ liệu cho một trường học (để dùng cho Select)
interface School {
  id: string;
  name: string;
  code: string;
}

// Định nghĩa kiểu dữ liệu cho một ngành
interface Major {
  id: string;
  name: string;
  code: string; // Mã ngành, ví dụ: CNTT, QTKD
  schoolId: string; // ID của trường mà ngành này thuộc về
  description?: string; // Mô tả thêm về ngành
}

const ManageMajorsPage: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [schools, setSchools] = useState<School[]>([]); // Danh sách các trường để hiển thị trong Select
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [form] = Form.useForm();

  // Giả lập dữ liệu trường và ngành
  useEffect(() => {
    // Giả lập lấy danh sách trường từ API (cần có để hiển thị trong Select)
    const dummySchools: School[] = [
      { id: '1', name: 'Đại học Bách Khoa Hà Nội', code: 'BKA' },
      { id: '2', name: 'Đại học Quốc gia Hà Nội', code: 'QGHN' },
      { id: '3', name: 'Đại học Ngoại Thương', code: 'NT' },
    ];
    setSchools(dummySchools);

    // Giả lập lấy danh sách ngành từ API
    const dummyMajors: Major[] = [
      { id: '101', name: 'Khoa học Máy tính', code: 'IT1', schoolId: '1', description: 'Ngành học về lập trình, thuật toán, AI...' },
      { id: '102', name: 'Kỹ thuật Điện tử Viễn thông', code: 'ET', schoolId: '1', description: 'Nghiên cứu về mạch điện, truyền thông...' },
      { id: '201', name: 'Kinh tế Quốc tế', code: 'KTQT', schoolId: '3', description: 'Nghiên cứu về kinh tế toàn cầu...' },
      { id: '202', name: 'Quản trị Kinh doanh', code: 'QTKD', schoolId: '3', description: 'Nghiên cứu về quản lý doanh nghiệp...' },
    ];
    setMajors(dummyMajors);
  }, []);

  // Mở modal thêm ngành
  const handleAddMajor = () => {
    setEditingMajor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal sửa ngành
  const handleEditMajor = (record: Major) => {
    setEditingMajor(record);
    form.setFieldsValue(record); // Gán giá trị hiện tại của ngành vào form
    setIsModalVisible(true);
  };

  // Xóa ngành
  const handleDeleteMajor = (id: string) => {
    // Thực hiện API call xóa ngành
    setMajors(majors.filter(major => major.id !== id));
    message.success('Xóa ngành thành công!');
  };

  // Xử lý khi submit form (thêm mới hoặc cập nhật)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingMajor) {
        // Cập nhật ngành hiện có
        const updatedMajors = majors.map(major =>
          major.id === editingMajor.id ? { ...major, ...values } : major
        );
        setMajors(updatedMajors);
        message.success('Cập nhật ngành thành công!');
      } else {
        // Thêm ngành mới
        const newMajor: Major = {
          ...values,
          id: String(majors.length + 1001), // ID tạm thời, thực tế sẽ do backend tạo
        };
        setMajors([...majors, newMajor]);
        message.success('Thêm ngành mới thành công!');
      }
      setIsModalVisible(false);
    } catch (errorInfo) {
      console.log('Validate Failed:', errorInfo);
      message.error('Vui lòng điền đầy đủ và đúng thông tin!');
    }
  };

  // Hủy bỏ modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm giúp lấy tên trường từ schoolId
  const getSchoolName = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : 'Không xác định';
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Mã Ngành',
      dataIndex: 'code',
      key: 'code',
      sorter: (a: Major, b: Major) => a.code.localeCompare(b.code),
    },
    {
      title: 'Tên Ngành',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Major, b: Major) => a.name.localeCompare(b.name),
    },
    {
      title: 'Trường',
      dataIndex: 'schoolId',
      key: 'schoolName',
      render: (schoolId: string) => getSchoolName(schoolId), // Hiển thị tên trường thay vì ID
      sorter: (a: Major, b: Major) => getSchoolName(a.schoolId).localeCompare(getSchoolName(b.schoolId)),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text: string, record: Major) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditMajor(record)}
            type="primary"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa ngành này?"
            onConfirm={() => handleDeleteMajor(record.id)}
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

  return (
    <div>
      <h1>Quản lý Danh sách Ngành</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddMajor}
        style={{ marginBottom: 16 }}
      >
        Thêm Ngành Mới
      </Button>
      <Table
        columns={columns}
        dataSource={majors}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={editingMajor ? 'Chỉnh sửa Ngành' : 'Thêm Ngành Mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingMajor ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="major_form"
          initialValues={editingMajor || {}}
        >
          <Form.Item
            name="schoolId"
            label="Trường"
            rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}
          >
            <Select
              placeholder="Chọn trường"
              showSearch // Cho phép tìm kiếm trong danh sách chọn
              optionFilterProp="children" // Lọc theo nội dung của Option
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
            name="name"
            label="Tên Ngành"
            rules={[{ required: true, message: 'Vui lòng nhập tên ngành!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Mã Ngành"
            rules={[{ required: true, message: 'Vui lòng nhập mã ngành!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageMajorsPage;