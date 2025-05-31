import React, { useEffect } from "react";
import { Form, Input, DatePicker, Radio, Button, message, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Item } = Form;

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
}

const PersonalInfoForm: React.FC = () => {
  const [form] = Form.useForm<PersonalInfo>();

  // Dữ liệu mẫu để hiển thị mặc định
  useEffect(() => {
    form.setFieldsValue({
      fullName: "Nguyễn Văn A",
      dob: dayjs("2000-01-01"),
      gender: "",
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
    });
  }, [form]);

  const onFinish = (values: PersonalInfo) => {
    // Chuyển dob và cccdIssueDate từ dayjs sang string DD/MM/YYYY
    const dataToSave = {
      ...values,
      dob: values.dob.format("DD/MM/YYYY"),
      cccdIssueDate: values.cccdIssueDate.format("DD/MM/YYYY"),
      cccdFrontFile: values.cccdFrontFile ? values.cccdFrontFile.map((file: any) => file.originFileObj) : [],
      cccdBackFile: values.cccdBackFile ? values.cccdBackFile.map((file: any) => file.originFileObj) : [],
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
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
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
            label="Nơi cấp CCCD"
            name="cccdIssuePlace"
            rules={[{ required: true, message: "Vui lòng nhập nơi cấp CCCD" }]}
          >
            <Input />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Ngày cấp CCCD"
            name="cccdIssueDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày cấp CCCD" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
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

            <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Mặt trước CCCD"
            name="cccdFrontFile"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={[{ required: true, message: "Vui lòng upload mặt trước CCCD" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png,.jpeg">
              <Button icon={<UploadOutlined />}>Chọn file</Button>
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
            <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png,.jpeg">
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Item>
        </Col>
      </Row>

      <Item style={{ textAlign: "left", marginTop: 6 }}>
        <Button type="primary" htmlType="submit">
          Lưu thông tin cá nhân
        </Button>
      </Item>
    </Form>
  );
};

export default PersonalInfoForm;