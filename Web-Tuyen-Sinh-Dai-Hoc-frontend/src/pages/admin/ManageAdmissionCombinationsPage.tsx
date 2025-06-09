import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Tag,
  Select,
  Spin,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { adminApi, type AdminMajorCombination } from '../../services/adminApi';

const { Option } = Select;

const predefinedSubjects = [
  'Toán', 'Ngữ Văn', 'Tiếng Anh', 'Vật Lí', 'Hóa Học',
  'Sinh Học', 'Lịch Sử', 'Địa Lí', 'Giáo dục công dân',
];

const ManageAdmissionCombinationsPage: React.FC = () => {
  const [combinations, setCombinations] = useState<AdminMajorCombination[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCombination, setEditingCombination] = useState<AdminMajorCombination | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch combinations from backend
  const fetchCombinations = async () => {
    try {
      setLoading(true);
      const combinationsData = await adminApi.getCombinations();
      setCombinations(combinationsData);
    } catch (error) {
      console.error('Error fetching combinations:', error);
      message.error('Không thể tải danh sách tổ hợp xét tuyển. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombinations();
  }, []);

  const handleAdd = () => {
    setEditingCombination(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: AdminMajorCombination) => {
    setEditingCombination(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteCombination(id);
      setCombinations(combinations.filter(c => c.id !== id));
      message.success('Xóa tổ hợp thành công!');
    } catch (error: any) {
      console.error('Error deleting combination:', error);
      message.error(error.response?.data?.message || 'Không thể xóa tổ hợp. Vui lòng thử lại!');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (values.subjects.length !== 3) {
        message.error('Mỗi tổ hợp phải có đúng 3 môn học!');
        return;
      }

      if (editingCombination) {
        // Update existing combination
        const updatedCombination = await adminApi.updateCombination(editingCombination.id, {
          name: values.name,
          subjects: values.subjects,
        });
        
        setCombinations(combinations.map(c =>
          c.id === editingCombination.id ? updatedCombination : c
        ));
        message.success('Cập nhật tổ hợp thành công!');
      } else {
        // Create new combination
        const newCombination = await adminApi.createCombination({
          name: values.name,
          subjects: values.subjects,
        });
        
        setCombinations([...combinations, newCombination]);
        message.success('Thêm tổ hợp thành công!');
      }
      
      setIsModalVisible(false);
    } catch (error: any) {
      console.error('Error saving combination:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Filter combinations based on search text
  const filteredCombinations = combinations.filter(
    combination =>
      combination.name.toLowerCase().includes(searchText.toLowerCase()) ||
      combination.subjects.some(subject => 
        subject.toLowerCase().includes(searchText.toLowerCase())
      )
  );

  const columns = [
    {
      title: 'Tên Tổ hợp',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: AdminMajorCombination, b: AdminMajorCombination) => a.name.localeCompare(b.name),
    },
    {
      title: 'Các môn học',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects: string[]) => (
        <Space wrap>
          {subjects.map(subject => (
            <Tag key={subject} color="blue">
              {subject}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: AdminMajorCombination) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
            type="primary"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tổ hợp này?"
            description="Thao tác này không thể hoàn tác!"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý Tổ hợp Xét tuyển</h1>

      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Input
          placeholder="Tìm kiếm theo tên tổ hợp hoặc môn học..."
          prefix={<SearchOutlined />}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm Tổ hợp Mới
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredCombinations}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tổ hợp`
          }}
          bordered
        />
      </Spin>

      <Modal
        title={editingCombination ? 'Chỉnh sửa Tổ hợp' : 'Thêm Tổ hợp Mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingCombination ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="combination_form"
        >
          <Form.Item
            name="name"
            label="Tên Tổ hợp"
            rules={[{ required: true, message: 'Vui lòng nhập tên tổ hợp!' }]}
          >
            <Input placeholder="VD: A00, A01, B00..." />
          </Form.Item>
          
          <Form.Item
            name="subjects"
            label="Chọn 3 môn học"
            rules={[
              { required: true, message: 'Vui lòng chọn các môn học!' },
              {
                validator: (_, value) => {
                  if (value && value.length === 3) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mỗi tổ hợp phải có đúng 3 môn học!'));
                },
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn đúng 3 môn học"
              maxTagCount={3}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {predefinedSubjects.map(subject => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAdmissionCombinationsPage;
