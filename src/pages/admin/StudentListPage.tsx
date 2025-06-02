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
//   Modal,
//   Descriptions,
//   Row,
//   Col,
//   message,
//   Card,
//   List,
//   Popover,
//   InputNumber,
// } from 'antd';
// import {
//   UserOutlined,
//   SearchOutlined,
//   SolutionOutlined,
//   BookOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   ExclamationCircleOutlined,
//   FileOutlined,
//   EyeOutlined,
//   MailOutlined,
//   InfoCircleOutlined,
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';

// const { Title, Text } = Typography;
// const { Option } = Select;

// // --- Định nghĩa kiểu dữ liệu ---

// // Trạng thái của một minh chứng cụ thể
// type ProofItemStatus = 'Đã tải lên' | 'Chưa tải lên';

// // Trạng thái duyệt của Admin cho từng minh chứng
// type AdminReviewStatus = 'Đã duyệt' | 'Từ chối' | 'Chưa xem xét';

// // Trạng thái tổng thể của việc duyệt minh chứng cho thí sinh
// type ProofOverallStatus = 'Chưa duyệt' | 'Đang chờ' | 'Đã duyệt' | 'Từ chối';

// // Kiểu dữ liệu cho một mục minh chứng
// interface ProofItem {
//   type: string; // Tên loại minh chứng (ví dụ: "CCCD mặt trước")
//   isRequired: boolean; // Có bắt buộc phải nộp file không
//   fileName?: string; // Tên file đã tải lên (nếu có)
//   status: ProofItemStatus; // Trạng thái tải lên
//   filePath?: string; // Đường dẫn tới file (để xem/tải xuống)
//   adminReviewStatus?: AdminReviewStatus; // Trạng thái duyệt của admin
//   adminNote?: string; // Ghi chú của admin cho minh chứng này
//   hasDeclaredNo?: boolean; // Nếu không bắt buộc, thí sinh có thể khai báo là "Không có"
// }

// // Kiểu dữ liệu cho thông tin khai báo của thí sinh
// interface DeclaredInfo {
//   preferredSubjectCombination?: string; // Tổ hợp môn yêu thích
//   hometown?: string; // Quê quán
//   highSchoolGPA?: number; // Điểm trung bình học bạ
//   thptqgScores?: {
//     math?: number;
//     literature?: number;
//     physics?: number;
//     chemistry?: number;
//     biology?: number;
//     english?: number;
//   };
//   dgnltdScore?: number; // Điểm ĐGNL/TD
//   internationalEnglishCert?: string; // Chứng chỉ TA quốc tế (ví dụ: IELTS, TOEFL)
//   nationalStudentAward?: string; // Giải HSG cấp Quốc gia (ví dụ: Nhất, Nhì, Ba)
//   provincialStudentAward?: string; // Giải HSG cấp Tỉnh/TP (ví dụ: Nhất, Nhì, Ba)
//   priorityObject?: string; // Đối tượng ưu tiên (ví dụ: Con liệt sĩ, Anh hùng LLVT)
//   priorityArea?: string; // Khu vực ưu tiên (KV1, KV2, KV2NT, KV3)
//   // ... có thể thêm các thông tin khác
// }


// // Định nghĩa kiểu dữ liệu cho một thí sinh
// interface Student {
//   id: string; // ID nội bộ của thí sinh
//   citizenId: string; // Số CCCD - KHÓA CHÍNH VÀ DUY NHẤT
//   fullName: string;
//   email: string;
//   phone: string;
//   dob: string;
//   declaredInfo: DeclaredInfo; // Thông tin thí sinh tự khai báo
//   proofs: ProofItem[]; // Danh sách các minh chứng của thí sinh này
//   overallProofStatus: ProofOverallStatus; // Trạng thái tổng thể của duyệt minh chứng
// }

// // Kiểu dữ liệu cho Nguyện vọng
// type AdmissionMethod = 'Điểm thi THPTQG' | 'Học bạ' | 'ĐGNL/TD' | 'Khác';

// interface Application {
//   id: string;
//   studentId: string;
//   schoolName: string;
//   majorName: string;
//   combination: string; // Tổ hợp môn
//   priorityOrder: number; // Thứ tự nguyện vọng
//   admissionMethod: AdmissionMethod; // Phương thức xét tuyển
//   scoreForMethod?: number; // Điểm dùng cho phương thức xét tuyển này (nếu có)
//   totalScore: number; // Tổng điểm (điểm sau khi quy đổi nếu có)
// }

// // --- Dữ liệu giả lập ---

// // Danh sách các loại minh chứng chuẩn
// const STANDARD_PROOF_TYPES: { type: string; isRequired: boolean }[] = [
//   { type: 'CCCD mặt trước', isRequired: true },
//   { type: 'CCCD mặt sau', isRequired: true },
//   { type: 'Phiếu điểm thi THPTQG', isRequired: true },
//   { type: 'File minh chứng học bạ', isRequired: true }, // Coi học bạ là bắt buộc để tính điểm học bạ
//   { type: 'Minh chứng đối tượng ưu tiên', isRequired: false },
//   { type: 'Minh chứng khu vực ưu tiên', isRequired: false },
//   { type: 'Phiếu điểm ĐGNL/TD', isRequired: false },
//   { type: 'Chứng chỉ TA quốc tế', isRequired: false },
//   { type: 'Chứng nhận HSG cấp tỉnh/TP', isRequired: false },
//   { type: 'Chứng nhận HSG Quốc gia', isRequired: false },
// ];

// // Hàm khởi tạo minh chứng cho một sinh viên mới
// const initializeProofs = (): ProofItem[] => {
//   return STANDARD_PROOF_TYPES.map(proofType => ({
//     ...proofType,
//     status: 'Chưa tải lên',
//     adminReviewStatus: 'Chưa xem xét',
//   }));
// };

