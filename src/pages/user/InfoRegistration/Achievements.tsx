// import React from "react";
// import { Form, Select, Upload, Button, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const { Option } = Select;

// const achievementTypes = [
//   "Học sinh giỏi tỉnh",
//   "Học sinh giỏi quốc gia",
// ];

// const certificateTypes = [
//   "Chứng chỉ TOEFL",
//   "Chứng chỉ IELTS",
//   "Chứng chỉ TOEIC",
//   "Chứng chỉ Cambridge",
// ];

// const AchievementsCerts: React.FC = () => {
//   const [form] = Form.useForm();

//   const onFinish = (values: any) => {
//     console.log("Thông tin thành tích & chứng chỉ:", values);
//     message.success("Lưu thành tích & chứng chỉ thành công!");
//     form.resetFields();
//   };

//   return (
//     <Form
//       form={form}
//       layout="vertical"
//       onFinish={onFinish}
//       style={{ maxWidth: 600, margin: "auto", padding: 20 }}
//     >
//       <Form.Item
//         label="Loại thành tích"
//         name="achievementType"
//         rules={[{ required: true, message: "Vui lòng chọn loại thành tích" }]}
//       >
//         <Select placeholder="Chọn loại thành tích" allowClear>
//           {achievementTypes.map((item) => (
//             <Option key={item} value={item}>
//               {item}
//             </Option>
//           ))}
//         </Select>
//       </Form.Item>

//       <Form.Item
//         label="File minh chứng thành tích"
//         name="achievementFile"
//         valuePropName="fileList"
//         getValueFromEvent={(e: any) => e && e.fileList}
//         rules={[{ required: true, message: "Vui lòng upload file minh chứng thành tích" }]}
//       >
//         <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
//           <Button icon={<UploadOutlined />}>Chọn file</Button>
//         </Upload>
//       </Form.Item>

//       <Form.Item
//         label="Loại chứng chỉ ngoại ngữ"
//         name="certificateType"
//         rules={[{ required: true, message: "Vui lòng chọn loại chứng chỉ" }]}
//       >
//         <Select placeholder="Chọn loại chứng chỉ" allowClear>
//           {certificateTypes.map((item) => (
//             <Option key={item} value={item}>
//               {item}
//             </Option>
//           ))}
//         </Select>
//       </Form.Item>

//       <Form.Item
//         label="File minh chứng chứng chỉ"
//         name="certificateFile"
//         valuePropName="fileList"
//         getValueFromEvent={(e: any) => e && e.fileList}
//         rules={[{ required: true, message: "Vui lòng upload file minh chứng chứng chỉ" }]}
//       >
//         <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
//           <Button icon={<UploadOutlined />}>Chọn file</Button>
//         </Upload>
//       </Form.Item>

//       <Form.Item>
//         <Button type="primary" htmlType="submit" block>
//           Lưu thành tích & chứng chỉ
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default AchievementsCerts;





