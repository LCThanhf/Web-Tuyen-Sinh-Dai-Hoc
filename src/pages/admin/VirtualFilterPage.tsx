// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import {
//   Table,
//   Button,
//   Input,
//   Space,
//   Tag,
//   Typography,
//   Spin,
//   Select,
//   Form,
//   InputNumber,
//   Divider,
//   Card,
//   Row,
//   Col,
//   message,
// } from 'antd';
// import { FilterOutlined, RiseOutlined, ExperimentOutlined, UserOutlined } from '@ant-design/icons';

// const { Title, Text } = Typography;
// const { Option } = Select;

// // Định nghĩa kiểu dữ liệu cơ bản
// interface School {
//   id: string;
//   name: string;
//   code: string;
// }

// interface Major {
//   id: string;
//   name: string;
//   code: string;
//   schoolId: string;
// }

// interface AdmissionCombination {
//   id: string;
//   name: string;
//   subjects: string[];
//   majorId: string;
//   schoolId: string;
// }

// // Giả định dữ liệu điểm của thí sinh
// // Trong thực tế, dữ liệu này sẽ đến từ quá trình nhập điểm của thí sinh
// // và có thể có nhiều loại điểm (thi THPT, học bạ, năng lực chuyên biệt...)
// interface ApplicantScore {
//   studentId: string;
//   fullName: string;
//   majorId: string; // Ngành thí sinh đăng ký nguyện vọng này
//   schoolId: string; // Trường thí sinh đăng ký nguyện vọng này
//   combinationId: string; // Tổ hợp thí sinh dùng để xét
//   priorityOrder: number; // Thứ tự nguyện vọng
//   totalScore: number; // Tổng điểm (đã tính ưu tiên nếu có)
//   originalScore: number; // Điểm gốc chưa ưu tiên
//   priorityScore?: number; // Điểm ưu tiên (nếu có)
//   status: 'Đã nộp' | 'Đã duyệt'; // Chỉ lọc các hồ sơ đã nộp/đã duyệt minh chứng
// }

// // Giả định dữ liệu chỉ tiêu và điểm sàn
// interface AdmissionQuota {
//   schoolId: string;
//   majorId: string;
//   combinationId?: string; // Có thể có chỉ tiêu chung cho ngành, hoặc chi tiết theo tổ hợp
//   quota: number; // Chỉ tiêu
//   minScore?: number; // Điểm sàn (nếu có)
// }

// // --- Dữ liệu giả lập ---
// const dummySchools: School[] = [
//   { id: '1', name: 'Đại học Bách Khoa Hà Nội', code: 'BKA' },
//   { id: '2', name: 'Đại học Quốc gia Hà Nội', code: 'QGHN' },
//   { id: '3', name: 'Đại học Ngoại Thương', code: 'NT' },
// ];

// const dummyMajors: Major[] = [
//   { id: '101', name: 'Khoa học Máy tính', code: 'IT1', schoolId: '1' },
//   { id: '102', name: 'Kỹ thuật Điện tử Viễn thông', code: 'ET', schoolId: '1' },
//   { id: '103', name: 'Công nghệ thông tin', code: 'CNTT', schoolId: '2' },
//   { id: '201', name: 'Kinh tế Quốc tế', code: 'KTQT', schoolId: '3' },
//   { id: '202', name: 'Quản trị Kinh doanh', code: 'QTKD', schoolId: '3' },
// ];

// const dummyCombinations: AdmissionCombination[] = [
//   { id: 'C001', name: 'A00', subjects: ['Toán', 'Lý', 'Hóa'], majorId: '101', schoolId: '1' },
//   { id: 'C002', name: 'A01', subjects: ['Toán', 'Lý', 'Anh'], majorId: '101', schoolId: '1' },
//   { id: 'C003', name: 'D07', subjects: ['Toán', 'Hóa', 'Anh'], majorId: '101', schoolId: '1' },
//   { id: 'C004', name: 'A00', subjects: ['Toán', 'Lý', 'Hóa'], majorId: '102', schoolId: '1' },
//   { id: 'C005', name: 'A01', subjects: ['Toán', 'Lý', 'Anh'], majorId: '102', schoolId: '1' },
//   { id: 'C006', name: 'A00', subjects: ['Toán', 'Lý', 'Hóa'], majorId: '103', schoolId: '2' },
//   { id: 'C007', name: 'D01', subjects: ['Toán', 'Văn', 'Anh'], majorId: '201', schoolId: '3' },
//   { id: 'C008', name: 'A00', subjects: ['Toán', 'Lý', 'Hóa'], majorId: '202', schoolId: '3' },
// ];