// // Danh sách thí sinh với minh chứng và nguyện vọng
// const dummyStudents: Student[] = [
//   {
//     id: 'S001',
//     citizenId: '001123456789',
//     fullName: 'Nguyễn Văn A',
//     email: 'nguyenvana@example.com',
//     phone: '0912345678',
//     dob: '15/01/2006',
//     declaredInfo: {
//       preferredSubjectCombination: 'A00',
//       hometown: 'Hà Nội',
//       highSchoolGPA: 8.5,
//       thptqgScores: { math: 9.0, physics: 8.5, chemistry: 8.0 },
//       priorityObject: 'Không',
//       priorityArea: 'KV3',
//     },
//     proofs: [
//       { type: 'CCCD mặt trước', isRequired: true, fileName: 'cccd_a_front.pdf', status: 'Đã tải lên', filePath: '/docs/cccd_a_front.pdf', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'CCCD mặt sau', isRequired: true, fileName: 'cccd_a_back.pdf', status: 'Đã tải lên', filePath: '/docs/cccd_a_back.pdf', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'Phiếu điểm thi THPTQG', isRequired: true, fileName: 'thptqg_a.pdf', status: 'Đã tải lên', filePath: '/docs/thptqg_a.pdf', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'File minh chứng học bạ', isRequired: true, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'Minh chứng đối tượng ưu tiên', isRequired: false, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét', hasDeclaredNo: true },
//       { type: 'Minh chứng khu vực ưu tiên', isRequired: false, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'Phiếu điểm ĐGNL/TD', isRequired: false, fileName: 'dgnl_a.pdf', status: 'Đã tải lên', filePath: '/docs/dgnl_a.pdf', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'Chứng chỉ TA quốc tế', isRequired: false, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'Chứng nhận HSG cấp tỉnh/TP', isRequired: false, fileName: 'hsg_a.pdf', status: 'Đã tải lên', filePath: '/docs/hsg_a.pdf', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'Chứng nhận HSG Quốc gia', isRequired: false, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét', hasDeclaredNo: true },
//     ],
//     overallProofStatus: 'Chưa duyệt', // Vẫn còn cái chưa xem xét
//   },
//   {
//     id: 'S002',
//     citizenId: '001987654321',
//     fullName: 'Trần Thị B',
//     email: 'tranthib@example.com',
//     phone: '0987654321',
//     dob: '20/03/2006',
//     declaredInfo: {
//       highSchoolGPA: 9.0,
//       thptqgScores: { math: 8.5, literature: 9.0, english: 8.8 },
//       priorityObject: 'Con thương binh',
//       priorityArea: 'KV1',
//       internationalEnglishCert: 'IELTS 7.0'
//     },
//     proofs: [
//       { type: 'CCCD mặt trước', isRequired: true, fileName: 'cccd_b_front.pdf', status: 'Đã tải lên', filePath: '/docs/cccd_b_front.pdf', adminReviewStatus: 'Đã duyệt' },
//       { type: 'CCCD mặt sau', isRequired: true, fileName: 'cccd_b_back.pdf', status: 'Đã tải lên', filePath: '/docs/cccd_b_back.pdf', adminReviewStatus: 'Đã duyệt' },
//       { type: 'Phiếu điểm thi THPTQG', isRequired: true, fileName: 'thptqg_b.pdf', status: 'Đã tải lên', filePath: '/docs/thptqg_b.pdf', adminReviewStatus: 'Đã duyệt' },
//       { type: 'File minh chứng học bạ', isRequired: true, fileName: 'hocba_b.pdf', status: 'Đã tải lên', filePath: '/docs/hocba_b.pdf', adminReviewStatus: 'Đã duyệt' },
//       { type: 'Minh chứng đối tượng ưu tiên', isRequired: false, fileName: 'priority_b.pdf', status: 'Đã tải lên', filePath: '/docs/priority_b.pdf', adminReviewStatus: 'Đã duyệt' },
//       { type: 'Minh chứng khu vực ưu tiên', isRequired: false, fileName: 'area_b.pdf', status: 'Đã tải lên', filePath: '/docs/area_b.pdf', adminReviewStatus: 'Đã duyệt' },
//       { type: 'Phiếu điểm ĐGNL/TD', isRequired: false, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét', hasDeclaredNo: true },
//       { type: 'Chứng chỉ TA quốc tế', isRequired: false, fileName: 'ielts_b.pdf', status: 'Đã tải lên', filePath: '/docs/ielts_b.pdf', adminReviewStatus: 'Đã duyệt' },
//       { type: 'Chứng nhận HSG cấp tỉnh/TP', isRequired: false, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét', hasDeclaredNo: true },
//       { type: 'Chứng nhận HSG Quốc gia', isRequired: false, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét', hasDeclaredNo: true },
//     ],
//     overallProofStatus: 'Đã duyệt',
//   },
//   {
//     id: 'S003',
//     citizenId: '001090123456',
//     fullName: 'Lê Văn C',
//     email: 'levanc@example.com',
//     phone: '0901234567',
//     dob: '01/07/2006',
//     declaredInfo: {
//       highSchoolGPA: 7.5,
//       thptqgScores: { math: 7.0, physics: 6.5, chemistry: 6.0 },
//       priorityObject: 'Không',
//       priorityArea: 'KV3',
//     },
//     proofs: [
//       { type: 'CCCD mặt trước', isRequired: true, fileName: 'cccd_c_front.pdf', status: 'Đã tải lên', filePath: '/docs/cccd_c_front.pdf', adminReviewStatus: 'Đã duyệt' },
//       { type: 'CCCD mặt sau', isRequired: true, fileName: 'cccd_c_back.pdf', status: 'Đã tải lên', filePath: '/docs/cccd_c_back.pdf', adminReviewStatus: 'Từ chối', adminNote: 'Ảnh mờ, không rõ.' },
//       { type: 'Phiếu điểm thi THPTQG', isRequired: true, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'File minh chứng học bạ', isRequired: true, fileName: 'hocba_c.pdf', status: 'Đã tải lên', adminReviewStatus: 'Đã duyệt' },
//       ...STANDARD_PROOF_TYPES.filter(p => !['CCCD mặt trước', 'CCCD mặt sau', 'Phiếu điểm thi THPTQG', 'File minh chứng học bạ'].includes(p.type)).map(p => ({
//         ...p, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét', hasDeclaredNo: true
//       }))
//     ],
//     overallProofStatus: 'Từ chối', // Vì có 1 minh chứng bắt buộc bị từ chối/thiếu
//   },
//   {
//     id: 'S004',
//     citizenId: '001911223344',
//     fullName: 'Phạm Thị D',
//     email: 'phamthid@example.com',
//     phone: '0911223344',
//     dob: '10/02/2006',
//     declaredInfo: {
//       highSchoolGPA: 8.0,
//       dgnltdScore: 900,
//       priorityObject: 'Không',
//       priorityArea: 'KV2',
//     },
//     proofs: [
//       { type: 'CCCD mặt trước', isRequired: true, fileName: 'cccd_d_front.pdf', status: 'Đã tải lên', filePath: '/docs/cccd_d_front.pdf', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'CCCD mặt sau', isRequired: true, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'Phiếu điểm thi THPTQG', isRequired: true, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'File minh chứng học bạ', isRequired: true, fileName: 'hocba_d.pdf', status: 'Đã tải lên', filePath: '/docs/hocba_d.pdf', adminReviewStatus: 'Chưa xem xét' },
//       { type: 'Phiếu điểm ĐGNL/TD', isRequired: false, fileName: 'dgnl_d.pdf', status: 'Đã tải lên', filePath: '/docs/dgnl_d.pdf', adminReviewStatus: 'Chưa xem xét' },
//       ...STANDARD_PROOF_TYPES.filter(p => !['CCCD mặt trước', 'CCCD mặt sau', 'Phiếu điểm thi THPTQG', 'File minh chứng học bạ', 'Phiếu điểm ĐGNL/TD'].includes(p.type)).map(p => ({
//         ...p, status: 'Chưa tải lên', adminReviewStatus: 'Chưa xem xét', hasDeclaredNo: true
//       }))
//     ],
//     overallProofStatus: 'Đang chờ', // Thiếu CCCD mặt sau và điểm THPTQG
//   },
// ];

