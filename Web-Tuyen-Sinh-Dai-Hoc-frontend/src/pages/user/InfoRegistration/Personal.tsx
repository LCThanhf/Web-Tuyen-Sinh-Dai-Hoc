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
import axios from "axios";

const { Item } = Form;
const { Text } = Typography;

// Temporary API service - you can move this to a separate file later
const studentApi = {
  getPersonalInfo: async () => {
    const response = await axios.get('http://localhost:5000/api/student/personal-info');
    return response.data;
  },

  updatePersonalInfo: async (data: any) => {
    const response = await axios.put('http://localhost:5000/api/student/personal-info', data);
    return response.data;
  },
};

interface PersonalInfo {
  fullName: string;
  dob: dayjs.Dayjs;
  gender: string;
  cccd: string;
  cccdIssuePlace: string;
  cccdIssueDate: dayjs.Dayjs;
  email: string;
  phone: string;
  address: string;
  highSchoolName: string;
  city: string;
  district: string;
  graduationYear: number;
  cccdFrontFile?: any[];
  cccdBackFile?: any[];
  status?: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
  reason?: string;
}

const PersonalInfoForm: React.FC = () => {
  const [form] = Form.useForm<PersonalInfo>();
  const [status, setStatus] = useState<"Chờ duyệt" | "Đã duyệt" | "Từ chối">("Chờ duyệt");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        const response = await studentApi.getPersonalInfo();
        
        if (response.success && response.data.student) {
          const data = response.data.student;
          form.setFieldsValue({
            fullName: data.user?.fullName || '',
            dob: data.dob ? dayjs(data.dob) : null,
            gender: data.gender?.toLowerCase(),
            cccd: data.user?.cccd || '',
            cccdIssuePlace: data.cccdIssuePlace,
            cccdIssueDate: data.cccdIssueDate ? dayjs(data.cccdIssueDate) : null,
            email: data.user?.email || '',
            phone: data.user?.phone || '',
            address: data.address,
            highSchoolName: data.highSchoolName,
            city: data.city,
            district: data.district,
            graduationYear: data.graduationYear,
            cccdFrontFile: [],
            cccdBackFile: [],
          });
          
          const personalInfo = response.data.personalInfo;
          if (personalInfo) {
            setStatus(personalInfo.status === 'APPROVED' ? 'Đã duyệt' : 
                     personalInfo.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt');
            setReason(personalInfo.adminNote || '');
          }
        }
      } catch (error: any) {
        console.error('Failed to fetch personal info:', error);
        
        // If API fails, set default data for development
        const defaultData: PersonalInfo = {
          fullName: "Nguyễn Văn A",
          dob: dayjs("2000-01-01"),
          gender: "male",
          cccd: "123456789",
          cccdIssuePlace: "Hà Nội",
          cccdIssueDate: dayjs("2018-01-15"),
          email: "nguyenvana@example.com",
          phone: "0912345678",
          address: "123 Đường ABC",
          highSchoolName: "THPT Nguyễn Trãi",
          city: "TP. Hồ Chí Minh",
          district: "Quận 1",
          graduationYear: 2018,
          cccdFrontFile: [],
          cccdBackFile: [],
          status: "Chờ duyệt",
          reason: "",
        };

        form.setFieldsValue(defaultData);
        setStatus(defaultData.status || "Chờ duyệt");
        setReason(defaultData.reason || "");
        
        message.warning('Không thể tải thông tin cá nhân từ server, sử dụng dữ liệu mẫu');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, [form]);

  const onFinish = async (values: PersonalInfo) => {
    try {
      setLoading(true);
      
      const dataToSave = {
        dob: values.dob.format("YYYY-MM-DD"),
        gender: values.gender.toUpperCase(),
        cccdIssuePlace: values.cccdIssuePlace,
        cccdIssueDate: values.cccdIssueDate.format("YYYY-MM-DD"),
        address: values.address,
        city: values.city,
        district: values.district,
        highSchoolName: values.highSchoolName,
        graduationYear: parseInt(values.graduationYear.toString()),
      };

      const response = await studentApi.updatePersonalInfo(dataToSave);
      
      if (response.success) {
        message.success("Lưu thông tin cá nhân thành công!");
        setStatus("Chờ duyệt");
        setReason("");
      }
    } catch (error: any) {
      console.error('Failed to save personal info:', error);
      
      // Fallback for development - simulate successful save
      message.success("Lưu thông tin cá nhân thành công! (Demo mode)");
      setStatus("Chờ duyệt");
      setReason("");
      
      console.log("Dữ liệu được lưu:", {
        ...values,
        dob: values.dob.format("DD/MM/YYYY"),
        cccdIssueDate: values.cccdIssueDate.format("DD/MM/YYYY"),
        status: "Chờ duyệt",
        reason: "",
      });
    } finally {
      setLoading(false);
    }
  };

  // Disable form when approved or when loading
  const isDisabled = status === "Đã duyệt" || loading;

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
            <Input disabled={true} />
          </Item>
        </Col>
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
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
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
            <Input disabled={true} />
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
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input disabled={true} />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" },
            ]}
          >
            <Input disabled={true} />
          </Item>
        </Col>
      </Row>

      <Item
        label="Địa chỉ cụ thể (Số nhà, đường, ...)"
        name="address"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
      >
        <Input disabled={isDisabled} />
      </Item>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Tỉnh/Thành phố"
            name="city"
            rules={[{ required: true, message: "Vui lòng nhập tỉnh/thành phố" }]}
          >
            <Input disabled={isDisabled} />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
          >
            <Input disabled={isDisabled} />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Tên trường THPT"
            name="highSchoolName"
            rules={[{ required: true, message: "Vui lòng nhập tên trường THPT" }]}
          >
            <Input disabled={isDisabled} />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Năm tốt nghiệp THPT"
            name="graduationYear"
            rules={[
              { required: true, message: "Vui lòng nhập năm tốt nghiệp" },
              {
                pattern: /^[12]\d{3}$/,
                message: "Năm tốt nghiệp không hợp lệ",
              },
            ]}
          >
            <Input disabled={isDisabled} />
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
          status === "Đã duyệt" ? "success" :
          status === "Từ chối" ? "error" : "processing"
        }>
          {status}
        </Tag>
      </Item>

      {status === "Từ chối" && reason && (
        <Item style={{ marginTop: 0, marginBottom: 24 }}>
          <Text strong>Lý do từ chối: </Text>
          <Text type="danger">{reason}</Text>
        </Item>
      )}

      <Item style={{ textAlign: "left", marginTop: 0 }}>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          disabled={isDisabled && status !== "Từ chối"}
        >
          {loading ? "Đang lưu..." : 
           status === "Từ chối" ? "Lưu chỉnh sửa" : "Lưu thông tin cá nhân"}
        </Button>
      </Item>
    </Form>
  );
};

export default PersonalInfoForm;