import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Select, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

// Định nghĩa kiểu dữ liệu cho một trường học (để dùng cho Select và hiển thị)
interface School {
  id: string;
  name: string;
  code: string;
}

// Định nghĩa kiểu dữ liệu cho một tổ hợp xét tuyển (chỉ để hiển thị tên)
interface AdmissionCombination {
  id: string;
  name: string; // Ví dụ: A00, A01, D01
}

// Định nghĩa kiểu dữ liệu cho một ngành
interface Major {
  id: string;
  name: string;
  code: string; // Mã ngành, sinh tự động, duy nhất
  schoolId: string; // ID của trường mà ngành này thuộc về
  quota: number; // Chỉ tiêu của ngành
  admissionCombinationIds: string[]; // Danh sách các ID của tổ hợp xét tuyển
}

const ManageMajorsPage: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [schools, setSchools] = useState<School[]>([]); // Danh sách các trường
  const [allAdmissionCombinations, setAllAdmissionCombinations] = useState<AdmissionCombination[]>([]); // Toàn bộ tổ hợp để mapping
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string | undefined>(undefined);

  // Giả lập dữ liệu trường, ngành và tổ hợp xét tuyển
  useEffect(() => {
    // Giả lập lấy danh sách trường từ API
    const dummySchools: School[] = [
      { id: '1', name: 'Đại học Bách Khoa Hà Nội', code: 'BKA' },
      { id: '2', name: 'Đại học Quốc gia Hà Nội', code: 'QGHN' },
      { id: '3', name: 'Đại học Ngoại Thương', code: 'NT' },
    ];
    setSchools(dummySchools);

    // Giả lập lấy danh sách tổ hợp xét tuyển từ API
    const dummyAdmissionCombinations: AdmissionCombination[] = [
      { id: 'cb1', name: 'A00' }, // Toán, Lý, Hóa
      { id: 'cb2', name: 'A01' }, // Toán, Lý, Anh
      { id: 'cb3', name: 'D01' }, // Toán, Văn, Anh
      { id: 'cb4', name: 'D07' }, // Toán, Hóa, Anh
    ];
    setAllAdmissionCombinations(dummyAdmissionCombinations);

    // Giả lập lấy danh sách ngành từ API
    const dummyMajors: Major[] = [
      {
        id: '101',
        name: 'Khoa học Máy tính',
        code: 'KHMTCB-001',
        schoolId: '1',
        quota: 1500,
        admissionCombinationIds: ['cb1', 'cb2'],
      },
      {
        id: '102',
        name: 'Kỹ thuật Điện tử Viễn thông',
        code: 'KTDTVT-002',
        schoolId: '1',
        quota: 1000,
        admissionCombinationIds: ['cb1', 'cb2', 'cb3'],
      },
      {
        id: '201',
        name: 'Kinh tế Quốc tế',
        code: 'KTQT-003',
        schoolId: '3',
        quota: 800,
        admissionCombinationIds: ['cb1', 'cb2', 'cb3', 'cb4'],
      },
      {
        id: '202',
        name: 'Quản trị Kinh doanh',
        code: 'QTKD-004',
        schoolId: '3',
        quota: 700,
        admissionCombinationIds: ['cb1', 'cb3'],
      },
    ];
    setMajors(dummyMajors);
  }, []);

  // Hàm sinh mã ngành tự động duy nhất
  const generateUniqueMajorCode = (existingMajors: Major[]): string => {
    const prefix = 'NGANH-';
    let newCode: string;
    let isUnique = false;
    do {
      // Số ngẫu nhiên từ 1000 đến 9999
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      newCode = `${prefix}${randomNum}`;
      isUnique = !existingMajors.some(major => major.code === newCode);
    } while (!isUnique);
    return newCode;
  };

  // Mở modal thêm ngành
  const handleAddMajor = () => {
    setEditingMajor(null);
    form.resetFields();
    // Sinh mã ngành tự động và gán vào form
    form.setFieldsValue({ code: generateUniqueMajorCode(majors), admissionCombinationIds: [] });
    setIsModalVisible(true);
  };

  // Mở modal sửa ngành
  const handleEditMajor = (record: Major) => {
    setEditingMajor(record);
    // Gán giá trị hiện tại của ngành vào form
    form.setFieldsValue(record);
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
          major.id === editingMajor.id
            ? {
                ...major,
                name: values.name,
                schoolId: values.schoolId,
                quota: values.quota,
                admissionCombinationIds: values.admissionCombinationIds || [], // Cập nhật tổ hợp xét tuyển
              }
            : major
        );
        setMajors(updatedMajors);
        message.success('Cập nhật ngành thành công!');
      } else {
        // Thêm ngành mới
        const newMajor: Major = {
          ...values,
          id: String(Date.now()), // ID tạm thời, thực tế sẽ do backend tạo
          code: form.getFieldValue('code'), // Lấy mã ngành đã được sinh tự động
          admissionCombinationIds: values.admissionCombinationIds || [], // Lấy tổ hợp xét tuyển từ form
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

  // Hàm lấy tên tổ hợp từ ID
  const getCombinationNames = (combinationIds: string[]) => {
    if (!combinationIds || combinationIds.length === 0) return 'Chưa có';
    return combinationIds
      .map(id => allAdmissionCombinations.find(cb => cb.id === id)?.name || 'N/A')
      .join(', ');
  };

  // Lọc danh sách ngành dựa trên tìm kiếm
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
          getSchoolName(major.schoolId).toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return filtered;
  }, [majors, searchText, selectedSchoolFilter, schools]);

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
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
      sorter: (a: Major, b: Major) => a.quota - b.quota,
    },
    {
      title: 'Tổ hợp xét tuyển',
      dataIndex: 'admissionCombinationIds',
      key: 'admissionCombinations',
      render: (ids: string[]) => getCombinationNames(ids), // Hiển thị tên tổ hợp
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
              (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
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

      <Table
        columns={columns}
        dataSource={filteredMajors}
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
          initialValues={editingMajor || { admissionCombinationIds: [] }} // Set default for new major
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
            // Khi thêm mới, mã ngành được sinh tự động. Khi chỉnh sửa, mã ngành không thay đổi.
            // Do đó, luôn disable trường này.
            // initialValue cho trường `code` được set trong `handleAddMajor` hoặc lấy từ `editingMajor`
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="quota"
            label="Chỉ tiêu"
            rules={[
              { required: true, message: 'Vui lòng nhập chỉ tiêu!' },
              { type: 'number', min: 0, message: 'Chỉ tiêu phải là số không âm!' },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
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
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {allAdmissionCombinations.map(combo => (
                <Option key={combo.id} value={combo.id}>
                  {combo.name}
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