// // Dữ liệu nguyện vọng giả lập
// const dummyApplications: Application[] = [
//   { id: 'NV001', studentId: 'S001', schoolName: 'ĐH Bách Khoa HN', majorName: 'Công nghệ thông tin', combination: 'A00', priorityOrder: 1, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 25.5, totalScore: 25.5 },
//   { id: 'NV002', studentId: 'S001', schoolName: 'ĐH Bách Khoa HN', majorName: 'Khoa học Máy tính', combination: 'A01', priorityOrder: 2, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 25.0, totalScore: 25.0 },
//   { id: 'NV003', studentId: 'S002', schoolName: 'ĐH Ngoại Thương', majorName: 'Kinh tế Quốc tế', combination: 'D01', priorityOrder: 1, admissionMethod: 'Học bạ', scoreForMethod: 28.0, totalScore: 28.0 },
//   { id: 'NV004', studentId: 'S003', schoolName: 'ĐH Quốc gia HN', majorName: 'Công nghệ thông tin', combination: 'A00', priorityOrder: 1, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 26.0, totalScore: 26.0 },
//   { id: 'NV005', studentId: 'S004', schoolName: 'ĐH Y Hà Nội', majorName: 'Y đa khoa', combination: 'B00', priorityOrder: 1, admissionMethod: 'ĐGNL/TD', scoreForMethod: 950, totalScore: 950 },
//   { id: 'NV006', studentId: 'S004', schoolName: 'ĐH Quốc gia HN', majorName: 'Công nghệ thông tin', combination: 'A00', priorityOrder: 2, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 27.0, totalScore: 27.0 },
// ];

// const StudentAndProofManagementPage: React.FC = () => {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchText, setSearchText] = useState('');
//   const [filterProofStatus, setFilterProofStatus] = useState<string | undefined>(undefined);

//   // State cho Modal Hồ sơ & Minh chứng
//   const [isProofModalVisible, setIsProofModalVisible] = useState(false);
//   const [selectedStudentForProof, setSelectedStudentForProof] = useState<Student | null>(null);

//   // State cho Modal Nguyện vọng
//   const [isApplicationModalVisible, setIsApplicationModalVisible] = useState(false);
//   const [selectedStudentForApplication, setSelectedStudentForApplication] = useState<Student | null>(null);
//   const [studentApplications, setStudentApplications] = useState<Application[]>([]);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       setLoading(true);
//       await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập API call
//       setStudents(dummyStudents);
//       setLoading(false);
//     };
//     fetchStudents();
//   }, []);

//   const getStatusColor = (status: ProofOverallStatus) => {
//     switch (status) {
//       case 'Đã duyệt': return 'green';
//       case 'Chưa duyệt': return 'default';
//       case 'Đang chờ': return 'blue';
//       case 'Từ chối': return 'red';
//       default: return 'default';
//     }
//   };

//   const getProofItemStatusColor = (status?: AdminReviewStatus) => {
//     switch (status) {
//       case 'Đã duyệt': return 'green';
//       case 'Từ chối': return 'red';
//       case 'Chưa xem xét': return 'orange';
//       default: return 'default';
//     }
//   };

