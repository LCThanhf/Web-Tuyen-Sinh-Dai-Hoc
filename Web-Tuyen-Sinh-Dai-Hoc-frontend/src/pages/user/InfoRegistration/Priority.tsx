import React, { useEffect, useState } from "react";
import { Form, Select, Button, Upload, message, Row, Col, Table, Space, Tag, Modal, Spin } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { studentApi, type Priority } from "../../../services/studentApi";

const { Option } = Select;
const { confirm } = Modal;

// Interface for form data
interface PriorityFormData {
  khuVucUuTien: string;
  fileKV?: any[];
  doiTuongUuTien: string;
  fileDT?: any[];
}

// Interface for display data
interface PriorityDisplayInfo {
  id?: string;
  khuVucUuTien: string;
  fileKV?: string;
  doiTuongUuTien: string;
  fileDT?: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
  reason?: string;
}

// Dữ liệu options
const khuVucUuTienOptions = [
  { label: "KV1 (+0.75)", value: "KV1", type: "AREA" as const },
  { label: "KV2-NT (+0.50)", value: "KV2-NT", type: "AREA" as const },
  { label: "KV2 (+0.25)", value: "KV2", type: "AREA" as const },
  { label: "KV3 (0.00)", value: "KV3", type: "AREA" as const },
];

const doiTuongUuTienOptions = [
  { label: "Con thương binh, liệt sĩ (DT01) (+2.00)", value: "DT01", type: "OBJECT" as const },
  { label: "Dân tộc thiểu số (+1.00)", value: "DTS", type: "OBJECT" as const },
  { label: "Hộ nghèo, chính sách (+1.00)", value: "HNS", type: "OBJECT" as const },
  { label: "Người khuyết tật (+1.00)", value: "NKT", type: "OBJECT" as const },
  { label: "Không có", value: "None", type: "OBJECT" as const },
];

