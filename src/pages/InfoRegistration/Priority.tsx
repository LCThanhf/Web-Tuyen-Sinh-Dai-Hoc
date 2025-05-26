import React, { useEffect, useState } from "react";
import { Form, Select, Button, Upload, message, Row, Col, Table, Space, Tag, Modal } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const { confirm } = Modal;

// Định nghĩa kiểu dữ liệu cho thông tin ưu tiên
interface PriorityInfo {
  id: string; // Thêm ID để dễ dàng quản lý
  khuVucUuTien: string;
  fileKV?: any; // Lưu ý: thực tế sẽ lưu URL hoặc ID của file
  doiTuongUuTien: string;
  fileDT?: any; // Lưu ý: thực tế sẽ lưu URL hoặc ID của file
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
  // State để quản lý danh sách các thông tin ưu tiên đã lưu
  const [priorityRecords, setPriorityRecords] = useState<PriorityInfo[]>([]);
  // State để xác định xem có đang chỉnh sửa một bản ghi không
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // Khi component mount, load dữ liệu từ localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsed: PriorityInfo[] = JSON.parse(savedData);
      setPriorityRecords(parsed);
    }
  }, []);

  // Lưu dữ liệu vào localStorage mỗi khi priorityRecords thay đổi
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(priorityRecords));
  }, [priorityRecords]);

  // Xử lý khi submit form
  const onFinish = (values: any) => {
    const newRecord: PriorityInfo = {
      ...values,
      // Trong thực tế, bạn sẽ xử lý file upload ở đây (gửi lên server)
      // Hiện tại, chúng ta chỉ lưu tên file để mô phỏng
      fileKV: values.fileKV && values.fileKV[0] ? values.fileKV[0].name : null,
      fileDT: values.fileDT && values.fileDT[0] ? values.fileDT[0].name : null,
      status: "Chờ duyệt", // Mặc định là "Chờ duyệt" khi tạo mới hoặc cập nhật
    };

    if (editingRecordId) {
      // Chỉnh sửa bản ghi hiện có
      setPriorityRecords(prevRecords =>
        prevRecords.map(record =>
          record.id === editingRecordId ? { ...newRecord, id: editingRecordId } : record
        )
      );
      message.success("Cập nhật thông tin ưu tiên thành công!");
      setEditingRecordId(null); // Kết thúc chế độ chỉnh sửa
    } else {
      // Thêm bản ghi mới
      newRecord.id = Date.now().toString(); // Tạo ID đơn giản
      setPriorityRecords(prevRecords => [...prevRecords, newRecord]);
      message.success("Lưu thông tin ưu tiên thành công!");
    }
    form.resetFields(); // Reset form sau khi lưu/cập nhật
  };

  // Xử lý chỉnh sửa một bản ghi
  const handleEdit = (record: PriorityInfo) => {
    setEditingRecordId(record.id);
    // Lưu ý: Ant Design Upload yêu cầu `fileList` có `uid` và `name`
    const fileKVList = record.fileKV ? [{ uid: record.fileKV, name: record.fileKV, status: 'done' }] : [];
    const fileDTList = record.fileDT ? [{ uid: record.fileDT, name: record.fileDT, status: 'done' }] : [];

    form.setFieldsValue({
      ...record,
      fileKV: fileKVList,
      fileDT: fileDTList,
    });
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
        setPriorityRecords(prevRecords => prevRecords.filter(record => record.id !== id));
        message.success("Xóa thông tin ưu tiên thành công!");
        // Nếu đang chỉnh sửa bản ghi bị xóa, reset form
        if (editingRecordId === id) {
          form.resetFields();
          setEditingRecordId(null);
        }
      },
    });
  };

  // Mô phỏng admin cập nhật trạng thái (Chỉ để xem giao diện)
  const simulateAdminAction = (recordId: string, status: "Đã duyệt" | "Từ chối", reason?: string) => {
    setPriorityRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === recordId ? { ...record, status, reason: status === "Từ chối" ? reason : undefined } : record
      )
    );
    message.info(`Trạng thái của bản ghi ${recordId} đã được cập nhật bởi admin.`);
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
      render: (text: string) => text || "Không có file",
    },
    {
      title: "Minh chứng ĐT",
      dataIndex: "fileDT",
      key: "fileDT",
      render: (text: string) => text || "Không có file",
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
            {/* Nút mô phỏng Admin cập nhật */}
            {status === "Chờ duyệt" && (
              <Space>
                <Button size="small" onClick={() => simulateAdminAction(record.id, "Đã duyệt")}>
                  Admin Duyệt
                </Button>
                <Button size="small" danger onClick={() => simulateAdminAction(record.id, "Từ chối", "Minh chứng không rõ ràng")}>
                  Admin Từ chối
                </Button>
              </Space>
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

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
      {/* Form khai báo thông tin ưu tiên */}
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
          <Row gutter={24}> {/* Tăng gutter để có khoảng cách tốt hơn */}
            <Col xs={24} sm={12}> {/* Responsive: 1 cột trên di động, 2 cột trên desktop */}
              <Form.Item
                label="Khu vực ưu tiên"
                name="khuVucUuTien"
                rules={[{ required: true, message: "Vui lòng chọn khu vực ưu tiên" }]}
              >
                <Select placeholder="Chọn khu vực ưu tiên">
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
                getValueFromEvent={(e: any) => e && e.fileList}
                rules={[{ required: true, message: "Vui lòng upload file minh chứng khu vực ưu tiên" }]}
              >
                <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
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
                <Select placeholder="Chọn đối tượng ưu tiên">
                  {doiTuongUuTienOptions.map(({ label, value }) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="File minh chứng đối tượng ưu tiên"
                name="fileDT"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => e && e.fileList}
                rules={[{ required: true, message: "Vui lòng upload file minh chứng đối tượng ưu tiên" }]}
              >
                <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
                  <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
            <Button type="primary" htmlType="submit" size="large" style={{ width: '50%' }}>
              {editingRecordId ? "Cập nhật" : "Lưu thông tin ưu tiên"}
            </Button>
            {editingRecordId && (
              <Button
                onClick={() => {
                  form.resetFields();
                  setEditingRecordId(null);
                }}
                style={{ marginLeft: 10 }}
              >
                Hủy chỉnh sửa
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>

      {/* Bảng hiển thị thông tin đã khai báo */}
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
          dataSource={priorityRecords.map(record => ({ ...record, key: record.id }))} // Thêm key cho Table
          pagination={false} // Tắt phân trang nếu ít bản ghi
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