//   // Lọc và tìm kiếm thí sinh
//   const filteredStudents = useMemo(() => {
//     let result = students;
//     if (filterProofStatus) {
//       result = result.filter(student => student.overallProofStatus === filterProofStatus);
//     }
//     if (searchText) {
//       result = result.filter(student =>
//         student.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
//         student.citizenId.includes(searchText) || // Tìm kiếm theo CCCD
//         student.email.toLowerCase().includes(searchText.toLowerCase()) ||
//         student.phone.toLowerCase().includes(searchText.toLowerCase())
//       );
//     L
//     }
//     return result;
//   }, [students, filterProofStatus, searchText]);

//   // --- Logic Modal Hồ sơ & Minh chứng ---
//   const handleViewProof = (student: Student) => {
//     setSelectedStudentForProof(student);
//     setIsProofModalVisible(true);
//   };

//   const handleProofModalOk = () => {
//     setIsProofModalVisible(false);
//     setSelectedStudentForProof(null);
//   };

//   const handleProofModalCancel = () => {
//     setIsProofModalVisible(false);
//     setSelectedStudentForProof(null);
//   };

//   const handleApproveProofItem = (proofType: string) => {
//     if (selectedStudentForProof) {
//       const updatedProofs = selectedStudentForProof.proofs.map(proof =>
//         proof.type === proofType ? { ...proof, adminReviewStatus: 'Đã duyệt' } : proof
//       );
//       updateStudentProofsAndOverallStatus(selectedStudentForProof.id, updatedProofs);
//       message.success(`Đã duyệt minh chứng "${proofType}" cho ${selectedStudentForProof.fullName}`);
//     }
//   };

//   const handleRejectProofItem = (proofType: string) => {
//     if (selectedStudentForProof) {
//       const reason = prompt(`Nhập lý do từ chối minh chứng "${proofType}":`);
//       if (reason !== null) {
//         const updatedProofs = selectedStudentForProof.proofs.map(proof =>
//           proof.type === proofType ? { ...proof, adminReviewStatus: 'Từ chối', adminNote: reason } : proof
//         );
//         updateStudentProofsAndOverallStatus(selectedStudentForProof.id, updatedProofs);
//         message.warning(`Đã từ chối minh chứng "${proofType}" cho ${selectedStudentForProof.fullName}`);
//       }
//     }
//   };

//   // Tính toán trạng thái tổng thể dựa trên danh sách minh chứng
//   const calculateOverallStatus = useCallback((proofs: ProofItem[]): ProofOverallStatus => {
//     const uploadedProofs = proofs.filter(p => p.status === 'Đã tải lên' && !p.hasDeclaredNo); // Chỉ xét các file đã tải lên hoặc không cần nộp

//     // Kiểm tra các minh chứng BẮT BUỘC
//     const requiredProofs = proofs.filter(p => p.isRequired);
//     const missingRequiredProofs = requiredProofs.some(p => p.status === 'Chưa tải lên' && !p.hasDeclaredNo);
//     const rejectedRequiredProofs = requiredProofs.some(p => p.status === 'Đã tải lên' && p.adminReviewStatus === 'Từ chối');

//     if (missingRequiredProofs || rejectedRequiredProofs) {
//       return 'Từ chối'; // Thiếu hoặc có cái bắt buộc bị từ chối -> từ chối tổng thể
//     }

//     const allApproved = uploadedProofs.every(p => p.adminReviewStatus === 'Đã duyệt');
//     const anyRejected = uploadedProofs.some(p => p.adminReviewStatus === 'Từ chối');
//     const anyUnreviewed = uploadedProofs.some(p => p.adminReviewStatus === 'Chưa xem xét');

//     if (anyRejected) {
//       return 'Từ chối';
//     } else if (allApproved && uploadedProofs.length > 0 && !anyUnreviewed) {
//       return 'Đã duyệt';
//     } else if (uploadedProofs.length > 0 && anyUnreviewed) {
//       return 'Đang chờ';
//     } else {
//       return 'Chưa duyệt'; // Không có minh chứng nào được tải lên (hoặc chỉ có các loại không bắt buộc và khai báo không có)
//     }
//   }, []);


//   // Cập nhật trạng thái tổng thể của thí sinh
//   const updateStudentProofsAndOverallStatus = useCallback((studentId: string, updatedProofs: ProofItem[]) => {
//     setStudents(prevStudents => {
//       return prevStudents.map(student => {
//         if (student.id === studentId) {
//           const newOverallStatus = calculateOverallStatus(updatedProofs);
//           return { ...student, proofs: updatedProofs, overallProofStatus: newOverallStatus };
//         }
//         return student;
//       });
//     });
//     // Cập nhật lại selectedStudentForProof để Modal hiển thị trạng thái mới nhất
//     setSelectedStudentForProof(prev => prev ? { ...prev, proofs: updatedProofs, overallProofStatus: calculateOverallStatus(updatedProofs) } : null);
//   }, [calculateOverallStatus]);


//   const handleOverallProofAction = (status: 'approve' | 'reject') => {
//     if (selectedStudentForProof) {
//       const updatedProofs = selectedStudentForProof.proofs.map(proof => {
//         // Chỉ duyệt/từ chối các minh chứng đã tải lên hoặc khai báo không có
//         if (proof.status === 'Đã tải lên' || proof.hasDeclaredNo) {
//           return { ...proof, adminReviewStatus: status === 'approve' ? 'Đã duyệt' : 'Từ chối' };
//         }
//         return proof; // Giữ nguyên trạng thái nếu chưa tải lên và không khai báo không có
//       });
//       updateStudentProofsAndOverallStatus(selectedStudentForProof.id, updatedProofs);

