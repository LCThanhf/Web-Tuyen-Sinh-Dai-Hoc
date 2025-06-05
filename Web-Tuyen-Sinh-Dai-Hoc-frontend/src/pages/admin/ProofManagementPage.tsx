// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   Space,
//   Tag,
//   message,
//   Typography,
//   Descriptions,
//   Divider,
//   Upload,
//   Spin,
//   Select,
// } from 'antd';
// import {
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   EyeOutlined,
//   LoadingOutlined,
//   MailOutlined,
//   SearchOutlined,
// } from '@ant-design/icons';
// import { UploadFile } from 'antd/lib/upload/interface';
// import { Popconfirm } from 'antd';


// const { Title, Text } = Typography;
// const { Option } = Select;
// const { TextArea } = Input;

// // Định nghĩa kiểu dữ liệu cho một thí sinh/hồ sơ xét tuyển
// interface Applicant {
//   id: string; // ID hồ sơ
//   studentId: string; // ID sinh viên (tài khoản đăng nhập)
//   fullName: string;
//   dob: string; // Date of Birth
//   email: string;
//   phone: string;
//   nationalId: string; // CCCD
//   majorRegistered: string; // Ngành đã đăng ký (ví dụ: Khoa học Máy tính - ĐH Bách Khoa)
//   applicationStatus: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
//   submissionDate: string;
//   proofs: {
//     personalInfoProof: UploadFile[]; // Minh chứng thông tin cá nhân (CCCD, Giấy khai sinh)
//     scoreProof: UploadFile[]; // Minh chứng điểm thi (TN THPT, ĐGNL/TĐ, Học bạ)
//     priorityProof: UploadFile[]; // Minh chứng ưu tiên (Giấy chứng nhận đối tượng ưu tiên)
//     achievementProof: UploadFile[]; // Minh chứng thành tích (HSG, chứng chỉ Tiếng Anh)
//   };
//   rejectionReason?: string; // Lý do từ chối
// }

// // Giả lập dữ liệu minh chứng (sẽ được thay thế bằng API)
// // Lưu ý: Trong thực tế, UploadFile['url'] sẽ là URL thật của file trên server/cloud storage
// const dummyProofs = {
//   personalInfoProof: [{ uid: '1', name: 'cccd_front.jpg', status: 'done', url: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=CCCD_truoc' }, { uid: '2', name: 'cccd_back.jpg', status: 'done', url: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=CCCD_sau' }],
//   scoreProof: [{ uid: '3', name: 'diem_thpt_2023.pdf', status: 'done', url: 'https://www.africau.edu/images/default/sample.pdf' }, { uid: '4', name: 'hocba_ky1_12.pdf', status: 'done', url: 'https://www.africau.edu/images/default/sample.pdf' }],
//   priorityProof: [],
//   achievementProof: [{ uid: '5', name: 'chung_chi_ielts.pdf', status: 'done', url: 'https://www.africau.edu/images/default/sample.pdf' }],
// };

// const dummyApplicants: Applicant[] = [
//   {
//     id: 'H001',
//     studentId: 'SV001',
//     fullName: 'Nguyễn Văn A',
//     dob: '15/01/2006',
//     email: 'nguyenvana@example.com',
//     phone: '0912345678',
//     nationalId: '001122334455',
//     majorRegistered: 'Khoa học Máy tính - Đại học Bách Khoa Hà Nội',
//     applicationStatus: 'Chờ duyệt',
//     submissionDate: '2024-05-20',
//     proofs: { ...dummyProofs, priorityProof: [{ uid: '6', name: 'giay_chung_nhan_uu_tien.pdf', status: 'done', url: 'https://www.africau.edu/images/default/sample.pdf' }] },
//   },
//   {
//     id: 'H002',
//     studentId: 'SV002',
//     fullName: 'Trần Thị B',
//     dob: '20/03/2006',
//     email: 'tranthib@example.com',
//     phone: '0987654321',
//     nationalId: '002233445566',
//     majorRegistered: 'Kinh tế Quốc tế - Đại học Ngoại Thương',
//     applicationStatus: 'Đã duyệt',
//     submissionDate: '2024-05-18',
//     proofs: { ...dummyProofs },
//   },
//   {
//     id: 'H003',
//     studentId: 'SV003',
//     fullName: 'Lê Văn C',
//     dob: '01/07/2006',
//     email: 'levanc@example.com',
//     phone: '0901234567',
//     nationalId: '003344556677',
//     majorRegistered: 'Công nghệ thông tin - Đại học Quốc gia Hà Nội',
//     applicationStatus: 'Từ chối',
//     submissionDate: '2024-05-15',
//     proofs: { ...dummyProofs },
//     rejectionReason: 'Minh chứng học bạ không hợp lệ.',
//   },
//   {
//     id: 'H004',
//     studentId: 'SV004',
//     fullName: 'Phạm Thị D',
//     dob: '10/02/2006',
//     email: 'phamthid@example.com',
//     phone: '0911223344',
//     nationalId: '004455667788',
//     majorRegistered: 'Kỹ thuật Điện tử Viễn thông - Đại học Bách Khoa Hà Nội',
//     applicationStatus: 'Chờ duyệt',
//     submissionDate: '2024-05-22',
//     proofs: { ...dummyProofs },
//   },
// ];