// const dummyApplicantScores: ApplicantScore[] = [
//   // Nguyễn Văn A - Nộp NV1: BKA-KHTN-A00, NV2: BKA-KTĐT-A00
//   { studentId: 'SV001', fullName: 'Nguyễn Văn A', schoolId: '1', majorId: '101', combinationId: 'C001', priorityOrder: 1, totalScore: 28.5, originalScore: 27.5, priorityScore: 1.0, status: 'Đã duyệt' },
//   { studentId: 'SV001', fullName: 'Nguyễn Văn A', schoolId: '1', majorId: '102', combinationId: 'C004', priorityOrder: 2, totalScore: 28.0, originalScore: 27.0, priorityScore: 1.0, status: 'Đã duyệt' },

//   // Trần Thị B - Nộp NV1: NT-KTQT-D01
//   { studentId: 'SV002', fullName: 'Trần Thị B', schoolId: '3', majorId: '201', combinationId: 'C007', priorityOrder: 1, totalScore: 27.8, originalScore: 27.8, status: 'Đã duyệt' },

//   // Lê Văn C - Nộp NV1: QGHN-CNTT-A00
//   { studentId: 'SV003', fullName: 'Lê Văn C', schoolId: '2', majorId: '103', combinationId: 'C006', priorityOrder: 1, totalScore: 26.0, originalScore: 26.0, status: 'Đã duyệt' },

//   // Phạm Thị D - Nộp NV1: BKA-KHTN-A01
//   { studentId: 'SV004', fullName: 'Phạm Thị D', schoolId: '1', majorId: '101', combinationId: 'C002', priorityOrder: 1, totalScore: 28.3, originalScore: 28.3, status: 'Đã duyệt' },

//   // Hoàng Văn E - Nộp NV1: NT-QTKD-A00
//   { studentId: 'SV005', fullName: 'Hoàng Văn E', schoolId: '3', majorId: '202', combinationId: 'C008', priorityOrder: 1, totalScore: 25.5, originalScore: 25.5, status: 'Đã duyệt' },

//   // Nguyễn Thị F - Nộp NV1: BKA-KHTN-A00
//   { studentId: 'SV006', fullName: 'Nguyễn Thị F', schoolId: '1', majorId: '101', combinationId: 'C001', priorityOrder: 1, totalScore: 28.1, originalScore: 27.1, priorityScore: 1.0, status: 'Đã duyệt' },

//   // Đặng Văn G - Nộp NV1: BKA-KHTN-A00, NV2: BKA-KTĐT-A00
//   { studentId: 'SV007', fullName: 'Đặng Văn G', schoolId: '1', majorId: '101', combinationId: 'C001', priorityOrder: 1, totalScore: 27.9, originalScore: 27.9, status: 'Đã duyệt' },
//   { studentId: 'SV007', fullName: 'Đặng Văn G', schoolId: '1', majorId: '102', combinationId: 'C004', priorityOrder: 2, totalScore: 27.8, originalScore: 27.8, status: 'Đã duyệt' },

//   // Bùi Thị H - Nộp NV1: NT-KTQT-D01
//   { studentId: 'SV008', fullName: 'Bùi Thị H', schoolId: '3', majorId: '201', combinationId: 'C007', priorityOrder: 1, totalScore: 27.0, originalScore: 27.0, status: 'Đã duyệt' },

//   // Võ Văn I - Nộp NV1: QGHN-CNTT-A00
//   { studentId: 'SV009', fullName: 'Võ Văn I', schoolId: '2', majorId: '103', combinationId: 'C006', priorityOrder: 1, totalScore: 26.5, originalScore: 26.5, status: 'Đã duyệt' },

//   // Dương Thị K - Nộp NV1: BKA-KHTN-A00, NV2: BKA-KTĐT-A00
//   { studentId: 'SV010', fullName: 'Dương Thị K', schoolId: '1', majorId: '101', combinationId: 'C001', priorityOrder: 1, totalScore: 27.5, originalScore: 27.5, status: 'Đã duyệt' },
//   { studentId: 'SV010', fullName: 'Dương Thị K', schoolId: '1', majorId: '102', combinationId: 'C004', priorityOrder: 2, totalScore: 27.4, originalScore: 27.4, status: 'Đã duyệt' },

