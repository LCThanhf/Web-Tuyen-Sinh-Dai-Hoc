import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Radio, message, Typography } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

interface ProfileData {
  fullName: string;
  cccd: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
}

const Profile: React.FC = () => {
  // Dữ liệu mẫu ban đầu
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const initialData: ProfileData = {
    fullName: "Nguyễn Văn A",
    cccd: "123456789",
    dob: "2000-01-01",
    gender: "male",
    email: "nguyenvana@example.com",
    phone: "0912345678",
  };

  const onFinish = (values: any) => {
    setLoading(true);
    // Giả lập lưu dữ liệu, thực tế gọi API backend
    setTimeout(() => {
      setLoading(false);
      message.success("Lưu thông tin cá nhân thành công!");
      console.log("Dữ liệu gửi lên server:", values);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Title level={3}>Thông tin cá nhân</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialData,
          dob: dayjs(initialData.dob),
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số CCCD/CMND"
          name="cccd"
          rules={[
            { required: true, message: "Vui lòng nhập số CCCD/CMND" },
            { pattern: /^[0-9]{9,12}$/, message: "Số CCCD/CMND không hợp lệ" },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          name="dob"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
        >
          <Radio.Group>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
            <Radio value="other">Khác</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^[0-9]{10,11}$/,
              message: "Số điện thoại phải 10 hoặc 11 chữ số",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
