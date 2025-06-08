import React, { useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, Select, Typography, Row, Col, Divider, Card, message, Tabs } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const StudentProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Dữ liệu giả định về thông tin sinh viên
  const initialValues = {
    fullName: "Nguyễn Văn A",
    dateOfBirth: moment('2007-01-15'),
    gender: "male",
    cccd: "012345678912", // CCCD không cho sửa
    cccdIssuePlace: "Hà Nội",
    cccdIssueDate: moment('2018-01-15'),
    email: "nguyenvana@example.com", // Email không cho sửa
    phone: "0987654321",
    province: "Hà Nội",
    district: "Ba Đình",
    addressDetail: "123 Đường ABC, Phường XYZ",
    highSchoolName: "THPT Chuyên Hà Nội - Amsterdam",
    highSchoolProvince: "Hà Nội",
    graduationYear: "2025",
    conductGrade: "Good",
    gpa12: 8.5,
    priorityArea: "KV1",
    prioritySubject: ["ethnicMinority"],
  };

  const handleEditClick = () => {
    navigate('/student/info-registration/personal');
  };

  return (
    <div>
      <Title level={3}>Thông tin cá nhân</Title>
      <Text>Bạn có thể xem thông tin cá nhân của mình tại đây.</Text>
      <Divider />

      <Tabs defaultActiveKey="view">
        <TabPane tab={<span><EyeOutlined /> Xem thông tin</span>} key="view">
          <Card title="Chi tiết thông tin cá nhân" style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Họ và tên:</strong> {initialValues.fullName}</p>
              </Col>
              <Col span={12}>
                <p><strong>Ngày sinh:</strong> {initialValues.dateOfBirth.format('DD/MM/YYYY')}</p>
              </Col>
              <Col span={12}>
                <p><strong>Giới tính:</strong> {initialValues.gender === 'male' ? 'Nam' : 'Nữ'}</p>
              </Col>
              <Col span={12}>
                <p><strong>CCCD:</strong> {initialValues.cccd}</p>
              </Col>
              <Col span={12}>
                <p><strong>Nơi cấp CCCD:</strong> {initialValues.cccdIssuePlace}</p>
              </Col>
              <Col span={12}>
                <p><strong>Ngày cấp CCCD:</strong> {initialValues.cccdIssueDate.format('DD/MM/YYYY')}</p>
              </Col>
              <Col span={12}>
                <p><strong>Email:</strong> {initialValues.email}</p>
              </Col>
              <Col span={12}>
                <p><strong>Số điện thoại:</strong> {initialValues.phone}</p>
              </Col>
              <Col span={12}>
                <p><strong>Tỉnh/Thành phố:</strong> {initialValues.province}</p>
              </Col>
              <Col span={12}>
                <p><strong>Quận/Huyện:</strong> {initialValues.district}</p>
              </Col>
              <Col span={24}>
                <p><strong>Địa chỉ chi tiết:</strong> {initialValues.addressDetail}</p>
              </Col>
            </Row>
          </Card>

          <Card title="Thông tin học vấn" style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Trường THPT:</strong> {initialValues.highSchoolName}</p>
              </Col>
              <Col span={12}>
                <p><strong>Tỉnh/Thành phố (Trường):</strong> {initialValues.highSchoolProvince}</p>
              </Col>
              <Col span={12}>
                <p><strong>Năm tốt nghiệp:</strong> {initialValues.graduationYear}</p>
              </Col>
              <Col span={12}>
                <p><strong>Hạnh kiểm lớp 12:</strong> {initialValues.conductGrade}</p>
              </Col>
              <Col span={12}>
                <p><strong>Điểm trung bình lớp 12:</strong> {initialValues.gpa12}</p>
              </Col>
            </Row>
          </Card>

          <Card title="Thông tin ưu tiên" style={{ marginBottom: 20 }}>
            <p><strong>Khu vực ưu tiên:</strong> {initialValues.priorityArea}</p>
            <p><strong>Đối tượng ưu tiên:</strong>
              {initialValues.prioritySubject.map(item => {
                switch (item) {
                  case 'ethnicMinority': return 'Người dân tộc thiểu số';
                  case 'woundedSoldierChild': return 'Con thương binh/bệnh binh';
                  case 'disabledPerson': return 'Người khuyết tật';
                  case 'martyrChild': return 'Con liệt sĩ';
                  default: return item;
                }
              }).join(', ') || 'Không có'}
            </p>
          </Card>

          <Button type="primary" icon={<EditOutlined />} size="large" onClick={handleEditClick}>
            Chỉnh sửa thông tin
          </Button>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StudentProfilePage;