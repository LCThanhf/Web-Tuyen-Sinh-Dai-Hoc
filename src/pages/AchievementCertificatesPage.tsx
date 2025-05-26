import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, Typography, Card, Space, Divider, message, Popconfirm } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

interface Achievement {
  id: number;
  type: 'hsg' | 'vocational' | 'foreign_language';
  level?: string; // Cấp độ giải (Quốc gia/Tỉnh)
  awardType?: string; // Loại giải (Nhất/Nhì/Ba/Khuyến khích)
  subject?: string; // Môn/Lĩnh vực
  year?: string; // Năm đạt giải
  vocationalType?: string; // Loại nghề (Giỏi/Khá/TB)
  certificateType?: string; // Loại chứng chỉ (IELTS/TOEFL...)
  score?: number; // Điểm/Band
  issueDate?: moment.Moment; // Ngày cấp
  expiryDate?: moment.Moment; // Ngày hết hạn
  fileList: any[]; // File minh chứng
}

const AchievementCertificatesPage: React.FC = () => {
  const [form] = Form.useForm();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [nextId, setNextId] = useState(1);

  const addAchievement = (type: Achievement['type']) => {
    setAchievements([...achievements, { id: nextId, type, fileList: [] }]);
    setNextId(nextId + 1);
  };

  const removeAchievement = (id: number) => {
    setAchievements(achievements.filter(ach => ach.id !== id));
  };

  const onFinish = (values: any) => {
    console.log('Lưu thành tích và chứng chỉ:', values);
    message.success('Thành tích và chứng chỉ đã được lưu thành công!');
    // Logic gửi dữ liệu lên API
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div>
      <Title level={3}>Quản lý Thành tích & Chứng chỉ</Title>
      <Text>Thêm các giải thưởng, chứng chỉ ngoại ngữ, chứng chỉ nghề phổ thông của bạn để được xem xét cộng điểm.</Text>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {/* Phần giải thưởng Học sinh giỏi & KHKT */}
        <Card title="Giải thưởng Học sinh giỏi & Khoa học kỹ thuật" style={{ marginBottom: 20 }}>
          <Form.List name="hsgAchievements">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Space style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between' }} align="baseline">
                      <Title level={5} style={{ margin: 0 }}>Giải thưởng #{name + 1}</Title>
                      <Popconfirm
                        title="Bạn có chắc muốn xóa giải thưởng này?"
                        onConfirm={() => remove(name)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'level']} label="Cấp độ giải" rules={[{ required: true, message: 'Vui lòng chọn cấp độ!' }]}>
                          <Select placeholder="Chọn cấp độ">
                            <Option value="national">Quốc gia</Option>
                            <Option value="provincial">Cấp tỉnh</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'awardType']} label="Loại giải" rules={[{ required: true, message: 'Vui lòng chọn loại giải!' }]}>
                          <Select placeholder="Chọn loại giải">
                            <Option value="first">Nhất</Option>
                            <Option value="second">Nhì</Option>
                            <Option value="third">Ba</Option>
                            <Option value="consolation">Khuyến khích</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'subject']} label="Môn/Lĩnh vực đạt giải" rules={[{ required: true, message: 'Vui lòng nhập môn/lĩnh vực!' }]}>
                          <Input placeholder="VD: Toán, Vật lý, KHKT" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'year']} label="Năm đạt giải" rules={[{ required: true, message: 'Vui lòng nhập năm!' }]}>
                          <Input placeholder="VD: 2024" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'file']}
                          label="Minh chứng"
                          valuePropName="fileList"
                          getValueFromEvent={normFile}
                          rules={[{ required: true, message: 'Vui lòng tải lên minh chứng!' }]}
                        >
                          <Upload name="file" listType="text" maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Tải file (PDF/JPG/PNG)</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm giải thưởng
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        {/* Phần Chứng chỉ Ngoại ngữ Quốc tế */}
        <Card title="Chứng chỉ Ngoại ngữ Quốc tế" style={{ marginBottom: 20 }}>
          <Form.List name="languageCerts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Space style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between' }} align="baseline">
                      <Title level={5} style={{ margin: 0 }}>Chứng chỉ #{name + 1}</Title>
                      <Popconfirm
                        title="Bạn có chắc muốn xóa chứng chỉ này?"
                        onConfirm={() => remove(name)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'type']} label="Loại chứng chỉ" rules={[{ required: true, message: 'Vui lòng chọn loại chứng chỉ!' }]}>
                          <Select placeholder="Chọn loại chứng chỉ">
                            <Option value="ielts">IELTS</Option>
                            <Option value="toefl">TOEFL iBT</Option>
                            <Option value="toeic">TOEIC</Option>
                            <Option value="vstep">VSTEP</Option>
                            <Option value="other">Khác</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'score']} label="Điểm/Band" rules={[{ required: true, message: 'Vui lòng nhập điểm/band!' }]}>
                          <Input type="number" step="0.1" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'issueDate']} label="Ngày cấp" rules={[{ required: true, message: 'Vui lòng chọn ngày cấp!' }]}>
                          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'expiryDate']} label="Ngày hết hạn" rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}>
                          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'file']}
                          label="Minh chứng"
                          valuePropName="fileList"
                          getValueFromEvent={normFile}
                          rules={[{ required: true, message: 'Vui lòng tải lên minh chứng!' }]}
                        >
                          <Upload name="file" listType="text" maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Tải file (PDF/JPG/PNG)</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm chứng chỉ Ngoại ngữ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        {/* Phần Chứng chỉ nghề phổ thông */}
        <Card title="Chứng chỉ nghề phổ thông" style={{ marginBottom: 20 }}>
          <Form.List name="vocationalCerts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Space style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between' }} align="baseline">
                      <Title level={5} style={{ margin: 0 }}>Chứng chỉ nghề #{name + 1}</Title>
                      <Popconfirm
                        title="Bạn có chắc muốn xóa chứng chỉ này?"
                        onConfirm={() => remove(name)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'rank']} label="Xếp loại" rules={[{ required: true, message: 'Vui lòng chọn xếp loại!' }]}>
                          <Select placeholder="Chọn xếp loại">
                            <Option value="excellent">Giỏi</Option>
                            <Option value="good">Khá</Option>
                            <Option value="average">Trung bình</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'tradeName']} label="Tên nghề" rules={[{ required: true, message: 'Vui lòng nhập tên nghề!' }]}>
                          <Input placeholder="VD: Tin học văn phòng" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'file']}
                          label="Minh chứng"
                          valuePropName="fileList"
                          getValueFromEvent={normFile}
                          rules={[{ required: true, message: 'Vui lòng tải lên minh chứng!' }]}
                        >
                          <Upload name="file" listType="text" maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Tải file (PDF/JPG/PNG)</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm chứng chỉ nghề
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
            Lưu tất cả thành tích & chứng chỉ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AchievementCertificatesPage;