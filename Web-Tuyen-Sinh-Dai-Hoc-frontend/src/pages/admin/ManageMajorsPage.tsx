import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Select, InputNumber, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { adminApi } from '../../services/adminApi';

const { Option } = Select;

// Local interfaces that map AdminMajor to UI-friendly format
interface Major {
  id: string;
  name: string;
  code: string;
  schoolId: string;
  quota: number;
  isActive: boolean;
  school: {
    id: string;
    name: string;
    code: string;
  };
  combinations: Array<{
    combination: {
      id: string;
      name: string;
      subjects: string[];
    };
  }>;  _count?: {
    applications: number;
  };
}

interface School {
  id: string;
  name: string;
  code: string;
}

interface AdmissionCombination {
  id: string;
  name: string;
  subjects: string[];
}

const ManageMajorsPage: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [allAdmissionCombinations, setAllAdmissionCombinations] = useState<AdmissionCombination[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Fetch data from backend
  const fetchMajors = async () => {
    try {
      setLoading(true);
      const majorsData = await adminApi.getMajors();
      setMajors(majorsData);
    } catch (error) {
      console.error('Error fetching majors:', error);
      message.error('Không thể tải danh sách ngành. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const schoolsData = await adminApi.getSchools();
      setSchools(schoolsData);
    } catch (error) {
      console.error('Error fetching schools:', error);
      message.error('Không thể tải danh sách trường. Vui lòng thử lại!');
    }
  };

  const fetchCombinations = async () => {
    try {
      const combinationsData = await adminApi.getCombinations();
      setAllAdmissionCombinations(combinationsData);
    } catch (error) {
      console.error('Error fetching combinations:', error);
      message.error('Không thể tải danh sách tổ hợp xét tuyển. Vui lòng thử lại!');
    }
  };

  useEffect(() => {
    fetchMajors();
    fetchSchools();
    fetchCombinations();
  }, []);

  // Generate unique major code
  const generateUniqueMajorCode = (existingMajors: Major[]): string => {
    const prefix = 'NGANH_';
    let newCode: string;
    let isUnique = false;
    do {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      newCode = `${prefix}${randomNum}`;
      isUnique = !existingMajors.some(major => major.code === newCode);
    } while (!isUnique);
    return newCode;
  };

  // Open add major modal
  const handleAddMajor = () => {
    setEditingMajor(null);
    form.resetFields();
    form.setFieldsValue({ 
      code: generateUniqueMajorCode(majors), 
      admissionCombinationIds: [] 
    });
    setIsModalVisible(true);
  };

  // Open edit major modal
  const handleEditMajor = (record: Major) => {
    setEditingMajor(record);
    // Convert combinations array to IDs for form
    const combinationIds = record.combinations.map(c => c.combination.id);
    form.setFieldsValue({
      ...record,
      admissionCombinationIds: combinationIds
    });
    setIsModalVisible(true);
  };

  // Delete major
  const handleDeleteMajor = async (id: string) => {
    try {
      await adminApi.deleteMajor(id);
      setMajors(majors.filter(major => major.id !== id));
      message.success('Xóa ngành thành công!');
    } catch (error: any) {
      console.error('Error deleting major:', error);
      message.error(error.response?.data?.message || 'Không thể xóa ngành. Vui lòng thử lại!');
    }
  };
  // Handle form submission (add or update)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      const majorData = {
        name: values.name,
        code: values.code,
        schoolId: values.schoolId,
        quota: values.quota,
        admissionCombinationIds: values.admissionCombinationIds || []
      };

      console.log('Sending major data:', majorData);
        if (editingMajor) {
        // Update existing major
        const updatedMajor = await adminApi.updateMajor(editingMajor.id, majorData);
        
        setMajors(majors.map(major =>
          major.id === editingMajor.id ? { ...updatedMajor, _count: major._count } : major
        ));
        message.success('Cập nhật ngành thành công!');
      } else {
        // Create new major
        const newMajor = await adminApi.createMajor(majorData);
        
        // Add _count field for consistency with table display
        const majorWithCount = { 
          ...newMajor, 
          _count: { applications: 0 } 
        };
        
        setMajors([...majors, majorWithCount]);
        message.success('Thêm ngành mới thành công!');
      }
        setIsModalVisible(false);
    } catch (error: any) {
      console.error('Error saving major:', error);
      console.error('Error response:', error.response?.data);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  // Cancel modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Get combination names from major combinations
  const getCombinationNames = (major: Major) => {
    if (!major.combinations || major.combinations.length === 0) return 'Chưa có';
    return major.combinations
      .map(c => c.combination.name)
      .join(', ');
  };

  // Filter majors based on search and school filter
  const filteredMajors = useMemo(() => {
    let filtered = majors;

    if (selectedSchoolFilter) {
      filtered = filtered.filter(major => major.schoolId === selectedSchoolFilter);
    }

    if (searchText) {
      filtered = filtered.filter(
        major =>
          major.name.toLowerCase().includes(searchText.toLowerCase()) ||
          major.code.toLowerCase().includes(searchText.toLowerCase()) ||
          major.school.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    return filtered;
  }, [majors, searchText, selectedSchoolFilter]);

  // Table columns definition
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
      key: 'schoolName',
      render: (_: any, record: Major) => record.school.name,
      sorter: (a: Major, b: Major) => a.school.name.localeCompare(b.school.name),
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
      sorter: (a: Major, b: Major) => a.quota - b.quota,
    },    {
      title: 'Số đơn đăng ký',
      key: 'applications',
      render: (_: any, record: Major) => record._count?.applications || 0,
      sorter: (a: Major, b: Major) => (a._count?.applications || 0) - (b._count?.applications || 0),
    },
    {
      title: 'Tổ hợp xét tuyển',
      key: 'admissionCombinations',
      render: (_: any, record: Major) => getCombinationNames(record),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: Major) => (
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
            description="Thao tác này không thể hoàn tác!"
            onConfirm={() => handleDeleteMajor(record.id)}
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
      <h1>Quản lý Danh sách Ngành</h1>

      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên ngành, mã ngành..."
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo trường"
            style={{ width: 200 }}
            onChange={value => setSelectedSchoolFilter(value)}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              String(option?.children || '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {schools.map(school => (
              <Option key={school.id} value={school.id}>
                {school.name}
              </Option>
            ))}
          </Select>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddMajor}
        >
          Thêm Ngành Mới
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredMajors}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} ngành`
          }}
          bordered
        />
      </Spin>

      <Modal
        title={editingMajor ? 'Chỉnh sửa Ngành' : 'Thêm Ngành Mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingMajor ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="major_form"
        >
          <Form.Item
            name="schoolId"
            label="Trường"
            rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}
          >
            <Select
              placeholder="Chọn trường"
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
          </Form.Item>
          
          <Form.Item
            name="name"
            label="Tên Ngành"
            rules={[{ required: true, message: 'Vui lòng nhập tên ngành!' }]}
          >
            <Input placeholder="Nhập tên ngành" />
          </Form.Item>
          
          <Form.Item
            name="code"
            label="Mã Ngành"
            rules={[{ required: true, message: 'Mã ngành là bắt buộc!' }]}
          >
            <Input disabled placeholder="Mã ngành được sinh tự động" />
          </Form.Item>
          
          <Form.Item
            name="quota"
            label="Chỉ tiêu"
            rules={[
              { required: true, message: 'Vui lòng nhập chỉ tiêu!' },
              { type: 'number', min: 1, message: 'Chỉ tiêu phải lớn hơn 0!' },
            ]}
          >
            <InputNumber 
              min={1} 
              style={{ width: '100%' }} 
              placeholder="Nhập chỉ tiêu ngành"
            />
          </Form.Item>
          
          <Form.Item
            name="admissionCombinationIds"
            label="Tổ hợp xét tuyển"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một tổ hợp xét tuyển!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn các tổ hợp xét tuyển"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {allAdmissionCombinations.map(combo => (
                <Option key={combo.id} value={combo.id}>
                  {combo.name} ({combo.subjects.join(', ')})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageMajorsPage;
