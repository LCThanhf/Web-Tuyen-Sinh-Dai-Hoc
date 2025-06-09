import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Spin, Space, Typography, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { authApi } from '../../services/authApi';
import type { User } from '../../services/authApi';

const { Title, Text } = Typography;

const AdminProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [adminProfile, setAdminProfile] = useState<User | null>(null);

  // Load admin profile data from backend
  useEffect(() => {
    const fetchAdminProfile = async () => {
      setLoading(true);
      try {
        const response = await authApi.getProfile();
        setAdminProfile(response.user); // Extract user from response
        form.setFieldsValue(response.user); // Set default values for form
      } catch (error) {
        console.error('Failed to fetch admin profile:', error);
        message.error('Không thể tải thông tin profile. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [form]);

  // Handle save button click
  const onFinish = async (values: Partial<User>) => {
    setLoading(true);
    try {
      // Call real API to update profile
      const updatedProfile = await authApi.updateProfile({
        fullName: values.fullName!,
        email: values.email!,
        phone: values.phone!,
      });
      
      setAdminProfile(updatedProfile.user); // Extract user from response
      message.success('Cập nhật thông tin cá nhân thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('Cập nhật thông tin thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Vui lòng kiểm tra lại các trường bị lỗi.');
  };

  return (
    <div>
      <Title level={3}>Thông tin cá nhân Admin</Title>
      <Spin spinning={loading} tip="Đang tải/cập nhật thông tin...">
        <Card
          title={
            <Space>
              <UserOutlined />
              Thông tin tài khoản
            </Space>
          }
          extra={
            <Button
              type={isEditing ? 'default' : 'primary'}
              icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => {
                if (isEditing) {
                  form.submit(); // Khi ở chế độ chỉnh sửa, nhấn nút này sẽ submit form
                } else {
                  setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
                }
              }}
              loading={loading}
            >
              {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
            </Button>
          }
          style={{ maxWidth: 800, margin: 'auto' }}
        >
          {adminProfile ? (
            <Form
              form={form}
              layout="vertical"
              name="admin_profile"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={adminProfile}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="ID Admin">
                    <Text strong>{adminProfile.id}</Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="CCCD">
                    <Text strong>{adminProfile.cccd}</Text>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input prefix={<UserOutlined />} disabled={!isEditing} />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ email!' },
                  { type: 'email', message: 'Địa chỉ email không hợp lệ!' },
                ]}
              >
                <Input prefix={<MailOutlined />} disabled={!isEditing} />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input prefix={<PhoneOutlined />} disabled={!isEditing} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Chức vụ/Vai trò">
                    <Text strong>{adminProfile.role}</Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Trạng thái">
                    <Text strong style={{ color: adminProfile.isActive ? '#52c41a' : '#ff4d4f' }}>
                      {adminProfile.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </Text>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Ngày tạo tài khoản">
                <Text type="secondary">
                  {new Date(adminProfile.createdAt).toLocaleString('vi-VN')}
                </Text>
              </Form.Item>

              {/* Nếu không ở chế độ chỉnh sửa, các trường input sẽ disabled */}
              {/* Nút submit sẽ được đặt trong extra của Card */}
            </Form>
          ) : (
            <Text type="secondary">Không thể tải thông tin admin.</Text>
          )}
        </Card>
      </Spin>
    </div>
  );
};

export default AdminProfilePage;