// import React, { useState } from "react";
// import { Form, Input, Button, message, Space } from "antd";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Register: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const onFinish = async (values: any) => {
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/register", values);
//       message.success(response.data.message);
//       navigate("/");  // Redirect to Login after successful registration
//     } catch (error) {
//       message.error("Đăng ký thất bại!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Đăng ký tài khoản</h2>
//       <Form onFinish={onFinish} layout="vertical" style={{ maxWidth: 400, margin: "0 auto" }}>
//         <Form.Item
//           label="Tên đầy đủ"
//           name="full_name"
//           rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ!" }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           label="Email"
//           name="email"
//           rules={[
//             { required: true, message: "Vui lòng nhập email!" },
//             { type: "email", message: "Email không hợp lệ!" },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           label="Mật khẩu"
//           name="password"
//           rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
//           hasFeedback
//         >
//           <Input.Password />
//         </Form.Item>
//         <Form.Item
//           label="Xác nhận mật khẩu"
//           name="confirm_password"
//           dependencies={["password"]}
//           rules={[
//             { required: true, message: "Vui lòng xác nhận mật khẩu!" },
//             ({ getFieldValue }) => ({
//               validator(_, value) {
//                 if (!value || getFieldValue("password") === value) {
//                   return Promise.resolve();
//                 }
//                 return Promise.reject(new Error("Mật khẩu không khớp!"));
//               },
//             }),
//           ]}
//           hasFeedback
//         >
//           <Input.Password />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" block loading={loading}>
//             Đăng ký
//           </Button>
//         </Form.Item>
//       </Form>
//       <Space>
//         <Button onClick={() => navigate("/")}>Đã có tài khoản? Đăng nhập</Button>
//       </Space>
//     </div>
//   );
// };

// export default Register;





import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Radio, Checkbox, message } from "antd";
import dayjs from "dayjs";

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    message.success("Đăng ký thành công!");
    form.resetFields();
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
          <Input maxLength={12} />
        </Form.Item>

        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input />
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
          <Input maxLength={11} />
        </Form.Item>

        <Form.Item
          label="Ngày tháng năm sinh"
          name="dob"
          rules={[
            { required: true, message: "Vui lòng chọn ngày sinh" },
            {
              validator: (_, value) => {
                if (!value) return Promise.reject();
                const age = dayjs().diff(value, "year");
                if (age < 10 || age > 100)
                  return Promise.reject(
                    new Error("Tuổi phải từ 10 đến 100")
                  );
                return Promise.resolve();
              },
            },
          ]}
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
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 8, message: "Mật khẩu tối thiểu 8 ký tự" },
          ]}
          hasFeedback
        >
          <Input.Password
            visibilityToggle={{ visible: showPassword, onVisibleChange: setShowPassword }}
          />
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
          <Input.Password
            visibilityToggle={{ visible: showPassword, onVisibleChange: setShowPassword }}
          />
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
          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          Bạn đã có tài khoản? <a href="/">Đăng nhập ngay</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
