
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
            const currentSection = stu[sectionKey] as InfoItem;
            const updatedSection = {
              ...currentSection,
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

