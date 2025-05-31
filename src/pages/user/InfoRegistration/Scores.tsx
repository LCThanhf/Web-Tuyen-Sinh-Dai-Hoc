// // // import React, { useState } from "react";
// // // import {
// // //   Form,
// // //   Input,
// // //   InputNumber,
// // //   Select,
// // //   Upload,
// // //   Button,
// // //   message,
// // //   Divider,
// // //   Typography,
// // // } from "antd";
// // // import { UploadOutlined } from "@ant-design/icons";

// // // const { Option } = Select;
// // // const { Title } = Typography;

// // // const subjectCombos = [
// // //   "Toán, Lý, Hóa",
// // //   "Toán, Lý, Anh",
// // //   "Toán, Văn, Anh",
// // // ];

// // // const Scores: React.FC = () => {
// // //   const [form] = Form.useForm();

// // //   const onFinish = (values: any) => {
// // //     console.log("Dữ liệu điểm thi & học bạ:", values);
// // //     message.success("Lưu điểm thi & học bạ thành công!");
// // //     form.resetFields();
// // //   };

// // //   return (
// // //     <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
// // //       <Title level={4}>Điểm thi THPT quốc gia</Title>
// // //       <Form.Item
// // //         label="Số báo danh"
// // //         name="examNumber"
// // //         rules={[{ required: true, message: "Vui lòng nhập số báo danh" }]}
// // //       >
// // //         <Input placeholder="Nhập số báo danh" />
// // //       </Form.Item>
// // //       <Form.Item
// // //         label="Tổ hợp môn"
// // //         name="subjectCombo"
// // //         rules={[{ required: true, message: "Vui lòng chọn tổ hợp môn" }]}
// // //       >
// // //         <Select placeholder="Chọn tổ hợp môn" allowClear>
// // //           {subjectCombos.map((combo) => (
// // //             <Option key={combo} value={combo}>
// // //               {combo}
// // //             </Option>
// // //           ))}
// // //         </Select>
// // //       </Form.Item>
// // //       <Form.Item
// // //         label="Tổng điểm tổ hợp"
// // //         name="totalScore"
// // //         rules={[
// // //           { required: true, message: "Vui lòng nhập tổng điểm" },
// // //           { type: "number", min: 0, max: 30, message: "Điểm phải từ 0 đến 30" },
// // //         ]}
// // //       >
// // //         <InputNumber style={{ width: "100%" }} min={0} max={30} step={0.1} />
// // //       </Form.Item>
// // //       <Form.Item
// // //         label="File minh chứng điểm thi"
// // //         name="examFile"
// // //         valuePropName="fileList"
// // //         getValueFromEvent={(e: any) => e && e.fileList}
// // //         rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
// // //       >
// // //         <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
// // //           <Button icon={<UploadOutlined />}>Chọn file</Button>
// // //         </Upload>
// // //       </Form.Item>

// // //       <Divider />

// // //       <Title level={4}>Điểm học bạ 3 năm cấp 3</Title>
// // //       <Form.Item
// // //         label="Điểm trung bình lớp 10"
// // //         name="grade10"
// // //         rules={[
// // //           { required: true, message: "Vui lòng nhập điểm trung bình lớp 10" },
// // //           { type: "number", min: 0, max: 10, message: "Điểm từ 0 đến 10" },
// // //         ]}
// // //       >
// // //         <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
// // //       </Form.Item>
// // //       <Form.Item
// // //         label="Điểm trung bình lớp 11"
// // //         name="grade11"
// // //         rules={[
// // //           { required: true, message: "Vui lòng nhập điểm trung bình lớp 11" },
// // //           { type: "number", min: 0, max: 10, message: "Điểm từ 0 đến 10" },
// // //         ]}
// // //       >
// // //         <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
// // //       </Form.Item>
// // //       <Form.Item
// // //         label="Điểm trung bình lớp 12"
// // //         name="grade12"
// // //         rules={[
// // //           { required: true, message: "Vui lòng nhập điểm trung bình lớp 12" },
// // //           { type: "number", min: 0, max: 10, message: "Điểm từ 0 đến 10" },
// // //         ]}
// // //       >
// // //         <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
// // //       </Form.Item>
// // //       <Form.Item
// // //         label="Tổ hợp môn"
// // //         name="hkbCombo"
// // //         rules={[{ required: true, message: "Vui lòng chọn tổ hợp môn" }]}
// // //       >
// // //         <Select placeholder="Chọn tổ hợp môn" allowClear>
// // //           {subjectCombos.map((combo) => (
// // //             <Option key={combo} value={combo}>
// // //               {combo}
// // //             </Option>
// // //           ))}
// // //         </Select>
// // //       </Form.Item>
// // //       <Form.Item
// // //         label="File minh chứng học bạ"
// // //         name="hkbFile"
// // //         valuePropName="fileList"
// // //         getValueFromEvent={(e: any) => e && e.fileList}
// // //         rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
// // //       >
// // //         <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
// // //           <Button icon={<UploadOutlined />}>Chọn file</Button>
// // //         </Upload>
// // //       </Form.Item>

// // //       <Divider />

// // //       <Title level={4}>Điểm đánh giá năng lực & tư duy</Title>
// // //       <Form.Item
// // //         label="Đơn vị tổ chức"
// // //         name="assessmentUnit"
// // //         rules={[{ required: true, message: "Vui lòng nhập đơn vị tổ chức" }]}
// // //       >
// // //         <Input placeholder="Nhập tên đơn vị tổ chức" />
// // //       </Form.Item>
// // //       <Form.Item
// // //         label="Điểm thi"
// // //         name="assessmentScore"
// // //         rules={[
// // //           { required: true, message: "Vui lòng nhập điểm thi" },
// // //           { type: "number", min: 0, max: 30, message: "Điểm từ 0 đến 30" },
// // //         ]}
// // //       >
// // //         <InputNumber style={{ width: "100%" }} min={0} max={30} step={0.1} />
// // //       </Form.Item>
// // //       <Form.Item
// // //         label="File minh chứng đánh giá"
// // //         name="assessmentFile"
// // //         valuePropName="fileList"
// // //         getValueFromEvent={(e: any) => e && e.fileList}
// // //         rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
// // //       >
// // //         <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
// // //           <Button icon={<UploadOutlined />}>Chọn file</Button>
// // //         </Upload>
// // //       </Form.Item>

// // //       <Button type="primary" htmlType="submit" block>
// // //         Lưu điểm thi & học bạ
// // //       </Button>
// // //     </Form>
// // //   );
// // // };

// // // export default Scores;




// // import React, { useState } from "react";
// // import {
// //   Form,
// //   Input,
// //   InputNumber,
// //   Upload,
// //   Button,
// //   message,
// //   Tabs,
// //   Select,
// //   Row,
// //   Col,
// // } from "antd";
// // import { UploadOutlined } from "@ant-design/icons";

// // const { TabPane } = Tabs;
// // const { Option } = Select;

