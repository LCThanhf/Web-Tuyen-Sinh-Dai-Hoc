import React, { useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, Select, Typography, Row, Col, Divider, Card } from 'antd';
import { SaveOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment'; // Để làm việc với DatePicker

const { Title, Text } = Typography;
const { Option } = Select;

const StudentInfoRegistrationPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(true); // Mặc định cho phép chỉnh sửa ban đầu
  // Dữ liệu giả định về thông tin sinh viên
  const initialValues = {
    fullName: "Nguyễn Văn A",
    dateOfBirth: moment('2007-01-15'),
    gender: "male",
    cccd: "012345678912", // CCCD không cho sửa
    email: "nguyenvana@example.com", // Email không cho sửa
    phone: "0987654321",
    province: "Hà Nội",
    district: "Ba Đình",
    addressDetail: "Số 123, Đường ABC, Phường XYZ",
    highSchoolName: "THPT Chuyên Hà Nội - Amsterdam",
    highSchoolProvince: "Hà Nội",
    graduationYear: "2025",
    conductGrade: "Good",
    gpa12: 8.5,
    priorityArea: "KV1",
    prioritySubject: ["ethnicMinority"], // Ví dụ: người dân tộc thiểu số
  };

  const onFinish = (values: any) => {
    console.log('Thông tin đã lưu:', values);
    // Gửi dữ liệu lên API
    setIsEditing(false); // Sau khi lưu, chuyển sang chế độ xem
    alert('Thông tin đã được lưu thành công!');
  };

  return (
    <div>
      <Title level={3}>Đăng ký thông tin sinh</Title>
      <Text>Vui lòng điền đầy đủ và chính xác các thông tin cá nhân và thông tin ưu tiên của bạn.</Text>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Card title="Thông tin cá nhân" style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                <Radio.Group disabled={!isEditing}>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                  <Radio value="other">Khác</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số CCCD/CMND" name="cccd">
                <Input disabled /> {/* CCCD không được sửa */}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input disabled /> {/* Email không được sửa */}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tỉnh/Thành phố cư trú" name="province" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố!' }]}>
                <Select disabled={!isEditing}>
                  <Option value="Hà Nội">Hà Nội</Option>
                  <Option value="TP.HCM">TP.HCM</Option>
                  {/* Thêm các tỉnh/thành phố khác */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Quận/Huyện cư trú" name="district" rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện!' }]}>
                <Select disabled={!isEditing}>
                  <Option value="Ba Đình">Ba Đình</Option>
                  <Option value="Đống Đa">Đống Đa</Option>
                  {/* Thêm các quận/huyện khác tương ứng với tỉnh/thành phố */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Địa chỉ chi tiết" name="addressDetail" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết!' }]}>
                <Input.TextArea rows={2} disabled={!isEditing} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Thông tin học tập THPT" style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên trường THPT" name="highSchoolName" rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}>
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tỉnh/Thành phố trường THPT" name="highSchoolProvince" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố trường!' }]}>
                <Select disabled={!isEditing}>
                  <Option value="Hà Nội">Hà Nội</Option>
                  <Option value="TP.HCM">TP.HCM</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Năm tốt nghiệp THPT" name="graduationYear" rules={[{ required: true, message: 'Vui lòng nhập năm tốt nghiệp!' }]}>
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hạnh kiểm lớp 12" name="conductGrade" rules={[{ required: true, message: 'Vui lòng chọn hạnh kiểm!' }]}>
                <Select disabled={!isEditing}>
                  <Option value="Good">Tốt</Option>
                  <Option value="Fair">Khá</Option>
                  <Option value="Average">Trung bình</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Điểm trung bình chung lớp 12" name="gpa12" rules={[{ required: true, message: 'Vui lòng nhập điểm TB chung lớp 12!' }]}>
                <Input type="number" step="0.01" disabled={!isEditing} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Thông tin ưu tiên (áp dụng chung)" style={{ marginBottom: 20 }}>
          <Form.Item label="Khu vực ưu tiên" name="priorityArea" rules={[{ required: true, message: 'Vui lòng chọn khu vực ưu tiên!' }]}>
            <Radio.Group disabled={!isEditing}>
              <Radio value="KV1">KV1</Radio>
              <Radio value="KV2-NT">KV2-NT</Radio>
              <Radio value="KV2">KV2</Radio>
              <Radio value="KV3">KV3</Radio>
            </Radio.Group>
            <Text type="secondary"> <InfoCircleOutlined /> *Chọn khu vực nơi thí sinh học tập và có hộ khẩu thường trú.*</Text>
          </Form.Item>
          <Form.Item label="Đối tượng ưu tiên (nếu có)" name="prioritySubject">
            <Select mode="multiple" placeholder="Chọn đối tượng ưu tiên" disabled={!isEditing}>
              <Option value="ethnicMinority">Người dân tộc thiểu số</Option>
              <Option value="woundedSoldierChild">Con thương binh/bệnh binh</Option>
              <Option value="disabledPerson">Người khuyết tật</Option>
              <Option value="martyrChild">Con liệt sĩ</Option>
            </Select>
            <Text type="secondary"> <InfoCircleOutlined /> *Nếu thuộc nhiều diện, hệ thống sẽ áp dụng diện ưu tiên cao nhất.*</Text>
          </Form.Item>
        </Card>

        <Form.Item>
          {isEditing ? (
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
              Lưu thông tin
            </Button>
          ) : (
            <Button type="default" onClick={() => setIsEditing(true)} size="large">
              Chỉnh sửa thông tin
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default StudentInfoRegistrationPage;