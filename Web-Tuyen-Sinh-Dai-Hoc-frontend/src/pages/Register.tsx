import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Remove confirm password from the data sent to backend
      const { confirm, agreement, ...registerData } = values;
      
      const response = await axios.post("http://localhost:5000/api/auth/register", registerData);
      
      message.success(response.data.message);
      form.resetFields();
      
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
      } else {
        message.error("Đăng ký thất bại! Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePasswords = (_: any, value: string) => {
    if (!value || form.getFieldValue("password") === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Đăng ký tài khoản</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          label="Số CCCD/CMND"
          name="cccd"
          rules={[
            { required: true, message: "Vui lòng nhập số CCCD/CMND" },
            {
              pattern: /^[0-9]{9,12}$/,
              message: "Số CCCD/CMND phải từ 9 đến 12 chữ số",
            },
          ]}
        >
          <Input maxLength={12} placeholder="Nhập số CCCD/CMND" />
        </Form.Item>

        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên" },
            { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" }
          ]}
        >
          <Input placeholder="Nhập họ và tên đầy đủ" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập địa chỉ email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^[0-9]{10,11}$/,
              message: "Số điện thoại phải có 10 hoặc 11 chữ số",
            },
          ]}
        >
          <Input maxLength={11} placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 8, message: "Mật khẩu tối thiểu 8 ký tự" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
            }
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            { validator: validatePasswords },
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error("Bạn phải đồng ý điều khoản")),
            },
          ]}
        >
          <Checkbox>Tôi đồng ý với Điều khoản và Chính sách bảo mật</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng ký
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          Bạn đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;