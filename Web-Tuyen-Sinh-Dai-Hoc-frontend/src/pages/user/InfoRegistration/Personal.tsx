import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  message,
  Row,
  Col,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { studentApi } from "../../../services/studentApi";
import type { PersonalInfo as ApiPersonalInfo } from "../../../services/studentApi";

const { Item } = Form;
const { Text } = Typography;

// Form interface that matches backend expectations
interface PersonalInfoForm {
  // Read-only fields from registration
  fullName: string;
  cccd: string;
  email: string;
  // Editable personal info fields
  dob: dayjs.Dayjs | null;
  gender: "MALE" | "FEMALE";
  cccdIssuePlace: string;
  cccdIssueDate: dayjs.Dayjs | null;
  address: string;
  city: string;
  district: string;
  highSchoolName: string;
  graduationYear: string;
}

const PersonalInfoForm: React.FC = () => {
  const [form] = Form.useForm<PersonalInfoForm>();
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        const personalInfo = await studentApi.getPersonalInfo();
        
        if (personalInfo) {
          form.setFieldsValue({
            // Read-only fields from registration
            fullName: personalInfo.fullName || "",
            cccd: personalInfo.cccd || "",
            email: personalInfo.email || "",
            // Editable personal info fields
            dob: personalInfo.dob ? dayjs(personalInfo.dob) : null,
            gender: personalInfo.gender || "MALE",
            cccdIssuePlace: personalInfo.cccdIssuePlace || "",
            cccdIssueDate: personalInfo.cccdIssueDate ? dayjs(personalInfo.cccdIssueDate) : null,
            address: personalInfo.address || "",
            city: personalInfo.city || "",
            district: personalInfo.district || "",
            highSchoolName: personalInfo.highSchoolName || "",
            graduationYear: personalInfo.graduationYear || "",
          });
          
          setStatus(personalInfo.status || "PENDING");
          setRejectionReason(personalInfo.rejectionReason || personalInfo.adminNote || '');
        }
      } catch (error: any) {
        console.error('Failed to fetch personal info:', error);
        
        // If API fails, set default data for development
        const defaultData: PersonalInfoForm = {
          // Read-only fields (would normally come from registration)
          fullName: "Nguyễn Văn A",
          cccd: "123456789012",
          email: "nguyenvana@example.com",
          // Editable fields
          dob: dayjs("2000-01-01"),
          gender: "MALE",
          cccdIssuePlace: "Hà Nội",
          cccdIssueDate: dayjs("2018-01-15"),
          address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
          city: "Hồ Chí Minh",
          district: "Quận 1",
          highSchoolName: "THPT Nguyễn Thái Bình",
          graduationYear: "2024",
        };

        form.setFieldsValue(defaultData);
        setStatus("PENDING");
        setRejectionReason("");
        
        message.warning('Không thể tải thông tin cá nhân từ server, sử dụng dữ liệu mẫu');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, [form]);

  const onFinish = async (values: PersonalInfoForm) => {
    try {
      setLoading(true);
      
      // Map form data to backend expected format (only send editable fields)
      const dataToSave = {
        dob: values.dob?.format("YYYY-MM-DD") || "",
        gender: values.gender,
        cccdIssuePlace: values.cccdIssuePlace,
        cccdIssueDate: values.cccdIssueDate?.format("YYYY-MM-DD") || "",
        address: values.address,
        city: values.city,
        district: values.district,
        highSchoolName: values.highSchoolName,
        graduationYear: values.graduationYear,
      };

      const response = await studentApi.updatePersonalInfo(dataToSave);
      
      if (response) {
        message.success("Lưu thông tin cá nhân thành công!");
        setStatus("PENDING");
        setRejectionReason("");
      }
    } catch (error: any) {
      console.error('Failed to save personal info:', error);
      
      // Show the actual error message from backend
      if (error.response?.data?.message) {
        message.error(`Lỗi: ${error.response.data.message}`);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        const errorMessages = validationErrors.map((err: any) => err.msg).join(', ');
        message.error(`Lỗi validation: ${errorMessages}`);
      } else {
        message.error("Không thể lưu thông tin cá nhân. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to translate status for display
  const getStatusDisplay = (status: "PENDING" | "APPROVED" | "REJECTED") => {
    switch (status) {
      case "APPROVED": return "Đã duyệt";
      case "REJECTED": return "Từ chối";
      default: return "Chờ duyệt";
    }
  };

  // Disable form when approved or when loading
  const isDisabled = status === "APPROVED" || loading;

  if (loading && !form.getFieldValue('fullName')) {
    return (
      <div style={{ 
        maxWidth: 900, 
        margin: "auto", 
        padding: 20, 
        textAlign: 'center' 
      }}>
        <Text>Đang tải thông tin...</Text>
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        border: "1px solid #e8e8e8",
        borderRadius: 8,
      }}
    >
      {/* Read-only fields from registration */}
      <Row gutter={16}>
        <Col span={24}>
          <Item
            label="Họ và tên (từ tài khoản đăng ký)"
            name="fullName"
          >
            <Input 
              disabled 
              style={{ 
                backgroundColor: '#f5f5f5',
                color: '#666666',
                cursor: 'not-allowed'
              }}
              placeholder="Họ và tên từ đăng ký"
            />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Số CCCD/CMND (từ tài khoản đăng ký)"
            name="cccd"
          >
            <Input 
              disabled 
              style={{ 
                backgroundColor: '#f5f5f5',
                color: '#666666',
                cursor: 'not-allowed'
              }}
              placeholder="Số CCCD từ đăng ký"
            />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Email (từ tài khoản đăng ký)"
            name="email"
          >
            <Input 
              disabled 
              style={{ 
                backgroundColor: '#f5f5f5',
                color: '#666666',
                cursor: 'not-allowed'
              }}
              placeholder="Email từ đăng ký"
            />
          </Item>
        </Col>
      </Row>

      {/* Divider to separate read-only and editable sections */}
      <div style={{ 
        margin: '24px 0', 
        borderTop: '1px solid #d9d9d9',
        paddingTop: '24px'
      }}>
        <Text strong style={{ color: '#1890ff' }}>Thông tin cá nhân cần bổ sung:</Text>
      </div>

      {/* Editable personal info fields */}
      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Ngày sinh"
            name="dob"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker 
              style={{ width: "100%" }} 
              format="DD/MM/YYYY" 
              disabled={isDisabled} 
              placeholder="Chọn ngày sinh"
            />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Radio.Group disabled={isDisabled}>
              <Radio value="MALE">Nam</Radio>
              <Radio value="FEMALE">Nữ</Radio>
            </Radio.Group>
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Nơi cấp CCCD"
            name="cccdIssuePlace"
            rules={[{ required: true, message: "Vui lòng nhập nơi cấp CCCD" }]}
          >
            <Input disabled={isDisabled} placeholder="Nhập nơi cấp CCCD" />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Ngày cấp CCCD"
            name="cccdIssueDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày cấp CCCD" }]}
          >
            <DatePicker 
              style={{ width: "100%" }} 
              format="DD/MM/YYYY" 
              disabled={isDisabled} 
              placeholder="Chọn ngày cấp CCCD"
            />
          </Item>
        </Col>
      </Row>

      <Item
        label="Địa chỉ"
        name="address"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
      >
        <Input.TextArea rows={2} disabled={isDisabled} placeholder="Nhập địa chỉ chi tiết" />
      </Item>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Thành phố/Tỉnh"
            name="city"
            rules={[{ required: true, message: "Vui lòng nhập thành phố/tỉnh" }]}
          >
            <Input disabled={isDisabled} placeholder="Nhập thành phố/tỉnh" />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
          >
            <Input disabled={isDisabled} placeholder="Nhập quận/huyện" />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Trường THPT"
            name="highSchoolName"
            rules={[{ required: true, message: "Vui lòng nhập tên trường THPT" }]}
          >
            <Input disabled={isDisabled} placeholder="Nhập tên trường THPT" />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Năm tốt nghiệp"
            name="graduationYear"
            rules={[
              { required: true, message: "Vui lòng nhập năm tốt nghiệp" },
              { pattern: /^[0-9]{4}$/, message: "Năm tốt nghiệp phải là 4 chữ số" }
            ]}
          >
            <Input disabled={isDisabled} placeholder="Ví dụ: 2024" maxLength={4} />
          </Item>
        </Col>
      </Row>

      {/* Status Display */}
      <Item style={{ marginTop: 24, marginBottom: 20 }}>
        <Text strong>Trạng thái duyệt: </Text>
        <Tag color={
          status === "APPROVED" ? "success" :
          status === "REJECTED" ? "error" : "processing"
        }>
          {getStatusDisplay(status)}
        </Tag>
      </Item>

      {status === "REJECTED" && rejectionReason && (
        <Item style={{ marginTop: 0, marginBottom: 24 }}>
          <Text strong>Lý do từ chối: </Text>
          <Text type="danger">{rejectionReason}</Text>
        </Item>
      )}

      <Item style={{ textAlign: "left", marginTop: 0 }}>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          disabled={isDisabled && status !== "REJECTED"}
        >
          {loading ? "Đang lưu..." : 
           status === "REJECTED" ? "Lưu chỉnh sửa" : "Lưu thông tin cá nhân"}
        </Button>
      </Item>
    </Form>
  );
};

export default PersonalInfoForm;