// const ProofManagementPage: React.FC = () => {
//   const [applicants, setApplicants] = useState<Applicant[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(true);
//   const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
//   const [searchText, setSearchText] = useState('');

//   useEffect(() => {
//     const fetchApplicants = async () => {
//       setLoading(true);
//       await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập API call
//       setApplicants(dummyApplicants);
//       setLoading(false);
//     };
//     fetchApplicants();
//   }, []);

//   // Lọc và tìm kiếm hồ sơ
//   const filteredApplicants = useMemo(() => {
//     let result = applicants;
//     if (filterStatus) {
//       result = result.filter(app => app.applicationStatus === filterStatus);
//     }
//     if (searchText) {
//       result = result.filter(app =>
//         app.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
//         app.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
//         app.nationalId.toLowerCase().includes(searchText.toLowerCase())
//       );
//     }
//     return result;
//   }, [applicants, filterStatus, searchText]);

//   const getStatusColor = (status: Applicant['applicationStatus']) => {
//     switch (status) {
//       case 'Đã duyệt': return 'green';
//       case 'Chờ duyệt': return 'orange';
//       case 'Từ chối': return 'red';
//       default: return 'default';
//     }
//   };

//   // Mở modal xem chi tiết
//   const handleViewDetails = (record: Applicant) => {
//     setSelectedApplicant(record);
//     // Nếu hồ sơ đã từ chối, set lý do vào form để hiển thị
//     if (record.applicationStatus === 'Từ chối' && record.rejectionReason) {
//       form.setFieldsValue({ rejectionReason: record.rejectionReason });
//     } else {
//       form.resetFields(); // Reset form nếu không phải hồ sơ từ chối
//     }
//     setIsModalVisible(true);
//   };

//   // Cập nhật trạng thái hồ sơ
//   const handleUpdateStatus = async (status: 'Đã duyệt' | 'Từ chối') => {
//     if (!selectedApplicant) return;

//     let rejectionReason: string | undefined = undefined;
//     if (status === 'Từ chối') {
//       try {
//         const values = await form.validateFields();
//         rejectionReason = values.rejectionReason;
//         if (!rejectionReason) {
//           message.error('Vui lòng nhập lý do từ chối!');
//           return;
//         }
//       } catch (errorInfo) {
//         message.error('Vui lòng nhập lý do từ chối!');
//         return;
//       }
//     }

//     // Giả lập API call để cập nhật trạng thái
//     setLoading(true);
//     await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ

//     setApplicants(prevApplicants =>
//       prevApplicants.map(app =>
//         app.id === selectedApplicant.id
//           ? { ...app, applicationStatus: status, rejectionReason: rejectionReason }
//           : app
//       )
//     );
//     message.success(`Hồ sơ của ${selectedApplicant.fullName} đã được chuyển sang trạng thái: ${status}!`);

//     // Gửi email thông báo (cần API backend)
//     try {
//       // Ví dụ: await axios.post('/api/send-email', {
//       //   to: selectedApplicant.email,
//       //   subject: `Thông báo trạng thái hồ sơ của bạn - ${status}`,
//       //   body: `Kính gửi ${selectedApplicant.fullName},\n\nHồ sơ của bạn đã được cập nhật trạng thái thành: ${status}.\n${rejectionReason ? `Lý do: ${rejectionReason}` : ''}\n\nTrân trọng!`,
//       // });
//       message.info('Đã gửi email thông báo cho thí sinh.');
//     } catch (error) {
//       message.error('Không thể gửi email thông báo.');
//     }

