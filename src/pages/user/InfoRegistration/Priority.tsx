import React, { useEffect, useState } from "react";
import { Form, Select, Button, Upload, message, Row, Col, Table, Space, Tag, Modal } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from "@ant-design/icons";

const { Option } = Select;
const { confirm } = Modal;

// Định nghĩa kiểu dữ liệu cho thông tin ưu tiên
interface PriorityInfo {
  id: string; // Thêm ID để dễ dàng quản lý
  khuVucUuTien: string;
  fileKV?: string; // Lưu URL của Blob hoặc URL từ server
  doiTuongUuTien: string;
  fileDT?: string; // Lưu URL của Blob hoặc URL từ server
  status: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
  reason?: string; // Lý do từ chối
}

// Dữ liệu options
const khuVucUuTienOptions = [
  { label: "KV1 (+0.75)", value: "KV1", score: 0.75 },
  { label: "KV2-NT (+0.50)", value: "KV2-NT", score: 0.5 },
  { label: "KV2 (+0.25)", value: "KV2", score: 0.25 },
  { label: "KV3 (0.00)", value: "KV3", score: 0 },
];

const doiTuongUuTienOptions = [
  { label: "Con thương binh, liệt sĩ (DT01) (+2.00)", value: "DT01", score: 2.0 },
  { label: "Dân tộc thiểu số (+1.00)", value: "DTS", score: 1.0 },
  { label: "Hộ nghèo, chính sách (+1.00)", value: "HNS", score: 1.0 },
  { label: "Người khuyết tật (+1.00)", value: "NKT", score: 1.0 },
  { label: "Không có", value: "None", score: 0 },
];

const LOCAL_STORAGE_KEY = "infoPriorityData";

