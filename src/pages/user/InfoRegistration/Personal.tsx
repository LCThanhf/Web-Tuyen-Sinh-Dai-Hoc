import React, { useEffect } from "react";
import { Form, Input, DatePicker, Radio, Button, message, Row, Col } from "antd";
import dayjs from "dayjs";

const { Item } = Form;

interface PersonalInfo {
  fullName: string;
  dob: string;
  gender: string;
  cccd: string;
  email: string;
  phone: string;
  address: string;
  highSchoolName: string;
  city: string;
  district: string;
  graduationYear: number;
}

const PersonalInfoForm: React.FC = () => {
  const [form] = Form.useForm<PersonalInfo>();

  // Dữ liệu mẫu để hiển thị mặc định
  useEffect(() => {
    form.setFieldsValue({
      fullName: "Nguyễn Văn A",
      dob: dayjs("2000-01-01"),
      gender: "male",
      cccd: "123456789",
      email: "nguyenvana@example.com",
      phone: "0912345678",
      address: "123 Đường ABC", // Chỉ địa chỉ cụ thể
      highSchoolName: "THPT Nguyễn Trãi",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      graduationYear: 2018,
    });
  }, [form]);

  const onFinish = (values: PersonalInfo) => {
    // Chuyển dob từ dayjs sang string YYYY-MM-DD
    const dataToSave = {
      ...values,
      dob: values.dob.format("YYYY-MM-DD"),
    };
    console.log("Lưu thông tin cá nhân:", dataToSave);
    message.success("Lưu thông tin cá nhân thành công!");
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 900, margin: "auto", padding: 20, border: "1px solid #e8e8e8", borderRadius: 8 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Ngày sinh"
            name="dob"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
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
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
              <Radio value="other">Khác</Radio>
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
            <Input />
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
            <Input />
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
            <Input />
          </Item>
        </Col>
      </Row>

      {/* Nhóm các trường địa chỉ lại với nhau */}
      <Item
        label="Địa chỉ cụ thể (Số nhà, đường, ...)"
        name="address"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
      >
        <Input />
      </Item>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Tỉnh/Thành phố"
            name="city"
            rules={[{ required: true, message: "Vui lòng nhập tỉnh/thành phố" }]}
          >
            <Input />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
          >
            <Input />
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
            <Input />
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
            <Input />
          </Item>
        </Col>
      </Row>

      <Item style={{ textAlign: "right", marginTop: 20 }}>
        <Button type="primary" htmlType="submit">
          Lưu thông tin cá nhân
        </Button>
      </Item>
    </Form>
  );
};

export default PersonalInfoForm;