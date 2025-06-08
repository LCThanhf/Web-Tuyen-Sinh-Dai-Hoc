import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  Select,
  Form,
  Row,
  Col,
  Space,
  message,
  Typography,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { StatusService } from "../../services/statusService";
import type { StatusApplication, StatusFormData, School, Major, AdmissionCombination } from "../../services/statusService";

const { Option } = Select;
const { Title } = Typography;

// Form component
interface FormProps {
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: StatusFormData) => void;
  schools: School[];
  majors: Major[];
  combinations: AdmissionCombination[];
  loading?: boolean;
}

const RegisterForm: React.FC<FormProps> = ({ 
  initialValues, 
  onCancel, 
  onSubmit, 
  schools, 
  majors: _majors, 
  combinations,
  loading = false 
}) => {
  const [form] = Form.useForm();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [availableMajors, setAvailableMajors] = useState<Major[]>([]);
  const [loadingMajors, setLoadingMajors] = useState(false);

  // Method options
  const methods = ["Điểm THPT", "Học bạ", "Đánh giá năng lực/Đánh giá tư duy"];
  const assessmentUnits = [
    "Đại học Quốc gia Hà Nội",
    "Đại học Quốc gia TP.HCM",
    "Đại học Bách khoa Hà Nội",
  ];

  // Load majors when school changes
  const loadMajorsBySchool = async (schoolId: string) => {
    if (!schoolId) return;
    
    setLoadingMajors(true);
    try {
      const schoolMajors = await StatusService.getMajorsBySchool(schoolId);
      setAvailableMajors(schoolMajors);
    } catch (error: any) {
      message.error(error.message || 'Không thể tải danh sách ngành');
      setAvailableMajors([]);
    } finally {
      setLoadingMajors(false);
    }
  };

  // Khi initialValues thay đổi, reset hoặc set giá trị
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setSelectedMethod(initialValues.method);
      if (initialValues.schoolCode) {
        setSelectedSchool(initialValues.schoolCode);
        loadMajorsBySchool(initialValues.schoolCode);
      }
    } else {
      form.resetFields();
      setSelectedMethod(null);
      setSelectedSchool(null);
      setAvailableMajors([]);
    }
  }, [initialValues, form]);

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    setSelectedSchool(null);
    setAvailableMajors([]);
    form.setFieldsValue({ schoolCode: undefined, majorCode: undefined, unit: undefined, combo: undefined });
  };

  const handleSchoolChange = async (value: string) => {
    setSelectedSchool(value);
    form.setFieldsValue({ majorCode: undefined });
    await loadMajorsBySchool(value);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Phương thức xét tuyển" name="method" rules={[{ required: true }]}>
            <Select placeholder="Chọn phương thức" onChange={handleMethodChange} allowClear>
              {methods.map(m => <Option key={m} value={m}>{m}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ngành" name="majorCode" rules={[{ required: true }]}>
            <Select 
              placeholder="Chọn ngành" 
              disabled={!selectedSchool || loadingMajors} 
              loading={loadingMajors}
              allowClear
            >
              {availableMajors.map(m => <Option key={m.id} value={m.id}>{m.name}</Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Trường" name="schoolCode" rules={[{ required: true }]}>
            <Select placeholder="Chọn trường" onChange={handleSchoolChange} disabled={!selectedMethod} allowClear>
              {schools.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          {(selectedMethod === "Điểm THPT" || selectedMethod === "Học bạ") && (
            <Form.Item label="Tổ hợp môn" name="combo" rules={[{ required: true }]}>
              <Select placeholder="Chọn tổ hợp môn">
                {combinations.map(c => <Option key={c.id} value={c.name}>{c.name}</Option>)}
              </Select>
            </Form.Item>
          )}
          {selectedMethod === "Đánh giá năng lực/Đánh giá tư duy" && (
            <Form.Item label="Đơn vị tổ chức" name="unit" rules={[{ required: true }]}>
              <Select placeholder="Chọn đơn vị tổ chức">
                {assessmentUnits.map(u => <Option key={u} value={u}>{u}</Option>)}
              </Select>
            </Form.Item>
          )}
        </Col>
      </Row>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }} disabled={loading}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading}>Lưu</Button>
      </Form.Item>
    </Form>
  );
};

// Component chính Status
const Status: React.FC = () => {
  const [data, setData] = useState<StatusApplication[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [combinations, setCombinations] = useState<AdmissionCombination[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isReordering, setIsReordering] = useState(false);
  const [tempPriorityMap, setTempPriorityMap] = useState<Record<string, number>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add'|'edit'>('add');
  const [editingRecord, setEditingRecord] = useState<StatusApplication|null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [applicationsData, schoolsData, combinationsData] = await Promise.all([
        StatusService.getApplications(),
        StatusService.getSchools(),
        StatusService.getAdmissionCombinations()
      ]);

      setData(applicationsData);
      setSchools(schoolsData);
      setCombinations(combinationsData);
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const refreshApplications = async () => {
    try {
      const applicationsData = await StatusService.getApplications();
      setData(applicationsData);
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi tải danh sách nguyện vọng');
    }
  };

  // Reorder handlers
  const handleTempPriorityChange = (applicationId: string, priority: number) => {
    setTempPriorityMap(prev => ({ ...prev, [applicationId]: priority }));
  };

  const handleSaveReorder = async () => {
    setSubmitting(true);
    try {
      for (const [applicationId, priority] of Object.entries(tempPriorityMap)) {
        await StatusService.updateApplicationPriority(applicationId, priority);
      }
      await refreshApplications();
      setTempPriorityMap({});
      setIsReordering(false);
      message.success('Đã lưu thứ tự nguyện vọng mới!');
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật thứ tự');
    } finally {
      setSubmitting(false);
    }
  };

  // Mở modal add/edit và reset form
  const openAdd = () => { 
    setModalMode('add'); 
    setEditingRecord(null); 
    setModalVisible(true); 
  };
  
  const openEdit = (rec: StatusApplication) => { 
    setModalMode('edit'); 
    setEditingRecord(rec); 
    setModalVisible(true); 
  };

  // Xử lý submit form
  const handleFormSubmit = async (formData: StatusFormData) => {
    setSubmitting(true);
    try {
      if (modalMode === 'add') {
        await StatusService.submitApplication(formData);
        message.success('Thêm nguyện vọng thành công!');
      } else if (modalMode === 'edit' && editingRecord) {
        // For edit, we would need an update method in StatusService
        // For now, we'll delete and recreate
        await StatusService.deleteApplication(editingRecord.id);
        await StatusService.submitApplication(formData);
        message.success('Cập nhật nguyện vọng thành công!');
      }
      await refreshApplications();
      setModalVisible(false);
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi lưu nguyện vọng');
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa
  const handleDelete = async (applicationId: string) => {
    try {
      await StatusService.deleteApplication(applicationId);
      await refreshApplications();
      message.success('Đã xóa nguyện vọng!');
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi xóa nguyện vọng');
    }
  };

  // Xuất CSV
  const handleExport = () => {
    const headers = ['STT', 'Trường', 'Ngành', 'Phương thức', 'Tổ hợp môn', 'Đơn vị tổ chức', 'Trạng thái'];
    const rows = data.map(d => [
      d.stt,
      d.school,
      d.major,
      d.method,
      d.combo || '-',
      d.unit || '-',
      d.status
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nguyenvong.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    message.success('Đã xuất CSV!');
  };

  const columns = [
    { 
      title: 'Thứ tự NV', 
      dataIndex: 'stt', 
      key: 'stt', 
      width: 100,
      render: (priority: number, rec: StatusApplication) => (isReordering
        ? <InputNumber 
            min={1} 
            max={data.length} 
            defaultValue={priority} 
            onChange={v => handleTempPriorityChange(rec.id, v!)} 
            style={{ width: 60 }} 
          />
        : priority
      )
    },
    { title: 'Trường', dataIndex: 'school', key: 'school', width: 180 },
    { title: 'Ngành', dataIndex: 'major', key: 'major', width: 180 },
    { title: 'Phương thức', dataIndex: 'method', key: 'method', width: 200 },
    { title: 'Tổ hợp môn', dataIndex: 'combo', key: 'combo', width: 150, render: (t: any) => t || '-' },
    { title: 'Đơn vị tổ chức', dataIndex: 'unit', key: 'unit', width: 200, render: (t: any) => t || '-' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 120, 
      render: (status: string) => {
        const statusMap = {
          'PENDING': { color: 'orange', text: 'Chờ duyệt' },
          'APPROVED': { color: 'green', text: 'Đã duyệt' },
          'REJECTED': { color: 'red', text: 'Bị từ chối' }
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || { color: 'gray', text: status };
        return <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>;
      }
    },
    {
      title: 'Thao tác', 
      key: 'action', 
      width: 150,
      render: (_: any, rec: StatusApplication) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => openEdit(rec)} 
            disabled={isReordering}
          >
            Sửa
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(rec.id)} 
            disabled={isReordering}
          >
            Xóa
          </Button>
        </Space>
      )
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 30 }}>
        Danh sách Nguyện vọng
      </Title>
      
      <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical" size="middle">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={openAdd}
              disabled={isReordering}
            >
              Thêm nguyện vọng
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExport}
              disabled={isReordering}
            >
              In danh sách
            </Button>
            {!isReordering ? (
              <Button 
                icon={<EditOutlined />} 
                onClick={() => setIsReordering(true)}
              >
                Chỉnh thứ tự
              </Button>
            ) : (
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={handleSaveReorder}
                loading={submitting}
              >
                Lưu thứ tự
              </Button>
            )}
          </Space>
          <Input.Search 
            placeholder="Tìm (Trường, Ngành...)" 
            onChange={e => setSearchText(e.target.value)} 
            allowClear 
            style={{ width: 300 }} 
          />
        </div>
      </Space>
      
      <Table
        columns={columns}
        dataSource={data.filter(i =>
          i.school.toLowerCase().includes(searchText.toLowerCase()) ||
          i.major.toLowerCase().includes(searchText.toLowerCase()) ||
          i.method.toLowerCase().includes(searchText.toLowerCase())
        )}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        open={modalVisible}
        title={modalMode === 'add' ? 'Thêm nguyện vọng' : 'Chỉnh sửa nguyện vọng'}
        footer={null}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <RegisterForm
          key={modalMode + (editingRecord?.id || '')}
          initialValues={modalMode === 'edit' && editingRecord ? {
            method: editingRecord.method,
            unit: editingRecord.unit,
            schoolCode: editingRecord.schoolCode,
            majorCode: editingRecord.majorCode,
            combo: editingRecord.combo,
          } : undefined}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleFormSubmit}
          schools={schools}
          majors={[]} // Will be loaded dynamically by form
          combinations={combinations}
          loading={submitting}
        />
      </Modal>
    </div>
  );
};

export default Status;