//   // Nguyễn Văn L - Nộp NV1: BKA-KHTN-A00
//   { studentId: 'SV011', fullName: 'Nguyễn Văn L', schoolId: '1', majorId: '101', combinationId: 'C001', priorityOrder: 1, totalScore: 27.2, originalScore: 27.2, status: 'Đã duyệt' },

// ];

// const dummyQuotas: AdmissionQuota[] = [
//   { schoolId: '1', majorId: '101', quota: 5, minScore: 20 }, // Khoa học Máy tính - BKA
//   { schoolId: '1', majorId: '102', quota: 3, minScore: 18 }, // Kỹ thuật Điện tử Viễn thông - BKA
//   { schoolId: '2', majorId: '103', quota: 4, minScore: 19 }, // Công nghệ thông tin - QGHN
//   { schoolId: '3', majorId: '201', quota: 2, minScore: 20 }, // Kinh tế Quốc tế - NT
//   { schoolId: '3', majorId: '202', quota: 1, minScore: 18 }, // Quản trị Kinh doanh - NT
// ];
// // --- Hết dữ liệu giả lập ---


// const VirtualFilterPage: React.FC = () => {
//   const [schools, setSchools] = useState<School[]>([]);
//   const [majors, setMajors] = useState<Major[]>([]);
//   const [combinations, setCombinations] = useState<AdmissionCombination[]>([]);
//   const [applicantScores, setApplicantScores] = useState<ApplicantScore[]>([]);
//   const [quotas, setQuotas] = useState<AdmissionQuota[]>([]);

//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();
//   const [filteredResults, setFilteredResults] = useState<ApplicantScore[]>([]);
//   const [admissionScore, setAdmissionScore] = useState<number | null>(null); // Điểm chuẩn dự kiến
//   const [totalAdmitted, setTotalAdmitted] = useState<number>(0); // Tổng số thí sinh trúng tuyển

//   // Các state cho bộ lọc
//   const [filterYear, setFilterYear] = useState<string>('2024'); // Năm tuyển sinh
//   const [filterMethod, setFilterMethod] = useState<string>('Thi THPT'); // Phương thức xét tuyển
//   const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>(undefined);
//   const [selectedMajorId, setSelectedMajorId] = useState<string | undefined>(undefined);
//   const [filteredMajors, setFilteredMajors] = useState<Major[]>([]);

//   useEffect(() => {
//     setLoading(true);
//     const fetchData = async () => {
//       await new Promise(resolve => setTimeout(resolve, 500));
//       setSchools(dummySchools);
//       setMajors(dummyMajors);
//       setCombinations(dummyCombinations);
//       setApplicantScores(dummyApplicantScores);
//       setQuotas(dummyQuotas);
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   // Lọc ngành theo trường được chọn
//   useEffect(() => {
//     if (selectedSchoolId) {
//       setFilteredMajors(majors.filter(major => major.schoolId === selectedSchoolId));
//       setSelectedMajorId(undefined); // Reset major selection when school changes
//     } else {
//       setFilteredMajors(majors); // Hiển thị tất cả ngành nếu không chọn trường
//       setSelectedMajorId(undefined);
//     }
//     setFilteredResults([]); // Reset kết quả khi thay đổi bộ lọc
//     setAdmissionScore(null);
//     setTotalAdmitted(0);
//   }, [selectedSchoolId, majors]);


//   // Hàm ánh xạ ID sang tên
//   const getSchoolName = (id: string) => schools.find(s => s.id === id)?.name || 'N/A';
//   const getMajorName = (id: string) => majors.find(m => m.id === id)?.name || 'N/A';
//   const getCombinationName = (id: string) => combinations.find(c => c.id === id)?.name || 'N/A';


//   // --- THUẬT TOÁN LỌC ẢO ĐƠN GIẢN ---
//   // Thuật toán này chỉ xét nguyện vọng 1 của thí sinh và xếp theo điểm từ cao xuống thấp.
//   // Trong thực tế, cần một thuật toán phức tạp hơn để xử lý nguyện vọng ưu tiên, xét đa ngành,
//   // điểm sàn, tiêu chí phụ, và chỉ tiêu ngành/tổ hợp.
//   const runVirtualFilter = useCallback(async () => {
//     try {
//       await form.validateFields(); // Đảm bảo các trường form đã hợp lệ