//       message.success(
//         status === 'approve'
//           ? `Đã duyệt tất cả minh chứng của ${selectedStudentForProof.fullName}`
//           : `Đã từ chối tất cả minh chứng của ${selectedStudentForProof.fullName}`
//       );
//       setIsProofModalVisible(false); // Đóng modal sau khi duyệt/từ chối tổng thể
//     }
//   };

//   // Tính số mục thông tin đã khai báo/cần khai báo
//   const getDeclaredInfoProgress = (declaredInfo: DeclaredInfo) => {
//     const totalFields = Object.keys(declaredInfo).length;
//     const filledFields = Object.values(declaredInfo).filter(value =>
//       value !== undefined && value !== null && value !== '' &&
//       !(typeof value === 'object' && Object.keys(value).length === 0)
//     ).length;
//     return `${filledFields}/${totalFields}`;
//   };

//   // Gửi mail nhắc nhở
//   const handleSendReminderEmail = (student: Student) => {
//     message.success(`Đã gửi email nhắc nhở cho thí sinh ${student.fullName} (${student.email}).`);
//     // Trong thực tế, bạn sẽ gọi API backend để gửi email
//   };

//   // --- Logic Modal Nguyện vọng ---
//   const handleViewApplications = (student: Student) => {
//     setSelectedStudentForApplication(student);
//     const apps = dummyApplications.filter(app => app.studentId === student.id);
//     setStudentApplications(apps);
//     setIsApplicationModalVisible(true);
//   };

//   const handleApplicationModalOk = () => {
//     setIsApplicationModalVisible(false);
//     setSelectedStudentForApplication(null);
//     setStudentApplications([]);
//   };

//   const handleApplicationModalCancel = () => {
//     setIsApplicationModalVisible(false);
//     setSelectedStudentForApplication(null);
//     setStudentApplications([]);
//   };

//   const applicationColumns = [
//     {
//       title: 'NV',
//       dataIndex: 'priorityOrder',
//       key: 'priorityOrder',
//       sorter: (a: Application, b: Application) => a.priorityOrder - b.priorityOrder,
//       align: 'center' as const,
//     },
//     {
//       title: 'Trường ĐK',
//       dataIndex: 'schoolName',
//       key: 'schoolName',
//     },
//     {
//       title: 'Ngành ĐK',
//       dataIndex: 'majorName',
//       key: 'majorName',
//     },
//     {
//       title: 'Tổ hợp',
//       dataIndex: 'combination',
//       key: 'combination',
//     },
//     {
//       title: 'PTXT', // Phương thức xét tuyển
//       dataIndex: 'admissionMethod',
//       key: 'admissionMethod',
//     },
//     {
//       title: 'Điểm XT', // Điểm sử dụng cho PTXT
//       dataIndex: 'scoreForMethod',
//       key: 'scoreForMethod',
//       render: (score?: number) => score ? <Text strong>{score.toFixed(2)}</Text> : <Text type="secondary">N/A</Text>,
//     },
//     {
//       title: 'Tổng điểm', // Tổng điểm sau quy đổi/cộng ưu tiên (nếu có)
//       dataIndex: 'totalScore',
//       key: 'totalScore',
//       render: (score: number) => <Text strong>{score.toFixed(2)}</Text>,
//     },
//   ];


//   const columns = [
//     {
//       title: 'CCCD',
//       dataIndex: 'citizenId',
//       key: 'citizenId',
//       sorter: (a: Student, b: Student) => a.citizenId.localeCompare(b.citizenId),
//     },
//     {
//       title: 'Họ và tên',
//       dataIndex: 'fullName',
//       key: 'fullName',
//       sorter: (a: Student, b: Student) => a.fullName.localeCompare(b.fullName),
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//     },
//     {
//       title: 'SĐT',
//       dataIndex: 'phone',
//       key: 'phone',
//     },
//     {
//       title: 'Ngày sinh',
//       dataIndex: 'dob',
//       key: 'dob',
//     },
//     {
//       title: 'Trạng thái khai báo',
//       key: 'declaredInfoProgress',
//       render: (text: string, record: Student) => {
//         const progress = getDeclaredInfoProgress(record.declaredInfo);
//         const [filled, total] = progress.split('/').map(Number);
//         const color = filled === total ? 'green' : (filled > 0 ? 'blue' : 'red');
//         return (
//           <Tag color={color}>
//             {progress} ({filled === total ? 'Đầy đủ' : 'Chưa đầy đủ'})
//           </Tag>
//         );
//       },
//     },
//     {
//       title: 'Trạng thái duyệt minh chứng',
//       dataIndex: 'overallProofStatus',
//       key: 'overallProofStatus',
//       render: (status: ProofOverallStatus) => (
//         <Tag color={getStatusColor(status)}>
//           {status}
//         </Tag>
//       ),
//       filters: [
//         { text: 'Chưa duyệt', value: 'Chưa duyệt' },
//         { text: 'Đang chờ', value: 'Đang chờ' },
//         { text: 'Đã duyệt', value: 'Đã duyệt' },
//         { text: 'Từ chối', value: 'Từ chối' },
//       ],
//       onFilter: (value: any, record: Student) => record.overallProofStatus === value,
//     },
//     {
//       title: 'Hành động',
//       key: 'actions',
//       render: (text: string, record: Student) => (
//         <Space size="small">
//           <Button
//             icon={<SolutionOutlined />}
//             onClick={() => handleViewProof(record)}
//             size="small"
//           >
//             Hồ sơ & Minh chứng
//           </Button>
//           <Button
//             icon={<BookOutlined />}
//             onClick={() => handleViewApplications(record)}
//             size="small"
//           >
//             Nguyện vọng
//           </Button>
//           <Button
//             icon={<MailOutlined />}
//             onClick={() => handleSendReminderEmail(record)}
//             size="small"
//             type="dashed"
//             disabled={
//                 getDeclaredInfoProgress(record.declaredInfo).split('/')[0] !==
//                 getDeclaredInfoProgress(record.declaredInfo).split('/')[1] ||
//                 record.overallProofStatus !== 'Đã duyệt'
//             } // Chỉ cho phép gửi nếu chưa đủ thông tin hoặc chưa duyệt xong
//           >
//             Nhắc nhở
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Title level={3}>Quản lý Thí sinh & Duyệt Minh chứng</Title>