// // const naturalSubjects = ["Toán", "Lý", "Hóa", "Sinh", "Anh", "GDCD"];
// // const socialSubjects = ["Toán", "Văn", "Sử", "Địa", "Anh", "GDCD"];

// // const assessmentUnits = [
// //   { label: "ĐH Quốc gia Hà Nội", value: "DHQGHN" },
// //   { label: "ĐH Quốc gia TP.HCM", value: "DHQGTPHCM" },
// // ];

// // const thinkingAssessmentUnit = "ĐH Bách Khoa Hà Nội";

// // const Scores: React.FC = () => {
// //   const [examForm] = Form.useForm();
// //   const [hkbForm] = Form.useForm();
// //   const [assessmentForm] = Form.useForm();

// //   const [ban, setBan] = useState<"tu_nhien" | "xa_hoi">("tu_nhien");

// //   // Hàm xử lý submit từng form
// //   const onExamFinish = (values: any) => {
// //     console.log("Điểm thi THPT:", values);
// //     message.success("Lưu điểm thi THPT thành công!");
// //     examForm.resetFields();
// //   };

// //   const onHkbFinish = (values: any) => {
// //     console.log("Điểm học bạ:", values);
// //     message.success("Lưu điểm học bạ thành công!");
// //     hkbForm.resetFields();
// //   };

// //   const onAssessmentFinish = (values: any) => {
// //     console.log("Điểm đánh giá:", values);
// //     message.success("Lưu điểm đánh giá thành công!");
// //     assessmentForm.resetFields();
// //   };

// //   // Lấy danh sách môn theo ban
// //   const subjects = ban === "tu_nhien" ? naturalSubjects : socialSubjects;

// //   return (
// //     <Tabs defaultActiveKey="1" centered>
// //       <TabPane tab="Điểm thi THPT" key="1">
// //         <Form
// //           form={examForm}
// //           layout="vertical"
// //           onFinish={onExamFinish}
// //           style={{ maxWidth: 700, margin: "auto" }}
// //         >
// //           <Form.Item
// //             label="Số báo danh"
// //             name="examNumber"
// //             rules={[{ required: true, message: "Vui lòng nhập số báo danh" }]}
// //           >
// //             <Input placeholder="Nhập số báo danh" />
// //           </Form.Item>

// //           <Form.Item label="Chọn ban" required>
// //             <Select
// //               value={ban}
// //               onChange={(val) => setBan(val)}
// //               style={{ width: 200 }}
// //             >
// //               <Option value="tu_nhien">Tự nhiên</Option>
// //               <Option value="xa_hoi">Xã hội</Option>
// //             </Select>
// //           </Form.Item>

// //           <Row gutter={16}>
// //             {subjects.map((subject) => (
// //               <Col span={8} key={subject}>
// //                 <Form.Item
// //                   label={`Điểm môn ${subject}`}
// //                   name={`score_${subject}`}
// //                   rules={[
// //                     { required: true, message: `Vui lòng nhập điểm môn ${subject}` },
// //                     {
// //                       type: "number",
// //                       min: 0,
// //                       max: 10,
// //                       message: "Điểm phải từ 0 đến 10",
// //                     },
// //                   ]}
// //                 >
// //                   <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
// //                 </Form.Item>
// //               </Col>
// //             ))}
// //           </Row>

// //           <Form.Item
// //             label="File minh chứng điểm thi"
// //             name="examFile"
// //             valuePropName="fileList"
// //             getValueFromEvent={(e: any) => e && e.fileList}
// //             rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
// //           >
// //             <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
// //               <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
// //             </Upload>
// //           </Form.Item>

// //           <Form.Item>
// //             <Button type="primary" htmlType="submit" block>
// //               Lưu điểm thi THPT
// //             </Button>
// //           </Form.Item>
// //         </Form>
// //       </TabPane>

// //       <TabPane tab="Điểm học bạ 6 kỳ" key="2">
// //         <Form
// //           form={hkbForm}
// //           layout="vertical"
// //           onFinish={onHkbFinish}
// //           style={{ maxWidth: 700, margin: "auto" }}
// //         >
// //           <Row gutter={16}>
// //             {[1, 2, 3, 4, 5, 6].map((term) => (
// //               <Col span={8} key={term}>
// //                 <Form.Item
// //                   label={`Điểm trung bình học kỳ ${term}`}
// //                   name={`term${term}`}
// //                   rules={[
// //                     { required: true, message: `Vui lòng nhập điểm học kỳ ${term}` },
// //                     {
// //                       type: "number",
// //                       min: 0,
// //                       max: 10,
// //                       message: "Điểm phải từ 0 đến 10",
// //                     },
// //                   ]}
// //                 >
// //                   <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
// //                 </Form.Item>
// //               </Col>
// //             ))}
// //           </Row>

// //           <Form.Item
// //             label="File minh chứng học bạ"
// //             name="hkbFile"
// //             valuePropName="fileList"
// //             getValueFromEvent={(e: any) => e && e.fileList}
// //             rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
// //           >
// //             <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
// //               <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
// //             </Upload>
// //           </Form.Item>

// //           <Form.Item>
// //             <Button type="primary" htmlType="submit" block>
// //               Lưu điểm học bạ
// //             </Button>
// //           </Form.Item>
// //         </Form>
// //       </TabPane>

// //       <TabPane tab="Đánh giá năng lực & tư duy" key="3">
// //         <Form
// //           form={assessmentForm}
// //           layout="vertical"
// //           onFinish={onAssessmentFinish}
// //           style={{ maxWidth: 700, margin: "auto" }}
// //         >
// //           <Form.Item
// //             label="Đơn vị tổ chức"
// //             name="assessmentUnit"
// //             rules={[{ required: true, message: "Vui lòng nhập đơn vị tổ chức" }]}
// //           >
// //             <Select placeholder="Chọn đơn vị tổ chức">
// //               {assessmentUnits.map(({ label, value }) => (
// //                 <Option key={value} value={value}>
// //                   {label}
// //                 </Option>
// //               ))}
// //               <Option value="DHBK">ĐH Bách Khoa Hà Nội (Đánh giá tư duy)</Option>
// //             </Select>
// //           </Form.Item>

// //           <Form.Item
// //             label="Điểm thi"
// //             name="assessmentScore"
// //             rules={[
// //               { required: true, message: "Vui lòng nhập điểm thi" },
// //               { type: "number", min: 0, max: 30, message: "Điểm từ 0 đến 30" },
// //             ]}
// //           >
// //             <InputNumber style={{ width: "100%" }} min={0} max={30} step={0.1} />
// //           </Form.Item>

// //           <Form.Item
// //             label="File minh chứng đánh giá"
// //             name="assessmentFile"
// //             valuePropName="fileList"
// //             getValueFromEvent={(e: any) => e && e.fileList}
// //             rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
// //           >
// //             <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
// //               <Button icon={<UploadOutlined />}>Chọn file</Button>
// //             </Upload>
// //           </Form.Item>

// //           <Button type="primary" htmlType="submit" block>
// //             Lưu điểm đánh giá
// //           </Button>
// //         </Form>
// //       </TabPane>
// //     </Tabs>
// //   );
// // };