//       if (!selectedSchoolId || !selectedMajorId) {
//         message.warning('Vui lòng chọn Trường và Ngành để chạy lọc ảo.');
//         return;
//       }

//       setLoading(true);
//       setFilteredResults([]);
//       setAdmissionScore(null);
//       setTotalAdmitted(0);
//       await new Promise(resolve => setTimeout(resolve, 800)); // Giả lập thời gian chạy thuật toán

//       const targetQuota = quotas.find(q => q.schoolId === selectedSchoolId && q.majorId === selectedMajorId);

//       if (!targetQuota) {
//         message.warning('Không tìm thấy chỉ tiêu cho ngành này. Vui lòng cấu hình chỉ tiêu.');
//         setLoading(false);
//         return;
//       }

//       // 1. Lọc ra các nguyện vọng hợp lệ cho ngành đã chọn
//       // Giả định chỉ xét các nguyện vọng 1 và trạng thái 'Đã duyệt'
//       let eligibleApplicants = applicantScores.filter(app =>
//         app.schoolId === selectedSchoolId &&
//         app.majorId === selectedMajorId &&
//         app.priorityOrder === 1 && // Chỉ xét nguyện vọng 1
//         app.status === 'Đã duyệt'
//       );

//       // 2. Sắp xếp thí sinh theo tổng điểm từ cao xuống thấp
//       eligibleApplicants.sort((a, b) => b.totalScore - a.totalScore);

//       const admittedList: ApplicantScore[] = [];
//       let lastAdmittedScore: number | null = null;
//       let currentQuota = targetQuota.quota;

//       if (targetQuota.minScore) {
//           // Lọc bỏ những thí sinh dưới điểm sàn
//           eligibleApplicants = eligibleApplicants.filter(app => app.totalScore >= targetQuota.minScore!);
//       }

//       // 3. Xét tuyển theo chỉ tiêu
//       for (let i = 0; i < eligibleApplicants.length && currentQuota > 0; i++) {
//         const applicant = eligibleApplicants[i];
//         admittedList.push(applicant);
//         lastAdmittedScore = applicant.totalScore;
//         currentQuota--;
//       }

//       // Xử lý tiêu chí phụ (nếu có thí sinh đồng điểm ở cuối danh sách)
//       // Tìm tất cả các thí sinh có điểm bằng lastAdmittedScore
//       if (lastAdmittedScore !== null && currentQuota === 0) {
//         const remainingApplicantsWithSameScore = eligibleApplicants.filter(
//           app => app.totalScore === lastAdmittedScore && !admittedList.includes(app)
//         );

//         // Trong thực tế, ở đây sẽ có các tiêu chí phụ để chọn ra số lượng phù hợp
//         // Ví dụ: ưu tiên điểm môn Toán, ưu tiên nguyện vọng, v.v.
//         // Đối với ví dụ này, chúng ta chỉ thêm hết những người bằng điểm vào (nếu không có đủ tiêu chí phụ)
//         admittedList.push(...remainingApplicantsWithSameScore);
//       }


//       setFilteredResults(admittedList);
//       setAdmissionScore(lastAdmittedScore);
//       setTotalAdmitted(admittedList.length);
//       message.success('Chạy lọc ảo thành công!');
//     } catch (errorInfo) {
//       console.error('Lỗi khi chạy lọc ảo:', errorInfo);
//       message.error('Vui lòng kiểm tra lại cấu hình lọc ảo.');
//     } finally {
//       setLoading(false);
//     }
//   }, [form, selectedSchoolId, selectedMajorId, applicantScores, quotas]);
//   // --- KẾT THÚC THUẬT TOÁN LỌC ẢO ĐƠN GIẢN ---


