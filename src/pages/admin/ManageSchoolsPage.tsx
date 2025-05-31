import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

// Định nghĩa kiểu dữ liệu cho một trường học
interface School {
  id: string;
  name: string;
  code: string; // Mã trường, ví dụ: BKA, QGHN
  address: string;
  description?: string; // Mô tả thêm về trường
}

const ManageSchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [form] = Form.useForm();

  // Dữ liệu mẫu (sẽ được thay thế bằng API call sau)
  useEffect(() => {
    // Giả lập lấy dữ liệu từ API
    const dummySchools: School[] = [
      { id: '1', name: 'Đại học Bách Khoa Hà Nội', code: 'BKA', address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', description: 'Trường kỹ thuật hàng đầu Việt Nam' },
      { id: '2', name: 'Đại học Quốc gia Hà Nội', code: 'QGHN', address: '144 Xuân Thủy, Cầu Giấy, Hà Nội', description: 'Tổ hợp các trường đại học thành viên' },
      { id: '3', name: 'Đại học Ngoại Thương', code: 'NT', address: '91 Chùa Láng, Đống Đa, Hà Nội' },
    ];
    setSchools(dummySchools);
  }, []);

  // Mở modal thêm trường
  const handleAddSchool = () => {
    setEditingSchool(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal sửa trường
  const handleEditSchool = (record: School) => {
    setEditingSchool(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Xóa trường
  const handleDeleteSchool = (id: string) => {
    // Thực hiện API call xóa trường
    setSchools(schools.filter(school => school.id !== id));
    message.success('Xóa trường thành công!');
  };

  // Xử lý khi submit form (thêm mới hoặc cập nhật)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSchool) {
        // Cập nhật trường hiện có
        const updatedSchools = schools.map(school =>
          school.id === editingSchool.id ? { ...school, ...values } : school
        );
        setSchools(updatedSchools);
        message.success('Cập nhật trường thành công!');
      } else {
        // Thêm trường mới
        const newSchool: School = {
          ...values,
          id: String(schools.length + 1), // ID tạm thời, thực tế sẽ do backend tạo
        };
        setSchools([...schools, newSchool]);
        message.success('Thêm trường mới thành công!');
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

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Mã Trường',
      dataIndex: 'code',
      key: 'code',
      sorter: (a: School, b: School) => a.code.localeCompare(b.code),
    },
    {
      title: 'Tên Trường',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: School, b: School) => a.name.localeCompare(b.name),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text: string, record: School) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditSchool(record)}
            type="primary"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa trường này?"
            onConfirm={() => handleDeleteSchool(record.id)}
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
      <h1>Quản lý Danh sách Trường</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddSchool}
        style={{ marginBottom: 16 }}
      >
        Thêm Trường Mới
      </Button>
      <Table
        columns={columns}
        dataSource={schools}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={editingSchool ? 'Chỉnh sửa Trường' : 'Thêm Trường Mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingSchool ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="school_form"
          initialValues={editingSchool || {}}
        >
          <Form.Item
            name="name"
            label="Tên Trường"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Mã Trường"
            rules={[{ required: true, message: 'Vui lòng nhập mã trường!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input.TextArea rows={2} />
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

export default ManageSchoolsPage;