//       <Space style={{ marginBottom: 16 }}>
//         <Input
//           prefix={<SearchOutlined />}
//           placeholder="Tìm kiếm theo tên, CCCD, email, SĐT..."
//           value={searchText}
//           onChange={e => setSearchText(e.target.value)}
//           style={{ width: 350 }}
//         />
//         <Select
//           placeholder="Lọc theo Trạng thái duyệt minh chứng"
//           style={{ width: 250 }}
//           allowClear
//           value={filterProofStatus}
//           onChange={value => setFilterProofStatus(value)}
//         >
//           <Option value="Chưa duyệt">Chưa duyệt</Option>
//           <Option value="Đang chờ">Đang chờ</Option>
//           <Option value="Đã duyệt">Đã duyệt</Option>
//           <Option value="Từ chối">Từ chối</Option>
//         </Select>
//       </Space>

//       <Spin spinning={loading} tip="Đang tải danh sách thí sinh...">
//         <Table
//           columns={columns}
//           dataSource={filteredStudents}
//           rowKey="id"
//           pagination={{ pageSize: 10 }}
//           bordered
//           locale={{ emptyText: 'Không có thí sinh nào trong danh sách.' }}
//         />
//       </Spin>

//       {/* Modal Hồ sơ & Minh chứng */}
//       <Modal
//         title={
//           <Space>
//             <SolutionOutlined />
//             Hồ sơ & Minh chứng của {selectedStudentForProof?.fullName}
//           </Space>
//         }
//         visible={isProofModalVisible}
//         onOk={handleProofModalOk}
//         onCancel={handleProofModalCancel}
//         width={1000}
//         footer={[
//           <Button key="back" onClick={handleProofModalCancel}>
//             Đóng
//           </Button>,
//           <Button
//             key="reject_all"
//             type="primary"
//             danger
//             icon={<CloseCircleOutlined />}
//             onClick={() => handleOverallProofAction('reject')}
//             disabled={!selectedStudentForProof || selectedStudentForProof.proofs.filter(p => p.status === 'Đã tải lên' || p.hasDeclaredNo).every(p => p.adminReviewStatus !== 'Chưa xem xét')} // Chỉ hiện khi có cái chưa xem xét
//           >
//             Từ chối toàn bộ
//           </Button>,
//           <Button
//             key="approve_all"
//             type="primary"
//             icon={<CheckCircleOutlined />}
//             onClick={() => handleOverallProofAction('approve')}
//             disabled={!selectedStudentForProof || selectedStudentForProof.proofs.filter(p => p.status === 'Đã tải lên' || p.hasDeclaredNo).every(p => p.adminReviewStatus !== 'Chưa xem xét')} // Chỉ hiện khi có cái chưa xem xét
//           >
//             Duyệt toàn bộ
//           </Button>,
//         ]}
//       >
//         {selectedStudentForProof && (
//           <Spin spinning={loading}>
//             <Title level={5}>Thông tin cá nhân & Khai báo</Title>
//             <Descriptions bordered size="small" column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
//               <Descriptions.Item label="Họ và tên">{selectedStudentForProof.fullName}</Descriptions.Item>
//               <Descriptions.Item label="CCCD">{selectedStudentForProof.citizenId}</Descriptions.Item>
//               <Descriptions.Item label="Email">{selectedStudentForProof.email}</Descriptions.Item>
//               <Descriptions.Item label="SĐT">{selectedStudentForProof.phone}</Descriptions.Item>
//               <Descriptions.Item label="Ngày sinh">{selectedStudentForProof.dob}</Descriptions.Item>
//               <Descriptions.Item label="Quê quán">{selectedStudentForProof.declaredInfo.hometown || <Text type="secondary">Chưa khai báo</Text>}</Descriptions.Item>
//               <Descriptions.Item label="Tổ hợp môn yêu thích">{selectedStudentForProof.declaredInfo.preferredSubjectCombination || <Text type="secondary">Chưa khai báo</Text>}</Descriptions.Item>
//               <Descriptions.Item label="ĐTB Học bạ">{selectedStudentForProof.declaredInfo.highSchoolGPA || <Text type="secondary">Chưa khai báo</Text>}</Descriptions.Item>
//               <Descriptions.Item label="Điểm ĐGNL/TD">{selectedStudentForProof.declaredInfo.dgnltdScore || <Text type="secondary">Chưa khai báo</Text>}</Descriptions.Item>
//               <Descriptions.Item label="Chứng chỉ TA QT">{selectedStudentForProof.declaredInfo.internationalEnglishCert || <Text type="secondary">Chưa khai báo</Text>}</Descriptions.Item>
//               <Descriptions.Item label="HSG Quốc gia">{selectedStudentForProof.declaredInfo.nationalStudentAward || <Text type="secondary">Chưa khai báo</Text>}</Descriptions.Item>
//               <Descriptions.Item label="HSG Tỉnh/TP">{selectedStudentForProof.declaredInfo.provincialStudentAward || <Text type="secondary">Chưa khai báo</Text>}</Descriptions.Item>
//               <Descriptions.Item label="Đối tượng ưu tiên">{selectedStudentForProof.declaredInfo.priorityObject || <Text type="secondary">Chưa khai báo</Text>}</Descriptions.Item>
//               <Descriptions.Item label="Khu vực ưu tiên">{selectedStudentForProof.declaredInfo.priorityArea || <Text type="secondary">Chưa khai báo</Text>}</Descriptions.Item>
//               <Descriptions.Item label="Điểm thi THPTQG">
//                 {selectedStudentForProof.declaredInfo.thptqgScores ? (
//                   <Space direction="vertical" size={2}>
//                     {Object.entries(selectedStudentForProof.declaredInfo.thptqgScores).map(([subject, score]) => (
//                       <Text key={subject}>{subject.charAt(0).toUpperCase() + subject.slice(1)}: {score}</Text>
//                     ))}
//                   </Space>
//                 ) : <Text type="secondary">Chưa khai báo</Text>}
//               </Descriptions.Item>
//             </Descriptions>