//   const columns = [
//     {
//       title: 'STT',
//       render: (text: any, record: ApplicantScore, index: number) => index + 1,
//       width: 50,
//       align: 'center' as const,
//     },
//     {
//       title: 'Mã SV',
//       dataIndex: 'studentId',
//       key: 'studentId',
//       sorter: (a: ApplicantScore, b: ApplicantScore) => a.studentId.localeCompare(b.studentId),
//     },
//     {
//       title: 'Họ và tên',
//       dataIndex: 'fullName',
//       key: 'fullName',
//       sorter: (a: ApplicantScore, b: ApplicantScore) => a.fullName.localeCompare(b.fullName),
//     },
//     {
//       title: 'Trường ĐK',
//       dataIndex: 'schoolId',
//       key: 'schoolName',
//       render: (schoolId: string) => getSchoolName(schoolId),
//     },
//     {
//       title: 'Ngành ĐK',
//       dataIndex: 'majorId',
//       key: 'majorName',
//       render: (majorId: string) => getMajorName(majorId),
//     },
//     {
//       title: 'Tổ hợp',
//       dataIndex: 'combinationId',
//       key: 'combinationName',
//       render: (combinationId: string) => getCombinationName(combinationId),
//     },
//     {
//       title: 'NV',
//       dataIndex: 'priorityOrder',
//       key: 'priorityOrder',
//       sorter: (a: ApplicantScore, b: ApplicantScore) => a.priorityOrder - b.priorityOrder,
//       align: 'center' as const,
//     },
//     {
//       title: 'Điểm gốc',
//       dataIndex: 'originalScore',
//       key: 'originalScore',
//       sorter: (a: ApplicantScore, b: ApplicantScore) => a.originalScore - b.originalScore,
//       align: 'center' as const,
//     },
//     {
//       title: 'Điểm ưu tiên',
//       dataIndex: 'priorityScore',
//       key: 'priorityScore',
//       render: (score?: number) => score || 0,
//       sorter: (a: ApplicantScore, b: ApplicantScore) => (a.priorityScore || 0) - (b.priorityScore || 0),
//       align: 'center' as const,
//     },
//     {
//       title: 'Tổng điểm',
//       dataIndex: 'totalScore',
//       key: 'totalScore',
//       sorter: (a: ApplicantScore, b: ApplicantScore) => a.totalScore - b.totalScore,
//       align: 'center' as const,
//       render: (score: number) => <Text strong>{score.toFixed(2)}</Text>,
//     },
//   ];

//   return (
//     <div>
//       <Title level={3}>Công cụ Lọc ảo Xét tuyển</Title>

