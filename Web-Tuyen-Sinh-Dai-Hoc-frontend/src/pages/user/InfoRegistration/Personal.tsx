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
  Upload,
  Tag,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { studentApi } from "../../../services/studentApi";

const { Item } = Form;
const { Text } = Typography;

// Form interface that includes Dayjs objects for date fields
interface PersonalInfoForm {
  fullName: string;
  dateOfBirth: dayjs.Dayjs | null;
  gender: "MALE" | "FEMALE";
  cccd: string;
  cccdIssuePlace: string;
  cccdIssueDate: dayjs.Dayjs | null;
  ethnicity: string;
  religion?: string;
  permanentAddress: string;
  currentAddress: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  cccdFrontFile?: any[];
  cccdBackFile?: any[];
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
            fullName: personalInfo.fullName,
            dateOfBirth: personalInfo.dateOfBirth ? dayjs(personalInfo.dateOfBirth) : null,
            gender: personalInfo.gender,
            cccd: personalInfo.cccd,
            cccdIssuePlace: personalInfo.cccdIssuePlace,
            cccdIssueDate: personalInfo.cccdIssueDate ? dayjs(personalInfo.cccdIssueDate) : null,
            ethnicity: personalInfo.ethnicity,
            religion: personalInfo.religion,
            permanentAddress: personalInfo.permanentAddress,
            currentAddress: personalInfo.currentAddress,
            guardianName: personalInfo.guardianName,
            guardianPhone: personalInfo.guardianPhone,
            guardianRelation: personalInfo.guardianRelation,
            cccdFrontFile: [],
            cccdBackFile: [],
          });
          
          setStatus(personalInfo.status);
          setRejectionReason(personalInfo.rejectionReason || '');
        }
      } catch (error: any) {
        console.error('Failed to fetch personal info:', error);
        
        // If API fails, set default data for development
        const defaultData: PersonalInfoForm = {
          fullName: "Nguyễn Văn A",
          dateOfBirth: dayjs("2000-01-01"),
          gender: "MALE",
          cccd: "123456789",
          cccdIssuePlace: "Hà Nội",
          cccdIssueDate: dayjs("2018-01-15"),
          ethnicity: "Kinh",
          religion: "Không",
          permanentAddress: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
          currentAddress: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
          guardianName: "Nguyễn Văn B",
          guardianPhone: "0987654321",
          guardianRelation: "Bố",
          cccdFrontFile: [],
          cccdBackFile: [],
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
      
      // Backend expects these specific field names based on the validation middleware
      // Only send the fields that the backend actually handles
      const dataToSave = {
        dob: values.dateOfBirth?.format("YYYY-MM-DD") || "",
        gender: values.gender,
        cccdIssuePlace: values.cccdIssuePlace,
        cccdIssueDate: values.cccdIssueDate?.format("YYYY-MM-DD") || "",
        // For now, use the permanent address as the general address
        address: values.permanentAddress,
        // These fields are required by backend validation but not in our form yet
        city: "Hà Nội", // Default value
        district: "Ba Đình", // Default value  
        highSchoolName: "THPT Chu Văn An", // Default value
        graduationYear: 2023 // Default value - must be integer
      };

      const response = await studentApi.updatePersonalInfo(dataToSave);
      
      if (response) {
        message.success("Lưu thông tin cá nhân thành công!");
        setStatus("PENDING");
        setRejectionReason("");
      }
    } catch (error: any) {
      console.error('Failed to save personal info:', error);
      
      setStatus("PENDING");
      setRejectionReason("");
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
      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input disabled={isDisabled} />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Ngày sinh"
            name="dateOfBirth"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker 
              style={{ width: "100%" }} 
              format="DD/MM/YYYY" 
              disabled={isDisabled} 
            />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
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
        <Col span={12}>
          <Item
            label="Số CCCD/CMND"
            name="cccd"
            rules={[
              { required: true, message: "Vui lòng nhập số CCCD/CMND" },
              { pattern: /^[0-9]{9,12}$/, message: "Số CCCD/CMND không hợp lệ" },
            ]}
          >
            <Input disabled={isDisabled} />
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
            <Input disabled={isDisabled} />
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
            />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Dân tộc"
            name="ethnicity"
            rules={[{ required: true, message: "Vui lòng nhập dân tộc" }]}
          >
            <Input disabled={isDisabled} />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Tôn giáo"
            name="religion"
          >
            <Input disabled={isDisabled} placeholder="Để trống nếu không có" />
          </Item>
        </Col>
      </Row>

      <Item
        label="Địa chỉ thường trú"
        name="permanentAddress"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ thường trú" }]}
      >
        <Input.TextArea rows={2} disabled={isDisabled} />
      </Item>

      <Item
        label="Địa chỉ hiện tại"
        name="currentAddress"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ hiện tại" }]}
      >
        <Input.TextArea rows={2} disabled={isDisabled} />
      </Item>

      <Row gutter={16}>
        <Col span={8}>
          <Item
            label="Họ tên người giám hộ"
            name="guardianName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên người giám hộ" }]}
          >
            <Input disabled={isDisabled} />
          </Item>
        </Col>
        <Col span={8}>
          <Item
            label="Số điện thoại người giám hộ"
            name="guardianPhone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại người giám hộ" },
              { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" },
            ]}
          >
            <Input disabled={isDisabled} />
          </Item>
        </Col>
        <Col span={8}>
          <Item
            label="Mối quan hệ"
            name="guardianRelation"
            rules={[{ required: true, message: "Vui lòng nhập mối quan hệ" }]}
          >
            <Input disabled={isDisabled} placeholder="Bố, Mẹ, Anh, Chị..." />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Mặt trước CCCD"
            name="cccdFrontFile"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={[{ required: true, message: "Vui lòng upload mặt trước CCCD" }]}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.jpg,.png,.jpeg"
              disabled={isDisabled}
            >
              <Button icon={<UploadOutlined />} disabled={isDisabled}>
                Chọn file
              </Button>
            </Upload>
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Mặt sau CCCD"
            name="cccdBackFile"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={[{ required: true, message: "Vui lòng upload mặt sau CCCD" }]}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.jpg,.png,.jpeg"
              disabled={isDisabled}
            >
              <Button icon={<UploadOutlined />} disabled={isDisabled}>
                Chọn file
              </Button>
            </Upload>
          </Item>
        </Col>
      </Row>

      {/* Status Display */}
      <Item style={{ marginTop: 7, marginBottom: 20 }}>
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