//     setLoading(false);
//     setIsModalVisible(false);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   const columns = [
//     {
//       title: 'Mã Hồ sơ',
//       dataIndex: 'id',
//       key: 'id',
//       sorter: (a: Applicant, b: Applicant) => a.id.localeCompare(b.id),
//     },
//     {
//       title: 'Mã SV',
//       dataIndex: 'studentId',
//       key: 'studentId',
//       sorter: (a: Applicant, b: Applicant) => a.studentId.localeCompare(b.studentId),
//     },
//     {
//       title: 'Họ và tên',
//       dataIndex: 'fullName',
//       key: 'fullName',
//       sorter: (a: Applicant, b: Applicant) => a.fullName.localeCompare(b.fullName),
//     },
//     {
//       title: 'Ngành đã ĐK',
//       dataIndex: 'majorRegistered',
//       key: 'majorRegistered',
//     },
//     {
//       title: 'Ngày nộp',
//       dataIndex: 'submissionDate',
//       key: 'submissionDate',
//       sorter: (a: Applicant, b: Applicant) => a.submissionDate.localeCompare(b.submissionDate),
//     },
//     {
//       title: 'Trạng thái',
//       dataIndex: 'applicationStatus',
//       key: 'applicationStatus',
//       render: (status: Applicant['applicationStatus']) => (
//         <Tag color={getStatusColor(status)} icon={status === 'Chờ duyệt' ? <LoadingOutlined /> : status === 'Đã duyệt' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
//           {status}
//         </Tag>
//       ),
//       filters: [
//         { text: 'Chờ duyệt', value: 'Chờ duyệt' },
//         { text: 'Đã duyệt', value: 'Đã duyệt' },
//         { text: 'Từ chối', value: 'Từ chối' },
//       ],
//       onFilter: (value: any, record: Applicant) => record.applicationStatus === value,
//     },
//     {
//       title: 'Hành động',
//       key: 'actions',
//       render: (text: string, record: Applicant) => (
//         <Space size="middle">
//           <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
//             Chi tiết
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   // Hàm render file đính kèm
//   const renderProofSection = (title: string, files: UploadFile[]) => (
//     <>
//       <Text strong>{title}:</Text>
//       {files && files.length > 0 ? (
//         <Upload
//           fileList={files}
//           showUploadList={{
//             showRemoveIcon: false, // Không cho phép xóa từ đây
//             showDownloadIcon: true,
//             showPreviewIcon: true,
//           }}
//           itemRender={(originNode, file) => (
//             <Space style={{ margin: '5px 0' }}>
//               {originNode}
//               {/* Nếu muốn xem ảnh/pdf trực tiếp, cần một component previewer hoặc mở tab mới */}
//             </Space>
//           )}
//           listType="text" // Hoặc 'picture-card' nếu muốn hiển thị ảnh nhỏ
//           // Cần một hàm customRequest nếu muốn hiển thị ảnh từ URL hoặc blob
//         />
//       ) : (
//         <Text type="secondary">Chưa có minh chứng.</Text>
//       )}
//     </>
//   );


//   return (
//     <div>
//       <Title level={3}>Duyệt Minh chứng Hồ sơ Thí sinh</Title>

//       <Space style={{ marginBottom: 16 }}>
//         <Input
//           prefix={<SearchOutlined />}
//           placeholder="Tìm kiếm theo tên, mã SV, CCCD..."
//           value={searchText}
//           onChange={e => setSearchText(e.target.value)}
//           style={{ width: 300 }}
//         />
//         <Select
//           placeholder="Lọc theo Trạng thái"
//           style={{ width: 180 }}
//           allowClear
//           value={filterStatus}
//           onChange={value => setFilterStatus(value)}
//         >
//           <Option value="Chờ duyệt">Chờ duyệt</Option>
//           <Option value="Đã duyệt">Đã duyệt</Option>
//           <Option value="Từ chối">Từ chối</Option>
//         </Select>
//       </Space>

//       <Spin spinning={loading} tip="Đang tải danh sách hồ sơ...">
//         <Table
//           columns={columns}
//           dataSource={filteredApplicants}
//           rowKey="id"
//           pagination={{ pageSize: 10 }}
//           bordered
//           locale={{ emptyText: 'Không có hồ sơ nào cần duyệt.' }}
//         />
//       </Spin>

