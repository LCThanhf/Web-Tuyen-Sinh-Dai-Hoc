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

const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { Text } = Typography;

interface HSGAchievement {
  id: string;
  type: "tinh" | "quocGia" | "none";
  monDatGiai?: string;
  namDatGiai?: string;
  loaiGiai?: "Nhat" | "Nhi" | "Ba" | "KhuyenKhich";
  fileHSG?: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
  reason?: string;
}

interface EnglishCert {
  id: string;
  type: "IELTS" | "TOEFL iBT" | "TOEFL ITP" | "None" | string;
  diemThi?: number;
  ngayCap?: string;
  maDuThi?: string;
  donViCap?: "IDP Education Vietnam" | "British Council Vietnam" | "IIG Việt Nam" | "ETS" | "Khac";
  donViKhacText?: string;
  fileCert?: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
  reason?: string;
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
  { label: "Khác", value: "Khac" },
];

const currentYear = moment().year();
const yearsOptions = Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => ({
  label: String(year),
  value: String(year),
}));

const MIN_IELTS_SCORE = 5.5;
const MIN_TOEFL_IBT_SCORE = 65;
const MIN_TOEFL_ITP_SCORE = 513;

const LOCAL_STORAGE_HSG_KEY = "achievementsHSGData";
const LOCAL_STORAGE_CERT_KEY = "achievementsCertData";

const AchievementsCerts: React.FC = () => {
  const [hsgForm] = Form.useForm();
  const [certForm] = Form.useForm();

  const [hsgRecords, setHsgRecords] = useState<HSGAchievement[]>([]);
  const [certRecords, setCertRecords] = useState<EnglishCert[]>([]);

  const [editingHsgRecordId, setEditingHsgRecordId] = useState<string | null>(null);
  const [editingCertRecordId, setEditingCertRecordId] = useState<string | null>(null);

  const [currentTab, setCurrentTab] = useState<string>("hsg");

  const [showHsgFormFields, setShowHsgFormFields] = useState(true);
  const [showCertFormFields, setShowCertFormFields] = useState(true);
  const [hsgAchievementType, setHsgAchievementType] = useState<string | undefined>(undefined);
  const [showDonViKhacInput, setShowDonViKhacInput] = useState(false);

  // Load data localStorage
  useEffect(() => {
    const savedHsgData = localStorage.getItem(LOCAL_STORAGE_HSG_KEY);
    if (savedHsgData) {
      try {
        const parsed: HSGAchievement[] = JSON.parse(savedHsgData);
        setHsgRecords(parsed);
        setShowHsgFormFields(!(parsed.length > 0 && parsed[0].type === "none"));
        if (parsed.length > 0) setHsgAchievementType(parsed[0].type);
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_HSG_KEY);
      }
    }

    const savedCertData = localStorage.getItem(LOCAL_STORAGE_CERT_KEY);
    if (savedCertData) {
      try {
        const parsed: EnglishCert[] = JSON.parse(savedCertData);
        setCertRecords(parsed);
        setShowCertFormFields(!(parsed.length > 0 && parsed[0].type === "None"));
        setShowDonViKhacInput(parsed.length > 0 && parsed[0].donViCap === "Khac");
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_CERT_KEY);
      }
    }
  }, []);

  // Save data localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HSG_KEY, JSON.stringify(hsgRecords));
  }, [hsgRecords]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CERT_KEY, JSON.stringify(certRecords));
  }, [certRecords]);

  // -- HSG form logic --

  const handleHsgTypeChange = (value: string) => {
    setHsgAchievementType(value);
    if (value === "none") {
      setShowHsgFormFields(false);
      hsgForm.resetFields(["monDatGiai", "namDatGiai", "loaiGiai", "fileHSG"]);
    } else {
      setShowHsgFormFields(true);
    }
  };

  const onFinishHsg = (values: any) => {
    if (hsgRecords.length > 0 && !editingHsgRecordId) {
      message.warning("Bạn chỉ được khai báo một thành tích Học sinh Giỏi. Vui lòng sửa hoặc xóa bản ghi hiện có.");
      return;
    }
    const fileHSGBlobUrl =
      values.fileHSG && values.fileHSG[0] && values.fileHSG[0].originFileObj
        ? URL.createObjectURL(values.fileHSG[0].originFileObj)
        : null;

    const newRecord: HSGAchievement = {
      ...values,
      namDatGiai: values.namDatGiai ? values.namDatGiai : undefined,
      fileHSG: values.type === "none" ? null : fileHSGBlobUrl,
      status: "Chờ duyệt",
      id: editingHsgRecordId || Date.now().toString(),
    };

    if (editingHsgRecordId) {
      setHsgRecords((prev) =>
        prev.map((r) => {
          if (r.id === editingHsgRecordId) {
            if (r.fileHSG && r.fileHSG.startsWith("blob:") && r.fileHSG !== newRecord.fileHSG) {
              URL.revokeObjectURL(r.fileHSG);
            }
            return newRecord;
          }
          return r;
        })
      );
      message.success("Cập nhật Thành tích HSG thành công!");
      setEditingHsgRecordId(null);
    } else {
      setHsgRecords([newRecord]);
      message.success("Lưu Thành tích HSG thành công!");
    }
    hsgForm.resetFields();
    setShowHsgFormFields(true);
    setHsgAchievementType(undefined);
  };

  const handleEditHsg = (record: HSGAchievement) => {
    setEditingHsgRecordId(record.id);
    setHsgAchievementType(record.type);
    setShowHsgFormFields(record.type !== "none");

    const fileHSGList = record.fileHSG ? [{ uid: record.fileHSG, name: `fileHSG.pdf`, status: "done" as const }] : [];
    hsgForm.setFieldsValue({
      type: record.type,
      monDatGiai: record.monDatGiai,
      namDatGiai: record.namDatGiai,
      loaiGiai: record.loaiGiai,
      fileHSG: fileHSGList,
    });
  };

  const handleDeleteHsg = (id: string) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa thành tích Học sinh Giỏi này?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        setHsgRecords((prev) => {
          const r = prev.find((x) => x.id === id);
          if (r && r.fileHSG && r.fileHSG.startsWith("blob:")) {
            URL.revokeObjectURL(r.fileHSG);
          }
          return prev.filter((x) => x.id !== id);
        });
        message.success("Xóa Thành tích HSG thành công!");
        if (editingHsgRecordId === id) {
          hsgForm.resetFields();
          setEditingHsgRecordId(null);
          setHsgAchievementType(undefined);
          setShowHsgFormFields(true);
        }
      },
    });
  };

  // -- Cert form logic --

  const handleCertTypeChange = (value: string) => {
    if (value === "None") {
      setShowCertFormFields(false);
      certForm.resetFields(["diemThi", "ngayCap", "maDuThi", "donViCap", "donViKhacText", "fileCert"]);
      setShowDonViKhacInput(false);
    } else {
      setShowCertFormFields(true);
    }
  };

  const handleDonViCapChange = (value: string) => {
    setShowDonViKhacInput(value === "Khac");
    if (value !== "Khac") {
      certForm.setFieldsValue({ donViKhacText: undefined });
    }
  };

  const onFinishCert = (values: any) => {
    if (certRecords.length > 0 && !editingCertRecordId) {
      message.warning("Bạn chỉ được khai báo một chứng chỉ Tiếng Anh. Vui lòng sửa hoặc xóa bản ghi hiện có.");
      return;
    }

    const fileCertBlobUrl =
      values.fileCert && values.fileCert[0] && values.fileCert[0].originFileObj
        ? URL.createObjectURL(values.fileCert[0].originFileObj)
        : null;

    const newRecord: EnglishCert = {
      ...values,
      ngayCap: values.ngayCap ? values.ngayCap : undefined,
      fileCert: values.type === "None" ? null : fileCertBlobUrl,
      status: "Chờ duyệt",
      id: editingCertRecordId || Date.now().toString(),
    };

    if (editingCertRecordId) {
      setCertRecords((prev) =>
        prev.map((r) => {
          if (r.id === editingCertRecordId) {
            if (r.fileCert && r.fileCert.startsWith("blob:") && r.fileCert !== newRecord.fileCert) {
              URL.revokeObjectURL(r.fileCert);
            }
            return newRecord;
          }
          return r;
        })
      );
      message.success("Cập nhật Chứng chỉ Tiếng Anh thành công!");
      setEditingCertRecordId(null);
    } else {
      setCertRecords([newRecord]);
      message.success("Lưu Chứng chỉ Tiếng Anh thành công!");
    }
    certForm.resetFields();
    setShowCertFormFields(true);
    setShowDonViKhacInput(false);
  };

  const handleEditCert = (record: EnglishCert) => {
    setEditingCertRecordId(record.id);
    setShowCertFormFields(record.type !== "None");
    setShowDonViKhacInput(record.donViCap === "Khac");

    const fileCertList = record.fileCert ? [{ uid: record.fileCert, name: "fileCert.pdf", status: "done" as const }] : [];
    certForm.setFieldsValue({
      type: record.type,
      diemThi: record.diemThi,
      ngayCap: record.ngayCap,
      maDuThi: record.maDuThi,
      donViCap: record.donViCap,
      donViKhacText: record.donViKhacText,
      fileCert: fileCertList,
    });
  };

  const handleDeleteCert = (id: string) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa Chứng chỉ Tiếng Anh này?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        setCertRecords((prev) => {
          const r = prev.find((x) => x.id === id);
          if (r && r.fileCert && r.fileCert.startsWith("blob:")) {
            URL.revokeObjectURL(r.fileCert);
          }
          return prev.filter((x) => x.id !== id);
        });
        message.success("Xóa Chứng chỉ Tiếng Anh thành công!");
        if (editingCertRecordId === id) {
          certForm.resetFields();
          setEditingCertRecordId(null);
          setShowCertFormFields(true);
          setShowDonViKhacInput(false);
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
      dataIndex: "monDatGiai",
      key: "monDatGiai",
    },
    {
      title: "Năm đạt giải",
      dataIndex: "namDatGiai",
      key: "namDatGiai",
    },
    {
      title: "Loại giải",
      dataIndex: "loaiGiai",
      key: "loaiGiai",
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
      dataIndex: "fileHSG",
      key: "fileHSG",
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
      render: (status: string, record: HSGAchievement) => {
        let color = "processing";
        if (status === "Đã duyệt") color = "success";
        else if (status === "Từ chối") color = "error";

        return (
          <Space direction="vertical">
            <Tag color={color}>{status}</Tag>
            {status === "Từ chối" && record.reason && <Tag color="volcano">Lý do: {record.reason}</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: HSGAchievement) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditHsg(record)} disabled={record.status !== "Chờ duyệt"}>
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteHsg(record.id)}
            disabled={record.status !== "Chờ duyệt"}
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
      dataIndex: "diemThi",
      key: "diemThi",
    },
    {
      title: "Ngày Cấp",
      dataIndex: "ngayCap",
      key: "ngayCap",
    },
    {
      title: "Mã Dự Thi",
      dataIndex: "maDuThi",
      key: "maDuThi",
    },
    {
      title: "Đơn vị Cấp",
      dataIndex: "donViCap",
      key: "donViCap",
      render: (text: string, record: EnglishCert) => (text === "Khac" ? record.donViKhacText : text),
    },
    {
      title: "Chứng chỉ",
      dataIndex: "fileCert",
      key: "fileCert",
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
      render: (status: string, record: EnglishCert) => {
        let color = "processing";
        if (status === "Đã duyệt") color = "success";
        else if (status === "Từ chối") color = "error";

        return (
          <Space direction="vertical">
            <Tag color={color}>{status}</Tag>
            {status === "Từ chối" && record.reason && <Tag color="volcano">Lý do: {record.reason}</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: EnglishCert) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditCert(record)} disabled={record.status !== "Chờ duyệt"}>
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteCert(record.id)}
            disabled={record.status !== "Chờ duyệt"}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const isHsgFormDisabled = hsgRecords.length > 0 && editingHsgRecordId === null && hsgRecords[0].type !== "none";
  const isCertFormDisabled = certRecords.length > 0 && editingCertRecordId === null && certRecords[0].type !== "None";

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
              {editingHsgRecordId ? "Cập nhật Thành tích Học sinh Giỏi" : "Khai báo Thành tích Học sinh Giỏi"}
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
                      name="monDatGiai"
                      rules={[{ required: true, message: "Vui lòng nhập môn đạt giải" }]}
                    >
                      <Input placeholder="Ví dụ: Toán, Lý, Hóa..." disabled={isHsgFormDisabled} />
                    </Form.Item>
                  </Col>
                </Row>

                {showHsgFormFields && (
                  <Row gutter={24}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Loại giải"
                        name="loaiGiai"
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
                        name="fileHSG"
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => e && e.fileList}
                        rules={[{ required: true, message: "Vui lòng upload bằng khen/chứng nhận" }]}
                      >
                        <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png" disabled={isHsgFormDisabled}>
                          <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
                        </Upload>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Năm đạt giải"
                        name="namDatGiai"
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
                    disabled={isHsgFormDisabled && !editingHsgRecordId}
                  >
                    {editingHsgRecordId ? "Cập nhật" : "Lưu Thành tích HSG"}
                  </Button>
                  {editingHsgRecordId && (
                    <Button
                      onClick={() => {
                        hsgForm.resetFields();
                        setEditingHsgRecordId(null);
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
                dataSource={hsgRecords.map((record) => ({ ...record, key: record.id }))}
                pagination={false}
                bordered
              />
              {hsgRecords.length === 0 && (
                <p style={{ textAlign: "center", marginTop: 20, color: "#888" }}>Chưa có thành tích Học sinh Giỏi nào được khai báo.</p>
              )}
            </div>
          </TabPane>

          {/* Chứng chỉ Tiếng Anh */}
          <TabPane tab="Chứng chỉ Tiếng Anh Quốc tế" key="cert">
            <h3 style={{ textAlign: "center", marginBottom: 20, color: "#0056b3" }}>
              {editingCertRecordId ? "Cập nhật Chứng chỉ Tiếng Anh" : "Khai báo Chứng chỉ Tiếng Anh Quốc tế"}
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
                          name="diemThi"
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
                          name="ngayCap"
                          rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
                        >
                          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled={isCertFormDisabled} />
                        </Form.Item>

                        <Form.Item
                          label="Chứng chỉ đính kèm (Bản scan/ảnh)"
                          name="fileCert"
                          valuePropName="fileList"
                          getValueFromEvent={(e: any) => e && e.fileList}
                          rules={[{ required: true, message: "Vui lòng upload chứng chỉ đính kèm" }]}
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
                          name="maDuThi"
                          rules={[{ required: true, message: "Vui lòng nhập mã dự thi/số đăng ký" }]}
                        >
                          <Input placeholder="Nhập mã dự thi/số đăng ký" disabled={isCertFormDisabled} />
                        </Form.Item>

                        <Form.Item
                          label="Đơn vị Cấp"
                          name="donViCap"
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
                            name="donViKhacText"
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
                    disabled={isCertFormDisabled && !editingCertRecordId}
                  >
                    {editingCertRecordId ? "Cập nhật" : "Lưu Chứng chỉ TA"}
                  </Button>
                  {editingCertRecordId && (
                    <Button
                      onClick={() => {
                        certForm.resetFields();
                        setEditingCertRecordId(null);
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
                dataSource={certRecords.map((record) => ({ ...record, key: record.id }))}
                pagination={false}
                bordered
              />
              {certRecords.length === 0 && (
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