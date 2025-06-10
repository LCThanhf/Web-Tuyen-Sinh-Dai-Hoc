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
  InputNumber,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { adminApi, type AdminSchool, type AdminAdmissionMethod, type AdminMajor } from '../../services/adminApi';

// Use the types from adminApi
type School = AdminSchool;
type AdmissionMethod = AdminAdmissionMethod;
type Major = AdminMajor;

const ManageSchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMajorModalVisible, setIsMajorModalVisible] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [majorsForEditing, setMajorsForEditing] = useState<Major[]>([]);
  const [form] = Form.useForm();
  const [admissionMethodsForm] = Form.useForm();

  // Fetch schools from backend
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const schoolsData = await adminApi.getSchools();
      setSchools(schoolsData);
    } catch (error) {
      console.error('Error fetching schools:', error);
      message.error('Không thể tải danh sách trường. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Generate unique school code based on school name abbreviation
  const generateUniqueSchoolCode = (schoolName: string, existingSchools: School[], editingId?: string): string => {
    if (!schoolName) return '';
    
    // Replace Đ/đ with D/d and other Vietnamese characters
    const replaced = schoolName
      .replace(/Đ/g, "D").replace(/đ/g, "d")
      .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
      .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
      .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
      .replace(/ì|í|ị|ỉ|ĩ/g, "i")
      .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
      .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
      .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    
    // Remove special characters except spaces and hyphens
    const cleaned = replaced.replace(/[^A-Za-z0-9\s-]/g, " ");
    
    // Split into words and get first letter of each significant word
    const words = cleaned
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0)
      // Filter out common connecting words
      .filter(word => !['va', 'và', 'cua', 'của', 'tren', 'trên', 'trong', 'ngoai', 'ngoài'].includes(word.toLowerCase()));
    
    let baseCode = '';
    
    if (words.length === 1) {
      // Single word: take first 3 characters
      baseCode = words[0].substring(0, 3).toUpperCase();
    } else if (words.length >= 2) {
      // Multiple words: take first letter of each word up to 3 letters
      baseCode = words
        .slice(0, 3)
        .map(word => word[0])
        .join('')
        .toUpperCase();
    }
    
    // Ensure we have a valid base code
    if (!baseCode || baseCode.length === 0) {
      baseCode = 'SCH';
    }
    
    // Check if base code is unique
    let finalCode = baseCode;
    let counter = 1;
    
    while (existingSchools.some(school => school.code === finalCode && school.id !== editingId)) {
      if (counter < 10) {
        finalCode = `${baseCode}${counter}`;
      } else {
        // If we have too many conflicts, add random number
        const randomNum = Math.floor(10 + Math.random() * 90);
        finalCode = `${baseCode}${randomNum}`;
        break;
      }
      counter++;
    }
    
    return finalCode;
  };

  // Handle school name change to auto-generate code
  const handleSchoolNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const schoolName = e.target.value;
    if (schoolName && !editingSchool) {
      // Only auto-generate for new schools, not when editing
      const generatedCode = generateUniqueSchoolCode(schoolName, schools);
      form.setFieldsValue({ code: generatedCode });
    }
  };

  // Modal handlers
  const handleAddSchool = () => {
    setEditingSchool(null);
    form.resetFields();
    form.setFieldsValue({ 
      code: '' // We'll generate this when name is entered
    });
    admissionMethodsForm.setFieldsValue({
      admissionMethods: [
        { name: 'Điểm THPT', percentage: null },
        { name: 'Học bạ', percentage: null },
        { name: 'ĐGNL/TD', percentage: null },
      ],
    });
    setIsModalVisible(true);
  };

  const handleEditSchool = (record: School) => {
    setEditingSchool(record);
    form.setFieldsValue({ 
      name: record.name,
      code: record.code 
    });
    admissionMethodsForm.setFieldsValue({
      admissionMethods: record.admissionMethods,
    });
    setIsModalVisible(true);
  };

  const handleDeleteSchool = async (id: string) => {
    try {
      await adminApi.deleteSchool(id);
      message.success('Xóa trường thành công!');
      fetchSchools(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting school:', error);
      message.error(error.response?.data?.message || 'Không thể xóa trường. Vui lòng thử lại!');
    }
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const admissionMethodValues = await admissionMethodsForm.validateFields();

      const totalPercentage = admissionMethodValues.admissionMethods.reduce(
        (sum: number, method: AdmissionMethod) => sum + (method.percentage || 0),
        0
      );

      if (totalPercentage !== 100) {
        message.error('Tổng phần trăm của các phương thức xét tuyển phải bằng 100%!');
        return;
      }

      const updatedAdmissionMethods = admissionMethodValues.admissionMethods.map(
        (method: AdmissionMethod) => ({
          name: method.name,
          percentage: method.percentage || 0,
        })
      );

      const schoolData = {
        name: values.name,
        code: values.code || generateUniqueSchoolCode(values.name, schools, editingSchool?.id),
        totalQuota: 1000, // Default value, can be updated later when majors are added
        admissionMethods: updatedAdmissionMethods,
      };

      console.log('Sending school data:', schoolData);

      if (editingSchool) {
        await adminApi.updateSchool(editingSchool.id, schoolData);
        message.success('Cập nhật trường thành công!');
      } else {
        await adminApi.createSchool(schoolData);
        message.success('Thêm trường mới thành công!');
      }
      
      setIsModalVisible(false);
      fetchSchools(); // Refresh the list
    } catch (error: any) {
      console.error('Error saving school:', error);
      message.error(error.response?.data?.message || 'Không thể lưu thông tin trường. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Major management modal
  const handleViewMajors = (school: School) => {
    setMajorsForEditing(school.majors);
    setIsMajorModalVisible(true);
    setEditingSchool(school);
  };

  // Major viewing (read-only since major management happens in ManageMajorsPage)
  const handleQuotaChange = (majorId: string, value: number | null) => {
    // This is now read-only, majors should be managed in ManageMajorsPage
    if (value === null) return;
    setMajorsForEditing(current =>
      current.map(m => (m.id === majorId ? { ...m, quota: value } : m))
    );
  };

  const handleDeleteMajor = (majorId: string) => {
    // This is now read-only, majors should be managed in ManageMajorsPage
    setMajorsForEditing(current => current.filter(m => m.id !== majorId));
  };

  const handleSaveMajors = () => {
    // For now, just close the modal since major management should happen in ManageMajorsPage
    setIsMajorModalVisible(false);
    message.info('Để quản lý ngành, vui lòng sử dụng trang Quản lý Ngành.');
  };

  // Các cột bảng trường giữ nguyên
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
      title: 'Chỉ tiêu',
      key: 'totalQuota',
      render: (_: any, record: School) => (
        <Space size="middle">
          <span>{record.majors.reduce((sum, major) => sum + major.quota, 0)}</span>
          <Button icon={<EyeOutlined />} onClick={() => handleViewMajors(record)} size="small">
            Xem ngành
          </Button>
        </Space>
      ),
    },
    {
      title: 'Phương thức xét tuyển',
      key: 'admissionMethods',
      render: (_: any, record: School) => (
        <span>
          {record.admissionMethods
            .map(method => `${method.name} (${method.percentage}%)`)
            .join(' - ')}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: School) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditSchool(record)} type="primary">
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa trường này?"
            onConfirm={() => handleDeleteSchool(record.id)}
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

  // Cột cho bảng ngành trong modal (có input chỉnh quota và nút xóa)
  const majorColumns = [
    {
      title: 'Tên Ngành',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
      render: (_: any, record: Major) => (
        <InputNumber
          min={0}
          value={majorsForEditing.find(m => m.id === record.id)?.quota}
          onChange={value => handleQuotaChange(record.id, value)}
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: 'Xóa',
      key: 'delete',
      render: (_: any, record: Major) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa ngành này?"
          onConfirm={() => handleDeleteMajor(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
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
        loading={loading}
      />

      {/* Modal thêm/sửa trường */}
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
          initialValues={editingSchool ? { name: editingSchool.name, code: editingSchool.code } : {}}
        >
          <Form.Item
            name="name"
            label="Tên Trường"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
          >
            <Input placeholder="Nhập tên trường" onChange={handleSchoolNameChange} />
          </Form.Item>
          
          <Form.Item
            name="code"
            label="Mã Trường"
            rules={[{ required: true, message: 'Mã trường là bắt buộc!' }]}
          >
            <Input placeholder="Mã trường được sinh tự động từ tên trường" />
          </Form.Item>
        </Form>

        <h3>Phương thức xét tuyển</h3>
        <Form
          form={admissionMethodsForm}
          layout="vertical"
          name="admission_methods_form"
          initialValues={{
            admissionMethods: editingSchool
              ? editingSchool.admissionMethods
              : [
                  { name: 'Điểm THPT', percentage: null },
                  { name: 'Học bạ', percentage: null },
                  { name: 'ĐGNL/TD', percentage: null },
                ],
          }}
        >
          <Form.List name="admissionMethods">
            {(fields) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={[name, 'name']} fieldKey={fieldKey ? [fieldKey, 'name'] : undefined} noStyle>
                      <Input disabled style={{ width: 120 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'percentage']}
                      fieldKey={fieldKey ? [fieldKey, 'percentage'] : undefined}
                      rules={[
                        { required: true, message: 'Vui lòng nhập phần trăm!' },
                        { type: 'number', min: 0, max: 100, message: 'Phần trăm phải từ 0 đến 100!' },
                      ]}
                      style={{ width: 120 }}
                    >
                      <InputNumber
                        formatter={value => `${value}%`}
                        parser={value => (value ? value.replace('%', '') : '') as any}
                      />
                    </Form.Item>
                  </Space>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Modal xem và chỉnh sửa ngành */}
      <Modal
        title="Chi tiết Ngành"
        visible={isMajorModalVisible}
        onCancel={() => setIsMajorModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsMajorModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveMajors}>
            Lưu thay đổi
          </Button>,
        ]}
      >
        <Table
          columns={majorColumns}
          dataSource={majorsForEditing}
          rowKey="id"
          pagination={false}
          bordered
          summary={pageData => {
            const totalQuota = pageData.reduce((sum, major) => sum + major.quota, 0);
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Tổng chỉ tiêu:</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>{totalQuota}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
              </Table.Summary.Row>
            );
          }}
        />
      </Modal>
    </div>
  );
};

export default ManageSchoolsPage;