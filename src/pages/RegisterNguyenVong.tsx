import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  message,
  Table,
  Space,
  Popconfirm,
  Tag,
  Typography,
  Row, // Import Row
  Col, // Import Col
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;

const methods = ["Điểm THPT", "Học bạ", "Đánh giá năng lực/Đánh giá tư duy"];

const subjectCombos = ["Toán, Lý, Hóa", "Toán, Lý, Anh", "Toán, Văn, Anh"];

const assessmentUnits = [
  "Đại học Quốc gia Hà Nội",
  "Đại học Quốc gia TP.HCM",
  "Đại học Bách khoa Hà Nội",
];

const schoolsByMethod = {
  "Điểm THPT": [
    { code: "BK", name: "Đại học Bách Khoa" },
    { code: "KT", name: "Đại học Kinh Tế" },
  ],
  "Học bạ": [
    { code: "BK", name: "Đại học Bách Khoa" },
    { code: "KT", name: "Đại học Kinh Tế" },
  ],
  "Đánh giá năng lực/Đánh giá tư duy": [
    { code: "BK", name: "Đại học Bách Khoa" },
    { code: "KT", name: "Đại học Kinh Tế" },
  ],
};

const majorsBySchool = {
  BK: [
    { code: "CNTT", name: "Công nghệ thông tin" },
    { code: "DTVT", name: "Điện tử viễn thông" },
  ],
  KT: [
    { code: "KTQT", name: "Kinh tế quốc tế" },
    { code: "QTKD", name: "Quản trị kinh doanh" },
  ],
};

