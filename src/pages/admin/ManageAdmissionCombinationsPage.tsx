import React, { useState } from 'react';
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
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

interface AdmissionCombination {
  id: string;
  name: string;
  subjects: string[];
}

const predefinedSubjects = [
  'Toán', 'Ngữ Văn', 'Tiếng Anh', 'Vật Lí', 'Hóa Học',
  'Sinh Học', 'Lịch Sử', 'Địa Lí', 'Giáo dục công dân',
];

const ManageAdmissionCombinationsForm: React.FC = () => {
  const [combinations, setCombinations] = useState<AdmissionCombination[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCombination, setEditingCombination] = useState<AdmissionCombination | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingCombination(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: AdmissionCombination) => {
    setEditingCombination(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setCombinations(combinations.filter(c => c.id !== id));
    message.success('Xóa tổ hợp thành công!');
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.subjects.length !== 3) {
        message.error('Mỗi tổ hợp phải có đúng 3 môn học!');
        return;
      }
      if (editingCombination) {
        setCombinations(combinations.map(c =>
          c.id === editingCombination.id ? { ...c, ...values } : c
        ));
        message.success('Cập nhật tổ hợp thành công!');
      } else {
        const newCombination: AdmissionCombination = {
          id: Date.now().toString(),
          ...values,
        };
        setCombinations([...combinations, newCombination]);
        message.success('Thêm tổ hợp thành công!');
      }
      setIsModalVisible(false);
    } catch {
      message.error('Vui lòng điền đầy đủ thông tin!');
    }
  };

  const columns = [
    {
      title: 'Tên Tổ hợp',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Các môn học',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects: string[]) => (
        <Space wrap>{subjects.map(sub => <Tag key={sub}>{sub}</Tag>)}</Space>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: AdmissionCombination) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="primary">
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
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
      <h2>Quản lý Tổ hợp Xét tuyển</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        Thêm tổ hợp
      </Button>
      <Table columns={columns} dataSource={combinations} rowKey="id" bordered />

      <Modal
        title={editingCombination ? 'Sửa Tổ hợp' : 'Thêm Tổ hợp'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingCombination ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Tổ hợp"
            rules={[{ required: true, message: 'Vui lòng nhập tên tổ hợp!' }]}
          >
            <Input placeholder="VD: A00, D01..." />
          </Form.Item>
          <Form.Item
            name="subjects"
            label="Chọn 3 môn học"
            rules={[{ required: true, message: 'Vui lòng chọn 3 môn học!' }]}
          >
            <Select mode="multiple" placeholder="Chọn 3 môn" maxTagCount={3}>
              {predefinedSubjects.map(sub => (
                <Option key={sub} value={sub}>{sub}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAdmissionCombinationsForm;