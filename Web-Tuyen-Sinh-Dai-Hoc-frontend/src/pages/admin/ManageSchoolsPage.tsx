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

interface AdmissionMethod {
  name: string;
  percentage: number;
}

interface Major {
  id: string;
  name: string;
  quota: number;
}

interface School {
  id: string;
  name: string;
  code: string;
  totalQuota: number;
  admissionMethods: AdmissionMethod[];
  majors: Major[];
}

const ManageSchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMajorModalVisible, setIsMajorModalVisible] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [viewingMajors, setViewingMajors] = useState<Major[]>([]);
  const [form] = Form.useForm();
  const [admissionMethodsForm] = Form.useForm();
  // State để chỉnh sửa ngành trong modal
  const [majorsForEditing, setMajorsForEditing] = useState<Major[]>([]);

  useEffect(() => {
    const dummySchools: School[] = [
      {
        id: '1',
        name: 'Đại học Bách Khoa Hà Nội',
        code: 'BKA',
        totalQuota: 5000,
        admissionMethods: [
          { name: 'Điểm THPT', percentage: 50 },
          { name: 'Học bạ', percentage: 20 },
          { name: 'ĐGNL/TD', percentage: 30 },
        ],
        majors: [
          { id: '101', name: 'Công nghệ thông tin', quota: 1500 },
          { id: '102', name: 'Điện tử viễn thông', quota: 1000 },
          { id: '103', name: 'Cơ khí', quota: 800 },
        ],
      },
      {
        id: '2',
        name: 'Đại học Quốc gia Hà Nội',
        code: 'QGHN',
        totalQuota: 8000,
        admissionMethods: [
          { name: 'Điểm THPT', percentage: 60 },
          { name: 'Học bạ', percentage: 20 },
          { name: 'ĐGNL/TD', percentage: 20 },
        ],
        majors: [
          { id: '201', name: 'Khoa học máy tính', quota: 2000 },
          { id: '202', name: 'Ngôn ngữ Anh', quota: 1200 },
        ],
      },
      {
        id: '3',
        name: 'Đại học Ngoại Thương',
        code: 'NT',
        totalQuota: 3000,
        admissionMethods: [
          { name: 'Điểm THPT', percentage: 70 },
          { name: 'Học bạ', percentage: 15 },
          { name: 'ĐGNL/TD', percentage: 15 },
        ],
        majors: [
          { id: '301', name: 'Kinh tế quốc tế', quota: 1000 },
          { id: '302', name: 'Quản trị kinh doanh', quota: 800 },
        ],
      },
    ];
    setSchools(dummySchools);
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

  // Modal thêm/sửa trường giữ nguyên như trước...
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

  const handleDeleteSchool = (id: string) => {
    setSchools(schools.filter(school => school.id !== id));
    message.success('Xóa trường thành công!');
  };

  const handleOk = async () => {
    try {
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
          ...method,
          percentage: method.percentage || 0,
        })
      );

      if (editingSchool) {
        const updatedSchools = schools.map(school =>
          school.id === editingSchool.id
            ? {
                ...school,
                name: values.name,
                code: generateSchoolCode(values.name),
                admissionMethods: updatedAdmissionMethods,
              }
            : school
        );
        setSchools(updatedSchools);
        message.success('Cập nhật trường thành công!');
      } else {
        const newSchool: School = {
          ...values,
          id: String(schools.length + 1),
          code: generateSchoolCode(values.name),
          totalQuota: 0,
          admissionMethods: updatedAdmissionMethods,
          majors: [],
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

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // *** Bổ sung: modal xem và chỉnh sửa ngành của trường ***
  const handleViewMajors = (school: School) => {
    setViewingMajors(school.majors);
    setMajorsForEditing(school.majors);
    setIsMajorModalVisible(true);
    setEditingSchool(school); // Lưu trường đang xem ngành để cập nhật về sau
  };

  // Sửa quota ngành trong modal
  const handleQuotaChange = (majorId: string, value: number | null) => {
    if (value === null) return;
    setMajorsForEditing(current =>
      current.map(m => (m.id === majorId ? { ...m, quota: value } : m))
    );
  };

  // Xóa ngành trong modal
  const handleDeleteMajor = (majorId: string) => {
    setMajorsForEditing(current => current.filter(m => m.id !== majorId));
  };

  // Lưu thay đổi ngành về trường
  const handleSaveMajors = () => {
    if (!editingSchool) return;

    // Cập nhật danh sách majors trong trường đang edit
    const updatedSchools = schools.map(school =>
      school.id === editingSchool.id ? { ...school, majors: majorsForEditing } : school
    );
    setSchools(updatedSchools);
    message.success('Cập nhật ngành thành công!');
    setIsMajorModalVisible(false);
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
      render: (text: string, record: School) => (
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
      render: (text: string, record: School) => (
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
      render: (text: string, record: School) => (
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
      <Table columns={columns} dataSource={schools} rowKey="id" pagination={{ pageSize: 10 }} bordered />

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
                    <Form.Item {...restField} name={[name, 'name']} fieldKey={[fieldKey, 'name']} noStyle>
                      <Input disabled style={{ width: 120 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'percentage']}
                      fieldKey={[fieldKey, 'percentage']}
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