const InfoPriority: React.FC = () => {
  const [form] = Form.useForm<PriorityInfo>();
  const [priorityRecords, setPriorityRecords] = useState<PriorityInfo[]>([]);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [showDoiTuongUuTienFile, setShowDoiTuongUuTienFile] = useState<boolean>(true);

  // Khi component mount, load dữ liệu từ localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: PriorityInfo[] = JSON.parse(savedData);
        setPriorityRecords(parsed);
      } catch (e) {
        console.error("Error parsing localStorage data:", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);

  // Lưu dữ liệu vào localStorage mỗi khi priorityRecords thay đổi
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(priorityRecords));
  }, [priorityRecords]);

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

  // Xử lý khi submit form
  const onFinish = (values: any) => {
    if (priorityRecords.length > 0 && !editingRecordId) {
      message.warn("Bạn chỉ được phép khai báo một thông tin ưu tiên. Vui lòng sửa hoặc xóa bản ghi hiện có.");
      return;
    }

    const fileKVBlobUrl = values.fileKV && values.fileKV[0] && values.fileKV[0].originFileObj
      ? URL.createObjectURL(values.fileKV[0].originFileObj)
      : null;

    const fileDTBlobUrl = showDoiTuongUuTienFile && values.fileDT && values.fileDT[0] && values.fileDT[0].originFileObj
      ? URL.createObjectURL(values.fileDT[0].originFileObj)
      : null;

    const newRecord: PriorityInfo = {
      ...values,
      fileKV: fileKVBlobUrl,
      fileDT: fileDTBlobUrl,
      status: "Chờ duyệt",
    };

    if (editingRecordId) {
      setPriorityRecords(prevRecords =>
        prevRecords.map(record => {
          if (record.id === editingRecordId) {
            if (record.fileKV && record.fileKV.startsWith('blob:') && record.fileKV !== newRecord.fileKV) {
              URL.revokeObjectURL(record.fileKV);
            }
            if (record.fileDT && record.fileDT.startsWith('blob:') && record.fileDT !== newRecord.fileDT) {
              URL.revokeObjectURL(record.fileDT);
            }
            return { ...newRecord, id: editingRecordId };
          }
          return record;
        })
      );
      message.success("Cập nhật thông tin ưu tiên thành công!");
      setEditingRecordId(null);
    } else {
      newRecord.id = Date.now().toString();
      setPriorityRecords(prevRecords => [...prevRecords, newRecord]);
      message.success("Lưu thông tin ưu tiên thành công!");
    }
    form.resetFields();
    setShowDoiTuongUuTienFile(true);
  };

  // Xử lý chỉnh sửa một bản ghi
  const handleEdit = (record: PriorityInfo) => {
    setEditingRecordId(record.id);
    const fileKVName = record.fileKV ? `file_kv_${record.id}.pdf` : null;
    const fileDTName = record.fileDT ? `file_dt_${record.id}.pdf` : null;

    const fileKVList = record.fileKV ? [{ uid: record.fileKV, name: fileKVName, status: 'done' }] : [];
    const fileDTList = record.fileDT ? [{ uid: record.fileDT, name: fileDTName, status: 'done' }] : [];

    form.setFieldsValue({
      ...record,
      fileKV: fileKVList,
      fileDT: fileDTList,
    });
    setShowDoiTuongUuTienFile(record.doiTuongUuTien !== "None");
  };

  // Xử lý xóa một bản ghi
  const handleDelete = (id: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa thông tin ưu tiên này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Thao tác này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setPriorityRecords(prevRecords => {
          const recordToDelete = prevRecords.find(record => record.id === id);
          if (recordToDelete) {
            if (recordToDelete.fileKV && recordToDelete.fileKV.startsWith('blob:')) {
              URL.revokeObjectURL(recordToDelete.fileKV);
            }
            if (recordToDelete.fileDT && recordToDelete.fileDT.startsWith('blob:')) {
              URL.revokeObjectURL(recordToDelete.fileDT);
            }
          }
          return prevRecords.filter(record => record.id !== id);
        });
        message.success("Xóa thông tin ưu tiên thành công!");
        if (editingRecordId === id) {
          form.resetFields();
          setEditingRecordId(null);
          setShowDoiTuongUuTienFile(true);
        }
      },
    });
  };

  // Hàm xử lý khi nhấn "Xem file"
  const handleViewFile = (fileUrl: string | undefined) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      message.warn("Không có file minh chứng để xem.");
    }
  };

  // Định nghĩa cột cho Table
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
      render: (status: "Chờ duyệt" | "Đã duyệt" | "Từ chối", record: PriorityInfo) => {
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
      render: (_: any, record: PriorityInfo) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.status !== "Chờ duyệt"} // Chỉ sửa khi đang "Chờ duyệt"
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
            disabled={record.status !== "Chờ duyệt"} // Chỉ xóa khi đang "Chờ duyệt"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Logic để vô hiệu hóa form nếu đã có bản ghi và không trong chế độ chỉnh sửa
  const isFormDisabled = priorityRecords.length > 0 && editingRecordId === null;

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
          {editingRecordId ? "Cập nhật Thông tin Ưu tiên" : "Khai báo Thông tin Ưu tiên"}
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
                  disabled={isFormDisabled} // Vô hiệu hóa khi form bị khóa
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
                  disabled={isFormDisabled} // Vô hiệu hóa khi form bị khóa
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

          <Form.Item style={{ textAlign: "left", marginTop: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              style={{ width: '17%' }}
              disabled={isFormDisabled && !editingRecordId} // Vô hiệu hóa nút nếu đã có bản ghi và không chỉnh sửa
            >
              {editingRecordId ? "Cập nhật" : "Lưu thông tin ưu tiên"}
            </Button>
            {editingRecordId && (
              <Button
                onClick={() => {
                  form.resetFields();
                  setEditingRecordId(null);
                  setShowDoiTuongUuTienFile(true);
                }}
                style={{ marginLeft: 10 }}
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
          dataSource={priorityRecords.map(record => ({ ...record, key: record.id }))}
          pagination={false}
          bordered
        />
        {priorityRecords.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            Chưa có thông tin ưu tiên nào được khai báo.
          </p>
        )}
      </div>
    </div>
  );
};

export default InfoPriority;