//             <Title level={5} style={{ marginTop: 20 }}>Minh chứng</Title>
//             <List
//               itemLayout="horizontal"
//               dataSource={selectedStudentForProof.proofs}
//               bordered
//               renderItem={item => (
//                 <List.Item
//                   actions={[
//                     item.status === 'Đã tải lên' && item.filePath ? (
//                       <Button
//                         type="link"
//                         icon={<EyeOutlined />}
//                         onClick={() => message.info(`Xem file ${item.fileName} tại ${item.filePath}`)}
//                       >
//                         Xem File
//                       </Button>
//                     ) : item.hasDeclaredNo ? (
//                       <Tag color="blue">Đã khai báo không có</Tag>
//                     ) : (
//                       <Text type="secondary">Chưa tải lên</Text>
//                     ),
//                     item.status === 'Đã tải lên' || item.hasDeclaredNo ? (
//                       <Space>
//                         <Button
//                           type="text"
//                           icon={<CheckCircleOutlined style={{ color: 'green' }} />}
//                           onClick={() => handleApproveProofItem(item.type)}
//                           disabled={item.adminReviewStatus === 'Đã duyệt'}
//                         >
//                           Duyệt
//                         </Button>
//                         <Button
//                           type="text"
//                           icon={<CloseCircleOutlined style={{ color: 'red' }} />}
//                           onClick={() => handleRejectProofItem(item.type)}
//                           disabled={item.adminReviewStatus === 'Từ chối'}
//                         >
//                           Từ chối
//                         </Button>
//                       </Space>
//                     ) : null,
//                   ]}
//                 >
//                   <List.Item.Meta
//                     avatar={item.isRequired ? <InfoCircleOutlined style={{ color: 'red' }} /> : <FileOutlined />}
//                     title={
//                       <Space>
//                         <Text>{item.type}</Text>
//                         {item.isRequired && (
//                           <Popover content="Minh chứng này là bắt buộc phải nộp." title="Lưu ý">
//                             <Tag color="red" icon={<ExclamationCircleOutlined />}>Bắt buộc</Tag>
//                           </Popover>
//                         )}
//                       </Space>
//                     }
//                     description={
//                       <Space direction="vertical" size={2}>
//                         {item.fileName && <Text>{item.fileName}</Text>}
//                         <Tag color={getProofItemStatusColor(item.adminReviewStatus)}>
//                           {item.adminReviewStatus || 'Chưa xem xét'}
//                         </Tag>
//                         {item.adminNote && <Text type="danger">Lý do: {item.adminNote}</Text>}
//                       </Space>
//                     }
//                   />
//                 </List.Item>
//               )}
//             />
//           </Spin>
//         )}
//       </Modal>

//       {/* Modal Nguyện vọng */}
//       <Modal
//         title={
//           <Space>
//             <BookOutlined />
//             Nguyện vọng của {selectedStudentForApplication?.fullName}
//           </Space>
//         }
//         visible={isApplicationModalVisible}
//         onOk={handleApplicationModalOk}
//         onCancel={handleApplicationModalCancel}
//         width={900}
//         footer={[
//           <Button key="back" onClick={handleApplicationModalCancel}>
//             Đóng
//           </Button>,
//         ]}
//       >
//         {selectedStudentForApplication && (
//           <Spin spinning={loading}>
//             <Table
//               columns={applicationColumns}
//               dataSource={studentApplications}
//               rowKey="id"
//               pagination={{ pageSize: 5 }}
//               bordered
//               locale={{ emptyText: 'Thí sinh này chưa đăng ký nguyện vọng nào.' }}
//             />
//           </Spin>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default StudentAndProofManagementPage;




import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Spin,
  Select,
  Modal,
} from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

// --- Dữ liệu nguyện vọng giả lập ---
const dummyApplications = [
  { id: 'NV001', studentId: 'S001', schoolName: 'ĐH Bách Khoa HN', majorName: 'Công nghệ thông tin', combination: 'A00', priorityOrder: 1, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 25.5, totalScore: 25.5 },
  { id: 'NV002', studentId: 'S001', schoolName: 'ĐH Bách Khoa HN', majorName: 'Khoa học Máy tính', combination: 'A01', priorityOrder: 2, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 25.0, totalScore: 25.0 },
  { id: 'NV003', studentId: 'S002', schoolName: 'ĐH Ngoại Thương', majorName: 'Kinh tế Quốc tế', combination: 'D01', priorityOrder: 1, admissionMethod: 'Học bạ', scoreForMethod: 28.0, totalScore: 28.0 },
  { id: 'NV004', studentId: 'S003', schoolName: 'ĐH Quốc gia HN', majorName: 'Công nghệ thông tin', combination: 'A00', priorityOrder: 1, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 26.0, totalScore: 26.0 },
  { id: 'NV005', studentId: 'S004', schoolName: 'ĐH Y Hà Nội', majorName: 'Y đa khoa', combination: 'B00', priorityOrder: 1, admissionMethod: 'ĐGNL/TD', scoreForMethod: 950, totalScore: 950 },
  { id: 'NV006', studentId: 'S004', schoolName: 'ĐH Quốc gia HN', majorName: 'Công nghệ thông tin', combination: 'A00', priorityOrder: 2, admissionMethod: 'Điểm thi THPTQG', scoreForMethod: 27.0, totalScore: 27.0 },
];

