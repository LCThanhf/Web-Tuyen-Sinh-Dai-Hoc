
import React, { useState } from "react";
import {
  Form,
  Select,
  Button,
  Typography,
  Row,
  Col,
  message,
} from "antd";

const { Option } = Select;
const { Title } = Typography;

const methods = ["Điểm THPT", "Học bạ", "Đánh giá năng lực/Đánh giá tư duy"];

const assessmentUnits = [
  "Đại học Quốc gia Hà Nội",
  "Đại học Quốc gia TP.HCM",
  "Đại học Bách khoa Hà Nội",
];

const subjectCombos = ["Toán, Lý, Hóa", "Toán, Lý, Anh", "Toán, Văn, Anh"];

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

const RegisterNguyenVongForm = () => {
  const [form] = Form.useForm();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const onMethodChange = (value: string) => {
    setSelectedMethod(value);
    setSelectedSchool(null);
    form.resetFields(["school", "major", "unit", "combo"]);
  };

  const onSchoolChange = (value: string) => {
    setSelectedSchool(value);
    form.resetFields(["major"]);
  };

  const onFinish = (values: any) => {
    console.log("Nguyện vọng gửi đi:", values);
    message.success("Thêm nguyện vọng thành công!");
    form.resetFields();
    setSelectedMethod(null);
    setSelectedSchool(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Đăng ký Nguyện vọng Xét tuyển
      </Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
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
            {selectedMethod === "Đánh giá năng lực/Đánh giá tư duy" && (
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
            )}
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
                  schoolsByMethod[selectedMethod as keyof typeof schoolsByMethod]?.map((s) => (
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
                  majorsBySchool[selectedSchool as keyof typeof majorsBySchool]?.map((m) => (
                    <Option key={m.code} value={m.code}>
                      {m.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {(selectedMethod === "Điểm THPT" || selectedMethod === "Học bạ") && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tổ hợp môn"
                name="combo"
                rules={[{ required: true, message: "Vui lòng chọn tổ hợp môn" }]}
              >
                <Select placeholder="Chọn tổ hợp môn">
                  {subjectCombos.map((combo) => (
                    <Option key={combo} value={combo}>
                      {combo}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!selectedMethod}>
            Gửi nguyện vọng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterNguyenVongForm;
