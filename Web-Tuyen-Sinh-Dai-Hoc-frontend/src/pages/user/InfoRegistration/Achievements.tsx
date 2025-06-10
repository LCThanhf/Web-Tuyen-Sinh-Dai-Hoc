import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Input,
  Button,
  Upload,
  message,
  Row,
  Col,
  Table,
  Space,
  Tag,
  Modal,
  DatePicker,
  Tabs,
  Alert,
  Typography,
  Spin,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { apiClient } from "../../../services/api";

const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { Text } = Typography;

// Backend interfaces based on actual Prisma schema
interface Achievement {
  id?: string;
  type: string; // "tinh", "quocGia", "none"
  subject?: string;
  year?: string;
  level?: string; // "Nhat", "Nhi", "Ba", "KhuyenKhich"
  file?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string;
}

interface Certificate {
  id?: string;
  type: string; // "IELTS", "TOEFL iBT", "TOEFL ITP", "None"
  score?: number;
  issueDate?: string;
  testCode?: string;
  issuer?: string;
  issuerOther?: string;
  file?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string;
}

const hsgAchievementTypes = [
  { label: "HSG cấp tỉnh/TP", value: "tinh" },
  { label: "HSG cấp Quốc gia", value: "quocGia" },
];

const hsgTỉnhLoaiGiai = [
  { label: "Giải Nhất", value: "Nhat", score: 1.0 },
  { label: "Giải Nhì", value: "Nhi", score: 0.75 },
  { label: "Giải Ba", value: "Ba", score: 0.25 },
];

const hsgQuocGiaLoaiGiai = [
  { label: "Giải Nhất", value: "Nhat", score: 2.0 },
  { label: "Giải Nhì", value: "Nhi", score: 2.0 },
  { label: "Giải Ba", value: "Ba", score: 2.0 },
  { label: "Giải Khuyến Khích", value: "KhuyenKhich", score: 2.0 },
];

const englishCertTypes = [
  { label: "IELTS", value: "IELTS" },
  { label: "TOEFL iBT", value: "TOEFL iBT" },
  { label: "TOEFL ITP", value: "TOEFL ITP" },
];

const donViCapOptions = [
  { label: "IDP Education Vietnam", value: "IDP Education Vietnam" },
  { label: "British Council Vietnam", value: "British Council Vietnam" },
  { label: "IIG Việt Nam", value: "IIG Việt Nam" },
  { label: "ETS", value: "ETS" },
  { label: "Khác", value: "Other" },
];

const currentYear = moment().year();
const yearsOptions = Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => ({
  label: String(year),
  value: String(year),
}));

const MIN_IELTS_SCORE = 5.5;
const MIN_TOEFL_IBT_SCORE = 65;
const MIN_TOEFL_ITP_SCORE = 513;