import React from "react";
import {
  Form,
  Select,
  Upload,
  Button,
  message,
  Input,
  DatePicker,
  Radio,
  Col,
  Row,
  Space,
  Tabs,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;
const { Group: RadioGroup } = Radio;
const { TabPane } = Tabs;

// Danh sách các loại thành tích
const achievementTypes = [
  "Thí sinh đạt giải HSG tỉnh/TP",
  "Thí sinh tham gia kỳ thi HSG quốc gia",
];

// Danh sách các loại giải cho HSG tỉnh/TP (không xét Khuyến Khích)
const provincialAwardRanks = ["Giải Nhất", "Giải Nhì", "Giải Ba"];

// Danh sách các loại giải cho HSG Quốc gia (tất cả các loại)
const nationalAwardRanks = ["Giải Nhất", "Giải Nhì", "Giải Ba", "Giải Khuyến Khích"];

// Danh sách các loại chứng chỉ tiếng Anh
const englishCertificateTypes = [
  { label: "IELTS", value: "IELTS", minScore: 5.5 },
  { label: "TOEFL iBT", value: "TOEFL iBT", minScore: 65 },
  { label: "TOEFL ITP", value: "TOEFL ITP", minScore: 513 },
];

// Các đơn vị cấp phổ biến
const certificateIssuers = [
  { label: "British Council", value: "British Council" },
  { label: "IDP Education", value: "IDP Education" },
  { label: "ETS", value: "ETS" },
  { label: "IIG Việt Nam", value: "IIG Việt Nam" },
  { label: "Khác", value: "Khác" },
];

const AchievementsCerts: React.FC = () => {
  const [form] = Form.useForm();
  const achievementType = Form.useWatch("achievementType", form);
  const selectedCertType = Form.useWatch("certificateType", form);
  const selectedIssuer = Form.useWatch("certificateIssuer", form);

  const onFinish = (values: any) => {
    console.log("Thông tin thành tích & chứng chỉ:", values);
    message.success("Lưu thông tin thành công!");
    // form.resetFields(); // Có thể bỏ comment nếu muốn reset form sau khi submit
  };

  // Custom validation cho điểm chứng chỉ
  const validateCertificateScore = (_: any, value: number) => {
    if (!selectedCertType || value === undefined || value === null) {
      return Promise.resolve(); // Không bắt buộc nếu không chọn loại chứng chỉ hoặc chưa nhập điểm
    }
    const certInfo = englishCertificateTypes.find(
      (cert) => cert.value === selectedCertType
    );
    if (certInfo && value < certInfo.minScore) {
      return Promise.reject(
        `Điểm thi phải đạt tối thiểu ${certInfo.minScore} cho loại chứng chỉ này.`
      );
    }
    return Promise.resolve();
  };

  // Custom validation cho file upload
  const validateFileUpload = (_: any, value: any) => {
    console.log('Validating file upload:', value);
    
    if (!value || value.length === 0) {
      return Promise.reject("Vui lòng upload file");
    }
    
    // Kiểm tra xem có file nào đã được chọn không
    const hasValidFile = value.some((file: any) => {
      console.log('File object:', file);
      return file && (file.originFileObj || file.url || file.name);
    });
    
    if (!hasValidFile) {
      return Promise.reject("Vui lòng chọn file hợp lệ");
    }
    
    return Promise.resolve();
  };

  const getAwardRanks = (type: string | undefined) => {
    if (type === "Thí sinh đạt giải HSG tỉnh/TP") {
      return provincialAwardRanks;
    }
    if (type === "Thí sinh tham gia kỳ thi HSG quốc gia") {
      return nationalAwardRanks;
    }
    return [];
  };

  // Custom normalization cho file upload
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 800, margin: "auto", padding: 20 }}
      scrollToFirstError
    >
      <Tabs defaultActiveKey="achievements" centered size="large">
        {/* --- Tab THÔNG TIN THÀNH TÍCH HỌC SINH GIỎI --- */}
        <TabPane tab="Thành tích Học sinh Giỏi" key="achievements">
          <h3 style={{ marginBottom: 15, textAlign: 'center', color: '#1890ff' }}>
            Thông tin Thành tích Học sinh Giỏi
          </h3>
          <p style={{ marginBottom: 10, fontSize: '14px', color: '#555' }}>
            Cung cấp thông tin thành tích đạt được trong các kỳ thi Học sinh Giỏi.
          </p>
          <p style={{ marginBottom: 20, fontSize: '14px', fontWeight: 'bold' }}>
            Quy định cộng điểm:
            <ul>
              <li><strong style={{color: '#1890ff'}}>HSG cấp tỉnh/TP:</strong>
                <ul>
                  <li>Giải Nhất: Cộng 1.0 điểm</li>
                  <li>Giải Nhì: Cộng 0.75 điểm</li>
                  <li>Giải Ba: Cộng 0.25 điểm</li>
                </ul>
              </li>
              <li><strong style={{color: '#1890ff'}}>HSG cấp Quốc gia:</strong> Cộng 2.0 điểm (áp dụng cho tất cả loại giải).</li>
            </ul>
          </p>

          <Form.Item
            label="Loại thành tích"
            name="achievementType"
            tooltip="Vui lòng chọn loại thành tích đạt được để điền thông tin chi tiết."
            rules={[{ required: false }]} // Không bắt buộc ngay từ đầu
          >
            <Select placeholder="Chọn loại thành tích (nếu có)" allowClear>
              {achievementTypes.map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {achievementType && (
            <>
              <Row gutter={16}> {/* Chia thành 2 cột */}
                <Col span={12}>
                  <Form.Item
                    label="Môn đạt giải"
                    name="achievementSubject"
                    rules={[{ required: true, message: "Vui lòng nhập môn đạt giải" }]}
                  >
                    <Input placeholder="Ví dụ: Toán, Ngữ văn..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Năm đạt giải"
                    name="achievementYear"
                    rules={[{ required: true, message: "Vui lòng chọn năm đạt giải" }]}
                  >
                    <DatePicker
                      picker="year"
                      placeholder="Chọn năm"
                      style={{ width: "100%" }}
                      disabledDate={(current) => {
                        return current && current.year() > moment().year();
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Loại giải"
                name="achievementRank"
                rules={[{ required: true, message: "Vui lòng chọn loại giải" }]}
              >
                <RadioGroup>
                  <Space direction="vertical">
                    {getAwardRanks(achievementType).map((rank) => (
                      <Radio key={rank} value={rank}>
                        {rank}
                      </Radio>
                    ))}
                  </Space>
                </RadioGroup>
              </Form.Item>

              <Form.Item
                label="Bằng khen/Giấy chứng nhận đính kèm"
                name="achievementCertificateFile"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng upload bằng khen/giấy chứng nhận",
                  },
                ]}
              >
                <Upload 
                  beforeUpload={() => false} 
                  maxCount={1} 
                  accept=".pdf,.jpg,.png,.jpeg"
                  listType="text"
                  onChange={(info) => {
                    console.log('Upload onChange:', info);
                    // Trigger form validation sau khi file thay đổi
                    setTimeout(() => {
                      form.validateFields(['achievementCertificateFile']);
                    }, 100);
                  }}
                >
                  <Button icon={<UploadOutlined />}>Chọn file (PDF/JPG/PNG)</Button>
                </Upload>
                <p className="ant-upload-hint" style={{ fontSize: '12px', color: '#888' }}>
                  Chỉ chấp nhận định dạng PDF, JPG, PNG. Kích thước tệp tối đa: 5MB.
                </p>
              </Form.Item>
            </>
          )}
        </TabPane>

        {/* --- Tab THÔNG TIN CHỨNG CHỈ TIẾNG ANH QUỐC TẾ --- */}
        <TabPane tab="Chứng chỉ Tiếng Anh Quốc tế" key="englishCertificates">
          <h3 style={{ marginBottom: 15, textAlign: 'center', color: '#1890ff' }}>
            Thông tin Chứng chỉ Tiếng Anh Quốc tế
          </h3>
          <p style={{ marginBottom: 10, fontSize: '14px', color: '#555' }}>
            Cung cấp thông tin chứng chỉ tiếng Anh quốc tế để được **cộng điểm ưu tiên** vào tổng điểm xét tuyển.
          </p>
          <p style={{ marginBottom: 20, fontSize: '14px', fontWeight: 'bold' }}>
            Quy định cộng điểm:
            <ul>
              <li>IELTS 5.0 - 6.0 (hoặc tương đương TOEFL iBT 65-80, TOEFL ITP 513-549): <strong style={{color: '#1890ff'}}>Cộng 0.5 điểm</strong>.</li>
              <li>IELTS 6.5 trở lên (hoặc tương đương TOEFL iBT 81+, TOEFL ITP 550+): <strong style={{color: '#1890ff'}}>Cộng 1.0 điểm</strong>.</li>
            </ul>
            <span style={{ fontSize: '12px', color: '#e74c3c' }}>
              *Lưu ý: Chứng chỉ hợp lệ phải có điểm tối thiểu IELTS 5.5, TOEFL iBT 65, TOEFL ITP 513 và còn hiệu lực.
            </span>
          </p>

          <Form.Item
            label="Loại Chứng chỉ"
            name="certificateType"
            rules={[{ required: false }]} // Không bắt buộc ngay từ đầu
          >
            <RadioGroup>
              <Space>
                {englishCertificateTypes.map((type) => (
                  <Radio key={type.value} value={type.value}>
                    {type.label}
                  </Radio>
                ))}
              </Space>
            </RadioGroup>
          </Form.Item>

          {selectedCertType && (
            <>
              <Row gutter={16}> {/* Chia thành 2 cột */}
                <Col span={12}>
                  <Form.Item
                    label="Điểm Thi"
                    name="certificateScore"
                    rules={[
                      { required: true, message: "Vui lòng nhập điểm thi" },
                      { type: "number", message: "Điểm thi phải là số" },
                      { validator: validateCertificateScore }, // Áp dụng custom validation
                    ]}
                  >
                    <Input
                      type="number"
                      step="0.5" // Cho phép nhập số thập phân
                      placeholder={`Tối thiểu ${englishCertificateTypes.find(c => c.value === selectedCertType)?.minScore}`}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Ngày Cấp Chứng chỉ"
                    name="certificateIssueDate"
                    rules={[{ required: true, message: "Vui lòng chọn ngày cấp chứng chỉ" }]}
                  >
                    <DatePicker
                      placeholder="Chọn ngày cấp"
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      disabledDate={(current) => {
                        return current && current > moment().endOf('day');
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}> {/* Chia thành 2 cột */}
                <Col span={12}>
                  <Form.Item
                    label="Mã Dự Thi / Số Đăng Ký"
                    name="examRegistrationNumber"
                    rules={[{ required: true, message: "Vui lòng nhập mã dự thi / số đăng ký" }]}
                    tooltip="Mã số này giúp trường xác minh chứng chỉ của bạn."
                  >
                    <Input placeholder="Nhập mã số trên chứng chỉ" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Đơn vị Cấp"
                    name="certificateIssuer"
                    rules={[{ required: true, message: "Vui lòng chọn đơn vị cấp" }]}
                  >
                    <Select placeholder="Chọn đơn vị cấp chứng chỉ" allowClear>
                      {certificateIssuers.map((issuer) => (
                        <Option key={issuer.value} value={issuer.value}>
                          {issuer.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {selectedIssuer === "Khác" && (
                <Form.Item
                  label="Tên đơn vị cấp khác"
                  name="otherIssuerName"
                  rules={[{ required: true, message: "Vui lòng nhập tên đơn vị cấp" }]}
                >
                  <Input placeholder="Nhập tên đơn vị cấp chứng chỉ khác" />
                </Form.Item>
              )}

              <Form.Item
                label="Chứng chỉ đính kèm (Bản scan/ảnh)"
                name="certificateFile"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng upload bản scan/ảnh chứng chỉ",
                  },
                ]}
              >
                <Upload 
                  beforeUpload={() => false} 
                  maxCount={1} 
                  accept=".pdf,.jpg,.png,.jpeg"
                  listType="text"
                  onChange={(info) => {
                    console.log('Certificate upload onChange:', info);
                    // Trigger form validation sau khi file thay đổi
                    setTimeout(() => {
                      form.validateFields(['certificateFile']);
                    }, 100);
                  }}
                >
                  <Button icon={<UploadOutlined />}>Chọn file (PDF/JPG/PNG)</Button>
                </Upload>
                <p className="ant-upload-hint" style={{ fontSize: '12px', color: '#888' }}>
                  Chỉ chấp nhận định dạng PDF, JPG, PNG. Kích thước tệp tối đa: 5MB.
                </p>
              </Form.Item>
            </>
          )}
        </TabPane>
      </Tabs>

      <Form.Item style={{ marginTop: 30, textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" size="large">
          Lưu thông tin
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AchievementsCerts;



// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Select,
//   Upload,
//   Button,
//   message,
//   Input,
//   DatePicker,
//   Radio,
//   Col,
//   Row,
//   Space,
//   Tabs,
//   Table,
//   Tag,
//   Modal,
// } from "antd";
// import { UploadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
// import dayjs from "dayjs"; // Sử dụng dayjs thay vì moment

// const { Option } = Select;
// const { TabPane } = Tabs;
// const { confirm } = Modal;

// // Định nghĩa kiểu dữ liệu cho FileUpload (để đồng bộ với Ant Design Upload component)
// interface FileUpload {
//   uid: string;
//   name: string;
//   status: 'done' | 'uploading' | 'error' | 'removed';
//   url?: string; // Trong thực tế sẽ là URL của file trên server
//   originFileObj?: File; // Đối tượng file gốc, thường có khi người dùng chọn file
// }

// // Định nghĩa kiểu dữ liệu cho Thành tích HSG
// interface Achievement {
//   id: string;
//   achievementType: string;
//   achievementSubject: string;
//   achievementYear: string; // Lưu dưới dạng string để đơn giản hóa localStorage
//   achievementRank: string;
//   achievementCertificateFile?: FileUpload[]; // FileUpload[] để tương thích với Ant Design Upload
//   status: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
//   reason?: string;
// }

// // Định nghĩa kiểu dữ liệu cho Chứng chỉ Tiếng Anh
// interface EnglishCertificate {
//   id: string;
//   certificateType: string;
//   certificateScore: number;
//   certificateIssueDate: string; // Lưu dưới dạng string để đơn giản hóa localStorage
//   examRegistrationNumber: string;
//   certificateIssuer: string;
//   otherIssuerName?: string;
//   certificateFile?: FileUpload[]; // FileUpload[] để tương thích với Ant Design Upload
//   status: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
//   reason?: string;
// }

// // Định nghĩa kiểu dữ liệu tổng hợp để lưu vào Local Storage
// interface AchievementsCertsData {
//   achievements: Achievement[];
//   englishCertificates: EnglishCertificate[];
// }

// // Dữ liệu options
// const achievementTypes = [
//   "Thí sinh đạt giải HSG tỉnh/TP",
//   "Thí sinh tham gia kỳ thi HSG quốc gia",
// ];

// const provincialAwardRanks = ["Giải Nhất", "Giải Nhì", "Giải Ba"];
// const nationalAwardRanks = ["Giải Nhất", "Giải Nhì", "Giải Ba", "Giải Khuyến Khích"];

// const englishCertificateTypes = [
//   { label: "IELTS", value: "IELTS", minScore: 5.5 },
//   { label: "TOEFL iBT", value: "TOEFL iBT", minScore: 65 },
//   { label: "TOEFL ITP", value: "TOEFL ITP", minScore: 513 },
// ];

// const certificateIssuers = [
//   { label: "British Council", value: "British Council" },
//   { label: "IDP Education", value: "IDP Education" },
//   { label: "ETS", value: "ETS" },
//   { label: "IIG Việt Nam", value: "IIG Việt Nam" },
//   { label: "Khác", value: "Khác" },
// ];

// const LOCAL_STORAGE_KEY = "achievementsCertsData";

// const AchievementsCerts: React.FC = () => {
//   const [form] = Form.useForm();
//   const achievementType = Form.useWatch("achievementType", form);
//   const selectedCertType = Form.useWatch("certificateType", form);
//   const selectedIssuer = Form.useWatch("certificateIssuer", form);

//   const [achievements, setAchievements] = useState<Achievement[]>([]);
//   const [englishCertificates, setEnglishCertificates] = useState<EnglishCertificate[]>([]);

//   const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
//   const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);

//   // Load dữ liệu từ localStorage khi component mount
//   useEffect(() => {
//     const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
//     if (savedData) {
//       const parsed: AchievementsCertsData = JSON.parse(savedData);
//       setAchievements(parsed.achievements || []);
//       setEnglishCertificates(parsed.englishCertificates || []);
//     }
//   }, []);

//   // Lưu dữ liệu vào localStorage mỗi khi achievements hoặc englishCertificates thay đổi
//   useEffect(() => {
//     const dataToSave: AchievementsCertsData = {
//       achievements: achievements,
//       englishCertificates: englishCertificates,
//     };
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
//   }, [achievements, englishCertificates]);

//   const onFinish = (values: any) => {
//     let savedSuccessfully = false;

//     // Xử lý form thành tích
//     if (values.achievementType) {
//       const newAchievement: Achievement = {
//         id: editingAchievementId || dayjs().valueOf().toString(), // Sử dụng timestamp làm ID
//         achievementType: values.achievementType,
//         achievementSubject: values.achievementSubject,
//         achievementYear: values.achievementYear ? dayjs(values.achievementYear).format("YYYY") : '',
//         achievementRank: values.achievementRank,
//         // Lưu fileList dạng chuẩn cho Upload, không phải chỉ tên file
//         achievementCertificateFile: values.achievementCertificateFile,
//         status: "Chờ duyệt",
//       };

//       if (editingAchievementId) {
//         setAchievements(prev => prev.map(a => a.id === editingAchievementId ? newAchievement : a));
//         message.success("Cập nhật thành tích thành công!");
//         setEditingAchievementId(null);
//       } else {
//         setAchievements(prev => [...prev, newAchievement]);
//         message.success("Lưu thành tích thành công!");
//       }
//       // Reset chỉ các trường liên quan đến thành tích
//       form.resetFields(["achievementType", "achievementSubject", "achievementYear", "achievementRank", "achievementCertificateFile"]);
//       savedSuccessfully = true;
//     }

//     // Xử lý form chứng chỉ tiếng Anh
//     if (values.certificateType) {
//       const newCertificate: EnglishCertificate = {
//         id: editingCertificateId || dayjs().valueOf().toString(), // Sử dụng timestamp làm ID
//         certificateType: values.certificateType,
//         certificateScore: values.certificateScore,
//         certificateIssueDate: values.certificateIssueDate ? dayjs(values.certificateIssueDate).format("YYYY-MM-DD") : '',
//         examRegistrationNumber: values.examRegistrationNumber,
//         certificateIssuer: values.certificateIssuer,
//         otherIssuerName: values.otherIssuerName,
//         // Lưu fileList dạng chuẩn cho Upload, không phải chỉ tên file
//         certificateFile: values.certificateFile,
//         status: "Chờ duyệt",
//       };

//       if (editingCertificateId) {
//         setEnglishCertificates(prev => prev.map(c => c.id === editingCertificateId ? newCertificate : c));
//         message.success("Cập nhật chứng chỉ thành công!");
//         setEditingCertificateId(null);
//       } else {
//         setEnglishCertificates(prev => [...prev, newCertificate]);
//         message.success("Lưu chứng chỉ thành công!");
//       }
//       // Reset chỉ các trường liên quan đến chứng chỉ
//       form.resetFields(["certificateType", "certificateScore", "certificateIssueDate", "examRegistrationNumber", "certificateIssuer", "otherIssuerName", "certificateFile"]);
//       savedSuccessfully = true;
//     }

//     if (!savedSuccessfully) {
//         message.warning("Vui lòng điền thông tin vào ít nhất một tab để lưu.");
//     }
//   };

//   // Custom validation cho điểm chứng chỉ
//   const validateCertificateScore = (_: any, value: number) => {
//     if (!selectedCertType || value === undefined || value === null) {
//       return Promise.resolve();
//     }
//     const certInfo = englishCertificateTypes.find(
//       (cert) => cert.value === selectedCertType
//     );
//     if (certInfo && value < certInfo.minScore) {
//       return Promise.reject(
//         `Điểm thi phải đạt tối thiểu ${certInfo.minScore} cho loại chứng chỉ này.`
//       );
//     }
//     return Promise.resolve();
//   };

//   const getAwardRanks = (type: string | undefined) => {
//     if (type === "Thí sinh đạt giải HSG tỉnh/TP") {
//       return provincialAwardRanks;
//     }
//     if (type === "Thí sinh tham gia kỳ thi HSG quốc gia") {
//       return nationalAwardRanks;
//     }
//     return [];
//   };

//   // --- Các hàm xử lý chỉnh sửa/xóa cho Bảng Thành tích ---
//   const handleEditAchievement = (record: Achievement) => {
//     setEditingAchievementId(record.id);
//     setEditingCertificateId(null); // Đảm bảo không chỉnh sửa chứng chỉ cùng lúc
//     form.setFieldsValue({
//       ...record,
//       // Chuyển đổi string năm thành Dayjs object
//       achievementYear: record.achievementYear ? dayjs(record.achievementYear, "YYYY") : null,
//       // Đảm bảo fileList được set đúng để hiển thị trong Upload component
//       achievementCertificateFile: record.achievementCertificateFile || [],
//     });
//     form.setFieldsValue({ _activeTab: 'achievements' }); // Điều hướng sang tab Thành tích
//   };

//   const handleDeleteAchievement = (id: string) => {
//     confirm({
//       title: 'Bạn có chắc chắn muốn xóa thành tích này?',
//       icon: <ExclamationCircleOutlined />,
//       content: 'Thao tác này không thể hoàn tác.',
//       okText: 'Xóa',
//       okType: 'danger',
//       cancelText: 'Hủy',
//       onOk() {
//         setAchievements(prev => prev.filter(a => a.id !== id));
//         message.success("Xóa thành tích thành công!");
//         if (editingAchievementId === id) {
//           form.resetFields();
//           setEditingAchievementId(null);
//         }
//       },
//     });
//   };

//   // --- Các hàm xử lý chỉnh sửa/xóa cho Bảng Chứng chỉ ---
//   const handleEditCertificate = (record: EnglishCertificate) => {
//     setEditingCertificateId(record.id);
//     setEditingAchievementId(null); // Đảm bảo không chỉnh sửa thành tích cùng lúc
//     form.setFieldsValue({
//       ...record,
//       // Chuyển đổi string ngày tháng thành Dayjs object
//       certificateIssueDate: record.certificateIssueDate ? dayjs(record.certificateIssueDate) : null,
//       // Đảm bảo fileList được set đúng để hiển thị trong Upload component
//       certificateFile: record.certificateFile || [],
//     });
//     form.setFieldsValue({ _activeTab: 'englishCertificates' }); // Điều hướng sang tab Chứng chỉ
//   };

//   const handleDeleteCertificate = (id: string) => {
//     confirm({
//       title: 'Bạn có chắc chắn muốn xóa chứng chỉ này?',
//       icon: <ExclamationCircleOutlined />,
//       content: 'Thao tác này không thể hoàn tác.',
//       okText: 'Xóa',
//       okType: 'danger',
//       cancelText: 'Hủy',
//       onOk() {
//         setEnglishCertificates(prev => prev.filter(c => c.id !== id));
//         message.success("Xóa chứng chỉ thành công!");
//         if (editingCertificateId === id) {
//           form.resetFields();
//           setEditingCertificateId(null);
//         }
//       },
//     });
//   };

//   // Mô phỏng trạng thái duyệt của admin (chỉ để xem giao diện)
//   const simulateAdminAction = (type: 'achievement' | 'certificate', id: string, status: "Đã duyệt" | "Từ chối", reason?: string) => {
//     if (type === 'achievement') {
//       setAchievements(prev => prev.map(a => a.id === id ? { ...a, status, reason: status === "Từ chối" ? reason : undefined } : a));
//     } else {
//       setEnglishCertificates(prev => prev.map(c => c.id === id ? { ...c, status, reason: status === "Từ chối" ? reason : undefined } : c));
//     }
//     message.info(`Trạng thái của bản ghi ${id} đã được cập nhật bởi admin (mô phỏng).`);
//   };

//   // Cột cho Bảng Thành tích
//   const achievementColumns = [
//     {
//       title: "Loại thành tích",
//       dataIndex: "achievementType",
//       key: "achievementType",
//     },
//     {
//       title: "Môn",
//       dataIndex: "achievementSubject",
//       key: "achievementSubject",
//     },
//     {
//       title: "Năm",
//       dataIndex: "achievementYear",
//       key: "achievementYear",
//     },
//     {
//       title: "Giải",
//       dataIndex: "achievementRank",
//       key: "achievementRank",
//     },
//     {
//       title: "Minh chứng",
//       dataIndex: "achievementCertificateFile",
//       key: "achievementCertificateFile",
//       render: (fileList: FileUpload[]) => (fileList && fileList.length > 0 ? fileList[0].name : "Không có file"),
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status: "Chờ duyệt" | "Đã duyệt" | "Từ chối", record: Achievement) => {
//         let color;
//         switch (status) {
//           case "Đã duyệt":
//             color = "success";
//             break;
//           case "Từ chối":
//             color = "error";
//             break;
//           default:
//             color = "processing";
//         }
//         return (
//           <Space direction="vertical">
//             <Tag color={color}>{status}</Tag>
//             {status === "Từ chối" && record.reason && (
//               <Tag color="volcano">Lý do: {record.reason}</Tag>
//             )}
//           </Space>
//         );
//       },
//     },
//     {
//       title: "Hành động",
//       key: "actions",
//       render: (_: any, record: Achievement) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => handleEditAchievement(record)}
//             disabled={record.status !== "Chờ duyệt"}
//           >
//             Sửa
//           </Button>
//           <Button
//             icon={<DeleteOutlined />}
//             danger
//             onClick={() => handleDeleteAchievement(record.id)}
//             disabled={record.status !== "Chờ duyệt"}
//           >
//             Xóa
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   // Cột cho Bảng Chứng chỉ Tiếng Anh
//   const certificateColumns = [
//     {
//       title: "Loại chứng chỉ",
//       dataIndex: "certificateType",
//       key: "certificateType",
//     },
//     {
//       title: "Điểm",
//       dataIndex: "certificateScore",
//       key: "certificateScore",
//     },
//     {
//       title: "Ngày cấp",
//       dataIndex: "certificateIssueDate",
//       key: "certificateIssueDate",
//       render: (dateString: string) => dateString ? dayjs(dateString).format("DD/MM/YYYY") : '',
//     },
//     {
//       title: "Mã/Số ĐK",
//       dataIndex: "examRegistrationNumber",
//       key: "examRegistrationNumber",
//     },
//     {
//       title: "Đơn vị cấp",
//       dataIndex: "certificateIssuer",
//       key: "certificateIssuer",
//       render: (text: string, record: EnglishCertificate) => text === "Khác" ? record.otherIssuerName : text,
//     },
//     {
//       title: "Minh chứng",
//       dataIndex: "certificateFile",
//       key: "certificateFile",
//       render: (fileList: FileUpload[]) => (fileList && fileList.length > 0 ? fileList[0].name : "Không có file"),
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status: "Chờ duyệt" | "Đã duyệt" | "Từ chối", record: EnglishCertificate) => {
//         let color;
//         switch (status) {
//           case "Đã duyệt":
//             color = "success";
//             break;
//           case "Từ chối":
//             color = "error";
//             break;
//           default:
//             color = "processing";
//         }
//         return (
//           <Space direction="vertical">
//             <Tag color={color}>{status}</Tag>
//             {status === "Từ chối" && record.reason && (
//               <Tag color="volcano">Lý do: {record.reason}</Tag>
//             )}
//           </Space>
//         );
//       },
//     },
//     {
//       title: "Hành động",
//       key: "actions",
//       render: (_: any, record: EnglishCertificate) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => handleEditCertificate(record)}
//             disabled={record.status !== "Chờ duyệt"}
//           >
//             Sửa
//           </Button>
//           <Button
//             icon={<DeleteOutlined />}
//             danger
//             onClick={() => handleDeleteCertificate(record.id)}
//             disabled={record.status !== "Chờ duyệt"}
//           >
//             Xóa
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
//       {/* Form khai báo thông tin thành tích và chứng chỉ */}
//       <div style={{
//         backgroundColor: '#fff',
//         padding: 30,
//         borderRadius: 8,
//         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//         marginBottom: 30
//       }}>
//         <h2 style={{ textAlign: "center", marginBottom: 30, color: '#1890ff' }}>
//           Khai báo Thành tích & Chứng chỉ
//         </h2>
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={onFinish}
//           scrollToFirstError
//         >
//           <Tabs
//             defaultActiveKey="achievements"
//             centered
//             size="large"
//             activeKey={editingAchievementId ? 'achievements' : (editingCertificateId ? 'englishCertificates' : undefined)}
//             onChange={(key) => {
//                 // Khi đổi tab, nếu đang chỉnh sửa thì reset form và hủy chế độ chỉnh sửa
//                 if (editingAchievementId || editingCertificateId) {
//                     form.resetFields(); // Reset toàn bộ form fields
//                     setEditingAchievementId(null);
//                     setEditingCertificateId(null);
//                 }
//                 // Dọn dẹp lỗi validation khi chuyển tab
//                 form.clearValidate(['achievementType', 'certificateType']);
//             }}
//           >
//             {/* --- Tab THÔNG TIN THÀNH TÍCH HỌC SINH GIỎI --- */}
//             <TabPane tab="Thành tích Học sinh Giỏi" key="achievements">
//               <h3 style={{ marginBottom: 15, textAlign: 'center', color: '#1890ff' }}>
//                 Thông tin Thành tích Học sinh Giỏi
//               </h3>
//               <p style={{ marginBottom: 10, fontSize: '14px', color: '#555' }}>
//                 Cung cấp thông tin thành tích đạt được trong các kỳ thi Học sinh Giỏi.
//               </p>
//               <p style={{ marginBottom: 20, fontSize: '14px', fontWeight: 'bold' }}>
//                 Quy định cộng điểm:
//                 <ul>
//                   <li><strong style={{ color: '#1890ff' }}>HSG cấp tỉnh/TP:</strong>
//                     <ul>
//                       <li>Giải Nhất: Cộng 1.0 điểm</li>
//                       <li>Giải Nhì: Cộng 0.75 điểm</li>
//                       <li>Giải Ba: Cộng 0.25 điểm</li>
//                     </ul>
//                   </li>
//                   <li><strong style={{ color: '#1890ff' }}>HSG cấp Quốc gia:</strong> Cộng 2.0 điểm (áp dụng cho tất cả loại giải).</li>
//                 </ul>
//               </p>

//               <Form.Item
//                 label="Loại thành tích"
//                 name="achievementType"
//                 tooltip="Vui lòng chọn loại thành tích đạt được để điền thông tin chi tiết."
//                 // Bắt buộc nếu đang chỉnh sửa achievement hoặc nếu không có chứng chỉ nào được chọn
//                 rules={[{ required: editingAchievementId || !selectedCertType, message: "Vui lòng chọn loại thành tích (hoặc điền thông tin chứng chỉ)" }]}
//               >
//                 <Select placeholder="Chọn loại thành tích (nếu có)" allowClear>
//                   {achievementTypes.map((item) => (
//                     <Option key={item} value={item}>
//                       {item}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               {achievementType && (
//                 <>
//                   <Row gutter={16}> {/* Chia thành 2 cột */}
//                     <Col span={12}>
//                       <Form.Item
//                         label="Môn đạt giải"
//                         name="achievementSubject"
//                         rules={[{ required: true, message: "Vui lòng nhập môn đạt giải" }]}
//                       >
//                         <Input placeholder="Ví dụ: Toán, Ngữ văn..." />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item
//                         label="Năm đạt giải"
//                         name="achievementYear"
//                         rules={[{ required: true, message: "Vui lòng chọn năm đạt giải" }]}
//                       >
//                         <DatePicker
//                           picker="year"
//                           placeholder="Chọn năm"
//                           style={{ width: "100%" }}
//                           disabledDate={(current) => {
//                             return current && current.year() > dayjs().year();
//                           }}
//                         />
//                       </Form.Item>
//                     </Col>
//                   </Row>

//                   <Form.Item
//                     label="Loại giải"
//                     name="achievementRank"
//                     rules={[{ required: true, message: "Vui lòng chọn loại giải" }]}
//                   >
//                     <Radio.Group>
//                       <Space direction="vertical">
//                         {getAwardRanks(achievementType).map((rank) => (
//                           <Radio key={rank} value={rank}>
//                             {rank}
//                           </Radio>
//                         ))}
//                       </Space>
//                     </Radio.Group>
//                   </Form.Item>

//                   <Form.Item
//                     label="Bằng khen/Giấy chứng nhận đính kèm"
//                     name="achievementCertificateFile"
//                     valuePropName="fileList"
//                     getValueFromEvent={(e: any) => e && e.fileList}
//                     rules={[
//                       {
//                         required: true,
//                         message: "Vui lòng upload bằng khen/giấy chứng nhận",
//                       },
//                     ]}
//                   >
//                     <Upload
//                       beforeUpload={() => false}
//                       maxCount={1}
//                       accept=".pdf,.jpg,.png"
//                       listType="picture" // Hiển thị hình ảnh hoặc icon file
//                     >
//                       <Button icon={<UploadOutlined />}>Chọn file (PDF/JPG/PNG)</Button>
//                     </Upload>
//                     <p className="ant-upload-hint" style={{ fontSize: '12px', color: '#888' }}>
//                       Chỉ chấp nhận định dạng PDF, JPG, PNG. Kích thước tệp tối đa: 5MB.
//                     </p>
//                   </Form.Item>
//                 </>
//               )}
//             </TabPane>

//             {/* --- Tab THÔNG TIN CHỨNG CHỈ TIẾNG ANH QUỐC TẾ --- */}
//             <TabPane tab="Chứng chỉ Tiếng Anh Quốc tế" key="englishCertificates">
//               <h3 style={{ marginBottom: 15, textAlign: 'center', color: '#1890ff' }}>
//                 Thông tin Chứng chỉ Tiếng Anh Quốc tế
//               </h3>
//               <p style={{ marginBottom: 10, fontSize: '14px', color: '#555' }}>
//                 Cung cấp thông tin chứng chỉ tiếng Anh quốc tế để được **cộng điểm ưu tiên** vào tổng điểm xét tuyển.
//               </p>
//               <p style={{ marginBottom: 20, fontSize: '14px', fontWeight: 'bold' }}>
//                 Quy định cộng điểm:
//                 <ul>
//                   <li>IELTS 5.0 - 6.0 (hoặc tương đương TOEFL iBT 65-80, TOEFL ITP 513-549): <strong style={{ color: '#1890ff' }}>Cộng 0.5 điểm</strong>.</li>
//                   <li>IELTS 6.5 trở lên (hoặc tương đương TOEFL iBT 81+, TOEFL ITP 550+): <strong style={{ color: '#1890ff' }}>Cộng 1.0 điểm</strong>.</li>
//                 </ul>
//                 <span style={{ fontSize: '12px', color: '#e74c3c' }}>
//                   *Lưu ý: Chứng chỉ hợp lệ phải có điểm tối thiểu IELTS 5.5, TOEFL iBT 65, TOEFL ITP 513 và còn hiệu lực.
//                 </span>
//               </p>

//               <Form.Item
//                 label="Loại Chứng chỉ"
//                 name="certificateType"
//                 // Bắt buộc nếu đang chỉnh sửa certificate hoặc nếu không có thành tích nào được chọn
//                 rules={[{ required: editingCertificateId || !achievementType, message: "Vui lòng chọn loại chứng chỉ (hoặc điền thông tin thành tích)" }]}
//               >
//                 <Radio.Group>
//                   <Space>
//                     {englishCertificateTypes.map((type) => (
//                       <Radio key={type.value} value={type.value}>
//                         {type.label}
//                       </Radio>
//                     ))}
//                   </Space>
//                 </Radio.Group>
//               </Form.Item>

//               {selectedCertType && (
//                 <>
//                   <Row gutter={16}> {/* Chia thành 2 cột */}
//                     <Col span={12}>
//                       <Form.Item
//                         label="Điểm Thi"
//                         name="certificateScore"
//                         rules={[
//                           { required: true, message: "Vui lòng nhập điểm thi" },
//                           { type: "number", message: "Điểm thi phải là số" },
//                           { validator: validateCertificateScore },
//                         ]}
//                       >
//                         <Input
//                           type="number"
//                           step="0.5"
//                           placeholder={`Tối thiểu ${englishCertificateTypes.find(c => c.value === selectedCertType)?.minScore}`}
//                         />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item
//                         label="Ngày Cấp Chứng chỉ"
//                         name="certificateIssueDate"
//                         rules={[{ required: true, message: "Vui lòng chọn ngày cấp chứng chỉ" }]}
//                       >
//                         <DatePicker
//                           placeholder="Chọn ngày cấp"
//                           style={{ width: "100%" }}
//                           format="DD/MM/YYYY"
//                           disabledDate={(current) => {
//                             return current && current > dayjs().endOf('day');
//                           }}
//                         />
//                       </Form.Item>
//                     </Col>
//                   </Row>

//                   <Row gutter={16}> {/* Chia thành 2 cột */}
//                     <Col span={12}>
//                       <Form.Item
//                         label="Mã Dự Thi / Số Đăng Ký"
//                         name="examRegistrationNumber"
//                         rules={[{ required: true, message: "Vui lòng nhập mã dự thi / số đăng ký" }]}
//                         tooltip="Mã số này giúp trường xác minh chứng chỉ của bạn."
//                       >
//                         <Input placeholder="Nhập mã số trên chứng chỉ" />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item
//                         label="Đơn vị Cấp"
//                         name="certificateIssuer"
//                         rules={[{ required: true, message: "Vui lòng chọn đơn vị cấp" }]}
//                       >
//                         <Select placeholder="Chọn đơn vị cấp chứng chỉ" allowClear>
//                           {certificateIssuers.map((issuer) => (
//                             <Option key={issuer.value} value={issuer.value}>
//                               {issuer.label}
//                             </Option>
//                           ))}
//                         </Select>
//                       </Form.Item>
//                     </Col>
//                   </Row>

//                   {selectedIssuer === "Khác" && (
//                     <Form.Item
//                       label="Tên đơn vị cấp khác"
//                       name="otherIssuerName"
//                       rules={[{ required: true, message: "Vui lòng nhập tên đơn vị cấp" }]}
//                     >
//                       <Input placeholder="Nhập tên đơn vị cấp chứng chỉ khác" />
//                     </Form.Item>
//                   )}

//                   <Form.Item
//                     label="Chứng chỉ đính kèm (Bản scan/ảnh)"
//                     name="certificateFile"
//                     valuePropName="fileList"
//                     getValueFromEvent={(e: any) => e && e.fileList}
//                     rules={[
//                       {
//                         required: true,
//                         message: "Vui lòng upload bản scan/ảnh chứng chỉ",
//                       },
//                     ]}
//                   >
//                     <Upload
//                       beforeUpload={() => false}
//                       maxCount={1}
//                       accept=".pdf,.jpg,.png"
//                       listType="picture" // Hiển thị hình ảnh hoặc icon file
//                     >
//                       <Button icon={<UploadOutlined />}>Chọn file (PDF/JPG/PNG)</Button>
//                     </Upload>
//                     <p className="ant-upload-hint" style={{ fontSize: '12px', color: '#888' }}>
//                       Chỉ chấp nhận định dạng PDF, JPG, PNG. Kích thước tệp tối đa: 5MB.
//                     </p>
//                   </Form.Item>
//                 </>
//               )}
//             </TabPane>
//           </Tabs>

//           <Form.Item style={{ marginTop: 30, textAlign: 'center' }}>
//             <Button type="primary" htmlType="submit" size="large" style={{ minWidth: 200 }}>
//               {editingAchievementId || editingCertificateId ? "Cập nhật" : "Lưu thông tin"}
//             </Button>
//             {(editingAchievementId || editingCertificateId) && (
//               <Button
//                 onClick={() => {
//                   form.resetFields();
//                   setEditingAchievementId(null);
//                   setEditingCertificateId(null);
//                 }}
//                 style={{ marginLeft: 10 }}
//               >
//                 Hủy chỉnh sửa
//               </Button>
//             )}
//           </Form.Item>
//         </Form>
//       </div>

//       {/* Bảng hiển thị thông tin thành tích */}
//       <div style={{
//         backgroundColor: '#fff',
//         padding: 30,
//         borderRadius: 8,
//         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//         marginTop: 30
//       }}>
//         <h2 style={{ textAlign: "center", marginBottom: 30, color: '#1890ff' }}>Thành tích Học sinh Giỏi đã khai báo</h2>
//         <Table
//           columns={achievementColumns}
//           dataSource={achievements.map(record => ({ ...record, key: record.id }))}
//           pagination={false}
//           bordered
//           locale={{ emptyText: 'Chưa có thành tích nào được khai báo.' }}
//         />
//         {achievements.length > 0 && (
//             <div style={{ textAlign: 'right', marginTop: 15 }}>
//                 <Button size="small" onClick={() => simulateAdminAction('achievement', achievements[0].id, "Đã duyệt")}>
//                     Admin Duyệt (Mô phỏng)
//                 </Button>
//                 <Button size="small" danger onClick={() => simulateAdminAction('achievement', achievements[0].id, "Từ chối", "Minh chứng không đủ rõ ràng")} style={{ marginLeft: 8 }}>
//                     Admin Từ chối (Mô phỏng)
//                 </Button>
//                 <p style={{ fontSize: '12px', color: '#888', marginTop: 5 }}>
//                     *Các nút này chỉ để mô phỏng hành động duyệt của Admin trên frontend.
//                 </p>
//             </div>
//         )}
//       </div>

//       {/* Bảng hiển thị thông tin chứng chỉ */}
//       <div style={{
//         backgroundColor: '#fff',
//         padding: 30,
//         borderRadius: 8,
//         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//         marginTop: 30
//       }}>
//         <h2 style={{ textAlign: "center", marginBottom: 30, color: '#1890ff' }}>Chứng chỉ Tiếng Anh đã khai báo</h2>
//         <Table
//           columns={certificateColumns}
//           dataSource={englishCertificates.map(record => ({ ...record, key: record.id }))}
//           pagination={false}
//           bordered
//           locale={{ emptyText: 'Chưa có chứng chỉ nào được khai báo.' }}
//         />
//          {englishCertificates.length > 0 && (
//             <div style={{ textAlign: 'right', marginTop: 15 }}>
//                 <Button size="small" onClick={() => simulateAdminAction('certificate', englishCertificates[0].id, "Đã duyệt")}>
//                     Admin Duyệt (Mô phỏng)
//                 </Button>
//                 <Button size="small" danger onClick={() => simulateAdminAction('certificate', englishCertificates[0].id, "Từ chối", "Chứng chỉ hết hiệu lực")} style={{ marginLeft: 8 }}>
//                     Admin Từ chối (Mô phỏng)
//                 </Button>
//                 <p style={{ fontSize: '12px', color: '#888', marginTop: 5 }}>
//                     *Các nút này chỉ để mô phỏng hành động duyệt của Admin trên frontend.
//                 </p>
//             </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AchievementsCerts;