import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const methods = [
  "Điểm THPT",
  "Học bạ",
  "Đánh giá năng lực",
  "Đánh giá tư duy",
];

// Tổ hợp môn mẫu dùng cho điểm THPT và học bạ
const subjectCombos = [
  "Toán, Lý, Hóa",
  "Toán, Lý, Anh",
  "Toán, Văn, Anh",
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
  "Đánh giá năng lực": [{ code: "BK", name: "Đại học Bách Khoa" }],
  "Đánh giá tư duy": [{ code: "KT", name: "Đại học Kinh Tế" }],
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
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);

  const [nguyenVongList, setNguyenVongList] = useState<any[]>([]);

  const onMethodChange = (value: string) => {
    setSelectedMethod(value);
    setSelectedSchool(null);
    setSelectedMajor(null);
    form.resetFields(["school", "major", "combo", "totalScore", "unit", "score", "file"]);
  };

  const onSchoolChange = (value: string) => {
    setSelectedSchool(value);
    setSelectedMajor(null);
    form.resetFields(["major"]);
  };

  const onMajorChange = (value: string) => {
    setSelectedMajor(value);
  };

  const onFinish = (values: any) => {
    const newNV = {
      key: Date.now(),
      method: selectedMethod,
      school: schoolsByMethod[selectedMethod!].find(s => s.code === values.school)?.name || "",
      major: majorsBySchool[values.school].find(m => m.code === values.major)?.name || "",
      extraInfo: {},
      fileName: values.file?.file?.name || null,
    };

    // Gán dữ liệu thêm tùy theo phương thức
    switch (selectedMethod) {
      case "Điểm THPT":
      case "Học bạ":
        newNV.extraInfo = {
          combo: values.combo,
          totalScore: values.totalScore,
        };
        break;
      case "Đánh giá năng lực":
      case "Đánh giá tư duy":
        newNV.extraInfo = {
          unit: values.unit,
          score: values.score,
        };
        break;
      default:
        break;
    }

    setNguyenVongList(prev => [...prev, newNV]);
    message.success("Thêm nguyện vọng thành công!");
    form.resetFields();
    setSelectedMethod(null);
    setSelectedSchool(null);
    setSelectedMajor(null);
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Phương thức xét tuyển */}
        <Form.Item
          label="Phương thức xét tuyển"
          name="method"
          rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
        >
          <Select placeholder="Chọn phương thức" onChange={onMethodChange} allowClear>
            {methods.map(m => (
              <Option key={m} value={m}>{m}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Trường */}
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
            {selectedMethod && schoolsByMethod[selectedMethod].map(s => (
              <Option key={s.code} value={s.code}>{s.name}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Ngành */}
        <Form.Item
          label="Ngành"
          name="major"
          rules={[{ required: true, message: "Vui lòng chọn ngành" }]}
        >
          <Select
            placeholder="Chọn ngành"
            disabled={!selectedSchool}
            onChange={onMajorChange}
            allowClear
          >
            {selectedSchool && majorsBySchool[selectedSchool].map(m => (
              <Option key={m.code} value={m.code}>{m.name}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Trường thông tin riêng theo phương thức */}
        {selectedMethod === "Điểm THPT" || selectedMethod === "Học bạ" ? (
          <>
            <Form.Item
              label="Tổ hợp môn"
              name="combo"
              rules={[{ required: true, message: "Vui lòng chọn tổ hợp môn" }]}
            >
              <Select placeholder="Chọn tổ hợp môn">
                {subjectCombos.map(c => (
                  <Option key={c} value={c}>{c}</Option>
                ))}
              </Select>
            </Form.Item>
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
          </>
        ) : null}

        {selectedMethod === "Đánh giá năng lực" || selectedMethod === "Đánh giá tư duy" ? (
          <>
            <Form.Item
              label="Đơn vị tổ chức"
              name="unit"
              rules={[{ required: true, message: "Vui lòng nhập đơn vị tổ chức" }]}
            >
              <Input placeholder="Nhập tên đơn vị tổ chức" />
            </Form.Item>
            <Form.Item
              label="Điểm thi"
              name="score"
              rules={[
                { required: true, message: "Vui lòng nhập điểm thi" },
                { type: "number", min: 0, max: 30, message: "Điểm phải từ 0 đến 30" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={0} max={30} step={0.1} />
            </Form.Item>
          </>
        ) : null}

        {/* File minh chứng */}
        <Form.Item
          label="File minh chứng"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={e => e && e.fileList}
          rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
        >
          <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!selectedMethod}>
            Thêm nguyện vọng
          </Button>
        </Form.Item>
      </Form>

      {/* Hiển thị danh sách nguyện vọng */}
      {nguyenVongList.length > 0 && (
        <>
          <h3>Danh sách nguyện vọng đã thêm</h3>
          <ul>
            {nguyenVongList.map((nv, idx) => (
              <li key={nv.key}>
                <b>{idx + 1}. {nv.method}</b> - {nv.school} - {nv.major} - Thông tin:{" "}
                {selectedMethod === "Điểm THPT" || selectedMethod === "Học bạ"
                  ? `Tổ hợp: ${nv.extraInfo.combo}, Tổng điểm: ${nv.extraInfo.totalScore}`
                  : `Đơn vị: ${nv.extraInfo.unit}, Điểm: ${nv.extraInfo.score}`
                }
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default RegisterNguyenVong;
