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
  Select,
  Tag,
  Divider,
  AutoComplete,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

// Định nghĩa kiểu dữ liệu cho một trường học
interface School {
  id: string;
  name: string;
  code: string;
}

// Định nghĩa kiểu dữ liệu cho một ngành
interface Major {
  id: string;
  name: string;
  code: string;
  schoolId: string;
}

// Định nghĩa kiểu dữ liệu cho một tổ hợp xét tuyển
interface AdmissionCombination {
  id: string;
  name: string; // Tên tổ hợp, ví dụ: A00, D01
  subjects: string[]; // Danh sách các môn, ví dụ: ['Toán', 'Lý', 'Hóa']
  majorId: string; // ID của ngành mà tổ hợp này thuộc về
  schoolId: string; // ID của trường (để tiện tra cứu và lọc)
}

// Danh sách các môn học gợi ý
const allSubjects = [
  'Toán', 'Ngữ Văn', 'Vật Lí', 'Hóa Học', 'Sinh Học', 'Lịch Sử', 'Địa Lí',
  'Giáo dục công dân', 'Tiếng Anh', 'Tiếng Pháp', 'Tiếng Đức', 'Tiếng Nhật', 'Tiếng Trung', 'Tiếng Hàn',
];

const ManageAdmissionCombinationsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [combinations, setCombinations] = useState<AdmissionCombination[]>([]);

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>(undefined);
  const [selectedMajorId, setSelectedMajorId] = useState<string | undefined>(undefined);
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]);
  const [filteredCombinations, setFilteredCombinations] = useState<AdmissionCombination[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCombination, setEditingCombination] = useState<AdmissionCombination | null>(null);
  const [form] = Form.useForm();
  const [inputSubjectValue, setInputSubjectValue] = useState(''); // Để nhập môn học

  // Giả lập dữ liệu từ API
  useEffect(() => {
    const dummySchools: School[] = [
      { id: '1', name: 'Đại học Bách Khoa Hà Nội', code: 'BKA' },
      { id: '2', name: 'Đại học Quốc gia Hà Nội', code: 'QGHN' },
      { id: '3', name: 'Đại học Ngoại Thương', code: 'NT' },
    ];
    setSchools(dummySchools);

    const dummyMajors: Major[] = [
      { id: '101', name: 'Khoa học Máy tính', code: 'IT1', schoolId: '1' },
      { id: '102', name: 'Kỹ thuật Điện tử Viễn thông', code: 'ET', schoolId: '1' },
      { id: '103', name: 'Công nghệ thông tin', code: 'CNTT', schoolId: '2' },
      { id: '201', name: 'Kinh tế Quốc tế', code: 'KTQT', schoolId: '3' },
      { id: '202', name: 'Quản trị Kinh doanh', code: 'QTKD', schoolId: '3' },
    ];
    setMajors(dummyMajors);

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
    setCombinations(dummyCombinations);
  }, []);

  // Lọc ngành theo trường được chọn
  useEffect(() => {
    if (selectedSchoolId) {
      setFilteredMajors(majors.filter(major => major.schoolId === selectedSchoolId));
      setSelectedMajorId(undefined); // Reset major selection when school changes
    } else {
      setFilteredMajors([]);
      setSelectedMajorId(undefined);
    }
  }, [selectedSchoolId, majors]);

  // Lọc tổ hợp theo ngành được chọn
  useEffect(() => {
    if (selectedMajorId) {
      setFilteredCombinations(combinations.filter(combo => combo.majorId === selectedMajorId));
    } else {
      setFilteredCombinations([]);
    }
  }, [selectedMajorId, combinations]);


  const getSchoolName = (id: string) => {
    const school = schools.find(s => s.id === id);
    return school ? school.name : 'N/A';
  };

  const getMajorName = (id: string) => {
    const major = majors.find(m => m.id === id);
    return major ? major.name : 'N/A';
  };

  // Mở modal thêm tổ hợp
  const handleAddCombination = () => {
    // Đảm bảo đã chọn trường và ngành trước khi thêm tổ hợp
    if (!selectedSchoolId || !selectedMajorId) {
      message.warning('Vui lòng chọn Trường và Ngành trước khi thêm tổ hợp!');
      return;
    }
    setEditingCombination(null);
    form.resetFields();
    form.setFieldsValue({ subjects: [] }); // Khởi tạo mảng subjects rỗng
    setInputSubjectValue('');
    setIsModalVisible(true);
  };

  // Mở modal sửa tổ hợp
  const handleEditCombination = (record: AdmissionCombination) => {
    setEditingCombination(record);
    // Khi sửa, set giá trị cho form bao gồm cả schoolId và majorId
    form.setFieldsValue({
      ...record,
      schoolId: record.schoolId,
      majorId: record.majorId,
    });
    setInputSubjectValue(''); // Clear input subject value
    setIsModalVisible(true);
  };

  // Xóa tổ hợp
  const handleDeleteCombination = (id: string) => {
    setCombinations(combinations.filter(combo => combo.id !== id));
    message.success('Xóa tổ hợp thành công!');
  };

  // Xử lý khi submit form (thêm mới hoặc cập nhật)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!values.subjects || values.subjects.length === 0) {
        message.error('Vui lòng nhập ít nhất một môn học cho tổ hợp!');
        return;
      }

      if (editingCombination) {
        // Cập nhật tổ hợp hiện có
        const updatedCombinations = combinations.map(combo =>
          combo.id === editingCombination.id
            ? { ...combo, ...values, schoolId: selectedSchoolId!, majorId: selectedMajorId! }
            : combo
        );
        setCombinations(updatedCombinations);
        message.success('Cập nhật tổ hợp thành công!');
      } else {
        // Thêm tổ hợp mới
        const newCombination: AdmissionCombination = {
          ...values,
          id: String(combinations.length + 2001), // ID tạm thời
          schoolId: selectedSchoolId!,
          majorId: selectedMajorId!,
        };
        setCombinations([...combinations, newCombination]);
        message.success('Thêm tổ hợp mới thành công!');
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

  // Hàm xử lý khi thêm môn học vào tổ hợp
  const handleAddSubject = () => {
    const currentSubjects: string[] = form.getFieldValue('subjects') || [];
    if (inputSubjectValue && !currentSubjects.includes(inputSubjectValue.trim())) {
      form.setFieldsValue({ subjects: [...currentSubjects, inputSubjectValue.trim()] });
      setInputSubjectValue(''); // Clear input after adding
    }
  };

  // Hàm xử lý khi xóa môn học khỏi tổ hợp
  const handleRemoveSubject = (removedSubject: string) => {
    const currentSubjects: string[] = form.getFieldValue('subjects') || [];
    form.setFieldsValue({ subjects: currentSubjects.filter(sub => sub !== removedSubject) });
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Tên Tổ hợp',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: AdmissionCombination, b: AdmissionCombination) => a.name.localeCompare(b.name),
    },
    {
      title: 'Các môn',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects: string[]) => (
        <Space wrap>
          {subjects.map(subject => (
            <Tag color="blue" key={subject}>{subject}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Trường',
      dataIndex: 'schoolId',
      key: 'schoolName',
      render: (schoolId: string) => getSchoolName(schoolId),
    },
    {
      title: 'Ngành',
      dataIndex: 'majorId',
      key: 'majorName',
      render: (majorId: string) => getMajorName(majorId),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text: string, record: AdmissionCombination) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditCombination(record)}
            type="primary"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tổ hợp này?"
            onConfirm={() => handleDeleteCombination(record.id)}
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
      <h1>Quản lý Tổ hợp Xét tuyển</h1>

      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Chọn Trường"
          style={{ width: 250 }}
          onChange={value => setSelectedSchoolId(value)}
          value={selectedSchoolId}
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
          placeholder="Chọn Ngành"
          style={{ width: 250 }}
          onChange={value => setSelectedMajorId(value)}
          value={selectedMajorId}
          disabled={!selectedSchoolId} // Disable nếu chưa chọn trường
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {filteredMajors.map(major => (
            <Option key={major.id} value={major.id}>
              {major.name} ({major.code})
            </Option>
          ))}
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCombination}
          disabled={!selectedMajorId} // Disable nếu chưa chọn ngành
        >
          Thêm Tổ hợp Mới
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredCombinations} // Hiển thị tổ hợp đã lọc
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
        locale={{ emptyText: 'Vui lòng chọn Trường và Ngành để xem hoặc thêm tổ hợp.' }}
      />

      <Modal
        title={editingCombination ? 'Chỉnh sửa Tổ hợp' : 'Thêm Tổ hợp Mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingCombination ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="admission_combination_form"
          initialValues={editingCombination || {}}
        >
          <Form.Item
            name="name"
            label="Tên Tổ hợp"
            rules={[{ required: true, message: 'Vui lòng nhập tên tổ hợp (VD: A00, D01)!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="subjects"
            label="Các môn học"
            rules={[{ required: true, message: 'Vui lòng thêm ít nhất một môn học!' }]}
          >
            <div>
              <Space style={{ width: '100%' }} align="baseline">
                <AutoComplete
                  options={allSubjects.map(sub => ({ value: sub }))}
                  style={{ flexGrow: 1 }}
                  value={inputSubjectValue}
                  onChange={setInputSubjectValue}
                  placeholder="Nhập hoặc chọn môn học"
                  filterOption={(inputValue, option) =>
                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
                <Button onClick={handleAddSubject} disabled={!inputSubjectValue}>
                  Thêm Môn
                </Button>
              </Space>
              <div style={{ marginTop: 8 }}>
                {(form.getFieldValue('subjects') || []).map((subject: string) => (
                  <Tag
                    key={subject}
                    closable
                    onClose={() => handleRemoveSubject(subject)}
                    style={{ marginTop: 4 }}
                  >
                    {subject}
                  </Tag>
                ))}
                {(form.getFieldValue('subjects') || []).length === 0 && (
                  <p style={{ color: 'red', marginTop: 5 }}>Chưa có môn học nào được thêm.</p>
                )}
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAdmissionCombinationsPage;