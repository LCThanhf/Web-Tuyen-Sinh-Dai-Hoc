import React, { useEffect } from "react";
import { Form, Select, Button, Upload, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

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
];

const LOCAL_STORAGE_KEY = "infoPriorityData";

const InfoPriority: React.FC = () => {
  const [form] = Form.useForm();

  // Khi component mount, load dữ liệu từ localStorage nếu có
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Cần map file từ localStorage sang định dạng fileList nếu muốn hiển thị
      form.setFieldsValue(parsed);
    }
  }, [form]);

  const onFinish = (values: any) => {
    console.log("Thông tin ưu tiên:", values);
    // Lưu dữ liệu lên localStorage (bạn có thể đổi thành gửi API)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
    message.success("Lưu thông tin ưu tiên thành công!");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: "auto", padding: 20 }}
    >
      <Row gutter={16}>
        <Col span={12}>
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

        <Col span={12}>
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

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Lưu thông tin ưu tiên
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InfoPriority;