const InfoPriority: React.FC = () => {
  const [form] = Form.useForm();
  const [priorityRecord, setPriorityRecord] = useState<PriorityDisplayInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDoiTuongUuTienFile, setShowDoiTuongUuTienFile] = useState<boolean>(true);

  // Function to map backend data to display format
  const mapBackendToDisplay = (backendData: Priority): PriorityDisplayInfo => {
    return {
      id: backendData.id,
      khuVucUuTien: backendData.priorityArea || "",
      fileKV: backendData.areaFile,
      doiTuongUuTien: backendData.priorityObject || "",
      fileDT: backendData.objectFile,
      status: backendData.status === "PENDING" ? "Chờ duyệt" : 
              backendData.status === "APPROVED" ? "Đã duyệt" : "Từ chối",
      reason: backendData.adminNote
    };
  };

  // Function to map form data to backend format
  const mapFormToBackend = (formData: PriorityFormData): Partial<Priority> => {
    return {
      priorityArea: formData.khuVucUuTien,
      priorityObject: formData.doiTuongUuTien,
      // Note: File uploads will be handled separately in a full implementation
      areaFile: formData.fileKV?.[0]?.name || undefined,
      objectFile: formData.fileDT?.[0]?.name || undefined,
    };
  };

  // Load priority data from backend
  const loadPriorityData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getPriority();
      if (response) {
        setPriorityRecord(mapBackendToDisplay(response));
      } else {
        setPriorityRecord(null);
      }
    } catch (error) {
      console.error("Error loading priority data:", error);
      message.error("Không thể tải thông tin ưu tiên");
      setPriorityRecord(null);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadPriorityData();
  }, []);

  // Handle changes in 'doiTuongUuTien' select to toggle file upload visibility
  const handleDoiTuongUuTienChange = (value: string) => {
    if (value === "None") {
      setShowDoiTuongUuTienFile(false);
      form.setFieldsValue({ fileDT: undefined });
      form.validateFields(["fileDT"]);
    } else {
      setShowDoiTuongUuTienFile(true);
    }
  };

  // Handle form submission
  const onFinish = async (values: PriorityFormData) => {
    if (priorityRecord && !isEditing) {
      message.warning("Bạn chỉ được phép khai báo một thông tin ưu tiên. Vui lòng sửa bản ghi hiện có.");
      return;
    }

    try {
      setSubmitting(true);
      const backendData = mapFormToBackend(values);
      
      if (isEditing && priorityRecord?.id) {
        // Update existing record
        await studentApi.updatePriority({ ...backendData, id: priorityRecord.id });
        message.success("Cập nhật thông tin ưu tiên thành công!");
      } else {
        // Create new record
        await studentApi.updatePriority(backendData);
        message.success("Lưu thông tin ưu tiên thành công!");
      }
      
      // Reload data from backend
      await loadPriorityData();
      form.resetFields();
      setIsEditing(false);
      setShowDoiTuongUuTienFile(true);
    } catch (error) {
      console.error("Error saving priority data:", error);
      message.error("Không thể lưu thông tin ưu tiên");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = () => {
    if (!priorityRecord) return;
    
    setIsEditing(true);
    
    // Create mock file objects for display
    const fileKVList = priorityRecord.fileKV ? [{ 
      uid: priorityRecord.fileKV, 
      name: `file_kv.pdf`, 
      status: 'done' as const,
      url: priorityRecord.fileKV
    }] : [];
    
    const fileDTList = priorityRecord.fileDT ? [{ 
      uid: priorityRecord.fileDT, 
      name: `file_dt.pdf`, 
      status: 'done' as const,
      url: priorityRecord.fileDT
    }] : [];

    form.setFieldsValue({
      khuVucUuTien: priorityRecord.khuVucUuTien,
      doiTuongUuTien: priorityRecord.doiTuongUuTien,
      fileKV: fileKVList,
      fileDT: fileDTList,
    });
    
    setShowDoiTuongUuTienFile(priorityRecord.doiTuongUuTien !== "None");
  };

  // Handle delete button click
  const handleDelete = () => {
    if (!priorityRecord?.id) return;
    
    confirm({
      title: 'Bạn có chắc chắn muốn xóa thông tin ưu tiên này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Thao tác này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // In a full implementation, you would call a delete API
          // For now, we'll just clear the form and show success
          message.success("Xóa thông tin ưu tiên thành công!");
          setPriorityRecord(null);
          form.resetFields();
          setIsEditing(false);
          setShowDoiTuongUuTienFile(true);
        } catch (error) {
          console.error("Error deleting priority data:", error);
          message.error("Không thể xóa thông tin ưu tiên");
        }
      },
    });
  };

  // Handle view file
  const handleViewFile = (fileUrl: string | undefined) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      message.warning("Không có file minh chứng để xem.");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    form.resetFields();
    setIsEditing(false);
    setShowDoiTuongUuTienFile(true);
  };

  // Table columns
  const columns = [
    {
      title: "Khu vực ưu tiên",
      dataIndex: "khuVucUuTien",
      key: "khuVucUuTien",
      render: (text: string) => khuVucUuTienOptions.find(opt => opt.value === text)?.label || text,
    },
    {
      title: "Đối tượng ưu tiên",
      dataIndex: "doiTuongUuTien",
      key: "doiTuongUuTien",
      render: (text: string) => doiTuongUuTienOptions.find(opt => opt.value === text)?.label || text,
    },
    {
      title: "Minh chứng KV",
      dataIndex: "fileKV",
      key: "fileKV",
      render: (fileUrl: string) => (
        fileUrl ? (
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewFile(fileUrl)}>
            Xem file
          </Button>
        ) : (
          "Không có file"
        )
      ),
    },
    {
      title: "Minh chứng ĐT",
      dataIndex: "fileDT",
      key: "fileDT",
      render: (fileUrl: string) => (
        fileUrl ? (
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewFile(fileUrl)}>
            Xem file
          </Button>
        ) : (
          "Không có file"
        )
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: "Chờ duyệt" | "Đã duyệt" | "Từ chối", record: PriorityDisplayInfo) => {
        let color;
        switch (status) {
          case "Đã duyệt":
            color = "success";
            break;
          case "Từ chối":
            color = "error";
            break;
          default:
            color = "processing";
        }
        return (
          <Space direction="vertical">
            <Tag color={color}>{status}</Tag>
            {status === "Từ chối" && record.reason && (
              <Tag color="volcano">Lý do: {record.reason}</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: PriorityDisplayInfo) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={handleEdit}
            disabled={record.status !== "Chờ duyệt"}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={handleDelete}
            disabled={record.status !== "Chờ duyệt"}
          >
            Xóa
          </Button>
        </Space>
      ),
    },  ];

  // Form disabled state
  const isFormDisabled = !!priorityRecord && !isEditing;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải thông tin...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
      <div style={{
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: 30
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 30, color: '#1890ff' }}>
          {isEditing ? "Cập nhật Thông tin Ưu tiên" : "Khai báo Thông tin Ưu tiên"}
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Khu vực ưu tiên"
                name="khuVucUuTien"
                rules={[{ required: true, message: "Vui lòng chọn khu vực ưu tiên" }]}
              >
                <Select
                  placeholder="Chọn khu vực ưu tiên"
                  disabled={isFormDisabled}
                >
                  {khuVucUuTienOptions.map(({ label, value }) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="File minh chứng khu vực ưu tiên"
                name="fileKV"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => {
                  if (Array.isArray(e)) return e;
                  return e && e.fileList;
                }}
                rules={[{ required: true, message: "Vui lòng upload file minh chứng khu vực ưu tiên" }]}
              >
                <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png" disabled={isFormDisabled}>
                  <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Đối tượng ưu tiên"
                name="doiTuongUuTien"
                rules={[{ required: true, message: "Vui lòng chọn đối tượng ưu tiên" }]}
              >
                <Select
                  placeholder="Chọn đối tượng ưu tiên"
                  onChange={handleDoiTuongUuTienChange}
                  disabled={isFormDisabled}
                >
                  {doiTuongUuTienOptions.map(({ label, value }) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {showDoiTuongUuTienFile && (
                <Form.Item
                  label="File minh chứng đối tượng ưu tiên"
                  name="fileDT"
                  valuePropName="fileList"
                  getValueFromEvent={(e: any) => {
                    if (Array.isArray(e)) return e;
                    return e && e.fileList;
                  }}
                  rules={[{ required: true, message: "Vui lòng upload file minh chứng đối tượng ưu tiên" }]}
                >
                  <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png" disabled={isFormDisabled}>
                    <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
                  </Upload>
                </Form.Item>
              )}
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "left", marginTop: 1 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              style={{ width: '186px' }}
              disabled={isFormDisabled}
              loading={submitting}
            >
              {isEditing ? "Cập nhật" : "Lưu thông tin ưu tiên"}
            </Button>
            {isEditing && (
              <Button
                onClick={handleCancelEdit}
                style={{ marginLeft: 10 }}
                disabled={submitting}
              >
                Hủy chỉnh sửa
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>

      <div style={{
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginTop: 30
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 30, color: '#1890ff' }}>Thông tin Ưu tiên của bạn</h2>
        <Table
          columns={columns}
          dataSource={priorityRecord ? [{ ...priorityRecord, key: priorityRecord.id || '1' }] : []}
          pagination={false}
          bordered
        />
        {!priorityRecord && (
          <p style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            Chưa có thông tin ưu tiên nào được khai báo.
          </p>
        )}
      </div>
    </div>
  );
};

export default InfoPriority;