const AchievementsCerts: React.FC = () => {
  const [hsgForm] = Form.useForm();
  const [certForm] = Form.useForm();

  const [achievementData, setAchievementData] = useState<Achievement | null>(null);
  const [certificateData, setCertificateData] = useState<Certificate | null>(null);

  const [editingAchievement, setEditingAchievement] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(false);

  const [currentTab, setCurrentTab] = useState<string>("hsg");
  const [loading, setLoading] = useState(false);

  const [showHsgFormFields, setShowHsgFormFields] = useState(true);
  const [showCertFormFields, setShowCertFormFields] = useState(true);
  const [hsgAchievementType, setHsgAchievementType] = useState<string | undefined>(undefined);
  const [showDonViKhacInput, setShowDonViKhacInput] = useState(false);

  // Load data from backend
  useEffect(() => {
    loadData();
  }, []);  const loadData = async () => {
    setLoading(true);
    try {
      // Load achievement data directly from backend
      const achievementResponse = await apiClient.get('/student/achievement');
      if (achievementResponse.data.success && achievementResponse.data.data) {
        const achievement = achievementResponse.data.data;
        setAchievementData(achievement);
        setShowHsgFormFields(achievement.type !== "none");
        setHsgAchievementType(achievement.type);
      }

      // Load certificate data directly from backend
      const certificateResponse = await apiClient.get('/student/certificate');
      if (certificateResponse.data.success && certificateResponse.data.data) {
        const certificate = certificateResponse.data.data;
        setCertificateData(certificate);
        setShowCertFormFields(certificate.type !== "None");
        setShowDonViKhacInput(certificate.issuer === "Other");
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // -- HSG form logic --
  const handleHsgTypeChange = (value: string) => {
    setHsgAchievementType(value);
    if (value === "none") {
      setShowHsgFormFields(false);
      hsgForm.resetFields(["subject", "year", "level", "file"]);
    } else {
      setShowHsgFormFields(true);
    }
  };
  const onFinishHsg = async (values: any) => {
    if (achievementData && !editingAchievement) {
      message.warning("Bạn chỉ được khai báo một thành tích Học sinh Giỏi. Vui lòng sửa hoặc xóa bản ghi hiện có.");
      return;
    }

    try {
      setLoading(true);
      
      // Map form values to backend structure
      const payload = {
        type: values.type,
        subject: values.subject,
        year: values.year,
        level: values.level,
        // Note: file upload would need to be handled separately
      };

      await apiClient.put('/student/achievement', payload);
      message.success(editingAchievement ? "Cập nhật Thành tích HSG thành công!" : "Lưu Thành tích HSG thành công!");
      
      // Reload data
      await loadData();
      
      hsgForm.resetFields();
      setShowHsgFormFields(true);
      setHsgAchievementType(undefined);
      setEditingAchievement(false);
    } catch (error) {
      console.error('Failed to save achievement:', error);
      message.error('Không thể lưu thành tích. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditHsg = () => {
    if (!achievementData) return;
    
    setEditingAchievement(true);
    setHsgAchievementType(achievementData.type);
    setShowHsgFormFields(achievementData.type !== "none");

    hsgForm.setFieldsValue({
      type: achievementData.type,
      subject: achievementData.subject,
      year: achievementData.year,
      level: achievementData.level,
    });
  };

  const handleDeleteHsg = () => {
    if (!achievementData) return;
    
    confirm({
      title: "Bạn có chắc chắn muốn xóa thành tích Học sinh Giỏi này?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",      async onOk() {
        try {
          setLoading(true);
          await apiClient.delete('/student/achievement');
          message.success("Xóa Thành tích HSG thành công!");
          setAchievementData(null);
          hsgForm.resetFields();
          setEditingAchievement(false);
          setHsgAchievementType(undefined);
          setShowHsgFormFields(true);
        } catch (error) {
          console.error('Failed to delete achievement:', error);
          message.error('Không thể xóa thành tích. Vui lòng thử lại.');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // -- Cert form logic --
  const handleCertTypeChange = (value: string) => {
    if (value === "None") {
      setShowCertFormFields(false);
      certForm.resetFields(["score", "issueDate", "testCode", "issuer", "issuerOther", "file"]);
      setShowDonViKhacInput(false);
    } else {
      setShowCertFormFields(true);
    }
  };

  const handleDonViCapChange = (value: string) => {
    setShowDonViKhacInput(value === "Other");
    if (value !== "Other") {
      certForm.setFieldsValue({ issuerOther: undefined });
    }
  };
  const onFinishCert = async (values: any) => {
    if (certificateData && !editingCertificate) {
      message.warning("Bạn chỉ được khai báo một chứng chỉ Tiếng Anh. Vui lòng sửa hoặc xóa bản ghi hiện có.");
      return;
    }

    try {
      setLoading(true);
      
      // Map form values to backend structure
      const payload = {
        type: values.type,
        score: values.score ? parseFloat(values.score) : undefined,
        issueDate: values.issueDate ? values.issueDate.format('YYYY-MM-DD') : undefined,
        testCode: values.testCode,
        issuer: values.issuer === "Other" ? values.issuerOther : values.issuer,
        issuerOther: values.issuer === "Other" ? values.issuerOther : undefined,
        // Note: file upload would need to be handled separately
      };

      await apiClient.put('/student/certificate', payload);
      message.success(editingCertificate ? "Cập nhật Chứng chỉ Tiếng Anh thành công!" : "Lưu Chứng chỉ Tiếng Anh thành công!");
      
      // Reload data
      await loadData();
      
      certForm.resetFields();
      setShowCertFormFields(true);
      setShowDonViKhacInput(false);
      setEditingCertificate(false);
    } catch (error) {
      console.error('Failed to save certificate:', error);
      message.error('Không thể lưu chứng chỉ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCert = () => {
    if (!certificateData) return;
    
    setEditingCertificate(true);
    setShowCertFormFields(certificateData.type !== "None");
    setShowDonViKhacInput(certificateData.issuer === "Other");

    certForm.setFieldsValue({
      type: certificateData.type,
      score: certificateData.score,
      issueDate: certificateData.issueDate ? moment(certificateData.issueDate) : undefined,
      testCode: certificateData.testCode,
      issuer: certificateData.issuer === certificateData.issuerOther ? "Other" : certificateData.issuer,
      issuerOther: certificateData.issuerOther,
    });
  };

  const handleDeleteCert = () => {
    if (!certificateData) return;
    
    confirm({
      title: "Bạn có chắc chắn muốn xóa Chứng chỉ Tiếng Anh này?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",      async onOk() {
        try {
          setLoading(true);
          await apiClient.delete('/student/certificate');
          message.success("Xóa Chứng chỉ Tiếng Anh thành công!");
          setCertificateData(null);
          certForm.resetFields();
          setEditingCertificate(false);
          setShowCertFormFields(true);
          setShowDonViKhacInput(false);
        } catch (error) {
          console.error('Failed to delete certificate:', error);
          message.error('Không thể xóa chứng chỉ. Vui lòng thử lại.');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Xem file
  const handleViewFile = (fileUrl?: string) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      message.warning("Không có file minh chứng để xem.");
    }
  };

  // Status mapping for display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PENDING":
        return { text: "Chờ duyệt", color: "processing" };
      case "APPROVED":
        return { text: "Đã duyệt", color: "success" };
      case "REJECTED":
        return { text: "Từ chối", color: "error" };
      default:
        return { text: status, color: "default" };
    }
  };

  // Columns table HSG
  const hsgColumns = [
    {
      title: "Loại thành tích",
      dataIndex: "type",
      key: "type",
      render: (text: string) =>
        text === "none" ? "Không có thành tích" : hsgAchievementTypes.find((o) => o.value === text)?.label || text,
    },
    {
      title: "Môn đạt giải",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Năm đạt giải",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Loại giải",
      dataIndex: "level",
      key: "level",
      render: (text: string) => {
        switch (text) {
          case "Nhat":
            return "Giải Nhất";
          case "Nhi":
            return "Giải Nhì";
          case "Ba":
            return "Giải Ba";
          case "KhuyenKhich":
            return "Giải Khuyến Khích";
          default:
            return text;
        }
      },
    },
    {
      title: "Bằng khen/GCN",
      dataIndex: "file",
      key: "file",
      render: (fileUrl: string) =>
        fileUrl ? (
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewFile(fileUrl)}>
            Xem file
          </Button>
        ) : (
          "Không có file"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Achievement) => {
        const statusDisplay = getStatusDisplay(status);

        return (
          <Space direction="vertical">
            <Tag color={statusDisplay.color}>{statusDisplay.text}</Tag>
            {status === "REJECTED" && record.adminNote && <Tag color="volcano">Lý do: {record.adminNote}</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Achievement) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={handleEditHsg} disabled={record.status !== "PENDING"}>
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={handleDeleteHsg}
            disabled={record.status !== "PENDING"}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Columns table Cert
  const certColumns = [
    {
      title: "Loại Chứng chỉ",
      dataIndex: "type",
      key: "type",
      render: (text: string) => (text === "None" ? "Không có chứng chỉ" : text),
    },
    {
      title: "Điểm Thi",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Ngày Cấp",
      dataIndex: "issueDate",
      key: "issueDate",
    },
    {
      title: "Mã Dự Thi",
      dataIndex: "testCode",
      key: "testCode",
    },
    {
      title: "Đơn vị Cấp",
      dataIndex: "issuer",
      key: "issuer",
      render: (text: string, record: Certificate) => 
        text === "Other" ? record.issuerOther : text,
    },
    {
      title: "Chứng chỉ",
      dataIndex: "file",
      key: "file",
      render: (fileUrl: string) =>
        fileUrl ? (
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewFile(fileUrl)}>
            Xem file
          </Button>
        ) : (
          "Không có file"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Certificate) => {
        const statusDisplay = getStatusDisplay(status);

        return (
          <Space direction="vertical">
            <Tag color={statusDisplay.color}>{statusDisplay.text}</Tag>
            {status === "REJECTED" && record.adminNote && <Tag color="volcano">Lý do: {record.adminNote}</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Certificate) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={handleEditCert} disabled={record.status !== "PENDING"}>
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={handleDeleteCert}
            disabled={record.status !== "PENDING"}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];
  const isHsgFormDisabled = achievementData ? !editingAchievement && achievementData.type !== "none" : false;
  const isCertFormDisabled = certificateData ? !editingCertificate && certificateData.type !== "None" : false;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
      <div
        style={{
          backgroundColor: "#fff",
          padding: 30,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: 30,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 30, color: "#1890ff" }}>Khai báo Thành tích và Chứng chỉ</h2>

        <Alert
          message="Lưu ý quan trọng!"
          description={
            <Text strong style={{ color: "#c72d2d" }}>
              Thí sinh vui lòng chỉ khai báo thành tích Học sinh Giỏi và Chứng chỉ Tiếng Anh <b>cao nhất</b> để được xét điểm ưu tiên.
              Mỗi loại chỉ được khai báo <b>MỘT LẦN DUY NHẤT</b>. Nếu muốn thay đổi, bạn phải xóa bản ghi cũ và khai báo lại.
            </Text>
          }
          type="warning"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: 30, borderColor: "#c72d2d", backgroundColor: "#fffbe6" }}
        />

        <Tabs
          defaultActiveKey="hsg"
          activeKey={currentTab}
          onChange={setCurrentTab}
          centered
          size="large"
          style={{ marginBottom: 30 }}
        >
          {/* Thành tích Học sinh Giỏi */}
          <TabPane tab="Thành tích Học sinh Giỏi" key="hsg">
            <h3 style={{ textAlign: "center", marginBottom: 20, color: "#0056b3" }}>
              {editingAchievement ? "Cập nhật Thành tích Học sinh Giỏi" : "Khai báo Thành tích Học sinh Giỏi"}
            </h3>
            <div style={{ padding: "0 20px" }}>
              <Alert
                message="Quy định cộng điểm HSG"
                description={
                  <Space direction="vertical">
                    <Text>
                      <b>HSG cấp tỉnh/TP:</b> Giải Nhất: +1.0đ, Giải Nhì: +0.75đ, Giải Ba: +0.25đ
                    </Text>
                    <Text>
                      <b>HSG cấp Quốc gia:</b> +2.0đ (áp dụng cho tất cả loại giải)
                    </Text>
                  </Space>
                }
                type="info"
                showIcon
                style={{ marginBottom: 20, backgroundColor: "#e6f7ff", borderColor: "#91d5ff" }}
              />

              <Form form={hsgForm} layout="vertical" onFinish={onFinishHsg}>
                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Loại thành tích"
                      name="type"
                      rules={[{ required: true, message: "Vui lòng chọn loại thành tích" }]}
                    >
                      <Select
                        placeholder="Chọn loại thành tích"
                        onChange={handleHsgTypeChange}
                        disabled={isHsgFormDisabled}
                      >
                        <Option value="none">Không có thành tích Học sinh Giỏi</Option>
                        {hsgAchievementTypes.map(({ label, value }) => (
                          <Option key={value} value={value}>
                            {label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Môn đạt giải"
                      name="subject"
                      rules={[{ required: showHsgFormFields, message: "Vui lòng nhập môn đạt giải" }]}
                    >
                      <Input placeholder="Ví dụ: Toán, Lý, Hóa..." disabled={isHsgFormDisabled || !showHsgFormFields} />
                    </Form.Item>
                  </Col>
                </Row>

                {showHsgFormFields && (
                  <Row gutter={24}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Loại giải"
                        name="level"
                        rules={[{ required: true, message: "Vui lòng chọn loại giải" }]}
                      >
                        <Select placeholder="Chọn loại giải" disabled={isHsgFormDisabled}>
                          {hsgAchievementType === "tinh" &&
                            hsgTỉnhLoaiGiai.map(({ label, value }) => (
                              <Option key={value} value={value}>
                                {label}
                              </Option>
                            ))}
                          {hsgAchievementType === "quocGia" &&
                            hsgQuocGiaLoaiGiai.map(({ label, value }) => (
                              <Option key={value} value={value}>
                                {label}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label="Bằng khen/Giấy chứng nhận đính kèm"
                        name="file"
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => e && e.fileList}
                      >
                        <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png" disabled={isHsgFormDisabled}>
                          <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
                        </Upload>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Năm đạt giải"
                        name="year"
                        rules={[{ required: true, message: "Vui lòng chọn năm đạt giải" }]}
                      >
                        <Select placeholder="Chọn năm" disabled={isHsgFormDisabled}>
                          {yearsOptions.map(({ label, value }) => (
                            <Option key={value} value={value}>
                              {label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                <Form.Item style={{ textAlign: "left", marginTop: 1 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="middle"
                    style={{ width: "186px" }}
                    disabled={isHsgFormDisabled && !editingAchievement}
                    loading={loading}
                  >
                    {editingAchievement ? "Cập nhật" : "Lưu Thành tích HSG"}
                  </Button>
                  {editingAchievement && (
                    <Button
                      onClick={() => {
                        hsgForm.resetFields();
                        setEditingAchievement(false);
                        setHsgAchievementType(undefined);
                        setShowHsgFormFields(true);
                      }}
                      style={{ marginLeft: 10 }}
                    >
                      Hủy chỉnh sửa
                    </Button>
                  )}
                </Form.Item>
              </Form>
            </div>

            <div style={{ marginTop: 40 }}>
              <h3 style={{ textAlign: "center", marginBottom: 20, color: "#0056b3" }}>Danh sách Thành tích Học sinh Giỏi của bạn</h3>
              <Table
                columns={hsgColumns}
                dataSource={achievementData ? [{ ...achievementData, key: achievementData.id }] : []}
                pagination={false}
                bordered
              />
              {!achievementData && (
                <p style={{ textAlign: "center", marginTop: 20, color: "#888" }}>Chưa có thành tích Học sinh Giỏi nào được khai báo.</p>
              )}
            </div>
          </TabPane>

          {/* Chứng chỉ Tiếng Anh */}
          <TabPane tab="Chứng chỉ Tiếng Anh Quốc tế" key="cert">
            <h3 style={{ textAlign: "center", marginBottom: 20, color: "#0056b3" }}>
              {editingCertificate ? "Cập nhật Chứng chỉ Tiếng Anh" : "Khai báo Chứng chỉ Tiếng Anh Quốc tế"}
            </h3>
            <div style={{ padding: "0 20px" }}>
              <Alert
                message="Quy định cộng điểm Chứng chỉ Tiếng Anh"
                description={
                  <Space direction="vertical">
                    <Text>
                      <b>IELTS 5.0 - 6.0</b> (hoặc tương đương TOEFL iBT 65-80, TOEFL ITP 513-549): <b>Cộng 0.5 điểm</b>.
                    </Text>
                    <Text>
                      <b>IELTS 6.5 trở lên</b> (hoặc tương đương TOEFL iBT 81+, TOEFL ITP 550+): <b>Cộng 1.0 điểm</b>.
                    </Text>
                    <Text italic>Lưu ý: Chứng chỉ hợp lệ phải có điểm tối thiểu IELTS 5.5, TOEFL iBT 65, TOEFL ITP 513 và còn hiệu lực.</Text>
                  </Space>
                }
                type="info"
                showIcon
                style={{ marginBottom: 20, backgroundColor: "#e6f7ff", borderColor: "#91d5ff" }}
              />

              <Form form={certForm} layout="vertical" onFinish={onFinishCert}>
                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Loại Chứng chỉ"
                      name="type"
                      rules={[{ required: true, message: "Vui lòng chọn loại chứng chỉ" }]}
                    >
                      <Select
                        placeholder="Chọn loại chứng chỉ"
                        onChange={handleCertTypeChange}
                        disabled={isCertFormDisabled}
                      >
                        <Option value="None">Không có chứng chỉ Tiếng Anh</Option>
                        {englishCertTypes.map(({ label, value }) => (
                          <Option key={value} value={value}>
                            {label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {showCertFormFields && (
                      <>
                        <Form.Item
                          label="Điểm Thi"
                          name="score"
                          rules={[
                            { required: true, message: "Vui lòng nhập điểm thi" },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value) return Promise.resolve();
                                const certType = getFieldValue("type");
                                if (certType === "None") return Promise.resolve();
                                const score = parseFloat(value);
                                if (isNaN(score)) return Promise.reject("Điểm phải là số!");
                                if (certType === "IELTS" && score < MIN_IELTS_SCORE)
                                  return Promise.reject(`IELTS tối thiểu ${MIN_IELTS_SCORE} điểm`);
                                if (certType === "TOEFL iBT" && score < MIN_TOEFL_IBT_SCORE)
                                  return Promise.reject(`TOEFL iBT tối thiểu ${MIN_TOEFL_IBT_SCORE} điểm`);
                                if (certType === "TOEFL ITP" && score < MIN_TOEFL_ITP_SCORE)
                                  return Promise.reject(`TOEFL ITP tối thiểu ${MIN_TOEFL_ITP_SCORE} điểm`);
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <Input type="number" step="0.1" placeholder="Nhập điểm thi" disabled={isCertFormDisabled} />
                        </Form.Item>

                        <Form.Item
                          label="Ngày Cấp Chứng chỉ"
                          name="issueDate"
                          rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
                        >
                          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled={isCertFormDisabled} />
                        </Form.Item>

                        <Form.Item
                          label="Chứng chỉ đính kèm (Bản scan/ảnh)"
                          name="file"
                          valuePropName="fileList"
                          getValueFromEvent={(e: any) => e && e.fileList}
                        >
                          <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png" disabled={isCertFormDisabled}>
                            <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
                          </Upload>
                        </Form.Item>
                      </>
                    )}
                  </Col>

                  <Col xs={24} sm={12}>
                    {showCertFormFields && (
                      <>
                        <Form.Item
                          label="Mã Dự Thi / Số Đăng Ký"
                          name="testCode"
                          rules={[{ required: true, message: "Vui lòng nhập mã dự thi/số đăng ký" }]}
                        >
                          <Input placeholder="Nhập mã dự thi/số đăng ký" disabled={isCertFormDisabled} />
                        </Form.Item>

                        <Form.Item
                          label="Đơn vị Cấp"
                          name="issuer"
                          rules={[{ required: true, message: "Vui lòng chọn đơn vị cấp" }]}
                        >
                          <Select
                            placeholder="Chọn đơn vị cấp"
                            onChange={handleDonViCapChange}
                            disabled={isCertFormDisabled}
                          >
                            {donViCapOptions.map(({ label, value }) => (
                              <Option key={value} value={value}>
                                {label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {showDonViKhacInput && (
                          <Form.Item
                            label="Tên đơn vị cấp khác"
                            name="issuerOther"
                            rules={[{ required: true, message: "Vui lòng nhập tên đơn vị cấp khác" }]}
                          >
                            <Input placeholder="Nhập tên đơn vị cấp khác" disabled={isCertFormDisabled} />
                          </Form.Item>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
                <Form.Item style={{ textAlign: "left", marginTop: 1 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="middle"
                    style={{ width: "186px" }}
                    disabled={isCertFormDisabled && !editingCertificate}
                    loading={loading}
                  >
                    {editingCertificate ? "Cập nhật" : "Lưu Chứng chỉ TA"}
                  </Button>
                  {editingCertificate && (
                    <Button
                      onClick={() => {
                        certForm.resetFields();
                        setEditingCertificate(false);
                        setShowCertFormFields(true);
                        setShowDonViKhacInput(false);
                      }}
                      style={{ marginLeft: 10 }}
                    >
                      Hủy chỉnh sửa
                    </Button>
                  )}
                </Form.Item>
              </Form>
            </div>

            <div style={{ marginTop: 40 }}>
              <h3 style={{ textAlign: "center", marginBottom: 20, color: "#0056b3" }}>Danh sách Chứng chỉ Tiếng Anh của bạn</h3>
              <Table
                columns={certColumns}
                dataSource={certificateData ? [{ ...certificateData, key: certificateData.id }] : []}
                pagination={false}
                bordered
              />
              {!certificateData && (
                <p style={{ textAlign: "center", marginTop: 20, color: "#888" }}>Chưa có chứng chỉ Tiếng Anh nào được khai báo.</p>
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AchievementsCerts;
