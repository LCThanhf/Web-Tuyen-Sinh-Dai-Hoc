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
