import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Spin, Space, Typography, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Định nghĩa kiểu dữ liệu cho thông tin Admin
interface AdminProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string; // Ví dụ: 'SuperAdmin', 'Officer', 'Viewer'
  lastLogin?: string; // Ngày đăng nhập gần nhất
}

const AdminProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

  // Giả lập tải dữ liệu thông tin Admin
  useEffect(() => {
    const fetchAdminProfile = async () => {
      setLoading(true);
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Dữ liệu giả lập của Admin đang đăng nhập
      const dummyData: AdminProfile = {
        id: 'admin001',
        username: 'admin.hust',
        fullName: 'Nguyễn Minh Anh',
        email: 'minhanh.nguyen@hust.edu.vn',
        phone: '0901122334',
        role: 'SuperAdmin',
        lastLogin: '2025-05-29 09:30:00',
      };
      setAdminProfile(dummyData);
      form.setFieldsValue(dummyData); // Set giá trị mặc định cho form
      setLoading(false);
    };

    fetchAdminProfile();
  }, [form]);

  // Xử lý khi nhấn nút Lưu
  const onFinish = async (values: AdminProfile) => {
    setLoading(true);
    // Giả lập API call để cập nhật thông tin Admin
    await new Promise(resolve => setTimeout(resolve, 800));

    // Trong thực tế, bạn sẽ gửi `values` này lên API backend
    // Ví dụ: await axios.put('/api/admin/profile', values);

    setAdminProfile(values); // Cập nhật state với dữ liệu mới
    message.success('Cập nhật thông tin cá nhân thành công!');
    setIsEditing(false); // Tắt chế độ chỉnh sửa
    setLoading(false);
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
                  <Form.Item label="Tên đăng nhập">
                    <Text strong>{adminProfile.username}</Text>
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

              <Form.Item label="Chức vụ/Vai trò">
                <Text strong>{adminProfile.role}</Text>
              </Form.Item>

              {adminProfile.lastLogin && (
                <Form.Item label="Lần đăng nhập gần nhất">
                  <Text type="secondary">{adminProfile.lastLogin}</Text>
                </Form.Item>
              )}

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