//       {selectedApplicant && (
//         <Modal
//           title={`Chi tiết Hồ sơ: ${selectedApplicant.fullName}`}
//           visible={isModalVisible}
//           onCancel={handleCancel}
//           footer={
//             <Space>
//               <Button onClick={handleCancel}>Đóng</Button>
//               {selectedApplicant.applicationStatus === 'Chờ duyệt' && (
//                 <>
//                   <Button
//                     type="primary"
//                     icon={<CheckCircleOutlined />}
//                     onClick={() => handleUpdateStatus('Đã duyệt')}
//                     loading={loading}
//                   >
//                     Duyệt Hồ sơ
//                   </Button>
//                   <Popconfirm
//                     title="Bạn có chắc chắn muốn từ chối hồ sơ này?"
//                     description={
//                       <Form form={form} layout="vertical" name="rejection_reason_form">
//                         <Form.Item
//                           name="rejectionReason"
//                           label="Lý do từ chối"
//                           rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}
//                         >
//                           <TextArea rows={3} placeholder="Ví dụ: Minh chứng học bạ không rõ ràng, thiếu giấy tờ ưu tiên..." />
//                         </Form.Item>
//                       </Form>
//                     }
//                     onConfirm={() => handleUpdateStatus('Từ chối')}
//                     okText="Xác nhận Từ chối"
//                     cancelText="Hủy"
//                     placement="topRight"
//                     overlayInnerStyle={{ width: 400 }} // Điều chỉnh độ rộng của Popconfirm
//                     // Khi Popconfirm được mở, cần reset fields và set lại nếu có lý do cũ
//                     onVisibleChange={(visible) => {
//                       if (visible) {
//                         form.resetFields();
//                         if (selectedApplicant.rejectionReason) {
//                           form.setFieldsValue({ rejectionReason: selectedApplicant.rejectionReason });
//                         }
//                       }
//                     }}
//                   >
//                     <Button
//                       type="default" // Đổi thành default để phân biệt
//                       icon={<CloseCircleOutlined />}
//                       danger
//                       loading={loading}
//                     >
//                       Từ chối Hồ sơ
//                     </Button>
//                   </Popconfirm>
//                 </>
//               )}
//               {selectedApplicant.applicationStatus === 'Từ chối' && selectedApplicant.rejectionReason && (
//                 <Button icon={<MailOutlined />} onClick={() => message.info('Tính năng gửi lại email thông báo lý do từ chối.')}>
//                   Gửi lại Email Lý do
//                 </Button>
//               )}
//                {selectedApplicant.applicationStatus === 'Đã duyệt' && (
//                 <Button icon={<MailOutlined />} onClick={() => message.info('Tính năng gửi lại email thông báo đã duyệt.')}>
//                   Gửi lại Email Duyệt
//                 </Button>
//               )}
//             </Space>
//           }
//           width={800}
//         >
//           <Spin spinning={loading} tip="Đang cập nhật trạng thái...">
//             <Descriptions bordered column={2} size="small">
//               <Descriptions.Item label="Họ và tên">{selectedApplicant.fullName}</Descriptions.Item>
//               <Descriptions.Item label="Mã SV">{selectedApplicant.studentId}</Descriptions.Item>
//               <Descriptions.Item label="Ngày sinh">{selectedApplicant.dob}</Descriptions.Item>
//               <Descriptions.Item label="SĐT">{selectedApplicant.phone}</Descriptions.Item>
//               <Descriptions.Item label="Email" span={2}>
//                 {selectedApplicant.email}
//               </Descriptions.Item>
//               <Descriptions.Item label="CCCD">{selectedApplicant.nationalId}</Descriptions.Item>
//               <Descriptions.Item label="Ngành Đăng ký" span={2}>
//                 {selectedApplicant.majorRegistered}
//               </Descriptions.Item>
//               <Descriptions.Item label="Ngày nộp hồ sơ">{selectedApplicant.submissionDate}</Descriptions.Item>
//               <Descriptions.Item label="Trạng thái hiện tại" span={1}>
//                 <Tag color={getStatusColor(selectedApplicant.applicationStatus)} icon={selectedApplicant.applicationStatus === 'Chờ duyệt' ? <LoadingOutlined /> : selectedApplicant.applicationStatus === 'Đã duyệt' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
//                   {selectedApplicant.applicationStatus}
//                 </Tag>
//               </Descriptions.Item>
//               {selectedApplicant.applicationStatus === 'Từ chối' && selectedApplicant.rejectionReason && (
//                 <Descriptions.Item label="Lý do từ chối" span={2}>
//                   <Text type="danger">{selectedApplicant.rejectionReason}</Text>
//                 </Descriptions.Item>
//               )}
//             </Descriptions>

//             <Divider orientation="left">Minh chứng đính kèm</Divider>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
//               {renderProofSection('Minh chứng Thông tin cá nhân', selectedApplicant.proofs.personalInfoProof)}
//               {renderProofSection('Minh chứng Điểm thi & Học bạ', selectedApplicant.proofs.scoreProof)}
//               {renderProofSection('Minh chứng Ưu tiên', selectedApplicant.proofs.priorityProof)}
//               {renderProofSection('Minh chứng Thành tích & Chứng chỉ', selectedApplicant.proofs.achievementProof)}
//             </div>
//           </Spin>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default ProofManagementPage;




import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Tabs,
  Tag,
  Typography,
  Row,
  Col,
  Form,
  InputNumber,
  message,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Text, Title } = Typography;
const { confirm } = Modal;

type StatusType = "Chờ duyệt" | "Đã duyệt" | "Từ chối";

interface FileProof {
  url?: string;
  name?: string;
}

interface InfoItem {
  status: StatusType;
  reason?: string;
  files?: FileProof[];
  [key: string]: any;
}

// Dữ liệu 3 môn thi bắt buộc
const DEFAULT_SUBJECTS = ["Toán", "Văn", "Anh"];

