import React, { useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, Select, Typography, Row, Col, Divider, Card, message, Tabs } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const StudentProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('view'); // Tab mặc định là xem

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
    prioritySubject: ["ethnicMinority"],
  };

  const onFinish = (values: any) => {
    console.log('Thông tin đã cập nhật:', values);
    // Gửi dữ liệu lên API
    message.success('Thông tin đã được cập nhật thành công!');
    setActiveTab('view'); // Sau khi lưu, chuyển về chế độ xem
  };

  return (
    <div>
      <Title level={3}>Thông tin cá nhân</Title>
      <Text>Bạn có thể xem và chỉnh sửa thông tin cá nhân của mình tại đây.</Text>
      <Divider />

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
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
                <p><strong>Giới tính:</strong> {initialValues.gender === 'male' ? 'Nam' : initialValues.gender === 'female' ? 'Nữ' : 'Khác'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Số CCCD/CMND:</strong> {initialValues.cccd}</p>
              </Col>
              <Col span={12}>
                <p><strong>Email:</strong> {initialValues.email}</p>
              </Col>
              <Col span={12}>
                <p><strong>Số điện thoại:</strong> {initialValues.phone}</p>
              </Col>
              <Col span={24}>
                <p><strong>Địa chỉ:</strong> {initialValues.addressDetail}, {initialValues.district}, {initialValues.province}</p>
              </Col>
            </Row>
          </Card>

          <Card title="Thông tin học tập THPT" style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Tên trường THPT:</strong> {initialValues.highSchoolName}</p>
              </Col>
              <Col span={12}>
                <p><strong>Tỉnh/Thành phố trường THPT:</strong> {initialValues.highSchoolProvince}</p>
              </Col>
              <Col span={12}>
                <p><strong>Năm tốt nghiệp THPT:</strong> {initialValues.graduationYear}</p>
              </Col>
              <Col span={12}>
                <p><strong>Hạnh kiểm lớp 12:</strong> {initialValues.conductGrade === 'Good' ? 'Tốt' : initialValues.conductGrade === 'Fair' ? 'Khá' : 'Trung bình'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Điểm trung bình chung lớp 12:</strong> {initialValues.gpa12}</p>
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

          <Button type="primary" icon={<EditOutlined />} size="large" onClick={() => setActiveTab('edit')}>
            Chỉnh sửa thông tin
          </Button>
        </TabPane>

        <TabPane tab={<span><EditOutlined /> Chỉnh sửa thông tin</span>} key="edit">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialValues}
          >
            <Card title="Chỉnh sửa thông tin cá nhân" style={{ marginBottom: 20 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                    <Radio.Group>
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
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Tỉnh/Thành phố cư trú" name="province" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố!' }]}>
                    <Select>
                      <Option value="Hà Nội">Hà Nội</Option>
                      <Option value="TP.HCM">TP.HCM</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Quận/Huyện cư trú" name="district" rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện!' }]}>
                    <Select>
                      <Option value="Ba Đình">Ba Đình</Option>
                      <Option value="Đống Đa">Đống Đa</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Địa chỉ chi tiết" name="addressDetail" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết!' }]}>
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Chỉnh sửa thông tin học tập THPT" style={{ marginBottom: 20 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Tên trường THPT" name="highSchoolName" rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tỉnh/Thành phố trường THPT" name="highSchoolProvince" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố trường!' }]}>
                    <Select>
                      <Option value="Hà Nội">Hà Nội</Option>
                      <Option value="TP.HCM">TP.HCM</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Năm tốt nghiệp THPT" name="graduationYear" rules={[{ required: true, message: 'Vui lòng nhập năm tốt nghiệp!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Hạnh kiểm lớp 12" name="conductGrade" rules={[{ required: true, message: 'Vui lòng chọn hạnh kiểm!' }]}>
                    <Select>
                      <Option value="Good">Tốt</Option>
                      <Option value="Fair">Khá</Option>
                      <Option value="Average">Trung bình</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Điểm trung bình chung lớp 12" name="gpa12" rules={[{ required: true, message: 'Vui lòng nhập điểm TB chung lớp 12!' }]}>
                    <Input type="number" step="0.01" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Chỉnh sửa thông tin ưu tiên" style={{ marginBottom: 20 }}>
              <Form.Item label="Khu vực ưu tiên" name="priorityArea" rules={[{ required: true, message: 'Vui lòng chọn khu vực ưu tiên!' }]}>
                <Radio.Group>
                  <Radio value="KV1">KV1</Radio>
                  <Radio value="KV2-NT">KV2-NT</Radio>
                  <Radio value="KV2">KV2</Radio>
                  <Radio value="KV3">KV3</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Đối tượng ưu tiên (nếu có)" name="prioritySubject">
                <Select mode="multiple" placeholder="Chọn đối tượng ưu tiên">
                  <Option value="ethnicMinority">Người dân tộc thiểu số</Option>
                  <Option value="woundedSoldierChild">Con thương binh/bệnh binh</Option>
                  <Option value="disabledPerson">Người khuyết tật</Option>
                  <Option value="martyrChild">Con liệt sĩ</Option>
                </Select>
              </Form.Item>
            </Card>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                Lưu thay đổi
              </Button>
              <Button type="default" size="large" style={{ marginLeft: 10 }} onClick={() => { form.resetFields(); setActiveTab('view'); }}>
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StudentProfilePage;