// // export default Scores;






// import React, { useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Upload,
//   Button,
//   message,
//   Tabs,
//   Select,
//   Table,
//   Typography,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const { TabPane } = Tabs;
// const { Option } = Select;
// const { Title, Text } = Typography;

// const subjects = [
//   "Toán",
//   "Văn",
//   "Anh",
//   "Lý",
//   "Hóa",
//   "Sinh",
//   "Sử",
//   "Địa",
//   "GDCD",
//   "Công nghệ",
//   "Tin học",
// ];

// const assessmentUnits = [
//   { label: "ĐH Quốc gia Hà Nội", value: "DHQGHN" },
//   { label: "ĐH Quốc gia TP.HCM", value: "DHQGTPHCM" },
// ];

// const Scores: React.FC = () => {
//   const [examForm] = Form.useForm();
//   const [hkbForm] = Form.useForm();
//   const [dgnlForm] = Form.useForm();
//   const [dgtdForm] = Form.useForm();

//   // State lưu điểm từng môn từng kỳ dạng object { subject: { term1: score, ... term6: score } }
//   const [scoresData, setScoresData] = useState<{ [subject: string]: number[] }>(() => {
//     // Khởi tạo 11 môn với 6 kỳ điểm = 0
//     const init: { [key: string]: number[] } = {};
//     subjects.forEach((subj) => {
//       init[subj] = Array(6).fill(0);
//     });
//     return init;
//   });

//   // Tính điểm trung bình tổng 11 môn trên 6 kỳ
//   const averageScore = () => {
//     let total = 0;
//     let count = 0;
//     subjects.forEach((subj) => {
//       scoresData[subj].forEach((score) => {
//         if (typeof score === "number") {
//           total += score;
//           count++;
//         }
//       });
//     });
//     return count === 0 ? 0 : (total / count).toFixed(2);
//   };

//   // Cột cho bảng học bạ (6 kỳ + tên môn)
//   const columns = [
//     {
//       title: "Môn học",
//       dataIndex: "subject",
//       key: "subject",
//       fixed: "left",
//       width: 120,
//     },
//     ...Array.from({ length: 6 }, (_, i) => ({
//       title: `Học kỳ ${i + 1}`,
//       dataIndex: `term${i + 1}`,
//       key: `term${i + 1}`,
//       width: 100,
//       render: (_: any, record: any, index: number) => (
//         <InputNumber
//           min={0}
//           max={10}
//           step={0.1}
//           style={{ width: "90%" }}
//           value={scoresData[record.subject][index]}
//           onChange={(value) => {
//             if (value === null || value === undefined) value = 0;
//             setScoresData((prev) => {
//               const newData = { ...prev };
//               newData[record.subject][index] = value;
//               return newData;
//             });
//           }}
//         />
//       ),
//     })),
//   ];

//   // Dữ liệu cho bảng
//   const dataSource = subjects.map((subj) => ({
//     key: subj,
//     subject: subj,
//   }));

//   // Submit form điểm thi THPT
//   const onExamFinish = (values: any) => {
//     console.log("Điểm thi THPT:", values);
//     message.success("Lưu điểm thi THPT thành công!");
//     examForm.resetFields();
//   };

//   // Submit form học bạ
//   const onHkbFinish = () => {
//     // Gửi điểm học bạ (scoresData) và file minh chứng
//     hkbForm
//       .validateFields()
//       .then((values) => {
//         console.log("Điểm học bạ:", scoresData);
//         console.log("File minh chứng:", values.hkbFile);
//         message.success("Lưu điểm học bạ thành công!");
//         hkbForm.resetFields();
//         // Reset điểm học bạ nếu muốn
//         // setScoresData(...);
//       })
//       .catch((errorInfo) => {
//         message.error("Vui lòng kiểm tra lại các trường bắt buộc");
//       });
//   };

//   // Submit ĐGNL
//   const onDgnlFinish = (values: any) => {
//     console.log("Đánh giá năng lực:", values);
//     message.success("Lưu điểm đánh giá năng lực thành công!");
//     dgnlForm.resetFields();
//   };

//   // Submit ĐGTD
//   const onDgtdFinish = (values: any) => {
//     console.log("Đánh giá tư duy:", values);
//     message.success("Lưu điểm đánh giá tư duy thành công!");
//     dgtdForm.resetFields();
//   };

//   return (
//     <Tabs defaultActiveKey="1" centered size="large">
//       <TabPane tab="Điểm thi THPT" key="1">
//         <Form form={examForm} layout="vertical" onFinish={onExamFinish} style={{ maxWidth: 700, margin: "auto" }}>
//           <Form.Item
//             label="Số báo danh"
//             name="examNumber"
//             rules={[{ required: true, message: "Vui lòng nhập số báo danh" }]}
//           >
//             <Input placeholder="Nhập số báo danh" />
//           </Form.Item>

//           <Form.Item label="Chọn ban" required>
//             <Select
//               value={ban}
//               onChange={(val) => setBan(val)}
//               style={{ width: 200 }}
//             >
//               <Option value="tu_nhien">Tự nhiên</Option>
//               <Option value="xa_hoi">Xã hội</Option>
//             </Select>
//           </Form.Item>

//           <Row gutter={16}>
//             {subjects.map((subject) => (
//               <Col span={8} key={subject}>
//                 <Form.Item
//                   label={`Điểm môn ${subject}`}
//                   name={`score_${subject}`}
//                   rules={[
//                     { required: true, message: `Vui lòng nhập điểm môn ${subject}` },
//                     {
//                       type: "number",
//                       min: 0,
//                       max: 10,
//                       message: "Điểm phải từ 0 đến 10",
//                     },
//                   ]}
//                 >
//                   <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
//                 </Form.Item>
//               </Col>
//             ))}
//           </Row>

//           <Form.Item
//             label="File minh chứng điểm thi"
//             name="examFile"
//             valuePropName="fileList"
//             getValueFromEvent={(e: any) => e && e.fileList}
//             rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
//           >
//             <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
//               <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
//             </Upload>
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" block>
//               Lưu điểm thi THPT
//             </Button>
//           </Form.Item>
//         </Form>
//       </TabPane>

//       <TabPane tab="Điểm học bạ 6 kỳ" key="2">
//         <Form
//           form={hkbForm}
//           layout="vertical"
//           onFinish={onHkbFinish}
//           style={{ maxWidth: 700, margin: "auto" }}
//         >
//           <Row gutter={16}>
//             {[1, 2, 3, 4, 5, 6].map((term) => (
//               <Col span={8} key={term}>
//                 <Form.Item
//                   label={`Điểm trung bình học kỳ ${term}`}
//                   name={`term${term}`}
//                   rules={[
//                     { required: true, message: `Vui lòng nhập điểm học kỳ ${term}` },
//                     {
//                       type: "number",
//                       min: 0,
//                       max: 10,
//                       message: "Điểm phải từ 0 đến 10",
//                     },
//                   ]}
//                 >
//                   <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
//                 </Form.Item>
//               </Col>
//             ))}
//           </Row>