// Danh sách thí sinh giả lập (chỉ giữ các trường cần thiết cho tìm kiếm và hiển thị nguyện vọng)
const dummyStudents = [
  { id: 'S001', citizenId: '001123456789', fullName: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0912345678', dob: '15/01/2006' },
  { id: 'S002', citizenId: '001987654321', fullName: 'Trần Thị B', email: 'tranthib@example.com', phone: '0987654321', dob: '20/03/2006' },
  { id: 'S003', citizenId: '001090123456', fullName: 'Lê Văn C', email: 'levanc@example.com', phone: '0901234567', dob: '01/07/2006' },
  { id: 'S004', citizenId: '001911223344', fullName: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0911223344', dob: '10/02/2006' },
];

const StudentAndProofManagementPage: React.FC = () => {
  const [students, setStudents] = useState(dummyStudents);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterByNameOrId, setFilterByNameOrId] = useState('');

  // Modal Nguyện vọng
  const [isApplicationModalVisible, setIsApplicationModalVisible] = useState(false);
  const [selectedStudentForApplication, setSelectedStudentForApplication] = useState<any>(null);
  const [studentApplications, setStudentApplications] = useState([]);

  useEffect(() => {
    // Nếu bạn muốn giả lập gọi API, bật loading trong 500ms rồi load data
    setLoading(true);
    setTimeout(() => {
      setStudents(dummyStudents);
      setLoading(false);
    }, 500);
  }, []);

  // Lọc thí sinh theo tìm kiếm
  const filteredStudents = students.filter(student => {
    const text = searchText.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(text) ||
      student.citizenId.includes(text) ||
      student.email.toLowerCase().includes(text) ||
      student.phone.includes(text)
    );
  });

  // Xử lý mở modal nguyện vọng
  const handleViewApplications = (student: any) => {
    setSelectedStudentForApplication(student);
    const apps = dummyApplications.filter(app => app.studentId === student.id);
    setStudentApplications(apps);
    setIsApplicationModalVisible(true);
  };

  const handleApplicationModalClose = () => {
    setIsApplicationModalVisible(false);
    setSelectedStudentForApplication(null);
    setStudentApplications([]);
  };

  // Cột của bảng Nguyện vọng (thêm cột mã NV)
  const applicationColumns = [
    {
      title: 'Mã NV',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as const,
      width: 80,
    },
    {
      title: 'Thứ tự NV',
      dataIndex: 'priorityOrder',
      key: 'priorityOrder',
      sorter: (a: any, b: any) => a.priorityOrder - b.priorityOrder,
      align: 'center' as const,
      width: 100,
    },
    {
      title: 'Trường ĐK',
      dataIndex: 'schoolName',
      key: 'schoolName',
    },
    {
      title: 'Ngành ĐK',
      dataIndex: 'majorName',
      key: 'majorName',
    },
    {
      title: 'Tổ hợp',
      dataIndex: 'combination',
      key: 'combination',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'PTXT',
      dataIndex: 'admissionMethod',
      key: 'admissionMethod',
      width: 150,
      align: 'center' as const,
    },
    {
      title: 'Điểm XT',
      dataIndex: 'scoreForMethod',
      key: 'scoreForMethod',
      width: 100,
      align: 'right' as const,
      render: (score?: number) => score !== undefined ? score.toFixed(2) : 'N/A',
    },
    {
      title: 'Tổng điểm',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 100,
      align: 'right' as const,
      render: (score: number) => score.toFixed(2),
      sorter: (a: any, b: any) => a.totalScore - b.totalScore,
    },
  ];

  // Cột của bảng thí sinh, chỉ giữ cần thiết + cột hành động nút nguyện vọng
  const columns = [
    {
      title: 'CCCD',
      dataIndex: 'citizenId',
      key: 'citizenId',
      sorter: (a: any, b: any) => a.citizenId.localeCompare(b.citizenId),
      width: 150,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: any, b: any) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      width: 110,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 130,
      render: (_: any, record: any) => (
        <Button
          icon={<BookOutlined />}
          onClick={() => handleViewApplications(record)}
          size="small"
          type="primary"
        >
          Nguyện vọng
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Quản lý Nguyện vọng Thí sinh</Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm theo tên, CCCD, email, SĐT..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 350 }}
          allowClear
        />
      </Space>

      <Spin spinning={loading} tip="Đang tải danh sách thí sinh...">
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          locale={{ emptyText: 'Không có thí sinh nào trong danh sách.' }}
        />
      </Spin>

      {/* Modal Nguyện vọng */}
      <Modal
        title={<><BookOutlined /> Nguyện vọng của {selectedStudentForApplication?.fullName}</>}
        visible={isApplicationModalVisible}
        onCancel={handleApplicationModalClose}
        footer={[
          <Button key="close" onClick={handleApplicationModalClose}>
            Đóng
          </Button>,
        ]}
        width={900}
      >
        <Spin spinning={loading}>
          <Table
            columns={applicationColumns}
            dataSource={studentApplications}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
            locale={{ emptyText: 'Thí sinh này chưa đăng ký nguyện vọng nào.' }}
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default StudentAndProofManagementPage;
