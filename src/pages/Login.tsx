// // import React, { useState } from "react";
// // import { Form, Input, Button, message, Space } from "antd";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // const Login: React.FC = () => {
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const onFinish = async (values: any) => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.post("http://localhost:5000/api/auth/login", values);
// //       localStorage.setItem("token", response.data.token);
// //       message.success(response.data.message);
// //       navigate("/submit-form"); // Redirect to submit form after login
// //     } catch (error) {
// //       message.error("Đăng nhập thất bại!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="auth-container">
// //       <h2>Đăng nhập</h2>
// //       <Form onFinish={onFinish} layout="vertical" style={{ maxWidth: 400, margin: "0 auto" }}>
// //         <Form.Item
// //           label="Email"
// //           name="email"
// //           rules={[
// //             { required: true, message: "Vui lòng nhập email!" },
// //             { type: "email", message: "Email không hợp lệ!" },
// //           ]}
// //         >
// //           <Input />
// //         </Form.Item>
// //         <Form.Item
// //           label="Mật khẩu"
// //           name="password"
// //           rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
// //         >
// //           <Input.Password />
// //         </Form.Item>
// //         <Form.Item>
// //           <Button type="primary" htmlType="submit" block loading={loading}>
// //             Đăng nhập
// //           </Button>
// //         </Form.Item>
// //       </Form>
// //       <Space>
// //         <Button onClick={() => navigate("/register")}>Chưa có tài khoản? Đăng ký</Button>
// //         <Button>Quên mật khẩu?</Button> {/* Phần này sẽ làm sau với API quên mật khẩu */}
// //       </Space>
// //     </div>
// //   );
// // };

// // export default Login;









// import React, { useState } from "react";
// import { Form, Input, Button, Checkbox, message } from "antd";

// const Login: React.FC = () => {
//   const [form] = Form.useForm();
//   const [showPassword, setShowPassword] = useState(false);

//   const onFinish = (values: any) => {
//     console.log("Login info:", values);
//     message.success("Đăng nhập thành công!");
//     form.resetFields();
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
//       <h2 style={{ textAlign: "center" }}>Đăng nhập hệ thống tuyển sinh</h2>
//       <Form form={form} layout="vertical" onFinish={onFinish}>
//         <Form.Item
//           label="Số CCCD/CMND"
//           name="cccd"
//           rules={[
//             { required: true, message: "Vui lòng nhập số CCCD/CMND" },
//             { pattern: /^[0-9]{9,12}$/, message: "Số CCCD/CMND không hợp lệ" },
//           ]}
//         >
//           <Input maxLength={12} />
//         </Form.Item>

//         <Form.Item
//           label="Mật khẩu"
//           name="password"
//           rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
//         >
//           <Input.Password
//             visibilityToggle={{ visible: showPassword, onVisibleChange: setShowPassword }}
//           />
//         </Form.Item>

//         <Form.Item name="remember" valuePropName="checked">
//           <Checkbox>Nhớ mật khẩu</Checkbox>
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Đăng nhập
//           </Button>
//         </Form.Item>

//         <Form.Item style={{ textAlign: "center" }}>
//           Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default Login;






// import React from "react";
// import { Form, Input, Button, message } from "antd";

// interface LoginProps {
//   onLogin: (role: string) => void;
// }

// const Login: React.FC<LoginProps> = ({ onLogin }) => {
//   const onFinish = (values: any) => {
//     const { cccd } = values;
//     // Demo phân quyền: cccd bắt đầu '9' là admin, còn lại student
//     if (cccd.startsWith("9")) {
//       message.success("Đăng nhập thành công - Admin");
//       onLogin("admin");
//     } else {
//       message.success("Đăng nhập thành công - Thí sinh");
//       onLogin("student");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
//       <h2 style={{ textAlign: "center" }}>Đăng nhập hệ thống tuyển sinh</h2>
//       <Form layout="vertical" onFinish={onFinish}>
//         <Form.Item
//           label="Số CCCD/CMND"
//           name="cccd"
//           rules={[
//             { required: true, message: "Vui lòng nhập số CCCD/CMND" },
//             { pattern: /^[0-9]{9,12}$/, message: "Số CCCD/CMND không hợp lệ" },
//           ]}
//         >
//           <Input maxLength={12} />
//         </Form.Item>

//         <Form.Item
//           label="Mật khẩu"
//           name="password"
//           rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
//         >
//           <Input.Password />
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Đăng nhập
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default Login;





import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";

interface LoginProps {
  onLogin: (role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = (values: any) => {
    const { cccd } = values;
    if (cccd.startsWith("9")) {
      message.success("Đăng nhập thành công - Admin");
      onLogin("admin");
    } else {
      message.success("Đăng nhập thành công - Thí sinh");
      onLogin("student");
    }
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Đăng nhập hệ thống tuyển sinh</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Số CCCD/CMND"
          name="cccd"
          rules={[
            { required: true, message: "Vui lòng nhập số CCCD/CMND" },
            { pattern: /^[0-9]{9,12}$/, message: "Số CCCD/CMND không hợp lệ" },
          ]}
        >
          <Input maxLength={12} />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password
            visibilityToggle={{
              visible: showPassword,
              onVisibleChange: setShowPassword,
            }}
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Nhớ mật khẩu</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
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
