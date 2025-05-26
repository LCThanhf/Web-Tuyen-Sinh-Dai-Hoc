import React, { useState } from "react";
import { Form, Input, Button, message, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubmitForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    const formData = new FormData();
    
    // Giả sử user_id là 1 nếu không lấy được từ localStorage
    // Đây là giải pháp tạm thời để test, trong sản phẩm thực tế cần xử lý đúng
    const userId = localStorage.getItem('user_id') || "1"; 
    formData.append("user_id", userId);
    
    // Thêm các trường dữ liệu khác
    formData.append("full_name", values.full_name);
    formData.append("cccd", values.cccd);
    formData.append("birthdate", values.birthdate);
    formData.append("gender", values.gender);
    formData.append("address", values.address);
    formData.append("phone", values.phone);
    formData.append("email", values.email);
    formData.append("exam_score", values.exam_score.toString());
    formData.append("priority_object", values.priority_object);
    formData.append("university_id", values.university_id.toString());
    formData.append("major_id", values.major_id.toString());
    formData.append("combination_id", values.combination_id.toString());

    if (fileList.length > 0 && fileList[0].originFileObj) {
      // Đúng tên field mà backend yêu cầu: 'document'
      formData.append("document", fileList[0].originFileObj);
    } else {
      message.error("Vui lòng upload minh chứng!");
      setLoading(false);
      return;
    }

    // Debug: In ra tất cả dữ liệu đang gửi
    console.log("Form data entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

try {
  const response = await axios.post("http://localhost:5000/api/applications/submit", formData, {
    headers: { 
      "Content-Type": "multipart/form-data"
    },
    // Thêm timeout dài hơn
    timeout: 30000, // 30 giây
    // Thêm các config để xử lý file lớn
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });
      message.success(response.data.message);
      navigate("/"); // Redirect to home page after success
    } catch (error: any) { // Properly type the error as any
      console.error("Error submitting form:", error);
      
      // In ra chi tiết đầy đủ của lỗi response
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
        
        // Hiển thị thông báo lỗi cụ thể từ server nếu có
        let errorMessage = "Nộp hồ sơ thất bại!";
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        message.error(`${errorMessage} (Mã lỗi: ${error.response.status})`);
      } else if (error.request) {
        console.log("Error request:", error.request);
        message.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
      } else {
        message.error("Lỗi hệ thống: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info: any) => {
    // Only keep the latest file
    const newFileList = [...info.fileList];
    const latestFile = newFileList.slice(-1);
    
    setFileList(latestFile);
    
    if (latestFile.length > 0) {
      const file = latestFile[0];
      if (file.status === "done") {
        message.success(`${file.name} tải lên thành công.`);
      } else if (file.status === "error") {
        message.error(`${file.name} tải lên thất bại.`);
      }
    }
  };

  const beforeUpload = (file: any) => {
    const isValidType = file.type === 'image/jpeg' || 
                      file.type === 'image/png' || 
                      file.type === 'application/pdf';
    
    if (!isValidType) {
      message.error('Chỉ chấp nhận định dạng JPG, PNG hoặc PDF!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('File phải nhỏ hơn 10MB!');
      return Upload.LIST_IGNORE;
    }
    
    return false; // Prevent auto upload
  };

  return (
    <div className="submit-form-container">
      <h2>Nhập thông tin hồ sơ</h2>
      <Form onFinish={onFinish} layout="vertical" style={{ maxWidth: 600, margin: "0 auto" }}>
        <Form.Item
          label="Tên đầy đủ"
          name="full_name"
          rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="CCCD"
          name="cccd"
          rules={[{ required: true, message: "Vui lòng nhập số CCCD!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="birthdate"
          rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select>
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
            <Select.Option value="Khác">Khác</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không hợp lệ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Điểm thi"
          name="exam_score"
          rules={[{ required: true, message: "Vui lòng nhập điểm thi!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Đối tượng ưu tiên"
          name="priority_object"
          rules={[{ required: true, message: "Vui lòng nhập đối tượng ưu tiên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Trường"
          name="university_id"
          rules={[{ required: true, message: "Vui lòng chọn trường!" }]}
        >
          <Select>
            <Select.Option value={1}>Đại học Bách Khoa</Select.Option>
            <Select.Option value={2}>Đại học Kinh Tế</Select.Option>
            {/* Thêm các trường khác ở đây */}
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngành"
          name="major_id"
          rules={[{ required: true, message: "Vui lòng chọn ngành!" }]}
        >
          <Select>
            <Select.Option value={1}>Công nghệ thông tin</Select.Option>
            <Select.Option value={2}>Kinh tế học</Select.Option>
            {/* Thêm các ngành khác ở đây */}
          </Select>
        </Form.Item>

        <Form.Item
          label="Tổ hợp xét tuyển"
          name="combination_id"
          rules={[{ required: true, message: "Vui lòng chọn tổ hợp xét tuyển!" }]}
        >
          <Select>
            <Select.Option value={1}>A00 (Toán, Lý, Hóa)</Select.Option>
            <Select.Option value={2}>D01 (Văn, Toán, Anh)</Select.Option>
            {/* Thêm các tổ hợp khác ở đây */}
          </Select>
        </Form.Item>

        <Form.Item 
          label="Minh chứng" 
          name="document"
          rules={[{ required: true, message: "Vui lòng upload minh chứng!" }]}
        >
          <Upload
            name="document"
            accept=".jpg,.jpeg,.png,.pdf"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>
              {fileList.length > 0 ? 'Thay đổi file' : 'Chọn file'}
            </Button>
            {fileList.length > 0 && (
              <span style={{ marginLeft: 8 }}>
                {fileList[0].name}
              </span>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Nộp hồ sơ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SubmitForm;