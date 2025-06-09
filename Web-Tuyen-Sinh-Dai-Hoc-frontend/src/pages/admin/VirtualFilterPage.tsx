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
import { adminApi } from '../../services/adminApi';
import virtualFilterApi, { type AdmissionResult } from '../../services/virtualFilterApi';

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
  quota: number;
}

const VirtualFilterPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>(undefined);
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]);
  const [selectedMajorId, setSelectedMajorId] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AdmissionResult[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    loadSchoolsAndMajors();
  }, []);

  const loadSchoolsAndMajors = async () => {
    try {
      const [schoolsData, majorsData] = await Promise.all([
        adminApi.getSchools(),
        adminApi.getMajors()
      ]);
      
      setSchools(schoolsData.map(s => ({ id: s.id, name: s.name })));
      setMajors(majorsData.map(m => ({ 
        id: m.id, 
        name: m.name, 
        schoolId: m.schoolId,
        quota: m.quota 
      })));
    } catch (error) {
      console.error('Error loading schools and majors:', error);
      message.error('Không thể tải danh sách trường và ngành');
    }
  };

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

  const handleRunFilter = async () => {
    if (!selectedSchoolId || !selectedMajorId) {
      message.warning('Vui lòng chọn trường và ngành trước khi chạy lọc ảo.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await virtualFilterApi.runVirtualFilter({
        schoolId: selectedSchoolId,
        majorId: selectedMajorId,
        simulationMode: true,
        maxResults: 100
      });
      
      setResults(response.results);
      setSummary(response.summary);
      message.success('Chạy lọc ảo thành công!');
    } catch (error) {
      console.error('Error running virtual filter:', error);
      message.error('Không thể chạy lọc ảo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'CCCD',
      dataIndex: 'cccd',
      key: 'cccd',
    },
    {
      title: 'Điểm xét tuyển',
      dataIndex: 'totalScore',
      key: 'totalScore',
      sorter: (a: AdmissionResult, b: AdmissionResult) => a.totalScore - b.totalScore,
      render: (score: number) => <Text strong>{score.toFixed(2)}</Text>,
      align: 'center' as const,
    },
    {
      title: 'Nguyện vọng',
      dataIndex: 'priorityOrder',
      key: 'priorityOrder',
      align: 'center' as const,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'admissionStatus',
      key: 'admissionStatus',
      render: (status: string) => {
        let color = '';
        let text = '';
        switch (status) {
          case 'ADMITTED':
            color = 'green';
            text = 'Trúng tuyển';
            break;
          case 'WAITLIST':
            color = 'orange';
            text = 'Danh sách chờ';
            break;
          case 'REJECTED':
            color = 'red';
            text = 'Không trúng tuyển';
            break;
          default:
            color = 'gray';
            text = status;
        }
        return <Text style={{ color }}>{text}</Text>;
      },
      align: 'center' as const,
    },
    {
      title: 'Thứ hạng',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center' as const,
    },
  ];

  // Lấy danh sách thí sinh trúng tuyển của ngành trường được chọn
  const admittedApplicants = results.filter(r => 
    r.schoolId === selectedSchoolId && 
    r.majorId === selectedMajorId &&
    r.admissionStatus === 'ADMITTED'
  );

  // Tính điểm chuẩn (điểm thấp nhất trong danh sách trúng tuyển)
  const admissionScore = admittedApplicants.length > 0
    ? Math.min(...admittedApplicants.map(app => app.totalScore))
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
            <label>Chọn ngành</label>
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
          <Col span={6}>
            <Card>
              <Text>Số thí sinh trúng tuyển</Text>
              <Title level={3}>{admittedApplicants.length}</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Text>Điểm chuẩn dự kiến</Text>
              <Title level={3}>{admissionScore !== null ? admissionScore.toFixed(2) : 'N/A'}</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Text>Tổng số thí sinh xét</Text>
              <Title level={3}>{summary?.totalProcessed || 0}</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Text>Điểm trung bình</Text>
              <Title level={3}>{summary?.averageScore || 'N/A'}</Title>
            </Card>
          </Col>
        </Row>

        <Spin spinning={loading} tip="Đang chạy lọc ảo...">
          <Table
            columns={columns}
            dataSource={results.filter(r => 
              r.schoolId === selectedSchoolId && r.majorId === selectedMajorId
            )}
            rowKey={(record) => record.studentId + '_' + record.majorId}
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default VirtualFilterPage;
