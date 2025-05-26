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
// //               { type: "number", min: 0, max: 30, message: "Điểm phải từ 0 đến 30" },
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
// //               <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
// //             </Upload>
// //           </Form.Item>

// //           <Form.Item>
// //             <Button type="primary" htmlType="submit" block>
// //               Lưu điểm đánh giá
// //             </Button>
// //           </Form.Item>
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

//           {/* Vì bạn không cần chọn tổ hợp môn, bỏ phần chọn tổ hợp môn */}

//           <Form.Item
//             label="Điểm môn Toán"
//             name="scoreToan"
//             rules={[
//               { required: true, message: "Vui lòng nhập điểm Toán" },
//               { type: "number", min: 0, max: 10, message: "Điểm phải từ 0 đến 10" },
//             ]}
//           >
//             <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
//           </Form.Item>
//           {/* Tương tự nhập điểm các môn còn lại */}
//           {subjects.slice(1).map((subject) => (
//             <Form.Item
//               label={`Điểm môn ${subject}`}
//               name={`score${subject}`}
//               key={subject}
//               rules={[
//                 { required: true, message: `Vui lòng nhập điểm môn ${subject}` },
//                 { type: "number", min: 0, max: 10, message: "Điểm phải từ 0 đến 10" },
//               ]}
//             >
//               <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
//             </Form.Item>
//           ))}

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

//       <TabPane tab="Điểm học bạ" key="2">
//         <Form
//           form={hkbForm}
//           layout="vertical"
//           onFinish={onHkbFinish}
//           style={{ maxWidth: 900, margin: "auto" }}
//         >
//           <Title level={5}>Nhập điểm học bạ từng môn trong 6 kỳ</Title>
//           <Table
//             columns={columns}
//             dataSource={dataSource}
//             pagination={false}
//             scroll={{ x: 900 }}
//             bordered
//           />
//           <div style={{ marginTop: 16, marginBottom: 16 }}>
//             <Text strong>Điểm trung bình 11 môn 6 kỳ: {averageScore()}</Text>
//           </div>

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

//       <TabPane tab="Đánh giá năng lực (ĐGNL)" key="3">
//         <Form
//           form={dgnlForm}
//           layout="vertical"
//           onFinish={onDgnlFinish}
//           style={{ maxWidth: 700, margin: "auto" }}
//         >
//           <Form.Item
//             label="Đơn vị tổ chức"
//             name="assessmentUnit"
//             rules={[{ required: true, message: "Vui lòng chọn đơn vị tổ chức" }]}
//           >
//             <Select placeholder="Chọn đơn vị tổ chức">
//               {assessmentUnits.map(({ label, value }) => (
//                 <Option key={value} value={value}>
//                   {label}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Điểm thi"
//             name="assessmentScore"
//             rules={[
//               { required: true, message: "Vui lòng nhập điểm thi" },
//               { type: "number", min: 0, max: 150, message: "Điểm từ 0 đến 150" },
//             ]}
//           >
//             <InputNumber style={{ width: "100%" }} min={0} max={150} step={0.1} />
//           </Form.Item>

//           <Form.Item
//             label="File minh chứng đánh giá năng lực"
//             name="assessmentFile"
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
//               Lưu đánh giá năng lực
//             </Button>
//           </Form.Item>
//         </Form>
//       </TabPane>

//       <TabPane tab="Đánh giá tư duy (ĐGTD)" key="4">
//         <Form
//           form={dgtdForm}
//           layout="vertical"
//           onFinish={onDgtdFinish}
//           style={{ maxWidth: 700, margin: "auto" }}
//         >
//           <Form.Item
//             label="Đơn vị tổ chức"
//             name="thinkingUnit"
//             initialValue="DHBK"
//             rules={[{ required: true, message: "Đơn vị tổ chức không được để trống" }]}
//           >
//             <Input disabled />
//           </Form.Item>

//           <Form.Item
//             label="Điểm thi"
//             name="thinkingScore"
//             rules={[
//               { required: true, message: "Vui lòng nhập điểm thi" },
//               { type: "number", min: 0, max: 150, message: "Điểm từ 0 đến 150" },
//             ]}
//           >
//             <InputNumber style={{ width: "100%" }} min={0} max={150} step={0.1} />
//           </Form.Item>

//           <Form.Item
//             label="File minh chứng đánh giá tư duy"
//             name="thinkingFile"
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
//               Lưu đánh giá tư duy
//             </Button>
//           </Form.Item>
//         </Form>
//       </TabPane>
//     </Tabs>
//   );
// };

// export default Scores;






import React, { useState, useEffect } from "react";
import { Form, InputNumber, Button, Table, Typography, message } from "antd";

const { Title, Text } = Typography;

const subjects = [
  "Toán",
  "Văn",
  "Anh",
  "Lý",
  "Hóa",
  "Sinh",
  "Sử",
  "Địa",
  "GDCD",
  "Công nghệ",
  "Tin học",
];

interface ScoreRow {
  key: string;
  subject: string;
  termScores: number[]; // 6 kỳ
  average: number;
}

const HocBaForm: React.FC = () => {
  // Khởi tạo dữ liệu điểm cho 11 môn, 6 kỳ đều là 0
  const initData: ScoreRow[] = subjects.map((subject) => ({
    key: subject,
    subject,
    termScores: Array(6).fill(0),
    average: 0,
  }));

  const [data, setData] = useState<ScoreRow[]>(initData);

  // Hàm tính trung bình 6 kỳ 1 môn
  const calcAverage = (scores: number[]) => {
    const sum = scores.reduce((a, b) => a + b, 0);
    return +(sum / scores.length).toFixed(2);
  };

  // Cập nhật điểm 1 ô kỳ môn
  const onScoreChange = (subjectKey: string, termIndex: number, value: number | null) => {
    setData((prev) => {
      return prev.map((row) => {
        if (row.key === subjectKey) {
          const newTermScores = [...row.termScores];
          newTermScores[termIndex] = value !== null && value !== undefined ? value : 0;
          const newAverage = calcAverage(newTermScores);
          return { ...row, termScores: newTermScores, average: newAverage };
        }
        return row;
      });
    });
  };

  // Cột bảng: môn + 6 kỳ điểm + điểm trung bình
  const columns = [
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      fixed: "left",
      width: 130,
    },
    ...Array.from({ length: 6 }, (_, i) => ({
      title: `HK ${i + 1}`,
      key: `term${i + 1}`,
      width: 90,
      render: (_: any, record: ScoreRow) => (
        <InputNumber
          min={0}
          max={10}
          step={0.1}
          value={record.termScores[i]}
          onChange={(value) => onScoreChange(record.key, i, value)}
          style={{ width: "80%" }}
        />
      ),
    })),
    {
      title: "Điểm TB",
      dataIndex: "average",
      key: "average",
      width: 100,
      render: (val: number) => <Text strong>{val}</Text>,
    },
  ];

  // Submit form lưu dữ liệu
  const onFinish = () => {
    // TODO: bạn có thể gửi data lên backend hoặc lưu localStorage ở đây
    console.log("Học bạ đã nhập:", data);
    message.success("Lưu điểm học bạ thành công!");
  };

  return (
    <>
      <Title level={4}>Nhập điểm học bạ 6 kỳ (11 môn)</Title>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 900 }}
        bordered
        rowKey="key"
        style={{ marginBottom: 16 }}
      />
      <Button type="primary" onClick={onFinish} block>
        Lưu điểm học bạ
      </Button>
    </>
  );
};

export default HocBaForm;