//       <Card title="Cấu hình Lọc ảo" style={{ marginBottom: 20 }}>
//         <Form form={form} layout="vertical" name="virtual_filter_config">
//           <Row gutter={16}>
//             <Col span={6}>
//               <Form.Item label="Năm tuyển sinh">
//                 <Select value={filterYear} onChange={setFilterYear}>
//                   <Option value="2024">2024</Option>
//                   <Option value="2023">2023</Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item label="Phương thức xét tuyển">
//                 <Select value={filterMethod} onChange={setFilterMethod}>
//                   <Option value="Thi THPT">Thi THPT QG</Option>
//                   <Option value="ĐGNL">Đánh giá Năng lực</Option>
//                   <Option value="Học bạ">Học bạ</Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item label="Trường">
//                 <Select
//                   placeholder="Chọn Trường"
//                   onChange={value => setSelectedSchoolId(value)}
//                   value={selectedSchoolId}
//                   showSearch
//                   optionFilterProp="children"
//                   filterOption={(input, option) =>
//                     (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
//                   }
//                 >
//                   {schools.map(school => (
//                     <Option key={school.id} value={school.id}>
//                       {school.name} ({school.code})
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item label="Ngành">
//                 <Select
//                   placeholder="Chọn Ngành"
//                   onChange={value => setSelectedMajorId(value)}
//                   value={selectedMajorId}
//                   disabled={!selectedSchoolId}
//                   showSearch
//                   optionFilterProp="children"
//                   filterOption={(input, option) =>
//                     (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
//                   }
//                 >
//                   {filteredMajors.map(major => (
//                     <Option key={major.id} value={major.id}>
//                       {major.name} ({major.code})
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={6}>
//               <Form.Item label="Chỉ tiêu (dự kiến)" name="quota" initialValue={
//                   quotas.find(q => q.schoolId === selectedSchoolId && q.majorId === selectedMajorId)?.quota || 0
//                 }>
//                 <InputNumber min={0} style={{ width: '100%' }} />
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item label="Điểm sàn (dự kiến)" name="minScore" initialValue={
//                  quotas.find(q => q.schoolId === selectedSchoolId && q.majorId === selectedMajorId)?.minScore
//               }>
//                 <InputNumber min={0} max={30} step={0.01} style={{ width: '100%' }} />
//               </Form.Item>
//             </Col>
//             {/* Có thể thêm các tiêu chí phụ khác tại đây */}
//           </Row>
//           <Form.Item>
//             <Button
//               type="primary"
//               icon={<FilterOutlined />}
//               onClick={runVirtualFilter}
//               loading={loading}
//               disabled={!selectedSchoolId || !selectedMajorId}
//             >
//               Chạy Lọc ảo
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>

//       <Divider orientation="left">Kết quả Lọc ảo</Divider>

//       {selectedSchoolId && selectedMajorId && !loading && (
//         <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
//           <Col span={8}>
//             <Card bordered={false}>
//               <Space direction="vertical" align="center" style={{ width: '100%' }}>
//                 <ExperimentOutlined style={{ fontSize: 30, color: '#1890ff' }} />
//                 <Text type="secondary">Số lượng trúng tuyển dự kiến</Text>
//                 <Title level={4}>{totalAdmitted}</Title>
//               </Space>
//             </Card>
//           </Col>
//           <Col span={8}>
//             <Card bordered={false}>
//               <Space direction="vertical" align="center" style={{ width: '100%' }}>
//                 <RiseOutlined style={{ fontSize: 30, color: '#52c41a' }} />
//                 <Text type="secondary">Điểm chuẩn dự kiến</Text>
//                 <Title level={4}>{admissionScore !== null ? admissionScore.toFixed(2) : 'N/A'}</Title>
//               </Space>
//             </Card>
//           </Col>
//           <Col span={8}>
//              <Card bordered={false}>
//               <Space direction="vertical" align="center" style={{ width: '100%' }}>
//                 <UserOutlined style={{ fontSize: 30, color: '#faad14' }} />
//                 <Text type="secondary">Tổng số NV đủ điều kiện</Text>
//                 <Title level={4}>
//                   {applicantScores.filter(app =>
//                     app.schoolId === selectedSchoolId &&
//                     app.majorId === selectedMajorId &&
//                     app.priorityOrder === 1 &&
//                     app.status === 'Đã duyệt'
//                   ).length}
//                 </Title>
//               </Space>
//             </Card>
//           </Col>
//         </Row>
//       )}


//       <Spin spinning={loading} tip="Đang chạy thuật toán lọc ảo...">
//         <Table
//           columns={columns}
//           dataSource={filteredResults}
//           rowKey="studentId" // Sử dụng studentId hoặc id của nguyện vọng làm key
//           pagination={{ pageSize: 10 }}
//           bordered
//           locale={{ emptyText: 'Chưa có kết quả lọc ảo. Vui lòng cấu hình và chạy lọc ảo.' }}
//         />
//       </Spin>
//     </div>
//   );
// };

// export default VirtualFilterPage;







import React, { useState, useEffect } from 'react';
import {
  Typography,
  Select,
  Button,
  Table,
  Card,
  Row,
  Col,
  message,
  Spin,
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

// --- Interfaces ---
interface School {
  id: string;
  name: string;
}

interface Major {
  id: string;
  name: string;
  schoolId: string;
}

interface Application {
  applicantId: string;
  fullName: string;
  schoolId: string;
  majorId: string;
  priorityOrder: number;
  totalScore: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

interface Quota {
  schoolId: string;
  majorId: string;
  quota: number;
  minScore?: number;
}

// --- Dummy Data ---
const dummySchools: School[] = [
  { id: '1', name: 'Đại học Bách Khoa Hà Nội' },
  { id: '2', name: 'Đại học Quốc gia Hà Nội' },
  { id: '3', name: 'Đại học Ngoại Thương' },
];

const dummyMajors: Major[] = [
  { id: '101', name: 'Khoa học Máy tính', schoolId: '1' },
  { id: '102', name: 'Kỹ thuật Điện tử Viễn thông', schoolId: '1' },
  { id: '103', name: 'Công nghệ thông tin', schoolId: '2' },
  { id: '201', name: 'Kinh tế Quốc tế', schoolId: '3' },
  { id: '202', name: 'Quản trị Kinh doanh', schoolId: '3' },
];

const dummyApplications: Application[] = [
  { applicantId: 'SV001', fullName: 'Nguyễn Văn A', schoolId: '1', majorId: '101', priorityOrder: 1, totalScore: 28.5, status: 'Approved' },
  { applicantId: 'SV001', fullName: 'Nguyễn Văn A', schoolId: '1', majorId: '102', priorityOrder: 2, totalScore: 28.0, status: 'Approved' },
  { applicantId: 'SV002', fullName: 'Trần Thị B', schoolId: '3', majorId: '201', priorityOrder: 1, totalScore: 27.8, status: 'Approved' },
  { applicantId: 'SV003', fullName: 'Lê Văn C', schoolId: '2', majorId: '103', priorityOrder: 1, totalScore: 26.0, status: 'Approved' },
  { applicantId: 'SV004', fullName: 'Phạm Thị D', schoolId: '1', majorId: '101', priorityOrder: 1, totalScore: 28.3, status: 'Approved' },
  { applicantId: 'SV005', fullName: 'Hoàng Văn E', schoolId: '3', majorId: '202', priorityOrder: 1, totalScore: 25.5, status: 'Approved' },
  { applicantId: 'SV003', fullName: 'Lê Văn C', schoolId: '1', majorId: '102', priorityOrder: 2, totalScore: 26.5, status: 'Approved' },
  { applicantId: 'SV006', fullName: 'Nguyễn Thị F', schoolId: '1', majorId: '101', priorityOrder: 1, totalScore: 28.1, status: 'Approved' },
  { applicantId: 'SV007', fullName: 'Đặng Văn G', schoolId: '1', majorId: '101', priorityOrder: 1, totalScore: 27.9, status: 'Approved' },
  { applicantId: 'SV007', fullName: 'Đặng Văn G', schoolId: '1', majorId: '102', priorityOrder: 2, totalScore: 27.8, status: 'Approved' },
  { applicantId: 'SV008', fullName: 'Bùi Thị H', schoolId: '3', majorId: '201', priorityOrder: 1, totalScore: 27.0, status: 'Approved' },
  { applicantId: 'SV009', fullName: 'Võ Văn I', schoolId: '2', majorId: '103', priorityOrder: 1, totalScore: 26.5, status: 'Approved' },
  { applicantId: 'SV010', fullName: 'Dương Thị K', schoolId: '1', majorId: '101', priorityOrder: 1, totalScore: 27.5, status: 'Approved' },
  { applicantId: 'SV010', fullName: 'Dương Thị K', schoolId: '1', majorId: '102', priorityOrder: 2, totalScore: 27.4, status: 'Approved' },
  { applicantId: 'SV011', fullName: 'Nguyễn Văn L', schoolId: '1', majorId: '101', priorityOrder: 1, totalScore: 27.2, status: 'Approved' },
];

const dummyQuotas: Quota[] = [
  { schoolId: '1', majorId: '101', quota: 5, minScore: 20 },
  { schoolId: '1', majorId: '102', quota: 3, minScore: 18 },
  { schoolId: '2', majorId: '103', quota: 4, minScore: 19 },
  { schoolId: '3', majorId: '201', quota: 2, minScore: 20 },
  { schoolId: '3', majorId: '202', quota: 1, minScore: 18 },
];

// --- Thuật toán lọc ảo đa nguyện vọng ---
function runVirtualFilter(applications: Application[], quotas: Quota[], maxPriority = 3) {
  const admittedMap = new Map<string, Application[]>(); // key = `${schoolId}_${majorId}`
  const admittedApplicants = new Set<string>();

  for (let priority = 1; priority <= maxPriority; priority++) {
    // Lấy các ứng viên nguyện vọng priority chưa trúng tuyển
    const currentApps = applications.filter(app =>
      app.priorityOrder === priority &&
      !admittedApplicants.has(app.applicantId) &&
      app.status === 'Approved'
    );

    // Nhóm theo trường-ngành
    const grouped = currentApps.reduce<Record<string, Application[]>>((acc, app) => {
      const key = `${app.schoolId}_${app.majorId}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(app);
      return acc;
    }, {});

    for (const key in grouped) {
      const groupApps = grouped[key];
      const [schoolId, majorId] = key.split('_');

      const quota = quotas.find(q => q.schoolId === schoolId && q.majorId === majorId);
      if (!quota) continue;

      // Lọc điểm sàn
      const filteredApps = groupApps.filter(app => app.totalScore >= (quota.minScore ?? 0));

      // Sắp xếp điểm giảm dần
      filteredApps.sort((a, b) => b.totalScore - a.totalScore);

      const existingAdmitted = admittedMap.get(key) ?? [];
      const quotaLeft = quota.quota - existingAdmitted.length;
      if (quotaLeft <= 0) continue;

      const admittedNow = filteredApps.slice(0, quotaLeft);

      // Cập nhật danh sách
      admittedMap.set(key, existingAdmitted.concat(admittedNow));
      admittedNow.forEach(app => admittedApplicants.add(app.applicantId));
    }
  }

  return admittedMap;
}

const VirtualFilterPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [quotas, setQuotas] = useState<Quota[]>([]);

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>(undefined);
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]);
  const [selectedMajorId, setSelectedMajorId] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [resultMap, setResultMap] = useState<Map<string, Application[]>>(new Map());

  useEffect(() => {
    // Load dữ liệu giả lập
    setSchools(dummySchools);
    setMajors(dummyMajors);
    setApplications(dummyApplications);
    setQuotas(dummyQuotas);
  }, []);

  // Cập nhật danh sách ngành theo trường
  useEffect(() => {
    if (selectedSchoolId) {
      setFilteredMajors(majors.filter(m => m.schoolId === selectedSchoolId));
      setSelectedMajorId(undefined);
    } else {
      setFilteredMajors([]);
      setSelectedMajorId(undefined);
    }
  }, [selectedSchoolId, majors]);

  const handleRunFilter = () => {
    if (!selectedSchoolId || !selectedMajorId) {
      message.warning('Vui lòng chọn trường và ngành trước khi chạy lọc ảo.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const map = runVirtualFilter(applications, quotas);
      setResultMap(map);
      setLoading(false);
      message.success('Chạy lọc ảo thành công!');
    }, 500);
  };

  const columns = [
    {
      title: 'STT',
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
      align: 'center' as const,
    },
    {
      title: 'Mã thí sinh',
      dataIndex: 'applicantId',
      key: 'applicantId',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Điểm xét tuyển',
      dataIndex: 'totalScore',
      key: 'totalScore',
      sorter: (a: Application, b: Application) => a.totalScore - b.totalScore,
      render: (score: number) => <Text strong>{score.toFixed(2)}</Text>,
      align: 'center' as const,
    },
    {
      title: 'Nguyện vọng',
      dataIndex: 'priorityOrder',
      key: 'priorityOrder',
      align: 'center' as const,
    },
  ];

  // Lấy danh sách thí sinh trúng tuyển của ngành trường được chọn
  const admittedApplicants = selectedSchoolId && selectedMajorId
    ? resultMap.get(`${selectedSchoolId}_${selectedMajorId}`) ?? []
    : [];

  // Tính điểm chuẩn (điểm thấp nhất trong danh sách trúng tuyển)
  const admissionScore = admittedApplicants.length > 0
    ? admittedApplicants.reduce((min, app) => app.totalScore < min ? app.totalScore : min, admittedApplicants[0].totalScore)
    : null;

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Công cụ Lọc Ảo Đa Nguyện Vọng</Title>

      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={8}>
            <label>Chọn Trường</label>
            <Select
              placeholder="Chọn trường"
              value={selectedSchoolId}
              onChange={setSelectedSchoolId}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
            >
              {schools.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
            </Select>
          </Col>
          <Col span={8}>
            <label>Chọn Ngành</label>
            <Select
              placeholder="Chọn ngành"
              value={selectedMajorId}
              onChange={setSelectedMajorId}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
              disabled={!selectedSchoolId}
            >
              {filteredMajors.map(m => <Option key={m.id} value={m.id}>{m.name}</Option>)}
            </Select>
          </Col>
          <Col span={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button type="primary" onClick={handleRunFilter} loading={loading} block>
              Chạy Lọc Ảo
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Card>
              <Text>Số thí sinh trúng tuyển</Text>
              <Title level={3}>{admittedApplicants.length}</Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Text>Điểm chuẩn dự kiến</Text>
              <Title level={3}>{admissionScore !== null ? admissionScore.toFixed(2) : 'N/A'}</Title>
            </Card>
          </Col>
        </Row>

        <Spin spinning={loading} tip="Đang chạy lọc ảo...">
          <Table
            columns={columns}
            dataSource={admittedApplicants}
            rowKey={(record) => record.applicantId + '_' + record.priorityOrder}
            pagination={{ pageSize: 8 }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default VirtualFilterPage;
