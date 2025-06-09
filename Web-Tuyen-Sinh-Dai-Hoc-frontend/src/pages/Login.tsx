import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/authApi";

interface LoginProps {
  onLogin: (role: string, userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await authApi.login({
        cccd: values.cccd,
        password: values.password
      });

      const { user, token } = response;
      
      // Store token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(user));
      
      message.success(`Đăng nhập thành công! Chào mừng ${user.fullName}`);
      
      // Call parent login handler with role
      const role = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'admin' : 'student';
      console.log('🔍 Login Debug:');
      console.log('- Backend user.role:', user.role);
      console.log('- Mapped role:', role);
      console.log('- User object:', user);
      
      onLogin(role, user);
      
      // Navigate directly with a small delay to ensure state update
      const redirectPath = role === 'admin' ? '/admin' : '/student/dashboard';
      console.log('- Redirect path:', redirectPath);
      
      setTimeout(() => {
        console.log('- Attempting navigation to:', redirectPath);
        navigate(redirectPath, { replace: true });
        
        // Fallback: if navigation doesn't work, try window.location
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            console.log('- Navigation failed, using window.location');
            window.location.href = redirectPath;
          }
        }, 1000);
      }, 500); // Increased delay to ensure state propagation
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
      } else {
        message.error("Đăng nhập thất bại! Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Đăng nhập</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Số CCCD/CMND"
          name="cccd"
          rules={[
            { required: true, message: "Vui lòng nhập số CCCD/CMND" },
            { pattern: /^[0-9]{9,12}$/, message: "Số CCCD/CMND không hợp lệ" },
          ]}
        >
          <Input maxLength={12} placeholder="Nhập số CCCD/CMND" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Nhớ đăng nhập</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;