//           <Form.Item
//             label="File minh chứng học bạ"
//             name="hkbFile"
//             valuePropName="fileList"
//             getValueFromEvent={(e: any) => e && e.fileList}
//             rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
//           >
//             <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
//               <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
//             </Upload>
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" block>
//               Lưu điểm học bạ
//             </Button>
//           </Form.Item>
//         </Form>
//       </TabPane>

//       <TabPane tab="Đánh giá năng lực & tư duy" key="3">
//         <Form
//           form={assessmentForm}
//           layout="vertical"
//           onFinish={onAssessmentFinish}
//           style={{ maxWidth: 700, margin: "auto" }}
//         >
//           <Form.Item
//             label="Đơn vị tổ chức"
//             name="assessmentUnit"
//             rules={[{ required: true, message: "Vui lòng nhập đơn vị tổ chức" }]}
//           >
//             <Select placeholder="Chọn đơn vị tổ chức">
//               {assessmentUnits.map(({ label, value }) => (
//                 <Option key={value} value={value}>
//                   {label}
//                 </Option>
//               ))}
//               <Option value="DHBK">ĐH Bách Khoa Hà Nội (Đánh giá tư duy)</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Điểm thi"
//             name="assessmentScore"
//             rules={[
//               { required: true, message: "Vui lòng nhập điểm thi" },
//               { type: "number", min: 0, max: 30, message: "Điểm từ 0 đến 30" },
//             ]}
//           >
//             <InputNumber style={{ width: "100%" }} min={0} max={30} step={0.1} />
//           </Form.Item>

//           <Form.Item
//             label="File minh chứng đánh giá"
//             name="assessmentFile"
//             valuePropName="fileList"
//             getValueFromEvent={(e: any) => e && e.fileList}
//             rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
//           >
//             <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
//               <Button icon={<UploadOutlined />}>Chọn file</Button>
//             </Upload>
//           </Form.Item>

//           <Button type="primary" htmlType="submit" block>
//             Lưu điểm đánh giá
//           </Button>
//         </Form>
//       </TabPane>
//     </Tabs>
//   );
// };

// export default Scores;






// import React, { useState, useEffect } from "react";
// import { Form, InputNumber, Button, Table, Typography, message } from "antd";

// const { Title, Text } = Typography;

// const subjects = [
//   "Toán",
//   "Văn",
//   "Anh",
//   "Lý",
//   "Hóa",
//   "Sinh",
//   "Sử",
//   "Địa",
//   "GDCD",
//   "Công nghệ",
//   "Tin học",
// ];

// interface ScoreRow {
//   key: string;
//   subject: string;
//   termScores: number[]; // 6 kỳ
//   average: number;
// }

// const HocBaForm: React.FC = () => {
//   // Khởi tạo dữ liệu điểm cho 11 môn, 6 kỳ đều là 0
//   const initData: ScoreRow[] = subjects.map((subject) => ({
//     key: subject,
//     subject,
//     termScores: Array(6).fill(0),
//     average: 0,
//   }));

//   const [data, setData] = useState<ScoreRow[]>(initData);

//   // Hàm tính trung bình 6 kỳ 1 môn
//   const calcAverage = (scores: number[]) => {
//     const sum = scores.reduce((a, b) => a + b, 0);
//     return +(sum / scores.length).toFixed(2);
//   };

//   // Cập nhật điểm 1 ô kỳ môn
//   const onScoreChange = (subjectKey: string, termIndex: number, value: number | null) => {
//     setData((prev) => {
//       return prev.map((row) => {
//         if (row.key === subjectKey) {
//           const newTermScores = [...row.termScores];
//           newTermScores[termIndex] = value !== null && value !== undefined ? value : 0;
//           const newAverage = calcAverage(newTermScores);
//           return { ...row, termScores: newTermScores, average: newAverage };
//         }
//         return row;
//       });
//     });
//   };

//   // Cột bảng: môn + 6 kỳ điểm + điểm trung bình
//   const columns = [
//     {
//       title: "Môn học",
//       dataIndex: "subject",
//       key: "subject",
//       fixed: "left",
//       width: 130,
//     },
//     ...Array.from({ length: 6 }, (_, i) => ({
//       title: `HK ${i + 1}`,
//       key: `term${i + 1}`,
//       width: 90,
//       render: (_: any, record: ScoreRow) => (
//         <InputNumber
//           min={0}
//           max={10}
//           step={0.1}
//           value={record.termScores[i]}
//           onChange={(value) => onScoreChange(record.key, i, value)}
//           style={{ width: "80%" }}
//         />
//       ),
//     })),
//     {
//       title: "Điểm TB",
//       dataIndex: "average",
//       key: "average",
//       width: 100,
//       render: (val: number) => <Text strong>{val}</Text>,
//     },
//   ];

//   // Submit form lưu dữ liệu
//   const onFinish = () => {
//     // TODO: bạn có thể gửi data lên backend hoặc lưu localStorage ở đây
//     console.log("Học bạ đã nhập:", data);
//     message.success("Lưu điểm học bạ thành công!");
//   };

//   return (
//     <>
//       <Title level={4}>Nhập điểm học bạ 6 kỳ (11 môn)</Title>
//       <Table
//         columns={columns}
//         dataSource={data}
//         pagination={false}
//         scroll={{ x: 900 }}
//         bordered
//         rowKey="key"
//         style={{ marginBottom: 16 }}
//       />
//       <Button type="primary" onClick={onFinish} block>
//         Lưu điểm học bạ
//       </Button>
//     </>
//   );
// };

// export default HocBaForm;








import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Tabs,
  Select,
  Table,
  Typography,
  Space,
  Popconfirm,
  Tag,
  Row,
  Col,
} from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

// Define subjects and their categories
const subjects = {
  general: ["Toán", "Văn", "Anh"],
  natural: ["Lý", "Hóa", "Sinh"],
  social: ["Sử", "Địa", "GDCD"],
  // "Công nghệ" and "Tin học" are not part of common exam blocks,
  // so they will only appear in the học bạ section
};

const allSubjectsForHkb = [
  ...subjects.general,
  ...subjects.natural,
  ...subjects.social,
  "Công nghệ",
  "Tin học",
];

const assessmentUnits = {
  dgnl: [
    { label: "ĐH Quốc gia Hà Nội", value: "DHQGHN" },
    { label: "ĐH Quốc gia TP.HCM", value: "DHQGTPHCM" },
  ],
  dgtd: [{ label: "ĐH Bách Khoa Hà Nội", value: "DHBK" }],
};

// Status tags for admin review
const statusTags = {
  "Chờ duyệt": "processing",
  "Đã duyệt": "success",
  "Từ chối": "error",
};

// Interface for table data entries
interface ExamScoreEntry {
  key: string;
  examNumber: string;
  examBan: string;
  scores: { [key: string]: number | null };
  examFile: any[];
  status: keyof typeof statusTags;
}

