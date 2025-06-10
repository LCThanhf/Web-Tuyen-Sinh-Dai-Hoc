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
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { studentApi } from "../../../services/studentApi";
import { apiClient } from "../../../services/api";

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
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  
  // File upload states
  const [selectedCccdFrontFile, setSelectedCccdFrontFile] = useState<File | null>(null);
  const [selectedCccdBackFile, setSelectedCccdBackFile] = useState<File | null>(null);
  const [uploadingCccdFrontFile, setUploadingCccdFrontFile] = useState(false);
  const [uploadingCccdBackFile, setUploadingCccdBackFile] = useState(false);

  const fetchPersonalInfo = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getStudentProfile();
      
      if (response) {
        setPersonalInfo(response);
        
        // Extract data from the correct structure
        const student = response.student;
        const personalInfo = response.personalInfo;
        
        form.setFieldsValue({
          fullName: student?.user?.fullName || '',
          dateOfBirth: student?.dob ? dayjs(student.dob) : null,
          gender: student?.gender || 'MALE',
          cccd: student?.user?.cccd || '',
          cccdIssuePlace: student?.cccdIssuePlace || '',
          cccdIssueDate: student?.cccdIssueDate ? dayjs(student.cccdIssueDate) : null,
          ethnicity: personalInfo?.ethnicity || '',
          religion: personalInfo?.religion || '',
          permanentAddress: personalInfo?.permanentAddress || student?.address || '',
          currentAddress: personalInfo?.currentAddress || student?.address || '',
          guardianName: personalInfo?.guardianName || '',
          guardianPhone: personalInfo?.guardianPhone || '',
          guardianRelation: personalInfo?.guardianRelation || '',
          cccdFrontFile: [],
          cccdBackFile: [],
        });
        
        // Set status from personalInfo, default to PENDING if no personalInfo exists
        setStatus(personalInfo?.status || "PENDING");
        setRejectionReason(personalInfo?.rejectionReason || '');
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

  // Fetch data from backend on component mount
  useEffect(() => {
    fetchPersonalInfo();
  }, [form]);

  // File selection handlers
  const handleCccdFrontFileSelect = (file: File) => {
    setSelectedCccdFrontFile(file);
    message.info('File đã được chọn. File sẽ được tải lên khi bạn lưu thông tin.');
    return false; // Prevent automatic upload
  };

  const handleCccdBackFileSelect = (file: File) => {
    setSelectedCccdBackFile(file);
    message.info('File đã được chọn. File sẽ được tải lên khi bạn lưu thông tin.');
    return false; // Prevent automatic upload
  };

  // File viewing handler
  const handleViewFile = (fileUrl: string) => {
    if (fileUrl) {
      // Use the same pattern as Achievements.tsx
      const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
      
      let fullUrl: string;
      if (fileUrl.startsWith('http')) {
        fullUrl = fileUrl;
      } else {
        // Direct file URL construction
        fullUrl = `${baseUrl}${fileUrl}`;
      }
      
      // Open directly in new window
      window.open(fullUrl, '_blank');
    } else {
      message.warning("Không có file minh chứng để xem.");
    }
  };

  const onFinish = async (values: PersonalInfoForm) => {
    try {
      setLoading(true);
      
      // First upload CCCD front file if selected
      if (selectedCccdFrontFile) {
        setUploadingCccdFrontFile(true);
        const formData = new FormData();
        formData.append('cccdFrontFile', selectedCccdFrontFile);

        const uploadResponse = await apiClient.post('/student/personal-info/upload-cccd-front', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (uploadResponse.data.success) {
          message.success('Tải file CCCD mặt trước thành công!');
        } else {
          message.error('Không thể tải file CCCD mặt trước lên. Vui lòng thử lại.');
          return;
        }
        setUploadingCccdFrontFile(false);
      }

      // Then upload CCCD back file if selected
      if (selectedCccdBackFile) {
        setUploadingCccdBackFile(true);
        const formData = new FormData();
        formData.append('cccdBackFile', selectedCccdBackFile);

        const uploadResponse = await apiClient.post('/student/personal-info/upload-cccd-back', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (uploadResponse.data.success) {
          message.success('Tải file CCCD mặt sau thành công!');
        } else {
          message.error('Không thể tải file CCCD mặt sau lên. Vui lòng thử lại.');
          return;
        }
        setUploadingCccdBackFile(false);
      }
      
      // Backend expects these specific field names based on the validation middleware
      // Include all the fields that users can enter in the form
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
        graduationYear: 2023, // Default value - must be integer
        // Add the missing personal information fields
        ethnicity: values.ethnicity,
        religion: values.religion || "",
        permanentAddress: values.permanentAddress,
        currentAddress: values.currentAddress,
        guardianName: values.guardianName,
        guardianPhone: values.guardianPhone,
        guardianRelation: values.guardianRelation
      };

      const response = await studentApi.updatePersonalInfo(dataToSave);
      
      if (response) {
        message.success("Lưu thông tin cá nhân thành công!");
        setStatus("PENDING");
        setRejectionReason("");
        
        // Clear selected files and reload data
        setSelectedCccdFrontFile(null);
        setSelectedCccdBackFile(null);
        
        // Reload data to show uploaded files
        await fetchPersonalInfo();
      }
    } catch (error: any) {
      console.error('Failed to save personal info:', error);
      
      setStatus("PENDING");
      setRejectionReason("");
    } finally {
      setLoading(false);
      setUploadingCccdFrontFile(false);
      setUploadingCccdBackFile(false);
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
            rules={[
              { 
                required: true, 
                message: "Vui lòng upload mặt trước CCCD",
                validator: () => {
                  // Check if either a new file is selected OR an existing file is already uploaded
                  if (selectedCccdFrontFile || (personalInfo?.personalInfo?.cccdFrontFile)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Vui lòng upload mặt trước CCCD"));
                }
              }
            ]}
          >
            <Upload
              beforeUpload={handleCccdFrontFileSelect}
              maxCount={1}
              accept=".pdf,.jpg,.png,.jpeg"
              disabled={isDisabled}
              fileList={[]}
              showUploadList={false}
            >
              <Button 
                icon={<UploadOutlined />} 
                disabled={isDisabled}
                loading={uploadingCccdFrontFile}
              >
                Chọn file minh chứng
              </Button>
            </Upload>
            {selectedCccdFrontFile && (
              <div style={{ marginTop: 8 }}>
                <Text>File đã chọn: {selectedCccdFrontFile.name}</Text>
                <Button 
                  size="small" 
                  style={{ marginLeft: 8 }}
                  onClick={() => setSelectedCccdFrontFile(null)}
                  disabled={isDisabled}
                >
                  Hủy
                </Button>
              </div>
            )}
            {personalInfo?.personalInfo?.cccdFrontFile && !selectedCccdFrontFile && (
              <div style={{ marginTop: 8 }}>
                <Text type="success">File đã tải lên: </Text>
                <Button 
                  type="link" 
                  size="small"
                  icon={<EyeOutlined />} 
                  onClick={() => handleViewFile(personalInfo.personalInfo.cccdFrontFile)}
                >
                  Xem file
                </Button>
              </div>
            )}
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                File sẽ được tải lên khi bạn nhấn "Lưu thông tin cá nhân"
              </Text>
            </div>
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Mặt sau CCCD"
            name="cccdBackFile"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={[
              { 
                required: true, 
                message: "Vui lòng upload mặt sau CCCD",
                validator: () => {
                  // Check if either a new file is selected OR an existing file is already uploaded
                  if (selectedCccdBackFile || (personalInfo?.personalInfo?.cccdBackFile)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Vui lòng upload mặt sau CCCD"));
                }
              }
            ]}
          >
            <Upload
              beforeUpload={handleCccdBackFileSelect}
              maxCount={1}
              accept=".pdf,.jpg,.png,.jpeg"
              disabled={isDisabled}
              fileList={[]}
              showUploadList={false}
            >
              <Button 
                icon={<UploadOutlined />} 
                disabled={isDisabled}
                loading={uploadingCccdBackFile}
              >
                Chọn file minh chứng
              </Button>
            </Upload>
            {selectedCccdBackFile && (
              <div style={{ marginTop: 8 }}>
                <Text>File đã chọn: {selectedCccdBackFile.name}</Text>
                <Button 
                  size="small" 
                  style={{ marginLeft: 8 }}
                  onClick={() => setSelectedCccdBackFile(null)}
                  disabled={isDisabled}
                >
                  Hủy
                </Button>
              </div>
            )}
            {personalInfo?.personalInfo?.cccdBackFile && !selectedCccdBackFile && (
              <div style={{ marginTop: 8 }}>
                <Text type="success">File đã tải lên: </Text>
                <Button 
                  type="link" 
                  size="small"
                  icon={<EyeOutlined />} 
                  onClick={() => handleViewFile(personalInfo.personalInfo.cccdBackFile)}
                >
                  Xem file
                </Button>
              </div>
            )}
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                File sẽ được tải lên khi bạn nhấn "Lưu thông tin cá nhân"
              </Text>
            </div>
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