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

  const generateSchoolCode = (schoolName: string): string => {
    if (!schoolName) return '';
    return schoolName
      .trim()
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
  };

  // Modal handlers
  const handleAddSchool = () => {
    setEditingSchool(null);
    form.resetFields();
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
    form.setFieldsValue({ name: record.name });
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
        code: generateSchoolCode(values.name),
        totalQuota: 0, // Default value, can be updated later
        admissionMethods: updatedAdmissionMethods,
      };

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
          initialValues={editingSchool ? { name: editingSchool.name } : {}}
        >
          <Form.Item
            name="name"
            label="Tên Trường"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
          >
            <Input />
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