interface HkbScoreEntry {
  key: string;
  scores: { [subject: string]: number[] }; // Raw scores for 6 terms per subject
  subjectAverages: { [subject: string]: number }; // Calculated averages for 6 terms
  averageOverall: number; // Overall average of subject averages
  hkbFile: any[];
  status: keyof typeof statusTags;
}

interface DgnlDgtdScoreEntry {
  key: string;
  type: "ĐGNL" | "ĐGTD";
  assessmentUnit: string;
  assessmentScore: number;
  assessmentFile: any[];
  status: keyof typeof statusTags;
}

const Scores: React.FC = () => {
  const [examForm] = Form.useForm();
  const [hkbForm] = Form.useForm();
  const [dgnlDgtdForm] = Form.useForm();

  const [selectedExamBan, setSelectedExamBan] = useState<string | null>(null);
  const [currentEditingExamKey, setCurrentEditingExamKey] = useState<string | null>(null);
  const [currentEditingHkbKey, setCurrentEditingHkbKey] = useState<string | null>(null);
  const [currentEditingDgnlDgtdKey, setCurrentEditingDgnlDgtdKey] = useState<string | null>(null);

  // States to hold the unique submitted data for each tab
  const [examScoresTableData, setExamScoresTableData] = useState<ExamScoreEntry | null>(null);
  const [hkbScoresTableData, setHkbScoresTableData] = useState<HkbScoreEntry | null>(null);
  const [dgnlDgtdScoresTableData, setDgnlDgtdScoresTableData] = useState<DgnlDgtdScoreEntry[]>([]);

  // State for học bạ raw input scores
  const [hkbRawScoresData, setHkbRawScoresData] = useState<{ [subject: string]: number[] }>(() => {
    const init: { [key: string]: number[] } = {};
    allSubjectsForHkb.forEach((subj) => {
      init[subj] = Array(6).fill(0); // 6 terms
    });
    return init;
  });

  // Calculate average score for 6 terms of a subject
  const calculateSubjectAverage = (subjectScores: number[]): number => {
    const validScores = subjectScores.filter(
      (score) => typeof score === "number" && score >= 0 && score <= 10
    );
    if (validScores.length === 0) return 0;
    return validScores.reduce((a, b) => a + b, 0) / validScores.length;
  };

  // Calculate overall average for HKB (average of 11 subject averages)
  const averageOverallHkbScore = (): number => {
    let totalSubjectAverages = 0;
    let countSubjectsWithData = 0;

    allSubjectsForHkb.forEach((subj) => {
      const subjectAvg = calculateSubjectAverage(hkbRawScoresData[subj]);
      if (subjectAvg > 0) {
        totalSubjectAverages += subjectAvg;
        countSubjectsWithData++;
      }
    });
    return countSubjectsWithData === 0 ? 0 : totalSubjectAverages / countSubjectsWithData;
  };

  // HKB table columns for input
  const hkbInputTableColumns = [
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      fixed: "left" as const,
      width: 120,
    },
    ...Array.from({ length: 6 }, (_, i) => ({
      title: `Kỳ ${Math.floor(i / 2) + 1} (Lớp ${10 + Math.floor(i / 2)})`,
      dataIndex: `term${i + 1}`,
      key: `term${i + 1}`,
      width: 100,
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          max={10}
          step={0.1}
          style={{ width: "90%" }}
          value={hkbRawScoresData[record.subject][i]}
          onChange={(value) => {
            setHkbRawScoresData((prev) => {
              const newData = { ...prev };
              // Ensure value is a number, default to 0 if null/undefined
              newData[record.subject][i] = value !== null && value !== undefined ? value : 0;
              return newData;
            });
          }}
        />
      ),
    })),
    {
      title: "Điểm TB môn (6 kỳ)",
      dataIndex: "subjectAverage",
      key: "subjectAverage",
      width: 150,
      render: (_: any, record: any) => (
        <Text strong>{calculateSubjectAverage(hkbRawScoresData[record.subject]).toFixed(2)}</Text>
      ),
    },
  ];

  // Data source for HKB input table
  const hkbInputDataSource = allSubjectsForHkb.map((subj) => ({
    key: subj,
    subject: subj,
  }));

  // --- THPT Exam Score Handlers ---
  const onExamFinish = (values: any) => {
    const relevantSubjects = [...subjects.general];
    if (values.examBan === "natural") {
      relevantSubjects.push(...subjects.natural);
    } else if (values.examBan === "social") {
      relevantSubjects.push(...subjects.social);
    }

    const scores: { [key: string]: number | null } = {};
    relevantSubjects.forEach((subj) => {
      scores[subj] = values[`score${subj}`];
    });

    const newEntry: ExamScoreEntry = {
      key: Date.now().toString(), // Unique key for this entry
      examNumber: values.examNumber,
      examBan: values.examBan,
      scores: scores,
      examFile: values.examFile ? values.examFile.map((file: any) => file.originFileObj) : [],
      status: "Chờ duyệt",
    };

    setExamScoresTableData(newEntry); // Store as a single entry
    message.success("Lưu điểm thi THPT thành công! Chờ admin duyệt.");
    examForm.resetFields();
    setSelectedExamBan(null);
    setCurrentEditingExamKey(null);
  };

  const handleEditExamScore = () => {
    if (examScoresTableData) {
      // Set form fields with existing data for editing
      examForm.setFieldsValue({
        examNumber: examScoresTableData.examNumber,
        examBan: examScoresTableData.examBan,
        ...Object.keys(examScoresTableData.scores).reduce((acc: any, subj) => {
          acc[`score${subj}`] = examScoresTableData.scores[subj];
          return acc;
        }, {}),
        // For file upload, you might need to handle Antd's fileList structure
        // This is a simplified representation, a real app might need file URLs
        examFile: examScoresTableData.examFile.length > 0 ? [{ uid: '-1', name: 'uploaded_file', status: 'done', url: URL.createObjectURL(examScoresTableData.examFile[0]) }] : [],
      });
      setSelectedExamBan(examScoresTableData.examBan);
      setCurrentEditingExamKey(examScoresTableData.key);
      message.info("Bạn đang chỉnh sửa điểm thi THPT.");
    }
  };

  const handleDeleteExamScore = () => {
    setExamScoresTableData(null); // Remove the single entry
    message.success("Xóa điểm thi THPT thành công!");
    examForm.resetFields();
    setSelectedExamBan(null);
    setCurrentEditingExamKey(null);
  };

  const examTableDisplayColumns = [
    {
      title: "SBD",
      dataIndex: "examNumber",
      key: "examNumber",
    },
    {
      title: "Bạn thi",
      dataIndex: "examBan",
      key: "examBan",
      render: (ban: string) => {
        if (ban === "general") return "Khối chung";
        if (ban === "natural") return "Khoa học tự nhiên";
        if (ban === "social") return "Khoa học xã hội";
        return ban;
      }
    },
    {
      title: "Điểm các môn",
      key: "scores",
      render: (_: any, record: ExamScoreEntry) => (
        <>
          {Object.entries(record.scores).map(([subject, score]) => (
            <div key={subject}>
              <Text strong>{subject}:</Text> {score !== null ? score : "N/A"}
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Minh chứng",
      dataIndex: "examFile",
      key: "examFile",
      render: (files: any[]) =>
        files.length > 0 ? (
          <a href={URL.createObjectURL(files[0])} target="_blank" rel="noopener noreferrer">
            Xem file
          </a>
        ) : (
          "Không có"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusTags) => (
        <Tag color={statusTags[status]}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: ExamScoreEntry) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={handleEditExamScore}
            disabled={record.status !== "Chờ duyệt"} // Only allow edit if "Chờ duyệt"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa điểm này?"
            onConfirm={handleDeleteExamScore}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={record.status !== "Chờ duyệt"} // Only allow delete if "Chờ duyệt"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- HKB Score Handlers ---
  const onHkbFinish = () => {
    hkbForm
      .validateFields()
      .then((values) => {
        const subjectAverages: { [subject: string]: number } = {};
        allSubjectsForHkb.forEach((subj) => {
          subjectAverages[subj] = calculateSubjectAverage(hkbRawScoresData[subj]);
        });

        const newEntry: HkbScoreEntry = {
          key: Date.now().toString(),
          scores: { ...hkbRawScoresData }, // Raw scores for backup/admin view
          subjectAverages: subjectAverages, // Calculated averages
          averageOverall: parseFloat(averageOverallHkbScore().toFixed(2)),
          hkbFile: values.hkbFile ? values.hkbFile.map((file: any) => file.originFileObj) : [],
          status: "Chờ duyệt",
        };
        setHkbScoresTableData(newEntry); // Store as a single entry
        message.success("Lưu điểm học bạ thành công! Chờ admin duyệt.");
        hkbForm.resetFields();
        // Reset raw scores data
        setHkbRawScoresData(() => {
          const init: { [key: string]: number[] } = {};
          allSubjectsForHkb.forEach((subj) => {
            init[subj] = Array(6).fill(0);
          });
          return init;
        });
        setCurrentEditingHkbKey(null);
      })
      .catch(() => {
        message.error("Vui lòng kiểm tra lại các trường bắt buộc và điểm.");
      });
  };

  const handleEditHkbScore = () => {
    if (hkbScoresTableData) {
      // Set raw scores data back to the input table
      setHkbRawScoresData({ ...hkbScoresTableData.scores });
      // Set file in the form (simplified)
      hkbForm.setFieldsValue({
        hkbFile: hkbScoresTableData.hkbFile.length > 0 ? [{ uid: '-1', name: 'uploaded_file', status: 'done', url: URL.createObjectURL(hkbScoresTableData.hkbFile[0]) }] : [],
      });
      setCurrentEditingHkbKey(hkbScoresTableData.key);
      message.info("Bạn đang chỉnh sửa điểm học bạ.");
    }
  };

  const handleDeleteHkbScore = () => {
    setHkbScoresTableData(null);
    message.success("Xóa điểm học bạ thành công!");
    hkbForm.resetFields();
    setHkbRawScoresData(() => { // Reset raw scores as well
      const init: { [key: string]: number[] } = {};
      allSubjectsForHkb.forEach((subj) => {
        init[subj] = Array(6).fill(0);
      });
      return init;
    });
    setCurrentEditingHkbKey(null);
  };

  const hkbTableDisplayColumns = [
    {
      title: "Điểm TB 11 môn (6 kỳ)",
      dataIndex: "averageOverall",
      key: "averageOverall",
      render: (text: number) => <Text strong>{text.toFixed(2)}</Text>,
    },
    {
      title: "Minh chứng",
      dataIndex: "hkbFile",
      key: "hkbFile",
      render: (files: any[]) =>
        files.length > 0 ? (
          <a href={URL.createObjectURL(files[0])} target="_blank" rel="noopener noreferrer">
            Xem file
          </a>
        ) : (
          "Không có"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusTags) => (
        <Tag color={statusTags[status]}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: HkbScoreEntry) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={handleEditHkbScore}
            disabled={record.status !== "Chờ duyệt"}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa điểm này?"
            onConfirm={handleDeleteHkbScore}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={record.status !== "Chờ duyệt"}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Columns to display 11 subject averages for HKB
  const hkbSubjectAveragesColumns = [
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Điểm TB 6 kỳ",
      dataIndex: "average",
      key: "average",
      render: (text: number) => <Text strong>{text.toFixed(2)}</Text>,
    },
  ];

  const hkbSubjectAveragesDataSource = hkbScoresTableData
    ? Object.entries(hkbScoresTableData.subjectAverages).map(([subject, average]) => ({
        key: subject,
        subject: subject,
        average: average,
      }))
    : [];

  // --- ĐGNL/ĐGTD Handlers ---
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<"ĐGNL" | "ĐGTD" | null>(null);

  // Helper function to get available assessment units for a type
  const getAvailableUnits = (assessmentType: "ĐGNL" | "ĐGTD") => {
    const allUnits = assessmentType === "ĐGNL" ? assessmentUnits.dgnl : assessmentUnits.dgtd;
    const usedUnits = dgnlDgtdScoresTableData
      .filter(entry => entry.type === assessmentType)
      .map(entry => entry.assessmentUnit);
    return allUnits.filter(unit => !usedUnits.includes(unit.value));
  };

  const onDgnlDgtdFinish = (values: any) => {
    // Check if an entry for this type and unit already exists (only if not editing)
    if (!currentEditingDgnlDgtdKey) {
      const existingEntry = dgnlDgtdScoresTableData.find(
        entry => entry.type === values.assessmentType && entry.assessmentUnit === values.assessmentUnit
      );
      if (existingEntry) {
        message.error(`Bạn đã có điểm ${values.assessmentType} cho đơn vị ${existingEntry.assessmentUnit} rồi. Không thể thêm trùng lặp.`);
        return;
      }
    }

    const newEntry: DgnlDgtdScoreEntry = {
      key: currentEditingDgnlDgtdKey || Date.now().toString(),
      type: values.assessmentType,
      assessmentUnit: values.assessmentUnit,
      assessmentScore: values.assessmentScore,
      assessmentFile: values.assessmentFile
        ? values.assessmentFile.map((file: any) => file.originFileObj)
        : [],
      status: "Chờ duyệt",
    };

    if (currentEditingDgnlDgtdKey) {
      // Update existing entry
      setDgnlDgtdScoresTableData(prev => 
        prev.map(entry => entry.key === currentEditingDgnlDgtdKey ? newEntry : entry)
      );
      message.success(`Cập nhật điểm ${values.assessmentType} thành công!`);
    } else {
      // Add new entry
      setDgnlDgtdScoresTableData(prev => [...prev, newEntry]);
      message.success(`Lưu điểm ${values.assessmentType} thành công! Chờ admin duyệt.`);
    }
    
    dgnlDgtdForm.resetFields();
    setSelectedAssessmentType(null);
    setCurrentEditingDgnlDgtdKey(null);
  };

  const handleEditDgnlDgtdScore = (record: DgnlDgtdScoreEntry) => {
    dgnlDgtdForm.setFieldsValue({
      assessmentType: record.type,
      assessmentUnit: record.assessmentUnit,
      assessmentScore: record.assessmentScore,
      assessmentFile: record.assessmentFile.length > 0 ? [{ uid: '-1', name: 'uploaded_file', status: 'done', url: URL.createObjectURL(record.assessmentFile[0]) }] : [],
    });
    setSelectedAssessmentType(record.type);
    setCurrentEditingDgnlDgtdKey(record.key);
    message.info("Bạn đang chỉnh sửa điểm ĐGNL/ĐGTD.");
  };

  const handleDeleteDgnlDgtdScore = (record: DgnlDgtdScoreEntry) => {
    setDgnlDgtdScoresTableData(prev => prev.filter(entry => entry.key !== record.key));
    message.success("Xóa điểm ĐGNL/ĐGTD thành công!");
    
    // If we're currently editing this entry, reset the form
    if (currentEditingDgnlDgtdKey === record.key) {
      dgnlDgtdForm.resetFields();
      setSelectedAssessmentType(null);
      setCurrentEditingDgnlDgtdKey(null);
    }
  };

  const dgnlDgtdTableDisplayColumns = [
    {
      title: "Loại hình",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Đơn vị tổ chức",
      dataIndex: "assessmentUnit",
      key: "assessmentUnit",
      render: (unitValue: string, record: DgnlDgtdScoreEntry) => {
        const units = record.type === "ĐGNL" ? assessmentUnits.dgnl : assessmentUnits.dgtd;
        const foundUnit = units.find(au => au.value === unitValue);
        return foundUnit ? foundUnit.label : unitValue;
      }
    },
    {
      title: "Điểm thi",
      dataIndex: "assessmentScore",
      key: "assessmentScore",
    },
    {
      title: "Minh chứng",
      dataIndex: "assessmentFile",
      key: "assessmentFile",
      render: (files: any[]) =>
        files.length > 0 ? (
          <a href={URL.createObjectURL(files[0])} target="_blank" rel="noopener noreferrer">
            Xem file
          </a>
        ) : (
          "Không có"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusTags) => (
        <Tag color={statusTags[status]}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: DgnlDgtdScoreEntry) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditDgnlDgtdScore(record)}
            disabled={record.status !== "Chờ duyệt"}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa điểm này?"
            onConfirm={() => handleDeleteDgnlDgtdScore(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={record.status !== "Chờ duyệt"}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Tabs defaultActiveKey="1" centered size="large" style={{ padding: "20px" }}>
      {/* --- Điểm thi THPT Tab --- */}
      <TabPane tab="Điểm thi THPT" key="1">
        <Form
          form={examForm}
          layout="vertical"
          onFinish={onExamFinish}
          style={{ maxWidth: 700, margin: "auto", padding: "20px", border: "1px solid #f0f0f0", borderRadius: "8px" }}
          initialValues={{ examBan: null }} // Ensure initial value for select
        >
          <Title level={4} style={{ textAlign: "center", marginBottom: "24px" }}>Nhập điểm thi THPT</Title>
          <Form.Item
            label="Số báo danh"
            name="examNumber"
            rules={[{ required: true, message: "Vui lòng nhập số báo danh" }]}
          >
            <Input placeholder="Nhập số báo danh" disabled={!!currentEditingExamKey}/>
          </Form.Item>

          <Form.Item
            label="Bạn thi"
            name="examBan"
            rules={[{ required: true, message: "Vui lòng chọn bạn thi" }]}
          >
            <Select
              placeholder="Chọn bạn thi"
              onChange={(value) => {
                setSelectedExamBan(value);
                // Reset subject scores when "ban" changes, but only if not editing
                if (!currentEditingExamKey) {
                    allSubjectsForHkb.forEach(subj => {
                        examForm.setFieldsValue({ [`score${subj}`]: null });
                    });
                }
              }}
              disabled={!!currentEditingExamKey} // Disable if editing existing entry
            >
              {/* <Option value="general">Khối chung (Toán, Văn, Anh)</Option> */}
              <Option value="natural">Khoa học tự nhiên (Lý, Hóa, Sinh)</Option>
              <Option value="social">Khoa học xã hội (Sử, Địa, GDCD)</Option>
            </Select>
          </Form.Item>

          {selectedExamBan && (
            <Row gutter={[16, 16]}>
              {/* Common subjects */}
              {subjects.general.map((subject) => (
                <Col xs={24} sm={8} key={`exam-${subject}`}>
                  <Form.Item
                    label={`Điểm ${subject}`}
                    name={`score${subject}`}
                    rules={[
                      { required: true, message: `Vui lòng nhập điểm ${subject}` },
                      { type: "number", min: 0, max: 10, message: "Điểm phải từ 0 đến 10" },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
                  </Form.Item>
                </Col>
              ))}

              {/* Natural subjects */}
              {selectedExamBan === "natural" &&
                subjects.natural.map((subject) => (
                  <Col xs={24} sm={8} key={`exam-${subject}`}>
                    <Form.Item
                      label={`Điểm ${subject}`}
                      name={`score${subject}`}
                      rules={[
                        { required: true, message: `Vui lòng nhập điểm ${subject}` },
                        { type: "number", min: 0, max: 10, message: "Điểm phải từ 0 đến 10" },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
                    </Form.Item>
                  </Col>
                ))}

              {/* Social subjects */}
              {selectedExamBan === "social" &&
                subjects.social.map((subject) => (
                  <Col xs={24} sm={8} key={`exam-${subject}`}>
                    <Form.Item
                      label={`Điểm ${subject}`}
                      name={`score${subject}`}
                      rules={[
                        { required: true, message: `Vui lòng nhập điểm ${subject}` },
                        { type: "number", min: 0, max: 10, message: "Điểm phải từ 0 đến 10" },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
                    </Form.Item>
                  </Col>
                ))}
            </Row>
          )}

          <Form.Item
            label="File minh chứng điểm thi"
            name="examFile"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
              <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '186px' }} disabled={!!examScoresTableData && !currentEditingExamKey}>
              {currentEditingExamKey ? "Cập nhật điểm thi THPT" : "Lưu điểm thi THPT"}
            </Button>
          </Form.Item>
        </Form>

        
        <Title level={4} style={{ textAlign: "center", marginTop: "40px", marginBottom: "24px" }}>
          Thông tin điểm thi THPT của bạn
        </Title>
        {examScoresTableData ? (
          <Table
            columns={examTableDisplayColumns}
            dataSource={[examScoresTableData]} // Wrap in array for Table component
            pagination={false}
            scroll={{ x: true }}
            bordered
          />
        ) : (
          <Text type="secondary" style={{ textAlign: "center", display: "block", padding: "20px" }}>
            Chưa có thông tin điểm thi THPT nào được nhập.
          </Text>
        )}
      </TabPane>

      {/* --- Học bạ Tab --- */}
      <TabPane tab="Điểm học bạ" key="2">
        <Form
          form={hkbForm}
          layout="vertical"
          onFinish={onHkbFinish}
          style={{ maxWidth: 1000, margin: "auto", padding: "20px", border: "1px solid #f0f0f0", borderRadius: "8px" }}
        >
          <Title level={4} style={{ textAlign: "center", marginBottom: "24px" }}>Nhập điểm học bạ</Title>
          <Title level={5}>Nhập điểm trung bình từng môn theo kỳ</Title>
          <Table
            columns={hkbInputTableColumns}
            dataSource={hkbInputDataSource}
            pagination={false}
            scroll={{ x: 900 }}
            bordered
            size="small"
          />
          <div style={{ marginTop: 16, marginBottom: 16, textAlign: "right" }}>
            <Text strong>Điểm trung bình tổng 11 môn 6 kỳ: {averageOverallHkbScore().toFixed(2)}</Text>
          </div>

          <Form.Item
            label="File minh chứng học bạ"
            name="hkbFile"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
              <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '186px' }} disabled={!!hkbScoresTableData && !currentEditingHkbKey}>
              {currentEditingHkbKey ? "Cập nhật điểm học bạ" : "Lưu điểm học bạ"}
            </Button>
          </Form.Item>
        </Form>

        
        <Title level={4} style={{ textAlign: "center", marginTop: "40px", marginBottom: "24px" }}>
          Thông tin điểm học bạ của bạn
        </Title>
        {hkbScoresTableData ? (
          <>
            <Table
              columns={hkbTableDisplayColumns}
              dataSource={[hkbScoresTableData]}
              pagination={false}
              scroll={{ x: true }}
              bordered
              style={{ marginBottom: '20px' }}
            />
            <Title level={5} style={{ textAlign: "center", marginTop: "20px", marginBottom: "15px" }}>
              Điểm trung bình 6 kỳ của từng môn
            </Title>
            <Table
              columns={hkbSubjectAveragesColumns}
              dataSource={hkbSubjectAveragesDataSource}
              pagination={false}
              size="small"
              bordered
              style={{ maxWidth: 400, margin: 'auto' }}
            />
          </>
        ) : (
          <Text type="secondary" style={{ textAlign: "center", display: "block", padding: "20px" }}>
            Chưa có thông tin điểm học bạ nào được nhập.
          </Text>
        )}
      </TabPane>

      {/* --- Đánh giá năng lực/tư duy Tab --- */}
      <TabPane tab="Đánh giá năng lực/tư duy" key="3">
        <Form
          form={dgnlDgtdForm}
          layout="vertical"
          onFinish={onDgnlDgtdFinish}
          style={{ maxWidth: 700, margin: "auto", padding: "20px", border: "1px solid #f0f0f0", borderRadius: "8px" }}
        >
          <Title level={4} style={{ textAlign: "center", marginBottom: "16px" }}>Nhập điểm Đánh giá năng lực/tư duy</Title>
          
          <Form.Item
            label="Loại hình đánh giá"
            name="assessmentType"
            rules={[{ required: true, message: "Vui lòng chọn loại hình đánh giá" }]}
          >
            <Select placeholder="Chọn loại hình" onChange={(value: "ĐGNL" | "ĐGTD") => {
                setSelectedAssessmentType(value);
                dgnlDgtdForm.setFieldsValue({ assessmentUnit: null }); // Reset unit when type changes
            }} disabled={!!currentEditingDgnlDgtdKey}>
              <Option value="ĐGNL">Đánh giá năng lực (ĐGNL)</Option>
              <Option value="ĐGTD">Đánh giá tư duy (ĐGTD)</Option>
            </Select>
          </Form.Item>

          {selectedAssessmentType && (
            <>
              <Form.Item
                label="Đơn vị tổ chức"
                name="assessmentUnit"
                rules={[{ required: true, message: "Vui lòng chọn đơn vị tổ chức" }]}
              >
                <Select 
                  placeholder="Chọn đơn vị tổ chức"
                  disabled={currentEditingDgnlDgtdKey ? true : getAvailableUnits(selectedAssessmentType).length === 0}
                >
                  {currentEditingDgnlDgtdKey ? (
                    // When editing, show all units for the selected type
                    selectedAssessmentType === "ĐGNL" ? assessmentUnits.dgnl.map(({ label, value }) => (
                      <Option key={value} value={value}>
                        {label}
                      </Option>
                    )) : assessmentUnits.dgtd.map(({ label, value }) => (
                      <Option key={value} value={value}>
                        {label}
                      </Option>
                    ))
                  ) : (
                    // When adding new, only show available units
                    getAvailableUnits(selectedAssessmentType).map(({ label, value }) => (
                      <Option key={value} value={value}>
                        {label}
                      </Option>
                    ))
                  )}
                </Select>
              </Form.Item>
              
              {!currentEditingDgnlDgtdKey && getAvailableUnits(selectedAssessmentType).length === 0 && (
                <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#fff7e6', border: '1px solid #ffd591', borderRadius: '4px' }}>
                  <Text type="warning">
                    Bạn đã nhập điểm cho tất cả các đơn vị của {selectedAssessmentType}. 
                    {selectedAssessmentType === "ĐGNL" && " (Đã có điểm cho cả ĐH Quốc gia Hà Nội và ĐH Quốc gia TP.HCM)"}
                    {selectedAssessmentType === "ĐGTD" && " (Đã có điểm cho ĐH Bách Khoa Hà Nội)"}
                  </Text>
                </div>
              )}
            </>
          )}

          <Form.Item
            label="Điểm thi"
            name="assessmentScore"
            rules={[
              { required: true, message: "Vui lòng nhập điểm thi" },
              { type: "number", min: 0, max: 150, message: "Điểm từ 0 đến 150" },
            ]}
          >
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              max={150} 
              step={0.1}
              disabled={
                !currentEditingDgnlDgtdKey && 
                selectedAssessmentType ? 
                getAvailableUnits(selectedAssessmentType).length === 0 : false
              }
            />
          </Form.Item>

          <Form.Item
            label="File minh chứng"
            name="assessmentFile"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
              <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '186px' }}
              disabled={
                !currentEditingDgnlDgtdKey && 
                selectedAssessmentType ? 
                getAvailableUnits(selectedAssessmentType).length === 0 : false
              }
            >
              {currentEditingDgnlDgtdKey ? "Cập nhật đánh giá" : "Lưu đánh giá"}
            </Button>
          </Form.Item>
        </Form>

        
        <Title level={4} style={{ textAlign: "center", marginTop: "40px", marginBottom: "24px" }}>
          Thông tin ĐGNL/ĐGTD của bạn
        </Title>
        {dgnlDgtdScoresTableData.length > 0 ? (
          <Table
            columns={dgnlDgtdTableDisplayColumns}
            dataSource={dgnlDgtdScoresTableData}
            pagination={false}
            scroll={{ x: true }}
            bordered
          />
        ) : (
          <Text type="secondary" style={{ textAlign: "center", display: "block", padding: "20px" }}>
            Chưa có thông tin ĐGNL/ĐGTD nào được nhập.
          </Text>
        )}
      </TabPane>
    </Tabs>
  );
};

export default Scores;