const RegisterNguyenVong = () => {
  const [form] = Form.useForm();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<React.Key>("");
  const [nguyenVongList, setNguyenVongList] = useState<any[]>([]);

  useEffect(() => {
    if (editingKey !== "") {
      const editingItem = nguyenVongList.find((item) => item.key === editingKey);
      if (editingItem) {
        form.setFieldsValue({
          ...editingItem,
          school: editingItem.schoolCode,
          major: editingItem.majorCode,
        });
        setSelectedMethod(editingItem.method);
        setSelectedSchool(editingItem.schoolCode);
      }
    }
  }, [editingKey, nguyenVongList, form]);

  const onMethodChange = (value: string) => {
    setSelectedMethod(value);
    setSelectedSchool(null);
    form.resetFields(["school", "major", "combo", "totalScore", "unit", "score"]);
  };

  const onSchoolChange = (value: string) => {
    setSelectedSchool(value);
    form.resetFields(["major"]);
  };

  const isEditing = (record: any) => record.key === editingKey;

  const edit = (record: Partial<any> & { key: React.Key }) => {
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
    form.resetFields();
    setSelectedMethod(null);
    setSelectedSchool(null);
  };

  const handleDelete = (key: React.Key) => {
    const updatedList = nguyenVongList.filter((item) => item.key !== key);
    setNguyenVongList(updatedList);
    message.success("Xóa nguyện vọng thành công!");
  };

  const onFinish = (values: any) => {
    const schoolName = schoolsByMethod[selectedMethod!].find(
      (s) => s.code === values.school
    )?.name;
    const majorName = majorsBySchool[values.school].find(
      (m) => m.code === values.major
    )?.name;

    const newNV = {
      method: selectedMethod,
      school: schoolName,
      schoolCode: values.school,
      major: majorName,
      majorCode: values.major,
      status: "Chờ duyệt",
      ...values,
    };

    if (editingKey !== "") {
      const updatedList = nguyenVongList.map((item) =>
        item.key === editingKey
          ? { ...item, ...newNV, key: editingKey }
          : item
      );
      setNguyenVongList(updatedList);
      setEditingKey("");
      message.success("Cập nhật nguyện vọng thành công!");
    } else {
      setNguyenVongList((prev) => [{ key: Date.now(), ...newNV }, ...prev]);
      message.success("Thêm nguyện vọng thành công!");
    }
    form.resetFields();
    setSelectedMethod(null);
    setSelectedSchool(null);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text: any, record: any, index: number) => index + 1,
      width: 50,
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      key: "method",
      render: (text: string, record: any) => {
        if (record.method === "Đánh giá năng lực/Đánh giá tư duy" && record.unit) {
          return (
            <>
              {text} <br />
              <small>({record.unit})</small>
            </>
          );
        }
        return text;
      },
    },
    {
      title: "Trường",
      dataIndex: "school",
      key: "school",
    },
    {
      title: "Ngành",
      dataIndex: "major",
      key: "major",
    },
    {
      title: "Thông tin chi tiết",
      key: "extraInfo",
      render: (text: any, record: any) => {
        if (record.method === "Điểm THPT" || record.method === "Học bạ") {
          return (
            <span>
              Tổ hợp: {record.combo} <br /> Tổng điểm: {record.totalScore}
            </span>
          );
        } else if (record.method === "Đánh giá năng lực/Đánh giá tư duy") {
          return <span>Điểm: {record.score}</span>;
        }
        return null;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "geekblue";
        if (status === "Đã duyệt") {
          color = "green";
        } else if (status === "Từ chối") {
          color = "volcano";
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Popconfirm title="Xác nhận lưu?" onConfirm={form.submit}>
              <Button type="link">Lưu</Button>
            </Popconfirm>
            <Button type="link" onClick={cancel}>
              Hủy
            </Button>
          </Space>
        ) : (
          <Space size="middle">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={editingKey !== ""}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa nguyện vọng này?"
              onConfirm={() => handleDelete(record.key)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                disabled={editingKey !== ""}
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: 20 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
        Đăng ký Nguyện vọng Xét tuyển
      </Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}> {/* Sử dụng Row và Col để chia cột */}
          <Col span={12}>
            <Form.Item
              label="Phương thức xét tuyển"
              name="method"
              rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
            >
              <Select placeholder="Chọn phương thức" onChange={onMethodChange} allowClear>
                {methods.map((m) => (
                  <Option key={m} value={m}>
                    {m}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {selectedMethod === "Đánh giá năng lực/Đánh giá tư duy" ? (
              <Form.Item
                label="Đơn vị tổ chức"
                name="unit"
                rules={[{ required: true, message: "Vui lòng chọn đơn vị tổ chức" }]}
              >
                <Select placeholder="Chọn đơn vị tổ chức">
                  {assessmentUnits.map((unit) => (
                    <Option key={unit} value={unit}>
                      {unit}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : null}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Trường"
              name="school"
              rules={[{ required: true, message: "Vui lòng chọn trường" }]}
            >
              <Select
                placeholder="Chọn trường"
                disabled={!selectedMethod}
                onChange={onSchoolChange}
                allowClear
              >
                {selectedMethod &&
                  schoolsByMethod[selectedMethod]?.map((s) => (
                    <Option key={s.code} value={s.code}>
                      {s.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngành"
              name="major"
              rules={[{ required: true, message: "Vui lòng chọn ngành" }]}
            >
              <Select placeholder="Chọn ngành" disabled={!selectedSchool} allowClear>
                {selectedSchool &&
                  majorsBySchool[selectedSchool]?.map((m) => (
                    <Option key={m.code} value={m.code}>
                      {m.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {selectedMethod === "Điểm THPT" || selectedMethod === "Học bạ" ? (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tổ hợp môn"
                name="combo"
                rules={[{ required: true, message: "Vui lòng chọn tổ hợp môn" }]}
              >
                <Select placeholder="Chọn tổ hợp môn">
                  {subjectCombos.map((c) => (
                    <Option key={c} value={c}>
                      {c}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tổng điểm tổ hợp 3 môn"
                name="totalScore"
                rules={[
                  { required: true, message: "Vui lòng nhập tổng điểm" },
                  { type: "number", min: 0, max: 30, message: "Điểm phải từ 0 đến 30" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} max={30} step={0.1} />
              </Form.Item>
            </Col>
          </Row>
        ) : null}

        {selectedMethod === "Đánh giá năng lực/Đánh giá tư duy" ? (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Điểm thi"
                name="score"
                rules={[
                  { required: true, message: "Vui lòng nhập điểm thi" },
                  { type: "number", min: 0, max: 1500, message: "Điểm không hợp lệ" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} max={1500} step={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* Giữ cột này trống hoặc thêm các trường khác nếu cần thiết */}
            </Col>
          </Row>
        ) : null}

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!selectedMethod}>
            {editingKey ? "Cập nhật nguyện vọng" : "Thêm nguyện vọng"}
          </Button>
          {editingKey && (
            <Button style={{ marginLeft: 8 }} onClick={cancel}>
              Hủy
            </Button>
          )}
        </Form.Item>
      </Form>

      ---

      {nguyenVongList.length > 0 && (
        <>
          <Title level={4} style={{ marginTop: 30 }}>
            Danh sách Nguyện vọng Đã Đăng ký
          </Title>
          <Table
            dataSource={nguyenVongList}
            columns={columns}
            pagination={{ pageSize: 5 }}
            bordered
          />
        </>
      )}
    </div>
  );
};

export default RegisterNguyenVong;