import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Radio, message, Typography, Spin, Alert, Select } from "antd";
import dayjs from "dayjs";
import { authApi } from "../../services/authApi";
import { studentApi } from "../../services/studentApi";

const { Title } = Typography;
const { Option } = Select;

interface ProfileData {
  fullName: string;
  cccd: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  email: string;
  phone: string;
  ethnicity?: string;
  religion?: string;
  cccdIssueDate?: string;
  cccdIssuePlace?: string;
  permanentAddress?: string;
  currentAddress?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
}

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        // Get basic user info from auth API
        const authResponse = await authApi.getProfile();
        const user = authResponse.user;

        // Get detailed personal info from student API
        const personalInfo = await studentApi.getPersonalInfo();

        // Combine data from both sources
        const combinedData: ProfileData = {
          fullName: user.fullName,
          cccd: user.cccd,
          email: user.email,
          phone: user.phone,
          dateOfBirth: personalInfo?.dateOfBirth || '',
          gender: personalInfo?.gender || 'MALE',
          ethnicity: personalInfo?.ethnicity || '',
          religion: personalInfo?.religion || '',
          cccdIssueDate: personalInfo?.cccdIssueDate || '',
          cccdIssuePlace: personalInfo?.cccdIssuePlace || '',
          permanentAddress: personalInfo?.permanentAddress || '',
          currentAddress: personalInfo?.currentAddress || '',
          guardianName: personalInfo?.guardianName || '',
          guardianPhone: personalInfo?.guardianPhone || '',
          guardianRelation: personalInfo?.guardianRelation || '',
        };

        setProfileData(combinedData);

        // Set form values
        form.setFieldsValue({
          ...combinedData,
          dateOfBirth: combinedData.dateOfBirth ? dayjs(combinedData.dateOfBirth) : null,
          cccdIssueDate: combinedData.cccdIssueDate ? dayjs(combinedData.cccdIssueDate) : null,
        });

      } catch (err: any) {
        console.error('Error loading profile data:', err);
        setError(err.response?.data?.message || 'Không thể tải thông tin hồ sơ');
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfileData();
  }, [form]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      setError(null);

      // Format dates for API
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : '',
        cccdIssueDate: values.cccdIssueDate ? values.cccdIssueDate.format('YYYY-MM-DD') : '',
      };

      // Update personal info via student API
      await studentApi.updatePersonalInfo(formattedValues);

      message.success("Cập nhật thông tin cá nhân thành công!");
      
      // Update local state
      setProfileData({ ...profileData, ...formattedValues });

    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.message || 'Không thể cập nhật thông tin';
      message.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ maxWidth: 600, margin: "auto", padding: 20, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải thông tin hồ sơ...</div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <Title level={3}>Thông tin cá nhân</Title>
      
      {error && (
        <Alert
          message="Có lỗi xảy ra"
          description={error}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          closable
          onClose={() => setError(null)}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
            name="dateOfBirth"
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
              <Radio value="MALE">Nam</Radio>
              <Radio value="FEMALE">Nữ</Radio>
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

          <Form.Item
            label="Dân tộc"
            name="ethnicity"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tôn giáo"
            name="religion"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày cấp CCCD"
            name="cccdIssueDate"
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Nơi cấp CCCD"
            name="cccdIssuePlace"
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item
          label="Địa chỉ thường trú"
          name="permanentAddress"
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Địa chỉ hiện tại"
          name="currentAddress"
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Tên người giám hộ"
            name="guardianName"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="SĐT người giám hộ"
            name="guardianPhone"
            rules={[
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại phải 10 hoặc 11 chữ số",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Quan hệ với người giám hộ"
            name="guardianRelation"
          >
            <Select placeholder="Chọn mối quan hệ">
              <Option value="Cha">Cha</Option>
              <Option value="Mẹ">Mẹ</Option>
              <Option value="Anh/Chị">Anh/Chị</Option>
              <Option value="Ông/Bà">Ông/Bà</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