// Môn bổ sung theo ban thi
const NATURAL_SCIENCE_SUBJECTS = ["Lý", "Hóa", "Sinh"];
const SOCIAL_SCIENCE_SUBJECTS = ["Sử", "Địa", "GDCD"];

// Đơn vị tổ chức ĐGNL/ĐGTD
const ASSESSMENT_UNITS = [
  "ĐHQG Hà Nội",
  "ĐHQG TP.HCM",
  "ĐH Bách khoa Hà Nội",
];

// Dữ liệu thí sinh mẫu
interface Student {
  id: string; // CCCD làm ID quản lý
  fullName: string;
  personalInfo: InfoItem & {
    fullName: string;
    dob: string;
    gender: string;
    cccd: string;
    cccdIssuePlace: string;
    cccdIssueDate: string;
    email: string;
    phone: string;
    address: string;
    highSchoolName: string;
    city: string;
    district: string;
    graduationYear: number;
  };
  scores: InfoItem & {
    examBan: "Tự nhiên" | "Xã hội";
    examNumber: string;
    scoresBySubject: Record<string, number>; // Môn => điểm
  };
  transcript: InfoItem & {
    avgBySubject: Record<string, number | null>; // điểm trung bình 6 kỳ từng môn (7 môn)
  };
  assessments: InfoItem[]; // Tối đa 3 bài thi ĐGNL/ĐGTD
  priorityInfo: InfoItem & {
    khuVucUuTien: string;
    doiTuongUuTien: string;
  };
  hsgAchievement: InfoItem & {
    type: string;
    subject: string;
    year: string;
    rank: string;
  };
  englishCert: InfoItem & {
    type: string;
    score: number;
    issueDate: string;
    registrationCode: string;
    issuer: string;
  };
}

const sampleStudents: Student[] = [
  {
    id: "123456789",
    fullName: "Nguyễn Văn A",
    personalInfo: {
      status: "Chờ duyệt",
      fullName: "Nguyễn Văn A",
      dob: "01/01/2000",
      gender: "Nam",
      cccd: "123456789",
      cccdIssuePlace: "Hà Nội",
      cccdIssueDate: "15/01/2018",
      email: "nguyenvana@example.com",
      phone: "0912345678",
      address: "123 Đường ABC",
      highSchoolName: "THPT Nguyễn Trãi",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      graduationYear: 2018,
      files: [
        { url: "https://example.com/cccd-front.jpg", name: "Mặt trước CCCD" },
        { url: "https://example.com/cccd-back.jpg", name: "Mặt sau CCCD" },
      ],
    },
    scores: {
      status: "Chờ duyệt",
      examBan: "Tự nhiên",
      examNumber: "123456",
      scoresBySubject: {
        Toán: 8,
        Văn: 7.5,
        Anh: 7,
        Lý: 8.5,
        Hóa: 8,
        Sinh: 7.5,
      },
      files: [{ url: "https://example.com/score.pdf", name: "Điểm thi THPT" }],
    },
    transcript: {
      status: "Chờ duyệt",
      avgBySubject: {
        Toán: 7.8,
        Văn: 7.2,
        Anh: 6.8,
        Lý: 7.5,
        Hóa: 7.9,
        Sinh: 7.0,
        Sử: null,
        Địa: null,
        GDCD: null,
      },
      files: [{ url: "https://example.com/transcript.pdf", name: "Học bạ" }],
    },
    assessments: [
      {
        status: "Chờ duyệt",
        type: "ĐGNL",
        unit: "ĐHQG Hà Nội",
        score: 85,
        noScoreDeclared: false,
        files: [{ url: "https://example.com/assessment1.pdf", name: "Phiếu điểm 1" }],
      },
      {
        status: "Chờ duyệt",
        type: "ĐGNL",
        unit: "ĐHQG TP.HCM",
        score: 82,
        noScoreDeclared: false,
        files: [{ url: "https://example.com/assessment2.pdf", name: "Phiếu điểm 2" }],
      },
    ],
    priorityInfo: {
      status: "Đã duyệt",
      khuVucUuTien: "KV1",
      doiTuongUuTien: "DT01",
      files: [
        { url: "https://example.com/priority-kv.pdf", name: "Minh chứng KV" },
        { url: "https://example.com/priority-dt.pdf", name: "Minh chứng ĐT" },
      ],
    },
    hsgAchievement: {
      status: "Từ chối",
      type: "tinh",
      subject: "Toán",
      year: "2020",
      rank: "Nhất",
      reason: "File minh chứng không rõ ràng",
      files: [{ url: "https://example.com/hsg.pdf", name: "Thành tích HSG" }],
    },
    englishCert: {
      status: "Chờ duyệt",
      type: "IELTS",
      score: 6.5,
      issueDate: "01/05/2023",
      registrationCode: "ABC123",
      issuer: "British Council",
      files: [{ url: "https://example.com/cert.pdf", name: "Chứng chỉ tiếng Anh" }],
    },
  },
];

const StudentAndProofManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [searchText, setSearchText] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Để lưu trạng thái sửa/chỉnh trạng thái đang mở
  const [editingSection, setEditingSection] = useState<keyof Student | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState<string>("");

  // Tìm kiếm theo CCCD hoặc tên
  const filteredStudents = students.filter(
    (stu) =>
      stu.id.includes(searchText.trim()) ||
      stu.fullName.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  // Tính trạng thái tổng thể: nếu có 1 mục chờ duyệt => chờ duyệt; nếu có từ chối => có từ chối; else hoàn tất
  const getOverallStatus = (stu: Student): StatusType => {
    const statusList: StatusType[] = [
      stu.personalInfo.status,
      stu.scores.status,
      stu.transcript.status,
      ...stu.assessments.map((a) => a.status),
      stu.priorityInfo.status,
      stu.hsgAchievement.status,
      stu.englishCert.status,
    ];

    if (statusList.includes("Chờ duyệt")) return "Chờ duyệt";
    if (statusList.includes("Từ chối")) return "Từ chối";
    return "Đã duyệt";
  };

  // Duyệt hoặc từ chối từng mục
  const handleUpdateStatus = (
    sectionKey: keyof Student,
    newStatus: StatusType,
    reason?: string,
    indexAssessment?: number // nếu cập nhật bài đánh giá nào
  ) => {
    if (!selectedStudent) return;
    setStudents((prev) =>
      prev.map((stu) => {
        if (stu.id === selectedStudent.id) {
          if (sectionKey === "assessments" && typeof indexAssessment === "number") {
            // Cập nhật bài đánh giá cụ thể
            const newAssessments = [...stu.assessments];
            newAssessments[indexAssessment] = {
              ...newAssessments[indexAssessment],
              status: newStatus,
              reason: newStatus === "Từ chối" ? reason : undefined,
            };
            return { ...stu, assessments: newAssessments };
          } else {
            const updatedSection = {
              ...stu[sectionKey],
              status: newStatus,
              reason: newStatus === "Từ chối" ? reason : undefined,
            };
            return { ...stu, [sectionKey]: updatedSection };
          }
        }
        return stu;
      })
    );
    message.success(`Cập nhật trạng thái thành công.`);
    setEditingSection(null);
    setRejectReasonInput("");
  };

  // Mở modal nhập lý do từ chối
  const openRejectModal = (
    sectionKey: keyof Student,
    indexAssessment?: number
  ) => {
    let inputReason = "";

    confirm({
      title: "Nhập lý do từ chối",
      icon: <ExclamationCircleOutlined />,
      content: (
        <Input.TextArea
          autoSize
          placeholder="Lý do từ chối..."
          onChange={(e) => {
            inputReason = e.target.value;
            setRejectReasonInput(inputReason);
          }}
        />
      ),
      onOk() {
        if (!inputReason.trim()) {
          message.error("Lý do từ chối không được để trống!");
          return Promise.reject();
        }
        handleUpdateStatus(sectionKey, "Từ chối", inputReason.trim(), indexAssessment);
        return Promise.resolve();
      },
      okText: "Xác nhận từ chối",
      cancelText: "Hủy",
    });
  };

  // Hiển thị trạng thái với màu tag
  const StatusTag: React.FC<{ status: StatusType }> = ({ status }) => {
    let color = "default";
    if (status === "Đã duyệt") color = "success";
    else if (status === "Từ chối") color = "error";
    else if (status === "Chờ duyệt") color = "processing";
    return <Tag color={color}>{status}</Tag>;
  };

  // Xem file minh chứng dạng nút
  const FileViewButtons: React.FC<{ files?: FileProof[] }> = ({ files }) => {
    if (!files || files.length === 0) return <Text>Không có file minh chứng</Text>;
    return (
      <Space direction="vertical">
        {files.map((file, i) => (
          <Button
            key={i}
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open(file.url, "_blank")}
          >
            {file.name || `File ${i + 1}`}
          </Button>
        ))}
      </Space>
    );
  };

  // Hiển thị từng phần chi tiết với chức năng duyệt/từ chối
  const DetailSection: React.FC<{
    title: string;
    data: InfoItem;
    fields: { label: string; key: string }[];
    sectionKey: keyof Student;
    assessmentIndex?: number; // Nếu là bài đánh giá cụ thể
  }> = ({ title, data, fields, sectionKey, assessmentIndex }) => {
    const canApprove = data.status === "Chờ duyệt";

    return (
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          backgroundColor: "#fafafa",
        }}
      >
        <Title level={4}>
          {title} <StatusTag status={data.status} />
        </Title>
        <Row gutter={[12, 12]}>
          {fields.map(({ label, key }) => (
            <Col span={12} key={key}>
              <Text strong>{label}: </Text> {data[key] ?? "-"}
            </Col>
          ))}
          <Col span={24} style={{ marginTop: 8 }}>
            <Text strong>Minh chứng: </Text>
            <FileViewButtons files={data.files} />
          </Col>
          {data.status === "Từ chối" && data.reason && (
            <Col span={24} style={{ marginTop: 8 }}>
              <Text type="danger">Lý do từ chối: {data.reason}</Text>
            </Col>
          )}
          {canApprove && (
            <Col span={24} style={{ marginTop: 12 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleUpdateStatus(sectionKey, "Đã duyệt", undefined, assessmentIndex)}
                >
                  Duyệt
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => openRejectModal(sectionKey, assessmentIndex)}
                >
                  Từ chối
                </Button>
              </Space>
            </Col>
          )}
        </Row>
      </div>
    );
  };

  // Cột bảng danh sách thí sinh, thêm cột trạng thái từng mục rõ ràng
  const studentColumns = [
    {
      title: "Số CCCD",
      dataIndex: "id",
      key: "id",
      sorter: (a: Student, b: Student) => a.id.localeCompare(b.id),
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: Student, b: Student) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Trạng thái cá nhân",
      dataIndex: ["personalInfo", "status"],
      key: "personalInfo",
      render: (_: any, record: Student) => <StatusTag status={record.personalInfo.status} />,
    },
    {
      title: "Điểm thi THPT",
      dataIndex: ["scores", "status"],
      key: "scores",
      render: (_: any, record: Student) => <StatusTag status={record.scores.status} />,
    },
    {
      title: "Điểm học bạ",
      dataIndex: ["transcript", "status"],
      key: "transcript",
      render: (_: any, record: Student) => <StatusTag status={record.transcript.status} />,
    },
    {
      title: "ĐGNL/ĐGTD",
      key: "assessment",
      render: (_: any, record: Student) => {
        // Nếu nhiều bài thì nếu có bài nào chờ duyệt thì hiển thị chờ duyệt, có từ chối thì hiển thị từ chối, ngược lại đã duyệt
        const list = record.assessments.map((a) => a.status);
        if (list.includes("Chờ duyệt")) return <StatusTag status="Chờ duyệt" />;
        if (list.includes("Từ chối")) return <StatusTag status="Từ chối" />;
        return <StatusTag status="Đã duyệt" />;
      },
    },
    {
      title: "Ưu tiên",
      dataIndex: ["priorityInfo", "status"],
      key: "priorityInfo",
      render: (_: any, record: Student) => <StatusTag status={record.priorityInfo.status} />,
    },
    {
      title: "Thành tích HSG",
      dataIndex: ["hsgAchievement", "status"],
      key: "hsgAchievement",
      render: (_: any, record: Student) => <StatusTag status={record.hsgAchievement.status} />,
    },
    {
      title: "Chứng chỉ TA",
      dataIndex: ["englishCert", "status"],
      key: "englishCert",
      render: (_: any, record: Student) => <StatusTag status={record.englishCert.status} />,
    },
    {
      title: "Trạng thái tổng thể",
      key: "overallStatus",
      render: (_: any, record: Student) => <StatusTag status={getOverallStatus(record)} />,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Student) => (
        <Button type="link" onClick={() => setSelectedStudent(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  if (!selectedStudent) {
    return (
      <div style={{ padding: 20, maxWidth: 1100, margin: "auto" }}>
        <Title level={3}>Quản lý Thông tin Thí sinh và Duyệt Minh chứng</Title>
        <Input
          placeholder="Tìm kiếm theo số CCCD hoặc tên"
          prefix={<SearchOutlined />}
          style={{ marginBottom: 20, width: 400 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Table
          columns={studentColumns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "auto" }}>
      <Button onClick={() => setSelectedStudent(null)} style={{ marginBottom: 20 }}>
        ← Quay lại danh sách
      </Button>
      <Title level={3}>
        Quản lý hồ sơ thí sinh: {selectedStudent.fullName} (CCCD: {selectedStudent.id})
      </Title>

      <Tabs defaultActiveKey="personalInfo" type="card">
        <TabPane tab="Thông tin cá nhân" key="personalInfo">
          <DetailSection
            sectionKey="personalInfo"
            title="Thông tin cá nhân"
            data={selectedStudent.personalInfo}
            fields={[
              { label: "Họ và tên", key: "fullName" },
              { label: "Ngày sinh", key: "dob" },
              { label: "Giới tính", key: "gender" },
              { label: "Số CCCD/CMND", key: "cccd" },
              { label: "Nơi cấp CCCD", key: "cccdIssuePlace" },
              { label: "Ngày cấp CCCD", key: "cccdIssueDate" },
              { label: "Email", key: "email" },
              { label: "Số điện thoại", key: "phone" },
              { label: "Địa chỉ", key: "address" },
              { label: "Trường THPT", key: "highSchoolName" },
              { label: "Tỉnh/Thành phố", key: "city" },
              { label: "Quận/Huyện", key: "district" },
              { label: "Năm tốt nghiệp", key: "graduationYear" },
            ]}
          />
        </TabPane>

        <TabPane tab="Điểm thi THPT" key="scores">
          <DetailSection
            sectionKey="scores"
            title="Điểm thi THPT"
            data={{
              ...selectedStudent.scores,
              scoresBySubject: undefined,
            }}
            fields={[
              { label: "Bạn thi", key: "examBan" },
              { label: "Số báo danh", key: "examNumber" },
            ]}
          />
          {/* Hiển thị điểm từng môn */}
          <div style={{ marginTop: 12 }}>
            <Title level={5}>Điểm từng môn</Title>
            <Row gutter={[12, 12]}>
              {/* Môn bắt buộc */}
              {DEFAULT_SUBJECTS.map((subject) => (
                <Col span={6} key={subject}>
                  <Text strong>{subject}: </Text>
                  {selectedStudent.scores.scoresBySubject?.[subject] ?? "-"}
                </Col>
              ))}
              {/* Môn theo bạn thi */}
              {(selectedStudent.scores.examBan === "Tự nhiên"
                ? NATURAL_SCIENCE_SUBJECTS
                : SOCIAL_SCIENCE_SUBJECTS
              ).map((subject) => (
                <Col span={6} key={subject}>
                  <Text strong>{subject}: </Text>
                  {selectedStudent.scores.scoresBySubject?.[subject] ?? "-"}
                </Col>
              ))}
            </Row>
          </div>
          {/* Minh chứng */}
          <div style={{ marginTop: 12 }}>
            <Text strong>Minh chứng: </Text>
            <FileViewButtons files={selectedStudent.scores.files} />
          </div>
        </TabPane>

        <TabPane tab="Điểm học bạ" key="transcript">
          <DetailSection
            sectionKey="transcript"
            title="Điểm học bạ"
            data={selectedStudent.transcript}
            fields={Object.keys(selectedStudent.transcript.avgBySubject).map((subject) => ({
              label: subject,
              key: `avgBySubject.${subject}`,
            }))}
          />
          <div style={{ marginTop: 12 }}>
            <Text strong>Minh chứng: </Text>
            <FileViewButtons files={selectedStudent.transcript.files} />
          </div>
        </TabPane>

        <TabPane tab="Đánh giá năng lực / Tư duy" key="assessment">
          {selectedStudent.assessments.length === 0 && (
            <Text>Không có bài đánh giá nào được khai báo.</Text>
          )}
          {selectedStudent.assessments.map((a, idx) => (
            <DetailSection
              key={idx}
              sectionKey="assessments"
              assessmentIndex={idx}
              title={`Bài đánh giá #${idx + 1}`}
              data={a}
              fields={[
                { label: "Loại đánh giá", key: "type" },
                { label: "Đơn vị tổ chức", key: "unit" },
                { label: "Điểm", key: "score" },
                { label: "Không có điểm", key: "noScoreDeclared" },
              ]}
            />
          ))}
        </TabPane>

        <TabPane tab="Thông tin ưu tiên" key="priorityInfo">
          <DetailSection
            sectionKey="priorityInfo"
            title="Thông tin ưu tiên"
            data={selectedStudent.priorityInfo}
            fields={[
              { label: "Khu vực ưu tiên", key: "khuVucUuTien" },
              { label: "Đối tượng ưu tiên", key: "doiTuongUuTien" },
            ]}
          />
        </TabPane>

        <TabPane tab="Thành tích HSG" key="hsgAchievement">
          <DetailSection
            sectionKey="hsgAchievement"
            title="Thành tích Học sinh Giỏi"
            data={selectedStudent.hsgAchievement}
            fields={[
              { label: "Loại thành tích", key: "type" },
              { label: "Môn đạt giải", key: "subject" },
              { label: "Năm đạt giải", key: "year" },
              { label: "Loại giải", key: "rank" },
            ]}
          />
        </TabPane>

        <TabPane tab="Chứng chỉ Tiếng Anh" key="englishCert">
          <DetailSection
            sectionKey="englishCert"
            title="Chứng chỉ Tiếng Anh Quốc tế"
            data={selectedStudent.englishCert}
            fields={[
              { label: "Loại chứng chỉ", key: "type" },
              { label: "Điểm thi", key: "score" },
              { label: "Ngày cấp", key: "issueDate" },
              { label: "Mã dự thi", key: "registrationCode" },
              { label: "Đơn vị cấp", key: "issuer" },
            ]}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StudentAndProofManagementPage;

