import React from "react";
import { Form, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const achievementTypes = [
  "Học sinh giỏi tỉnh",
  "Học sinh giỏi quốc gia",
];

const certificateTypes = [
  "Chứng chỉ TOEFL",
  "Chứng chỉ IELTS",
  "Chứng chỉ TOEIC",
  "Chứng chỉ Cambridge",
];

const AchievementsCerts: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Thông tin thành tích & chứng chỉ:", values);
    message.success("Lưu thành tích & chứng chỉ thành công!");
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: "auto", padding: 20 }}
    >
      <Form.Item
        label="Loại thành tích"
        name="achievementType"
        rules={[{ required: true, message: "Vui lòng chọn loại thành tích" }]}
      >
        <Select placeholder="Chọn loại thành tích" allowClear>
          {achievementTypes.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="File minh chứng thành tích"
        name="achievementFile"
        valuePropName="fileList"
        getValueFromEvent={(e: any) => e && e.fileList}
        rules={[{ required: true, message: "Vui lòng upload file minh chứng thành tích" }]}
      >
        <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
          <Button icon={<UploadOutlined />}>Chọn file</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Loại chứng chỉ ngoại ngữ"
        name="certificateType"
        rules={[{ required: true, message: "Vui lòng chọn loại chứng chỉ" }]}
      >
        <Select placeholder="Chọn loại chứng chỉ" allowClear>
          {certificateTypes.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="File minh chứng chứng chỉ"
        name="certificateFile"
        valuePropName="fileList"
        getValueFromEvent={(e: any) => e && e.fileList}
        rules={[{ required: true, message: "Vui lòng upload file minh chứng chứng chỉ" }]}
      >
        <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
          <Button icon={<UploadOutlined />}>Chọn file</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Lưu thành tích & chứng chỉ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AchievementsCerts;
